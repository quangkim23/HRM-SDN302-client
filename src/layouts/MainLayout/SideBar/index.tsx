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

interface MenuItem {
  key: string;
  title: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  href: string;
}

export default function Sidebar() {
  const { t } = useTranslation();

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
      href: ROUTERS_PATHS.EMPLOYEE_MANAGEMENT
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
      href: ROUTERS_PATHS.DEPARTMENT_MANAGEMENT
    },
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
      href: ROUTERS_PATHS.ROLES
    },
  ];
  // const [menu, setMenu] = React.useState<MenuItem[]>(listMenu);
  const [selectedMenu, setSelectedMenu] = React.useState<string>('');
  const currentPath = window.location.pathname;

  console.log(currentPath);
  const { signOut } = useAuth();

  const handleClickMenu = (key: string) => {
    setSelectedMenu(key);
  };

  React.useEffect(() => {
    const mainMenu = listMenu.reverse()?.find(m => currentPath.includes(m.href));
    setSelectedMenu(mainMenu?.key || '');
  }, [currentPath]);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className='w-full flex flex-col h-[calc(100%-170px)] justify-between mt-[90px] pr-4 overflow-y-auto'>
      <div>
        {listMenu.map((e: MenuItem) => {
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
