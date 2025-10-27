const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL_PATHS = {
  SIG_IN: '/v1/api/authentication/login',
  REFRESH_TOKEN: 'api/Auth/RefreshToken',
  LOG_OUT: 'api/Auth/Logout',
  //Upload file

  UPLOAD_FILE: 'api/File/UploadFiles',
  STATIC_CONTENT: BASE_URL + 'api/static-contents/',

  //User
  GET_CURRENT_USER: '/v1/api/user/getCurrentUser',
  GET_USERS: 'api/User/GetUsers',
  GET_USER_BY_ID: 'api/User/GetUser',
  CREATE_USER: 'api/User/CreateUser',
  UPDATE_USER: 'api/User/UpdateUser',

  //Employee
  GET_EMPLOYEES: '/v1/api/employee/getEmployees',
  GET_EMPLOYEES_BY_DEPARTMENT: '/v1/api/employee/getEmployeesByDepartment',
  GET_EMPLOYEE: '/v1/api/employee/getEmployee',
  UPDATE_EMPLOYEE: '/v1/api/employee/updateEmployee',
  CHANGE_STATUS_EMPLOYEE: '/v1/api/employee/changeStatus',
  DELETE_EMPLOYEE: '/v1/api/employee/deleteEmployee',
  ADD_EMPLOYEE: '/v1/api/employee/createEmployee',
  GET_EMPLOYEE_ADD_DEPARTMENT: '/v1/api/employee/getEmployeeAddDepartment',
  
  
  //Department
  GET_DEPARTMENTS: '/v1/api/department/getDepartments',
  GET_DEPARTMENT: '/v1/api/department/getDepartment',
  DELETE_DEPARTMENT: '/v1/api/department/deleteDepartment',
  ADD_DEPARTMENT: '/v1/api/department/createDepartment',
  UPDATE_DEPARTMENT: '/v1/api/department/updateDepartment',
  ADD_OR_REMOVE_EMPLOYEE_TO_DEPARTMENT: '/v1/api/department/addOrRemoveEmployeeToDepartment',
  

  //Position
  GET_POSITIONS_BY_DEPARTMENT: '/v1/api/position/getPositionsByDepartment',

  //User Role
  GET_USER_ROLES: 'api/UserRole/GetUserRoles',
  CHANGE_STATUS_USER: 'api/User/ChangeStatusUser',

  //Role
  GET_ROLES: '/v1/api/role/GetRoles',
  GET_ROLE_BY_ID: 'api/Role/GetRole',
  CREATE_ROLE: 'api/Role/CreateRole',
  UPDATE_ROLE: 'api/Role/UpdateRole',
  DELETE_ROLE: 'api/Role/DeleteRole',

  // Screen
  GET_SCREEN_ACTION: 'api/ScreenAction/GetScreenAction',
  UPDATE_SCREEN_ACTION: 'api/ScreenAction/UpdateScreenAction',
  CREATE_SCREEN_ACTION: 'api/ScreenAction/CreateScreenAction',
  DELETE_SCREEN_ACTION: 'api/ScreenAction/DeleteScreenAction',
};

export default URL_PATHS;
