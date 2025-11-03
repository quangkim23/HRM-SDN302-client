import { Label } from '@/components/ui/label';
import { ROUTERS_PATHS } from '@/constants/router-paths';
import { Icons } from '@/constants/svgIcon';
import React from 'react';
import MenuItem from './MenuItem';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import useAuth from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { RiUserSettingsLine } from 'react-icons/ri';
import { useUserInfo } from '@/store/userInfoStore';

interface MenuItem {
  key: string;
  title: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  href: string;
  permissions?: string[]; // Thêm trường permissions
}

export default function Sidebar() {
  const { t } = useTranslation();
  const { userInfo } = useUserInfo(); 

  // Đây là danh sách menu với các quyền tương ứng
  const listMenu = [
    {
      key: 'employee_management',
      title: 'Employee Management',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.EMPLOYEE_MANAGEMENT,
      permissions: ['permission.employee.create']
    },
    {
      key: 'department_management',
      title: 'Department Management',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.DEPARTMENT_MANAGEMENT,
      permissions: ['permission.department.create']
    },
    {
      key: 'attendance_management',
      title: 'Attendance Management',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.ATTENDANCE_MANAGEMENT,
    },
    // Giữ nguyên các menu khác và thêm permissions nếu cần
    {
      key: 'role',
      title: 'Role',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.ROLES,
    },
    {
      key: 'attendance',
      title: 'Attendance',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.ATTENDANCE,
      // Không cần permission vì mọi người đều cần xem attendance của mình
    },
    {
      key: 'overtime_request',
      title: 'Overtime Request',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.OVERTIME_REQUEST
    },
    {
      key: 'leave',
      title: 'Leave Request',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.LEAVE
    },
    {
      key: 'salary',
      title: 'Salary',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.SALARY
    },
    {
      key: 'notification',
      title: 'Notification',
      icon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='#667097' />
        </div>
      ),
      activeIcon: (
        <div className='h-6 w-6'>
          <RiUserSettingsLine size={24} color='white' />
        </div>
      ),
      href: ROUTERS_PATHS.NOTIFICATION
    }
  ];

  // Kiểm tra user có quyền truy cập menu không
  const hasPermission = (menu: MenuItem): boolean => {
    // Nếu menu không yêu cầu quyền, cho phép truy cập
    if (!menu.permissions || menu.permissions.length === 0) {
      return true;
    }

    // Kiểm tra xem user có quyền không
    if (!userInfo || !userInfo.permissions) {
      return false;
    }

    // Kiểm tra xem user có ít nhất một quyền trong danh sách quyền yêu cầu
    return menu.permissions.some(permission => 
      userInfo.permissions.includes(permission)
    );
  };

  // Lọc menu mà user có quyền xem
  const filteredMenu = listMenu.filter(menu => hasPermission(menu));

  const [selectedMenu, setSelectedMenu] = React.useState<string>('');
  const currentPath = window.location.pathname;
  const { signOut } = useAuth();

  const handleClickMenu = (key: string) => {
    setSelectedMenu(key);
  };

  // Cập nhật useEffect để dùng filteredMenu thay vì listMenu
  React.useEffect(() => {
    const mainMenu = [...filteredMenu].reverse()?.find(m => currentPath.includes(m.href));
    setSelectedMenu(mainMenu?.key || '');
  }, [currentPath, filteredMenu]);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className='w-full flex flex-col h-[calc(100%-170px)] justify-between mt-[90px] pr-4 overflow-y-auto'>
      <div>
        {filteredMenu.map((e: MenuItem) => {
          const activeMenu = selectedMenu === e?.key;

          return (
            <MenuItem
              key={`Link${e?.key}`}
              keyPath={e?.key}
              title={e?.title}
              icon={e?.icon}
              activeIcon={e?.activeIcon}
              href={e?.href}
              activeMenu={activeMenu}
              onClickMenu={handleClickMenu}
            />
          );
        })}
      </div>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className='flex items-center gap-4 cursor-pointer p-4'>
            <div className='h-6 w-6'>
              <Icons.LogoutIcon />
            </div>
            <Label className='text-[#667097] cursor-pointer'>{t('content.logout')}</Label>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
