// import { IUserInfo } from '@/store/userInfoStore';

import { field } from './productType';

export interface OptionSelected {
  label: string;
  value: string | null;
}

export interface TClientsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  orderColumn: string;
  orderDirection: string;
  items: field[];
}
export interface OptionResult {
  result: string;
  id: string;
}

export interface Role {
  name: string;
  permissions: string[];
}
export interface RoleResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  orderColumn: string;
  orderDirection: string;
  items: Role[];
}

export interface UserResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  orderColumn: string;
  orderDirection: string;
  items: User[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface ScreenActionResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  orderColumn: string;
  orderDirection: string;
  items: ScreenAction[];
}

export interface ScreenAction {
  screen: string;
  actions: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EmployeeResponse {
  pagination: Pagination;
  data: Employee[];
}

export interface Employee {
  _id: string;
  fullName: string;
  employeeCode: string;
  email: string;
  image: string;
  status: string;
  department: any;
  position: any;
  roles: any[];
  createdAt: Date;
  updatedAt: Date;
}

export type Gender = 'male' | 'female' | 'other';

export interface EmployeeDetail {
  _id: string;
  fullName: string;
  employeeCode: string;
  dateOfBirth: Date;
  gender: Gender;
  address: Address;
  phoneNumber: string;
  email: string;
  image: string;
  status: string;
  department: {
    _id: string;
    name: string;
  };
  position: {
    _id: string;
    title: string;
  };
  startDate: Date;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  roles: {
    _id: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface DepartmentResponse {
  pagination: Pagination;
  data: Department[];
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  employeeCount: number;
  manager: {
    fullName: string,
    employeeCode: string
  }
}

export interface PositionByDepartment {
  _id?: string;
  title: string;
}
