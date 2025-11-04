import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import { Employee } from '../types';

interface EmployeeSelectorProps {
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee | null) => void;
  disabled?: boolean;
}

interface OptionType {
  value: string;
  label: string;
  employee: Employee;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  selectedEmployee,
  onSelect,
  disabled = false
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Set selected option when selectedEmployee prop changes
  useEffect(() => {
    if (selectedEmployee && employees.length > 0) {
      const option = options.find(opt => opt.employee._id === selectedEmployee._id) || null;
      setSelectedOption(option);
    } else {
      setSelectedOption(null);
    }
  }, [selectedEmployee, employees]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {

      const response = await axiosInstance({
        method: 'GET',
        url: URL_PATHS.GET_EMPLOYEES,
        params: { limit: 1000, page: 1 }
      });
      if (response.status === 200 && response.data.data) {
        const employeeList = response.data.data;
        setEmployees(employeeList);

        // Create options for react-select
        const employeeOptions = employeeList.map((emp: Employee) => ({
          value: emp._id,
          label: `${emp.fullName} (${emp.employeeCode})`,
          employee: emp
        }));

        setOptions(employeeOptions);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeChange = (option: OptionType | null) => {
    setSelectedOption(option);
    onSelect(option ? option.employee : null);
  };

  // Custom styles for react-select
  const customStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      borderColor: 'hsl(240, 5.9%, 90%)',
      boxShadow: 'none',
      fontSize: '0.875rem',
      '&:hover': {
        borderColor: 'hsl(240, 5.9%, 80%)'
      }
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      backgroundColor: state.isSelected
        ? 'hsl(221.2, 83.2%, 53.3%)'
        : state.isFocused
          ? 'hsl(210, 40%, 96.1%)'
          : undefined,
      color: state.isSelected ? 'white' : undefined,
      padding: '8px 12px',
      cursor: 'pointer',
      ':active': {
        backgroundColor: state.isSelected
          ? 'hsl(221.2, 83.2%, 53.3%)'
          : 'hsl(210, 40%, 96.1%)'
      }
    }),
    menu: (baseStyles: any) => ({
      ...baseStyles,
      zIndex: 50
    }),
    menuList: (baseStyles: any) => ({
      ...baseStyles,
      maxHeight: '200px'
    })
  };

  // Custom Option component with employee details
  const EmployeeOption = ({ innerProps, data, isFocused }: any) => {
    const emp = data.employee;
    return (
      <div
        className={`flex items-center p-2 ${isFocused ? 'bg-gray-50' : ''}`}
        {...innerProps}
      >
        {emp.image && (
          <img
            src={emp.image}
            alt={emp.fullName}
            className="h-8 w-8 rounded-full mr-3"
          />
        )}
        <div>
          <div className="font-medium">{emp.fullName}</div>
          <div className="text-sm text-gray-500">
            {emp.employeeCode} • {emp.position?.title || 'N/A'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleEmployeeChange as any}
      isLoading={isLoading}
      isClearable
      isDisabled={disabled}
      placeholder="Chọn nhân viên..."
      styles={customStyles}
      components={{
        Option: EmployeeOption
      }}
      noOptionsMessage={() => "Không tìm thấy nhân viên"}
      loadingMessage={() => "Đang tải danh sách nhân viên..."}
    />
  );
};

export default EmployeeSelector;