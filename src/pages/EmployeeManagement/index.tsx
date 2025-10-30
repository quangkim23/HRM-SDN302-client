import CustomTable from '@/components/CustomTable';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EmployeeResponse, OptionSelected, PositionByDepartment } from '@/constants/interfaces';
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
import AddEditEmployee from './EmployeeManagementAction/AddEditEmployee';
import { ACTION } from '@/constants/action';
import { saveAs } from 'file-saver';
import ImportExportDialog from './EmployeeManagementAction/ImportExportDialog';

export default function EmployeeManagement() {

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
  const [employees, setEmployees] = React.useState<EmployeeResponse>();
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

  const [openImportExportDialog, setOpenImportExportDialog] = React.useState(false);

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
            {headerColumn('employeeCode', 'Employee code', sort, handleSort, fieldSort)}
          </Label>
        )
      },
      accessorKey: 'employeeCode',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal',
      }
    },
    {
      header: ({ }: any) => {
        return (
          <Label>
            {headerColumn('fullName', 'full  name', sort, handleSort, fieldSort)}
          </Label>
        )
      },
      accessorKey: 'fullName',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: ({ }: any) => {
        return (
          <Label>
            {headerColumn('email', 'Email', sort, handleSort, fieldSort)}
          </Label>
        )
      },
      accessorKey: 'email',
      meta: {
        headerClassName: ' font-bold',
        cellClassName: 'text-[14px] font-normal'
      }
    },
    {
      header: 'Department',
      accessorKey: 'department.name',
      cell: ({ getValue }: any) => {
        const department = getValue();
        if (department) return department
        return "Unknown"
      },
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
      header: ({ }: any) => {
        return (
          <Label>
            {headerColumn('status', 'Status', sort, handleSort, fieldSort)}
          </Label>
        )
      },
      cell: ({ getValue }: any) => {
        const status = getValue();
        return status === 'active' ? (
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
      accessorKey: 'status',
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
                <div className='flex flex-row gap-4 items-center  h-12 px-3 hover:bg-background cursor-pointer text-sm'>
                  {row.original.status == 'active' ? (
                    <div
                      className='flex gap-2 items-center'
                      onClick={() => handleChangeStatus(row?.original._id, 'inactive')}
                    >
                      <div className='bg-[#eb4048] rounded-full h-3 w-3'></div>
                      <span>InActive</span>
                    </div>
                  ) : (
                    <div className='flex gap-2 items-center' onClick={() => handleChangeStatus(row?.original._id, 'active')}>
                      <div className='bg-[#34c661] rounded-full h-3 w-3'></div>
                      <span>Active</span>
                    </div>
                  )}
                </div>

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

  const getEmployees = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: URL_PATHS.GET_EMPLOYEES,
        params: {
          limit: limit,
          page: page,
          search: search,
          department: departmentSelected?.value,
          position: positionSelected?.value,
          sort: fieldSort ? `${sort == 'DESC' ? '-' : ''}${fieldSort}` : null,
        }
      });
      setEmployees(response.data);
    } catch (error) {
      console.log('Error fetching employees', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDepartments = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: URL_PATHS.GET_DEPARTMENTS,
        params: {
          limit: 1000,
          page: 1
        }
      });
      const departmentOptions: OptionSelected[] = [
        defaultDepartment
      ];

      const departmentsFromApi = response.data.data.map((department: Department) => {
        return {
          value: department._id,
          label: department.name
        }
      })

      departmentOptions.push(...departmentsFromApi);

      setDepartmentOptions(departmentOptions);
    } catch (error) {
      console.log('Error fetching department', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getPositionsByDepartment = async (departmentId: string | null) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: `${URL_PATHS.GET_POSITIONS_BY_DEPARTMENT}/${departmentId}`
      });

      const positionOptions: OptionSelected[] = [defaultPosition];

      const positionOptionsFormApi = response.data.map((position: PositionByDepartment) => {
        return {
          value: position._id,
          label: position.title
        }
      })

      positionOptions.push(...positionOptionsFormApi);

      setPositionOptions(positionOptions);
    } catch (error) {
      console.log('Error fetching positions by department', error);
      toastifyUtils('error', error || ERROR_API_MESSAGE[3]);
    } finally {
      setIsLoading(false);
    }
  }


  const handleChangeStatus = async (id: string, status: string) => {
    try {
      await axiosInstance({
        method: 'PUT',
        url: `${URL_PATHS.CHANGE_STATUS_EMPLOYEE}/${id}`,
        data: {
          status: status
        }
      });

    } catch (error) {
      console.log('Error changing status', error);
      toastifyUtils('error', error || ERROR_API_MESSAGE[3]);
    } finally {
      getEmployees();
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    showLoading();
    setIsLoadingDelete(true);
    try {
      console.log('ID Client', id);
      await axiosInstance({
        method: 'DELETE',
        url: `${URL_PATHS.DELETE_EMPLOYEE}/${id}`,
      });

    } catch (error) {
      toastifyUtils('error', error || ERROR_API_MESSAGE[3]);
      console.log(error);
    } finally {
      setIsLoadingDelete(false);
      setOpenDeleteDialog(false);
      hideLoading();
      getEmployees();
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

  const handleSelectDepartment = async (selectedOption: OptionSelected | null) => {
    setDepartmentSelected(selectedOption);

    if (!selectedOption?.value) {
      setPositionOptions([]);
      setPositionSelected(null);
    }

    await getPositionsByDepartment(selectedOption?.value || '');
  }

  const handleSelectPosition = async (selectedOption: OptionSelected | null) => {
    setPositionSelected(selectedOption);
  }

  useEffect(() => {
    getEmployees();
    getDepartments();
  }, [limit, page, search, departmentSelected, positionSelected, sort, fieldSort]);

  const selectStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      height: '36px',
      minHeight: '36px',
      borderRadius: '0.375rem',
      borderColor: 'var(--border-input, #e5e7eb)',
      padding: '0',
      fontSize: '0.8125rem',
      backgroundColor: 'transparent',
      ':hover': {
        borderColor: 'var(--border-input-hover, #d1d5db)'
      },
      ':focus-within': {
        borderColor: 'var(--primary, #3b82f6)',
        boxShadow: '0 0 0 1px var(--primary, #3b82f6)'
      },
      paddingLeft: '2.25rem'
    }),
    option: (baseStyles: any, { isFocused, isSelected }: { isFocused: boolean, isSelected: boolean }) => ({
      ...baseStyles,
      backgroundColor: isSelected
        ? 'hsl(var(--primary))' // Sử dụng giá trị mã hex thay vì biến CSS
        : isFocused
          ? 'rgba(59, 130, 246, 0.1)'
          : 'transparent',
      color: isSelected ? 'white' : 'inherit',
      cursor: 'pointer',
      padding: '6px 12px',
      fontSize: '0.8125rem',
      ':hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        color: 'inherit'
      }
    }),
    menu: (baseStyles: any) => ({
      ...baseStyles,
      zIndex: 50
    }),
    valueContainer: (baseStyles: any) => ({
      ...baseStyles,
      padding: '0 8px'
    }),
    placeholder: (baseStyles: any) => ({
      ...baseStyles,
      fontSize: '0.8125rem',
      color: 'var(--text-muted, #6b7280)'
    }),
    singleValue: (baseStyles: any) => ({
      ...baseStyles,
      fontSize: '0.8125rem' 
    }),
    indicatorsContainer: (baseStyles: any) => ({
      ...baseStyles,
      height: '36px'
    }),
    dropdownIndicator: (baseStyles: any) => ({
      ...baseStyles,
      padding: '6px'
    }),
    clearIndicator: (baseStyles: any) => ({
      ...baseStyles,
      padding: '6px'
    })
  };

  return (
    <div className='flex flex-col gap-5'>

      <AddEditEmployee open={open} setOpen={setOpen} getEmployeeList={getEmployees} type={type} id={activeData} setId={setActiveData} setType={setType} />
      
      <ImportExportDialog 
        open={openImportExportDialog}
        onOpenChange={setOpenImportExportDialog}
      />

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

        <div
          className="mr-4"
          onClick={() => setOpenImportExportDialog(true)}
        >
          {/* DatabaseBackupIcon */}
          <Icons.Chart className="mr-2 h-4 w-4" />
          Import/Export
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <ReactSelect
              options={departmentOptions}
              styles={selectStyles}
              onChange={handleSelectDepartment}
              value={departmentSelected}
              className="w-48"
              placeholder="Department"
              classNamePrefix="react-select"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Icons.Filter className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="relative">
            <ReactSelect
              options={positionOptions}
              styles={selectStyles}
              onChange={handleSelectPosition}
              value={departmentSelected?.value ? positionSelected : doNotChoosePosition}
              className="w-48"
              placeholder="Department"
              classNamePrefix="react-select"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Icons.Filter className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <CustomTable onRowClick={employee => {
        setOpen(true);
        setType(ACTION.VIEW);
        setActiveData(employee._id)
      }} columns={columns} data={employees?.data || []} isLoading={isLoading} />

      {employees?.pagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {((employees.pagination.page - 1) * employees.pagination.limit) + 1} to {Math.min(employees.pagination.page * employees.pagination.limit, employees.pagination.total)} out of {employees.pagination.total} employees
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
              Page {employees.pagination.page} / {employees.pagination.totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${employees.pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(1)}
                disabled={employees.pagination.page <= 1}
              >
                <span className="sr-only">First page</span>
                <Icons.PageFirst className="h-4 w-4" />
              </button>
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${!employees.pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(employees.pagination.page - 1)}
                disabled={!employees.pagination.hasPrevPage}
              >
                <span className="sr-only">Previous</span>
                <Icons.PagePrevious className="h-4 w-4" />
              </button>
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${!employees.pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(employees.pagination.page + 1)}
                disabled={!employees.pagination.hasNextPage}
              >
                <span className="sr-only">Next</span>
                <Icons.PageNext className="h-4 w-4" />
              </button>
              <button
                className={`h-8 w-8 rounded-md border border-input p-0 flex items-center justify-center ${employees.pagination.page >= employees.pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                onClick={() => handlePageChange(employees.pagination.totalPages)}
                disabled={employees.pagination.page >= employees.pagination.totalPages}
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
          handleDelete={handleDeleteEmployee}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          isLoadingDelete={isLoadingDelete}
        />
      )}
    </div>
  );
}
