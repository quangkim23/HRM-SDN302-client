import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Select from 'react-select';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/constants/svgIcon';
import { ERROR_API_MESSAGE } from '@/constants/error-message';
import { ACTION } from '@/constants/action';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import useStoreLoading from '@/store/loadingStore';
import toastifyUtils from '@/utils/toastify';
import { Employee, EmployeeDetail, EmployeeResponse, OptionSelected, PositionByDepartment } from '@/constants/interfaces';
import CustomTable from '@/components/CustomTable';
import ReactSelect, { ActionMeta, SingleValue, MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { selectStyles } from '@/components/styles/style';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: string;
  setId: (id: string) => void;
  type: string;
  setType: (type: string) => void;
  getDepartmentList?: (pageIndex: number) => Promise<void>;
};

interface Department {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface AddOrRemoveEmployee {
  employeeId?: string | null,
  positionId?: string | null
}

export default function AddEditDepartment(props: Props) {
  const { open, setOpen, getDepartmentList, type, id, setId, setType } = props;
  const { hideLoading, showLoading } = useStoreLoading();
  const [department, setDepartment] = React.useState<Department | null>(null);
  const [employeesByDepartment, setEmployeesByDepartment] = React.useState<any>(null);
  const [employeesByDepartmentOriginal, setEmployeesByDepartmentOriginal] = React.useState<any>(null);
  const [employeesAddToDepartment, setEmployeesAddToDepartment] = React.useState<EmployeeResponse[] | null>(null);
  const [employeeByDepartmentOptions, setEmployeeByDepartmentOptions] = React.useState<OptionSelected[]>([]);
  const [positions, setPositions] = React.useState<PositionByDepartment[]>([]);

  const [newPositionTitle, setNewPositionTitle] = React.useState('');

  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [deletePositionTitle, setDeletePositionTitle] = React.useState('');
  const [managerOptions, setManagerOptions] = React.useState<OptionSelected[]>([]);
  const [employeeOptions, setEmployeeOptions] = React.useState<OptionSelected[]>([]);
  const [employeeSelected, setEmployeeSelected] = React.useState<OptionSelected | null>();
  const [positionSelected, setPositionSelected] = React.useState<OptionSelected | null>();
  const [addOrRemoveEmployeesToDepartment, setAddOrRemoveEmployeesToDepartment] = React.useState<AddOrRemoveEmployee[]>([]);

  const defaultMangerSelected: OptionSelected = {
    label: 'Unknown',
    value: null
  };

  const [managerSelected, setManagerSelected] = React.useState<OptionSelected | null>(defaultMangerSelected);

  const formSchema = z.object({
    name: z.string().min(1, "Department name is required"),
    description: z.string().optional(),
    manager: z.string({
      invalid_type_error: "Manager is invalid"
    }).min(1, "Manager is required"),
    employees: z.array(z.object({
      employeeId: z.string(),
      positionId: z.string()
    })).optional()
  });

  const defaultValues: z.infer<typeof formSchema> = {
    name: '',
    description: '',
    manager: '',
    employees: []
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetFormToDefaultValues = () => {
    setDepartment(null);
    setManagerSelected(defaultMangerSelected);
    setManagerOptions([]);
    setPositions([]);
    setEmployeeOptions([]);
    setPositionSelected(null);
    setEmployeeSelected(null);
    setAddOrRemoveEmployeesToDepartment([]);

    form.reset(defaultValues);
  };

  const errorFunc = (err: any) => {
    console.log('Form errors:', err);
  };


  const columns: any[] = [
    {
      header: 'No.',
      id: 'index',
      cell: ({ row }: any) => {
        return <div className="text-center">{row.index + 1}</div>;
      },
      meta: {
        headerClassName: 'w-[5%] text-center font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'employee code',
      accessorKey: 'employeeCode',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal',
      }
    },
    {
      header: 'full name',
      accessorKey: 'fullName',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'email',
      accessorKey: 'email',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },

    {
      header: 'Position',
      accessorKey: 'position.title',
      cell: ({ getValue }: any) => {
        const position = getValue();
        if (position) return position
        return "Unknown"
      },
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Roles',
      id: 'roles',
      cell: ({ row }: any) => {
        if (row.original?.roles) {
          return (row.original.roles.map((role: { name: any; }) => role.name)).join(", ");
        } else {
          return 'Unknown';
        }
      },
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    ...(type === ACTION.ADD_EMPLOYEE_DEPARTMENT ? [{
      header: 'Action',
      cell: ({ row }: any) => {
        return (
          <div
            className="h-8 w-8 p-0 cursor-pointer flex items-center justify-center rounded-full"
            onClick={() => {
              confirmDeleteEmployeeFormDepartment(row.original._id);
            }}
          >
            <Icons.Delete className='h-3.5 w-3.5' />
          </div>
        )
      },
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    }] : [])
  ];

  const getDepartmentById = async () => {
    if (!id) return;

    showLoading();
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: `${URL_PATHS.GET_DEPARTMENT}/${id}`,
      });

      setDepartment(response.data);

      form.reset({
        name: response.data.name,
        description: response.data.description || '',
        manager: response.data?.manager?._id
      });

      if (response.data?.manager?._id) {
        setManagerSelected({
          label: response.data.manager?.fullName || 'Manager no name',
          value: response.data.manager._id
        })
      }
    } catch (error: any) {
      console.error('Error get department by id', error);
      let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];
      toastifyUtils('error', errorMessage);
    } finally {
      hideLoading();
    }
  };

  const confirmDeleteEmployeeFormDepartment = (id: string) => {
    let x = { ...employeesByDepartment };
    x.data = employeesByDepartment.data.filter((employee: any) => employee._id.toString() !== id);
    setEmployeesByDepartment(x)

    const employeeRemove = employeesByDepartment.data.find((employee: any) => employee._id.toString() === id);

    setEmployeeOptions([...employeeOptions, {
      label: employeeRemove.fullName,
      value: employeeRemove._id
    }])

    setAddOrRemoveEmployeesToDepartment(addOrRemoveEmployeesToDepartment.filter(employee => employee.employeeId !== employeeRemove._id.toString()))
  }


  const getEmployees = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: URL_PATHS.GET_EMPLOYEES,
        params: {
          limit: 1000,
          page: 1
        }
      });
      if (response?.data?.data?.length > 0) {
        const managerOptions = response.data.data.map((employee: Employee) => {
          if (!(employee.department)) {
            return {
              label: employee.fullName,
              value: employee._id
            }
          }
        })

        setManagerOptions(managerOptions.filter((x: any) => x));
      }
    } catch (error) {
      console.log('Error fetching employees', error);
    } finally {
    }
  };

  const getEmployeeAddDepartment = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: URL_PATHS.GET_EMPLOYEE_ADD_DEPARTMENT
      });
      if (response?.data?.length > 0) {
        const managerOptions = response.data.map((employee: Employee) => {
          return {
            label: employee.fullName,
            value: employee._id
          }
        })

        setEmployeeOptions(managerOptions);
        setEmployeesAddToDepartment(response.data);
      }
    } catch (error) {
      console.log('Error fetching employees', error);
    } finally {
    }
  }

  const getEmployeesByDepartment = async () => {
    if (!id) return;

    showLoading();
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: `${URL_PATHS.GET_EMPLOYEES_BY_DEPARTMENT}/${id}`,
        params: {
          limit: 1000,
          page: 1
        }
      });

      setEmployeesByDepartment(response.data);
      setEmployeesByDepartmentOriginal(response.data);

      let addOrRemoveEmployee: AddOrRemoveEmployee[] = [];


      if (response?.data?.data?.length > 0) {
        const managerOptions = response.data.data.map((employee: EmployeeDetail) => {
          addOrRemoveEmployee.push({
            employeeId: employee._id,
            positionId: employee.position._id
          })
          return {
            label: employee.fullName,
            value: employee._id
          }
        })

        setManagerOptions(managerOptions);
        setAddOrRemoveEmployeesToDepartment(addOrRemoveEmployee);
      } else {
        getEmployees();
      }

    } catch (error: any) {
      console.error('Error get employees by department', error);
      let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];
      toastifyUtils('error', errorMessage);
    } finally {
      hideLoading();
    }
  }

  const getPositionsByDepartment = async () => {
    if (!id) return;

    showLoading();
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: `${URL_PATHS.GET_POSITIONS_BY_DEPARTMENT}/${id}`,
        params: {
          limit: 1000,
          page: 1
        }
      });

      setPositions(response.data);

    } catch (error: any) {
      console.error('Error get position by department', error);
      let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];
      toastifyUtils('error', errorMessage);
    } finally {
      hideLoading();
    }
  }

  const handleUpdateDepartment = async (data: z.infer<typeof formSchema>) => {
    showLoading();
    try {
      const dataSend = {
        name: data.name,
        description: data.description,
        positions: positions,
        manager: managerSelected?.value
      }
      await axiosInstance({
        method: 'PUT',
        url: `${URL_PATHS.UPDATE_DEPARTMENT}/${id}`,
        data: dataSend,
      });
      toastifyUtils('success', 'Update department successfully');
      setOpen(false);
    } catch (error: any) {
      console.error('Error update department', error);
      let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];
      toastifyUtils('error', errorMessage);
    } finally {
      hideLoading();
      getDepartmentList && getDepartmentList(1);
    }
  };

  const handleAddDepartment = async (data: z.infer<typeof formSchema>) => {
    showLoading();
    try {

      const dataSend = {
        name: data.name,
        description: data.description,
        positions: positions,
        manager: managerSelected?.value
      }
      await axiosInstance({
        method: 'POST',
        url: URL_PATHS.ADD_DEPARTMENT,
        data: dataSend
      });
      toastifyUtils('success', 'Add department successfully');
      setOpen(false);
    } catch (error: any) {
      console.error('Error add department', error);
      let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];
      toastifyUtils('error', errorMessage);
    } finally {
      hideLoading();
      getDepartmentList && getDepartmentList(1);
    }
  };

  const handleAddOrRemoveEmployee = async (data: z.infer<typeof formSchema>) => {
    if (!id) return;
    showLoading();
    try {

      const dataSend = {
        employees: addOrRemoveEmployeesToDepartment
      }
      await axiosInstance({
        method: 'PUT',
        url: `${URL_PATHS.ADD_OR_REMOVE_EMPLOYEE_TO_DEPARTMENT}/${id}`,
        data: dataSend
      });
      toastifyUtils('success', 'Update department successfully');
      setOpen(false);
    } catch (error: any) {
      console.error('Error add department', error);
      let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];
      toastifyUtils('error', errorMessage);
    } finally {
      hideLoading();
      getDepartmentList && getDepartmentList(1);
    }
  }

  const handleAddPosition = async () => {
    if (!newPositionTitle.trim()) return;


    const positionExist = positions.filter(position => position.title.toLowerCase().trim() === newPositionTitle.toLowerCase().trim())


    if (positionExist.length > 0) {
      toastifyUtils('error', "Position title exist");
      return;
    }
    const newPosition = {
      title: newPositionTitle.trim()
    };

    setPositions([...positions, newPosition]);
    setNewPositionTitle('');
  };

  const handleDeletePosition = (title: string) => {
    const position = positions.find(pos => pos.title === title);
    if (position) {
      setDeletePositionTitle(position.title);
      setShowConfirmDelete(true);
    }
  };

  const confirmDeletePosition = async () => {
    if (!deletePositionTitle) return;

    setPositions(positions.filter(pos => pos.title !== deletePositionTitle));

    setShowConfirmDelete(false);
    setDeletePositionTitle('');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (type === ACTION.EDIT) {
      handleUpdateDepartment(values);
    } else if (type === ACTION.ADD_EMPLOYEE_DEPARTMENT) {
      handleAddOrRemoveEmployee(values);
    }
    else {
      handleAddDepartment(values);
    }
  };

  const handleSelectedManger = (selectedOption: OptionSelected | null) => {
    console.log(selectedOption)
    setManagerSelected(selectedOption);
  }


  const handleAddEmployeeWithPosition = async () => {
    let employees: any = employeesAddToDepartment?.find((x: any) => x._id.toString() === employeeSelected?.value?.toString());

    console.log(employees);
    if(!employees){
      employees = employeesByDepartmentOriginal?.data?.find((x: any) => x._id.toString() === employeeSelected?.value?.toString());
    }

    employees.position = {
      _id: positionSelected?.value,
      title: positionSelected?.label
    }
    
    const x = { ...employeesByDepartment };
    x.data = [...x.data, employees];
    const addEmployee: AddOrRemoveEmployee = {
      employeeId: employeeSelected?.value,
      positionId: positionSelected?.value
    }

    setAddOrRemoveEmployeesToDepartment([...addOrRemoveEmployeesToDepartment, addEmployee])

    setEmployeesByDepartment(x);
    setEmployeeOptions(employeeOptions.filter(employee => employee.value !== addEmployee.employeeId))

    setEmployeeSelected(null);
    setPositionSelected(null);
  }

  React.useEffect(() => {
    if (id && type !== ACTION.CREATE) {
      getDepartmentById();
      getEmployeesByDepartment();
      getPositionsByDepartment();
      getEmployeeAddDepartment();
    } else {
      resetFormToDefaultValues();
    }
  }, [id]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setId('');
        resetFormToDefaultValues();
      }
    }}>

      <SheetTrigger asChild>
        <Button onClick={() => {
          setType(ACTION.CREATE);
          getEmployees();
        }} variant="default" className="w-fit flex items-center gap-2">
          New Department
        </Button>
      </SheetTrigger>


      <SheetContent className="!w-[80%] !max-w-full flex flex-col p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="p-6 pb-4">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">
                {type === ACTION.EDIT ? 'Edit Department' : type === ACTION.VIEW ? 'Department Details' : type === ACTION.ADD_EMPLOYEE_DEPARTMENT ? "Add Employees to Department" : 'Add Department'}
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <Form {...form}>
              <form id="department-form" onSubmit={form.handleSubmit(onSubmit, errorFunc)} className="space-y-6">
                <div className='w-full flex flex-col gap-4'>
                  <div className='flex items-start gap-4'>
                    <div className='w-1/2'>
                      <FormField
                        control={form.control}
                        name='manager'
                        render={({ field }) => (
                          <FormItem>
                            <Label className='text-sm'>Manager</Label>
                            <FormControl>
                              <ReactSelect
                                options={managerOptions}
                                styles={{
                                  ...selectStyles,
                                  container: (provided) => ({
                                    ...provided,
                                    width: '80%'
                                  })
                                }}
                                onChange={(x) => {
                                  handleSelectedManger(x);
                                  field.onChange(x?.value);
                                }}
                                value={managerSelected}
                                className="w-48"
                                placeholder="Department"
                                isDisabled={type === ACTION.VIEW || type === ACTION.ADD_EMPLOYEE_DEPARTMENT}
                                classNamePrefix="react-select"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='w-1/3'>
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>
                            <Label className='text-sm'>Department Name</Label>
                            <FormControl>
                              <Input
                                className="rounded-[4px] px-[14px] py-[10px] h-[36px]"
                                placeholder='Department name'
                                maxLength={100}
                                disabled={type === ACTION.VIEW || type === ACTION.ADD_EMPLOYEE_DEPARTMENT}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='w-2/3'>
                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <Label className='text-sm'>Description</Label>
                            <FormControl>
                              <Textarea
                                className="rounded-[4px] px-[14px] py-[10px] min-h-[100px] resize-y"
                                placeholder='Department description'
                                disabled={type === ACTION.VIEW || type === ACTION.ADD_EMPLOYEE_DEPARTMENT}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>


                  <div className='flex items-start gap-4'>
                    {(type === ACTION.VIEW || type === ACTION.EDIT || type === ACTION.CREATE) && (
                      <div className='w-full'>
                        <div className='flex justify-between items-center mb-2'>
                          <Label className='text-sm font-medium'>Positions</Label>
                        </div>
                        <div className='border rounded-md bg-gray-50 p-4'>
                          {(type === ACTION.EDIT || type === ACTION.CREATE) && (
                            <div className='mt-2 border-t pb-4'>
                              <div className='flex items-end gap-3'>
                                <div className='flex-grow'>
                                  <Label className='text-xs mb-1 block'>Position Title</Label>
                                  <Input
                                    className="h-9 rounded-md"
                                    placeholder='Enter position title'
                                    value={newPositionTitle}
                                    onChange={(e) => setNewPositionTitle(e.target.value)}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  disabled={!newPositionTitle.trim()}
                                  className='flex items-center gap-1 h-9'
                                  onClick={handleAddPosition}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          )}


                          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                            {positions && positions.length > 0 ? (
                              positions.map((position: PositionByDepartment) => (
                                <div
                                  key={position._id}
                                  className='flex items-center justify-between bg-white p-3 rounded-md border hover:shadow-sm transition-shadow'
                                >
                                  <div className='flex items-center gap-2 flex-grow overflow-hidden'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></div>
                                    <div className='overflow-hidden'>
                                      <p >{position.title}</p>
                                    </div>
                                  </div>

                                  {(type === ACTION.EDIT || type === ACTION.CREATE) && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className='h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-500 flex-shrink-0'
                                      onClick={() => handleDeletePosition(position.title)}
                                    >
                                      <Icons.Delete className='h-3.5 w-3.5' />
                                    </Button>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className='col-span-3 text-center py-4 text-gray-500'>
                                {type === ACTION.EDIT ? 'Add your first position below.' : 'No positions found for this department.'}
                              </div>
                            )}
                          </div>


                        </div>

                        {showConfirmDelete && (
                          <div className='mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between'>
                            <p className='text-sm text-red-600'>Delete position "{deletePositionTitle}"?</p>
                            <div className='flex gap-2'>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className='h-7 border-red-300 text-red-600 hover:bg-red-100'
                                onClick={confirmDeletePosition}
                              >
                                Delete
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className='h-7'
                                onClick={() => {
                                  setShowConfirmDelete(false);
                                  setDeletePositionTitle('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {(type === ACTION.ADD_EMPLOYEE_DEPARTMENT) && (<div className='flex items-start gap-4'>
                    <div className='flex items-start gap-4 mt-6'>
                      <div className='w-full'>
                        <div className='flex justify-between items-center mb-2'>
                          <Label className='text-sm font-medium'>Add Employee to Department</Label>
                        </div>
                        <div className='border rounded-md bg-gray-50 p-4'>
                          {(
                            <div className='flex flex-col gap-4'>
                              <div className='flex items-end gap-3'>
                                <div className='flex-grow'>
                                  <Label className='text-xs mb-1 block'>Select Employee</Label>
                                  <ReactSelect
                                    options={employeeOptions}
                                    styles={{
                                      ...selectStyles,
                                      container: (provided) => ({
                                        ...provided,
                                        width: '100%'
                                      })
                                    }}
                                    onChange={(selectedOption) => {
                                      setEmployeeSelected(selectedOption);
                                    }}
                                    value={employeeSelected}
                                    className="w-full"
                                    placeholder="Select employee"
                                    isDisabled={type === ACTION.VIEW}
                                    classNamePrefix="react-select"
                                    isClearable
                                  />
                                </div>
                                <div className='flex-grow'>
                                  <Label className='text-xs mb-1 block'>Select Position</Label>
                                  <ReactSelect
                                    options={positions.map(pos => ({
                                      label: pos.title,
                                      value: pos._id || pos.title
                                    }))}
                                    styles={{
                                      ...selectStyles,
                                      container: (provided) => ({
                                        ...provided,
                                        width: '100%'
                                      })
                                    }}
                                    onChange={(selectedOption) => {
                                      setPositionSelected(selectedOption);
                                    }}
                                    value={positionSelected}
                                    className="w-full"
                                    placeholder="Select position"
                                    isDisabled={type === ACTION.VIEW || !employeeSelected}
                                    classNamePrefix="react-select"
                                    isClearable
                                  />
                                </div>
                                <Button
                                  type="button"
                                  disabled={!employeeSelected || !positionSelected}
                                  className='flex items-center gap-1 h-9'
                                  onClick={handleAddEmployeeWithPosition}
                                >
                                  Add
                                </Button>
                              </div>


                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>)}



                  {(type !== ACTION.CREATE && type !== ACTION.EDIT) && (
                    <div className='flex items-center gap-4'>
                      <CustomTable columns={columns} data={employeesByDepartment?.data || []} />
                    </div>
                  )}

                </div>
              </form>
            </Form>
          </div>

          <div className="mt-auto border-t bg-white w-full">
            <SheetFooter className="p-4 gap-2 flex justify-end">
              {(type === ACTION.EDIT || type === ACTION.ADD_EMPLOYEE_DEPARTMENT) && (
                <Button
                  type='submit'
                  form="department-form"
                  variant="success"
                  className='flex items-center gap-2'
                >
                  <Icons.ActiveIcon className='h-5 w-5' /> Save Changes
                </Button>
              )}

              {type === ACTION.CREATE && (
                <Button
                  type='submit'
                  form="department-form"
                  variant="success"
                  className='flex items-center gap-2'
                >
                  Create Department
                </Button>
              )}

              {(type !== ACTION.VIEW) && (
                <SheetClose asChild>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setId('');
                      resetFormToDefaultValues();
                    }}
                    className='border'
                  >
                    Cancel
                  </Button>
                </SheetClose>
              )}

              {type === ACTION.VIEW && (
                <SheetClose asChild>
                  <Button
                    variant='outline'
                    className='border'
                  >
                    Close
                  </Button>
                </SheetClose>
              )}
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}