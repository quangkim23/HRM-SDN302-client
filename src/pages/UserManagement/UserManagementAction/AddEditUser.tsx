import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import useStoreLoading from '@/store/loadingStore';
import toastifyUtils from '@/utils/toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import SelectReact from 'react-select';
import { z } from 'zod';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  getUserList?: () => Promise<void>;
  type: string;
  id?: string;
};

export default function AddEditUser(props: Props) {
  const { open, setOpen, getUserList, type, id } = props;
  const { hideLoading, showLoading } = useStoreLoading();
  const formSchema = z.object({
    username: z.string({ required_error: 'Username is required' }).trim().min(1),
    name: z.string({ required_error: 'Name is required' }).trim().min(1),
    email: z
      .string()
      .email({
        message: 'Invalid email'
      })
      .optional(),
    password: z.string().optional(),
    roles: z.array(z.string()).optional()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: ''
    }
  });

  const getTitle = () => {
    switch (type) {
      case 'create':
        return 'New user';
      case 'update':
        return 'Detail user';
      default:
        return 'Edit user';
    }
  };

  const optionRoles = [
    {
      value: 'Admin',
      label: 'Admin'
    },
    {
      value: 'Manager',
      label: 'Manager'
    },
    {
      value: 'Sub Admin',
      label: 'Sub Admin'
    },
    {
      value: 'User',
      label: 'User'
    }
  ];

  const styleSelectCountry = {
    control: (provided: any) => ({
      ...provided,
      fontSize: '14px',
      borderRadius: '8px',
      // borderColor: form.formState.errors.country ? 'red' : '#687197',
      minHeight: '52px'
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
      maxHeight: 200
    })
  };

  const getUserById = async () => {
    showLoading();
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: `${URL_PATHS.GET_USER_BY_ID}?id=${id}`
      });
      form.reset(response.data);
    } catch (error) {
      console.error('Error get user by id', error);
    } finally {
      hideLoading();
    }
  };
  const handleCreateNewUser = async (dataSend: any) => {
    const dataSendCreate = {
      username: dataSend.username,
      name: dataSend.name,
      email: dataSend.email,
      password: dataSend.password
    };

    try {
      await axiosInstance({
        method: 'POST',
        url: URL_PATHS.CREATE_USER,
        data: dataSendCreate
      });
      toastifyUtils('success', 'Create new user successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error create new user', error);
    } finally {
      hideLoading();
      getUserList && getUserList();
      form.reset();
    }
  };

  const handleUpdateUser = async (dataSend: any) => {
    const dataSendUpdate = {
      name: dataSend.name,
      roles: dataSend.roles
    };

    try {
      await axiosInstance({
        method: 'POST',
        url: `${URL_PATHS.UPDATE_USER}/${id}`,
        data: dataSendUpdate
      });
      toastifyUtils('success', 'Update user successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error update user', error);
    } finally {
      hideLoading();
      getUserList && getUserList();
    }
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    hideLoading();
    if (type === 'create') {
      handleCreateNewUser(values);
    } else {
      handleUpdateUser(values);
    }
  };

  React.useEffect(() => {
    if (type !== 'create' && id) {
      getUserById();
    }
  }, [id, type]);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-fit'>
          New User
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Username</Label>
                      <FormControl>
                        <Input
                          className={`rounded-[8px] px-[14px] py-[10px] h-[52px] bg-white ${form.formState.errors.username ? 'border border-red-500 focus-visible:outline-none focus-visible:border-red-500' : ''}`}
                          placeholder='Username'
                          {...field}
                          maxLength={250}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Name</Label>
                      <FormControl>
                        <Input
                          className={`rounded-[8px] px-[14px] py-[10px] h-[52px] bg-white ${form.formState.errors.name ? 'border border-red-500 focus-visible:outline-none focus-visible:border-red-500' : ''}`}
                          placeholder='Name'
                          {...field}
                          maxLength={250}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <Input
                          className={`rounded-[8px] px-[14px] py-[10px] h-[52px] bg-white ${form.formState.errors.email ? 'border border-red-500 focus-visible:outline-none focus-visible:border-red-500' : ''}`}
                          placeholder='Email'
                          {...field}
                          maxLength={250}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <Label>Password</Label>
                      <FormControl>
                        <Input
                          className={`rounded-[8px] px-[14px] py-[10px] h-[52px] bg-white ${form.formState.errors.password ? 'border border-red-500 focus-visible:outline-none focus-visible:border-red-500' : ''}`}
                          placeholder='Password'
                          type='password'
                          {...field}
                          maxLength={250}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {type === 'update' && (
                  <FormField
                    control={form.control}
                    name='roles'
                    render={({ field }) => (
                      <FormItem>
                        <Label>Roles</Label>
                        <FormControl>
                          <SelectReact
                            options={optionRoles}
                            styles={styleSelectCountry}
                            placeholder='Select Roles'
                            isMulti
                            value={
                              field.value?.map(item => {
                                return {
                                  value: item,
                                  label: optionRoles.find(option => option.value === item)?.label || ''
                                };
                              }) || []
                            }
                            // isDisabled={type == 'create'}
                            onChange={(val: any) => {
                              const result = val.map((item: { value: string }) => item.value);
                              field.onChange(result);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <DialogFooter>
                  <Button type='submit'>Save changes</Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
