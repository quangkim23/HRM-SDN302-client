import CustomTable from '@/components/CustomTable';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DepartmentResponse, EmployeeResponse, OptionSelected, PositionByDepartment } from '@/constants/interfaces';
import { Icons } from '@/constants/svgIcon';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import React, { useEffect, useState } from 'react';
import ModalDelete from '@/components/ModalDelete/ModalDelete';
import useStoreLoading from '@/store/loadingStore';
import toastifyUtils from '@/utils/toastify';
import { ERROR_API_MESSAGE } from '@/constants/error-message';
import { Department } from './../../constants/interfaces';
import ReactSelect from 'react-select';
import { Label } from '@radix-ui/react-label';
import { headerColumn } from '@/components/ColumnCustom/HeaderCustom';
// import AddEditEmployee from './EmployeeManagementAction/AddEditEmployee';
import { ACTION } from '@/constants/action';

import { Sheet } from '@/components/ui/sheet';
import AddEditDepartment from './DepartmentManagementAction/DepartmentManagementAction';

export default function DepartmentManagement() {

  const defaultDepartment: OptionSelected = {
    value: null,
    label: "All Departments"
  }

  const defaultPosition: OptionSelected = {
    value: null,
    label: "All Positions"
  }

  const doNotChoosePosition: OptionSelected = {
    value: null,
    label: "Choose department"
  }

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [departments, setDepartments] = React.useState<DepartmentResponse>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [departmentOptions, setDepartmentOptions] = useState<OptionSelected[]>();
  const [departmentSelected, setDepartmentSelected] = useState<OptionSelected | null>(defaultDepartment);
  const [positionOptions, setPositionOptions] = useState<OptionSelected[]>([]);
  const [positionSelected, setPositionSelected] = useState<OptionSelected | null>(defaultPosition);
  const [open, setOpen] = React.useState<boolean>(false);
  const [activeData, setActiveData] = React.useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState<boolean>(false);
  const [type, setType] = React.useState<string>('create');
  const { showLoading, hideLoading } = useStoreLoading();

  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [fieldSort, setFieldSort] = useState<string>('createdAt');

  const handleSort = (field: string, sort: 'ASC' | 'DESC') => {
    setFieldSort(field);
    setSort(sort);
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
      header: ({ }: any) => {
        return (
          <Label>
            {headerColumn('name', 'Department', sort, handleSort, fieldSort)}
          </Label>
        )
      },
      accessorKey: 'name',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal',
      }
    },
    {
      header: 'Manager',
      accessorKey: 'manager.fullName',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Employee counts',
      accessorKey: 'employeeCount',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Position counts',
      accessorKey: 'positionCounts',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      accessorKey: '_id',
      header: 'Action',
      id: 'id',
      meta: {
        headerClassName: 'w-[10%] text-center font-bold',
        disableRowClick: true,
      },
      cell: ({ row }: any) => {
        return (
          <div className='flex flex-row justify-center gap-2 h-8 pt-1 ' >
            <Popover>
              <PopoverTrigger asChild>
                <Icons.ActionIcon className='h-6 w-6 hover:opacity-85 cursor-pointer' />
              </PopoverTrigger>
              <PopoverContent className='w-[150px] -p-10 '>
                <div
                  className='flex flex-row gap-4 items-center  h-12 px-3 hover:bg-background cursor-pointer text-sm'
                  onClick={() => {
                    setActiveData(row?.original._id);
                    setOpen(true);
                    setType(ACTION.EDIT);
                  }}
                >
                  <Icons.EditIcon className='h-5 w-5' />
                  <span>Edit</span>
                </div>

                <div
                  className='flex flex-row gap-4 items-center  h-12 px-3 hover:bg-background cursor-pointer text-sm'
                  onClick={() => {
                    setActiveData(row?.original._id);
                    setOpen(true);
                    setType(ACTION.ADD_EMPLOYEE_DEPARTMENT);
                  }}
                >
                  <Icons.AddEmployee className='h-5 w-5' />
                  <span>Add Employees</span>
                </div>


                <div
                  onClick={() => {
                    setActiveData(row?.original._id);
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

  const getDepartments = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: URL_PATHS.GET_DEPARTMENTS,
        params: {
          limit: limit,
          page: page,
          search: search,
          sort: fieldSort ? `${sort == 'DESC' ? '-' : ''}${fieldSort}` : null,
        }
      });
      setDepartments(response.data);
    } catch (error) {
      console.log('Error fetching employees', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleDeleteDepartment = async (id: string) => {
    showLoading();
    setIsLoadingDelete(true);
    try {
      await axiosInstance({
        method: 'DELETE',
        url: `${URL_PATHS.DELETE_DEPARTMENT}/${id}`,
      });

      toastifyUtils('success', 'Delete department successfully!');
    } catch (error: any) {
      let errorMessage = error.errorMessage ? error.errorMessage : ERROR_API_MESSAGE[3];

      toastifyUtils('error', errorMessage);
    } finally {
      setIsLoadingDelete(false);
      setOpenDeleteDialog(false);
      hideLoading();
      getDepartments();
    }
  };

  const handleLimitChange = async (limit: number) => {
    setLimit(limit);
  }

  const handlePageChange = async (page: number) => {
    setPage(page);
  };

  const handleSearch = async (search: string) => {
    setSearch(search);
  }

  useEffect(() => {
    getDepartments();
  }, [limit, page, search, departmentSelected, positionSelected, sort, fieldSort]);


  return (
    <div className='flex flex-col gap-5'>


      <AddEditDepartment
        open={open}
        setOpen={setOpen}
        id={activeData}
        setId={setActiveData}
        type={type}
        setType={setType}
        getDepartmentList={getDepartments}
      />

      {/* <AddEditEmployee open={open} setOpen={setOpen} getEmployeeList={getEmployees} type={type} id={activeData} setId={setActiveData} setType={setType} /> */}

      <div className="flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by fullName or email..."
            className="w-64 h-9 pl-9 pr-9 py-2 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Icons.SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

      </div>

      <CustomTable onRowClick={employee => {
        setOpen(true);
        setType(ACTION.VIEW);
        setActiveData(employee._id)
      }} columns={columns} data={departments?.data || []} isLoading={isLoading} />

      {departments?.pagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {((departments.pagination.page - 1) * departments.pagination.limit) + 1} to {Math.min(departments.pagination.page * departments.pagination.limit, departments.pagination.total)} out of {departments.pagination.total} Departments
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Row</p>
              <select
                className="h-8 w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {departments.pagination.page} / {departments.pagination.totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${departments.pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(1)}
                disabled={departments.pagination.page <= 1}
              >
                <span className="sr-only">First page</span>
                <Icons.PageFirst className="h-4 w-4" />
              </button>
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${!departments.pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(departments.pagination.page - 1)}
                disabled={!departments.pagination.hasPrevPage}
              >
                <span className="sr-only">Previous</span>
                <Icons.PagePrevious className="h-4 w-4" />
              </button>
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${!departments.pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(departments.pagination.page + 1)}
                disabled={!departments.pagination.hasNextPage}
              >
                <span className="sr-only">Next</span>
                <Icons.PageNext className="h-4 w-4" />
              </button>
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${departments.pagination.page >= departments.pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(departments.pagination.totalPages)}
                disabled={departments.pagination.page >= departments.pagination.totalPages}
              >
                <span className="sr-only">Last page</span>
                <Icons.PageLast className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}


      {openDeleteDialog && activeData && (
        <ModalDelete
          id={activeData}
          handleDelete={handleDeleteDepartment}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          isLoadingDelete={isLoadingDelete}
        />
      )}
    </div>
  );
}
