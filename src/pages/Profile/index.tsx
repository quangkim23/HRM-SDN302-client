import { useUserInfo } from '@/store/userInfoStore';

export default function index() {
  const { userInfo } = useUserInfo();
  return <div>

    <p>EmployeeCode: {userInfo?.employeeCode}</p>
    <p>Email: {userInfo?.email}</p>
    <p>FullName: {userInfo?.fullName}</p>
  </div>;
}
