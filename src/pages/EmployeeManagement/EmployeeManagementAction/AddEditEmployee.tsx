import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeDetail, OptionSelected } from '@/constants/interfaces';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import useStoreLoading from '@/store/loadingStore';
import toastifyUtils from '@/utils/toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { parseISO } from 'date-fns';
import { z } from 'zod';

import { ERROR_API_MESSAGE, ERROR_MESSAGE } from '@/constants/error-message';
import { Icons } from '@/constants/svgIcon';
import DatePicker from './../../../components/ui/date-picker';
import { ACTION } from '@/constants/action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    id?: string;
    setId: (type: string) => void;
    type: string;
    setType: (type: string) => void;
    getEmployeeList?: (pageIndex: number) => Promise<void>;
};

export interface IFile {
    name: string;
    file: File;
    urlPath: string;
    type: string;
}

export default function AddEditEmployee(props: Props) {
    const unknownOption: OptionSelected = {
        label: "Unknown",
        value: null
    }

    const { open, setOpen, getEmployeeList, type, id, setType, setId } = props;
    const { hideLoading, showLoading } = useStoreLoading();
    const [employee, setEmployee] = React.useState<EmployeeDetail>();
    const [departmentSelected, setDepartmentSelected] = React.useState<string | null | undefined>(null);
    const [departmentOptions, setDepartmentOptions] = React.useState<OptionSelected[]>([]);
    const [positionByDepartmentOptions, setPositionByDepartmentOptions] = React.useState<OptionSelected[]>([]);
    const [roleOptions, setRoleOptions] = React.useState<OptionSelected[]>([]);

    // State để hiển thị preview ảnh và lưu trữ thông tin upload
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const formSchema = z.object({
        fullName: z.string().min(1, "Full name is required"),
        employeeCode: z.string().readonly(),
        dateOfBirth: z.date({
            required_error: ERROR_MESSAGE.fieldRequired,
            invalid_type_error: ERROR_MESSAGE.invalidDate
        }).refine(date => {
            return date <= new Date();
        }, {
            message: ERROR_MESSAGE.DateInTheFuture
        }),
        gender: z.enum(['male', 'female', 'other'], {
            required_error: ERROR_MESSAGE.genderIsRequired,
            invalid_type_error: ERROR_MESSAGE.genderIsInValid
        }),
        email: z.string().email(),
        status: z.enum(['active', 'inactive'], {
            required_error: ERROR_MESSAGE.statusIsRequired,
            invalid_type_error: ERROR_MESSAGE.statusIsInValid
        }),
        phoneNumber: z.string(),
        startDate: z.date(),
        emergencyContact: z.object({
            name: z.string().optional(),
            relationship: z.string().optional(),
            phoneNumber: z.string().optional()
        }).optional(),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional()
        }).optional(),
        department: z.string({
            required_error: "Department is required",
            invalid_type_error: "Department is inValid"
        }).optional().nullable(),
        position: z.string({
            required_error: "Position is required",
            invalid_type_error: "Position is inValid"
        }).optional().nullable(),
        roles: z.array(z.string()),
        baseSalary: z.preprocess(
            (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
            z.number().min(0, "Base salary > 0")
        ),
        // Thêm trường image vào schema
        image: z.string().optional(),
    });

    const defaultValues: Partial<z.infer<typeof formSchema>> = {
        fullName: '',
        employeeCode: '',
        gender: 'male' as const,
        email: '',
        status: 'active' as const,
        phoneNumber: undefined,
        emergencyContact: {
            name: '',
            relationship: '',
            phoneNumber: ''
        },
        address: {
            street: '',
            city: '',
            zipCode: '',
            country: ''
        },
        department: undefined,
        position: undefined,
        roles: [],
        image: '',
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const resetFormToDefaultValues = () => {
        setDepartmentSelected(null);
        setEmployee(undefined);
        setImagePreview(null);
        setUploadProgress(0);

        form.reset(defaultValues);
    };

    const styleSelectCountry = {
        control: (provided: any, state: any) => ({
            ...provided,
            fontSize: '14px',
            borderRadius: '4px',
            minHeight: '36px',
            backgroundColor: state.isDisabled ? '#79747E14' : 'white',
            border: state.isDisabled ? 'none' : ''
        }),
        menu: (provided: any) => ({
            ...provided,
            fontSize: '14px',
            zIndex: 9999
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            padding: '12px',
            borderLeft: 'none',
            svg: {
                width: '14px',
                height: '14px'
            }
        }),
        menuList: (provided: any) => ({
            ...provided,
            maxHeight: 150
        })
    };

    const errorFunc = (err: any) => {
        console.log('err', err);
    };

    // Hàm xử lý khi người dùng chọn file hình ảnh
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Giới hạn kích thước file (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toastifyUtils('error', 'File size should not exceed 5MB');
            return;
        }

        // Chỉ cho phép các định dạng hình ảnh
        if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
            toastifyUtils('error', 'Only image files (JPEG, PNG, GIF, WebP) are allowed');
            return;
        }

        // Tạo preview cho file
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        uploadImage(file);
    };

    // Hàm upload ảnh lên server
    const uploadImage = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post(URL_PATHS.UPLOAD_FILE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            // Cập nhật giá trị trường image trong form
            form.setValue('image', response.data.url);
            toastifyUtils('success', 'Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toastifyUtils('error', 'Failed to upload image');
            // Reset preview nếu upload thất bại
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    // Handler cho nút "Change Image"
    const handleClickChangeImage = useCallback(() => {
        fileInputRef.current?.click();
    }, [fileInputRef]);

    // Handler cho nút "Remove Image" 
    const handleRemoveImage = useCallback(() => {
        form.setValue('image', '');
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [form]);

    const handleUpdateEmployee = async (dataSend: any) => {
        const dataSendUpdate = {
            fullName: dataSend.fullName,
            dateOfBirth: dataSend.dateOfBirth,
            gender: dataSend.gender,
            address: dataSend.address,
            phoneNumber: dataSend.phoneNumber,
            ...(dataSend.department && { departmentId: dataSend.department }),
            ...(dataSend.position && { positionId: dataSend.position }),
            baseSalary: dataSend?.baseSalary,
            startDate: dataSend.startDate,
            image: dataSend.image,
            status: dataSend.status,
            emergencyContact: dataSend.emergencyContact,
            roles: dataSend.roles,
            email: dataSend?.email
        };

        try {
            await axiosInstance({
                method: 'PUT',
                url: `${URL_PATHS.UPDATE_EMPLOYEE}/${id}`,
                data: dataSendUpdate
            });
            toastifyUtils('success', 'Update employee successfully');
            setOpen(false);
        } catch (error: any) {
            console.error('Error update employee', error);

            let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];

            toastifyUtils('error', errorMessage);
        } finally {
            hideLoading();
            getEmployeeList && getEmployeeList(1);
        }
    };


    const handleAddEmployee = async (dataSend: any) => {
        const dataSendAdd = {
            fullName: dataSend.fullName,
            dateOfBirth: dataSend.dateOfBirth,
            gender: dataSend.gender,
            address: dataSend.address,
            phoneNumber: dataSend.phoneNumber,
            ...(dataSend.department && { departmentId: dataSend.department }),
            ...(dataSend.position && { positionId: dataSend.position }),
            baseSalary: dataSend?.baseSalary,
            startDate: dataSend.startDate,
            image: dataSend.image,
            status: dataSend.status,
            emergencyContact: dataSend.emergencyContact,
            roles: dataSend.roles,
            email: dataSend?.email
        };

        try {
            const result = await axiosInstance({
                method: 'POST',
                url: URL_PATHS.ADD_EMPLOYEE,
                data: dataSendAdd
            });
            toastifyUtils('success', 'Add employee successfully');
            setOpen(false);

            console.log(result);
        } catch (error: any) {
            console.error('Error add employee', error);

            let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];

            toastifyUtils('error', errorMessage);

        } finally {
            hideLoading();
            getEmployeeList && getEmployeeList(1);
        }
    };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        hideLoading();
        if (type === ACTION.EDIT) {
            handleUpdateEmployee(values);
        } else {
            handleAddEmployee(values);
        }
    };

    React.useEffect(() => {
        const getListDepartment = async () => {
            try {
                const response = await axiosInstance({
                    method: 'GET',
                    url: URL_PATHS.GET_DEPARTMENTS,
                    params: {
                        page: 1,
                        limit: 1000
                    }
                });
                const departmentFormApi = response?.data?.data.map((department: any) => {
                    return {
                        label: department.name,
                        value: department._id
                    }
                })

                setDepartmentOptions([unknownOption, ...departmentFormApi])
            } catch (error) {
                console.error('Error getting list department', error);
            }
        };

        const getListPositionByDepartment = async () => {
            try {
                const response = await axiosInstance({
                    method: 'GET',
                    url: `${URL_PATHS.GET_POSITIONS_BY_DEPARTMENT}/${departmentSelected}`,
                    params: {
                        page: 1,
                        limit: 1000
                    }
                });

                const positionFormApi = response?.data?.map((position: any) => {
                    return {
                        label: position.title,
                        value: position._id
                    }
                })

                setPositionByDepartmentOptions([unknownOption, ...positionFormApi])
            } catch (error) {
                console.error('Error getting list positions by department', error);
            }
        };

        const getRoles = async () => {
            try {
                const response = await axiosInstance({
                    method: 'GET',
                    url: URL_PATHS.GET_ROLES
                });

                const rolesFormApi = response?.data?.map((role: any) => {
                    return {
                        label: role.name,
                        value: role._id
                    }
                })

                setRoleOptions(rolesFormApi)
            } catch (error) {
                console.error('Error getting list positions by department', error);
            }
        }

        getListDepartment();

        getRoles();

        if (departmentSelected) {
            getListPositionByDepartment();
        }
    }, [departmentSelected]);


    const getEmployeeById = async () => {
        showLoading();
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `${URL_PATHS.GET_EMPLOYEE}/${id}`
            });

            setEmployee(response.data);

            // Set image preview from existing employee image
            if (response.data.image) {
                setImagePreview(response.data.image);
            }

            setDepartmentSelected(response?.data?.department?._id)

            const formattedData = {
                ...response.data,
                dateOfBirth: response.data.dateOfBirth ? parseISO(response.data.dateOfBirth) : null,
                startDate: response.data.startDate ? parseISO(response.data.startDate) : null,
                department: response.data?.department?._id || '',
                position: response.data?.position?._id || '',
                roles: response.data?.roles?.map((role: any) => role._id) || []
            }

            form.reset(formattedData);
        } catch (error) {
            console.error('Error get employee by id', error);
        } finally {
            hideLoading();
        }
    };

    React.useEffect(() => {
        if (id && type !== ACTION.CREATE) {
            getEmployeeById();
        } else {
            resetFormToDefaultValues()
        }
    }, [id]);

    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(!open)
            setId('');
            resetFormToDefaultValues()
        }}>
            <DialogTrigger asChild>
                <Button onClick={() => {
                    setType(ACTION.CREATE);
                }} variant='default' className='w-fit'>
                    New Employee
                </Button>
            </DialogTrigger>

            <DialogContent className='max-w-[768px] max-h-[80vh] p-0 overflow-hidden'>
                <DialogHeader className='bg-[#EDF0F7] w-full p-6 rounded-t-lg '>
                    <DialogTitle className='font-bold text-2xl'>
                        {type === ACTION.EDIT ? 'Edit User Detail' : type === ACTION.CREATE ? 'Create New Employee' : 'View Employee Detail'}
                    </DialogTitle>
                </DialogHeader>

                <div className='overflow-y-auto max-h-[calc(80vh-120px)]'>
                    <div className='px-6 py-6 pb-16'>
                        <Form {...form}>
                            <form id="employee-form" onSubmit={form.handleSubmit(onSubmit, errorFunc)}>
                                <div className='flex flex-col gap-5'>
                                    {/* Image Upload Section */}
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center gap-6">
                                                    <div className="relative">
                                                        <Avatar className="w-24 h-24 border">
                                                            <AvatarImage
                                                                src={imagePreview || field.value || '/placeholder-user.jpg'}
                                                                alt="Profile"
                                                            />
                                                            <AvatarFallback className="bg-primary/10">
                                                                {form.watch('fullName')?.charAt(0) || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        {isUploading && (
                                                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                                                                <div className="text-white text-xs font-medium">
                                                                    {uploadProgress}%
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleImageChange}
                                                            disabled={type === ACTION.VIEW || isUploading}
                                                        />

                                                        {type !== ACTION.VIEW && (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={handleClickChangeImage}
                                                                    disabled={isUploading}
                                                                >
                                                                    <Icons.UploadIcon className="mr-1 h-4 w-4" />
                                                                    {field.value ? "Change Image" : "Upload Image"}
                                                                </Button>

                                                                {(field.value || imagePreview) && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={handleRemoveImage}
                                                                        disabled={isUploading}
                                                                        className="text-red-500 hover:bg-red-50"
                                                                    >
                                                                        <Icons.DeleteIcon className="mr-1 h-4 w-4 fill-red-500" />
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}

                                                        <p className="text-xs text-gray-500">
                                                            Upload a profile picture (max 5MB)
                                                        </p>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='flex items-center gap-4'>
                                        {
                                            (type != ACTION.CREATE) && (
                                                <div className='w-full'>
                                                    <FormField
                                                        control={form.control}
                                                        name='employeeCode'

                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label className='text-sm'>Employee code</Label>
                                                                <FormControl>
                                                                    <Input className={` rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                        placeholder='Username'
                                                                        maxLength={60}
                                                                        disabled {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )
                                        }

                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='fullName'

                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label className='text-sm'>Full name</Label>
                                                        <FormControl>
                                                            <Input className={` rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                placeholder='Full name'
                                                                maxLength={60}
                                                                disabled={type == ACTION.VIEW} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='dateOfBirth'
                                                render={({ field }) => {
                                                    // Format date để hiển thị trong input
                                                    const value = field.value
                                                        ? new Date(field.value).toISOString().split('T')[0]
                                                        : '';

                                                    return (
                                                        <FormItem>
                                                            <Label className='text-sm'>Date of birth</Label>
                                                            <FormControl>
                                                                <Input
                                                                    type="date"
                                                                    className="rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]"
                                                                    max={new Date().toISOString().split('T')[0]} // Giới hạn không chọn ngày trong tương lai
                                                                    disabled={type === ACTION.VIEW}
                                                                    value={value} // Sử dụng biến đã định nghĩa ở trên
                                                                    onChange={(e) => {
                                                                        // Chuyển đổi giá trị string từ input thành Date object
                                                                        const date = e.target.value ? new Date(e.target.value) : null;
                                                                        field.onChange(date);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-4'>

                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='gender'

                                                render={
                                                    ({ field }) => {
                                                        const genderOptions: OptionSelected[] = [
                                                            {
                                                                label: "Male",
                                                                value: 'male'
                                                            },
                                                            {
                                                                label: "Female",
                                                                value: 'female'
                                                            },
                                                            {
                                                                label: "Other",
                                                                value: 'other'
                                                            }
                                                        ]

                                                        const filterGender = genderOptions.find(gender => gender.value === field.value);

                                                        const defaultGender: OptionSelected = (filterGender ? filterGender : genderOptions[0]);

                                                        return (
                                                            <FormItem>
                                                                <Label className='text-sm'>Gender</Label>
                                                                <ReactSelect
                                                                    options={genderOptions}
                                                                    styles={styleSelectCountry}
                                                                    onChange={x => {
                                                                        field.onChange(x?.value);
                                                                    }}
                                                                    value={defaultGender}
                                                                    className="w-48"
                                                                    placeholder="Gender"
                                                                    classNamePrefix="react-select"
                                                                    isDisabled={type === 'view'}
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        );
                                                    }
                                                }
                                            />
                                        </div>

                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='email'

                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label className='text-sm'>Email</Label>
                                                        <FormControl>
                                                            <Input className={` rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                placeholder='Email'
                                                                maxLength={60}
                                                                disabled={type == ACTION.VIEW} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='w-full'>


                                            <FormField
                                                control={form.control}
                                                name='status'

                                                render={
                                                    ({ field }) => {
                                                        const statusOptions: OptionSelected[] = [
                                                            {
                                                                label: "Active",
                                                                value: 'active'
                                                            },
                                                            {
                                                                label: "Inactive",
                                                                value: 'inactive'
                                                            }
                                                        ]

                                                        const filterStatus = statusOptions.find(gender => gender.value === field.value);

                                                        const defaultStatus: OptionSelected = (filterStatus ? filterStatus : statusOptions[0]);

                                                        return (
                                                            <FormItem>
                                                                <Label className='text-sm'>Status</Label>
                                                                <ReactSelect
                                                                    options={statusOptions}
                                                                    styles={styleSelectCountry}
                                                                    onChange={x => {
                                                                        field.onChange(x?.value);
                                                                    }}
                                                                    value={defaultStatus}
                                                                    className="w-48"
                                                                    placeholder="Status"
                                                                    classNamePrefix="react-select"
                                                                    isDisabled={type === ACTION.VIEW}
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        );
                                                    }
                                                }
                                            />

                                        </div>
                                    </div>

                                    <div className='flex items-center gap-4'>
                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='phoneNumber'

                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label className='text-sm'>Phone number</Label>
                                                        <FormControl>
                                                            <Input className={` rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                placeholder='Phone number'
                                                                maxLength={60}
                                                                disabled={type === ACTION.VIEW} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='startDate'
                                                render={({ field }) => {
                                                    const value = field.value
                                                        ? new Date(field.value).toISOString().split('T')[0]
                                                        : '';

                                                    return (
                                                        <FormItem>
                                                            <Label className='text-sm'>Start date</Label>
                                                            <FormControl>
                                                                <Input
                                                                    type="date"
                                                                    className="rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]"
                                                                    disabled={type === ACTION.VIEW}
                                                                    value={value}
                                                                    onChange={(e) => {
                                                                        const date = e.target.value ? new Date(e.target.value) : null;
                                                                        field.onChange(date);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>


                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='baseSalary'

                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label className='text-sm'>Base salary</Label>
                                                        <FormControl>
                                                            <Input type='number' className={` rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                placeholder='Base salary'
                                                                maxLength={60}
                                                                disabled={type === ACTION.VIEW} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>


                                    <div className='flex items-center gap-4'>
                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='department'

                                                render={
                                                    ({ field }) => {
                                                        const filterDepartment = departmentOptions.find(department => department.value === field.value);

                                                        const defaultDepartment: OptionSelected = (filterDepartment ? filterDepartment : unknownOption);

                                                        return (
                                                            <FormItem>
                                                                <Label className='text-sm'>Department</Label>
                                                                <ReactSelect
                                                                    options={departmentOptions}
                                                                    styles={styleSelectCountry}
                                                                    onChange={x => {
                                                                        setDepartmentSelected(x?.value);
                                                                        field.onChange(x?.value);
                                                                    }}
                                                                    value={defaultDepartment}
                                                                    className="w-48"
                                                                    placeholder="Department"
                                                                    classNamePrefix="react-select"
                                                                    isDisabled={type === ACTION.VIEW}
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        );
                                                    }
                                                }
                                            />
                                        </div>

                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='position'

                                                render={({ field }) => {
                                                    const filterPosition = positionByDepartmentOptions.find(position => position.value === field.value);

                                                    const defaultPosition: OptionSelected = (filterPosition ? filterPosition : unknownOption);

                                                    return (
                                                        <FormItem>
                                                            <Label className='text-sm'>Position</Label>
                                                            <FormControl>
                                                                <ReactSelect
                                                                    options={positionByDepartmentOptions}
                                                                    styles={styleSelectCountry}
                                                                    onChange={x => {
                                                                        field.onChange(x?.value);
                                                                    }}
                                                                    value={defaultPosition}
                                                                    className="w-48"
                                                                    placeholder="Position"
                                                                    classNamePrefix="react-select"
                                                                    isDisabled={type === ACTION.VIEW}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        </div>


                                        <div className='w-full'>
                                            <FormField
                                                control={form.control}
                                                name='roles'

                                                render={({ field }) => {
                                                    const filterRole = roleOptions.find(role => role?.value && field.value?.includes(role.value));

                                                    const defaultPosition: OptionSelected = (filterRole ? filterRole : unknownOption);
                                                    return (
                                                        <FormItem>
                                                            <Label className='text-sm'>Roles</Label>
                                                            <FormControl>
                                                                <ReactSelect
                                                                    options={roleOptions}
                                                                    styles={styleSelectCountry}
                                                                    onChange={x => {
                                                                        field.onChange(x?.value ? [x?.value] : null);
                                                                    }}
                                                                    value={defaultPosition}
                                                                    className="w-48"
                                                                    placeholder="Position"
                                                                    classNamePrefix="react-select"
                                                                    isDisabled={type === ACTION.VIEW}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className='flex items-start gap-4'>

                                        <div className='w-1/2'>
                                            <div className='w-full'>
                                                <Label className='text-sm block mb-2'>Address</Label>
                                                <div className="space-y-2 border rounded-md p-3">
                                                    <FormField
                                                        control={form.control}
                                                        name='address.street'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label className='text-sm'>Street</Label>
                                                                <FormControl>
                                                                    <Input className={`rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                        placeholder='Street'
                                                                        maxLength={100}
                                                                        disabled={type == ACTION.VIEW} {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name='address.city'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label className='text-sm'>City</Label>
                                                                <FormControl>
                                                                    <Input className={`rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                        placeholder='City'
                                                                        maxLength={60}
                                                                        disabled={type == ACTION.VIEW} {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name='address.zipCode'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label className='text-sm'>Zip Code</Label>
                                                                <FormControl>
                                                                    <Input className={`rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                        placeholder='Zip code'
                                                                        maxLength={20}
                                                                        disabled={type == ACTION.VIEW} {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name='address.country'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Label className='text-sm'>Country</Label>
                                                                <FormControl>
                                                                    <Input className={`rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                        placeholder='Country'
                                                                        maxLength={60}
                                                                        disabled={type == ACTION.VIEW} {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='w-1/2'>
                                            <Label className='text-sm block mb-2'>Emergency Contact</Label>
                                            <div className="space-y-2 border rounded-md p-3">
                                                <FormField
                                                    control={form.control}
                                                    name='emergencyContact.name'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label className='text-sm'>Name</Label>
                                                            <FormControl>
                                                                <Input className={`rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                    placeholder='Contact name'
                                                                    maxLength={60}
                                                                    disabled={type == ACTION.VIEW} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name='emergencyContact.relationship'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label className='text-sm'>Relationship</Label>
                                                            <FormControl>
                                                                <Input className={`rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                    placeholder='Relationship'
                                                                    maxLength={60}
                                                                    disabled={type == ACTION.VIEW} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name='emergencyContact.phoneNumber'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label className='text-sm'>Phone Number</Label>
                                                            <FormControl>
                                                                <Input className={`rounded-[4px] px-[14px] py-[10px] h-[36px] bg-white border-none disabled:text-black disabled:bg-[#79747E14]`}
                                                                    placeholder='Phone number'
                                                                    maxLength={60}
                                                                    disabled={type == ACTION.VIEW} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>

                </div>

                <div className='p-6 border-t bg-white sticky bottom-0'>
                    <DialogFooter>
                        {type == ACTION.EDIT && (
                            <Button type='submit' form="employee-form" className='flex items-center gap-2 bg-[#439F6E] hover:bg-[#439F6E]/90'>
                                <Icons.ActiveIcon className='h-5 w-5 ' /> Save
                            </Button>
                        )}

                        {type == ACTION.CREATE && (
                            <Button type='submit' form="employee-form" className='flex items-center gap-2 bg-[#439F6E] hover:bg-[#439F6E]/90'>
                                <Icons.ActiveIcon className='h-5 w-5 ' /> Create
                            </Button>
                        )}

                        {(type === ACTION.EDIT || type == ACTION.CREATE) && (
                            <Button
                                type='reset'
                                variant='outline'
                                onClick={() => {
                                    setOpen(false);
                                    setId('');
                                    resetFormToDefaultValues()
                                }}
                                className='border'
                            >
                                Cancel
                            </Button>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
