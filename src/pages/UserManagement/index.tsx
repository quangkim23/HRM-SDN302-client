import CustomTable from '@/components/CustomTable';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserResponse } from '@/constants/interfaces';
import { Icons } from '@/constants/svgIcon';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import React, { useEffect } from 'react';
import AddEditUser from './UserManagementAction/AddEditUser';
import ModalDelete from '@/components/ModalDelete/ModalDelete';
import useStoreLoading from '@/store/loadingStore';
import toastifyUtils from '@/utils/toastify';
import { ERROR_API_MESSAGE } from '@/constants/error-message';

export default function UserManagement() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [users, setUsers] = React.useState<UserResponse>();
  const [open, setOpen] = React.useState<boolean>(false);
  const [activeData, setActiveData] = React.useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>('create');
  const { showLoading, hideLoading } = useStoreLoading();
  const columns: any[] = [
    {
      header: 'Username',
      accessorKey: 'username',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Name',
      accessorKey: 'name',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Email',
      accessorKey: 'email',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Roles',
      accessorFn: (row: any) => {
        return row.roles.map((role: string) => role).join(', ');
      },
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Status',
      cell: ({ getValue }: any) => {
        const status = getValue();
        return status === true ? (
          <div className='flex items-center gap-1 cursor-auto '>
            <div className='h-2 w-2 bg-green-500 rounded-full'></div>
            <p>Active</p>
          </div>
        ) : (
          <div className='flex items-center gap-1 cursor-auto '>
            <div className='h-2 w-2 bg-red-500 rounded-full'></div>
            <p>Inactive</p>
          </div>
        );
      },
      accessorKey: 'isActive',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      accessorKey: 'id',
      header: 'Action',
      id: 'id',
      meta: {
        headerClassName: 'w-[10%] text-center font-bold'
      },
      cell: ({ row }: any) => {
        return (
          <div className='flex flex-row justify-center gap-2 h-8 pt-1 '>
            <Popover>
              <PopoverTrigger asChild>
                <Icons.ActionIcon className='h-6 w-6 hover:opacity-85 cursor-pointer' />
              </PopoverTrigger>
              <PopoverContent className='w-[150px] -p-10 '>
                <div className='flex flex-row gap-4 items-center  h-12 px-3 hover:bg-background cursor-pointer text-sm'>
                  {row.original.isActive ? (
                    <div
                      className='flex gap-2 items-center'
                      onClick={() => handleChangeStatus(row?.original.id, false)}
                    >
                      <div className='bg-[#eb4048] rounded-full h-3 w-3'></div>
                      <span>InActive</span>
                    </div>
                  ) : (
                    <div className='flex gap-2 items-center' onClick={() => handleChangeStatus(row?.original.id, true)}>
                      <div className='bg-[#34c661] rounded-full h-3 w-3'></div>
                      <span>Active</span>
                    </div>
                  )}
                </div>

                <div
                  className='flex flex-row gap-4 items-center  h-12 px-3 hover:bg-background cursor-pointer text-sm'
                  onClick={() => {
                    setActiveData(row?.original.id);
                    setOpen(true);
                    setType('update');
                  }}
                >
                  <Icons.EditIcon className='h-5 w-5' />
                  <span>Edit</span>
                </div>
                <div
                  onClick={() => {
                    setActiveData(row?.original.id);
                    setOpenDeleteDialog(true);
                  }}
                  className='flex flex-row gap-4 items-center  h-12 px-3 hover:bg-background cursor-pointer'
                >
                  <Icons.DeleteIcon className='h-5 w-5 fill-redColor' />
                  <div className='text-sm'>Delete</div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      }
    }
  ];

  const getUsers = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: URL_PATHS.GET_USERS
      });
      setUsers(response.data);
    } catch (error) {
      console.log('Error fetching users', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = async (id: string, status: boolean) => {
    try {
      await axiosInstance({
        method: 'POST',
        url: URL_PATHS.CHANGE_STATUS_USER,
        data: {
          id: id,
          isActive: status
        }
      });
    } catch (error) {
      console.log('Error changing status', error);
    } finally {
      getUsers();
    }
  };

  const hanldeDeleteUser = async (id: string) => {
    showLoading();
    setIsLoadingDelete(true);
    try {
      console.log('ID Client', id);
    } catch (error) {
      toastifyUtils('error', error || ERROR_API_MESSAGE[3]);
      console.log(error);
    } finally {
      setIsLoadingDelete(false);
      setOpenDeleteDialog(false);
      hideLoading();
      getUsers();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      <AddEditUser open={open} setOpen={setOpen} getUserList={getUsers} type={type} id={activeData} />
      <CustomTable columns={columns} data={users?.items || []} isLoading={isLoading} />

      {openDeleteDialog && activeData && (
        <ModalDelete
          id={activeData}
          handleDelete={hanldeDeleteUser}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          isLoadingDelete={isLoadingDelete}
        />
      )}
    </div>
  );
}
