import React, { useCallback } from 'react';
import Sidebar from './SideBar';
import Header from './Header';
import { Logo } from '@/assets/images';
import { Link, useLocation } from 'react-router-dom';
import { ROUTERS_PATHS } from '@/constants/router-paths';
import { useTranslation } from 'react-i18next';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout(props: MainLayoutProps) {
  const { children } = props;
  const { pathname } = useLocation();
  const prefixPath = pathname?.split('/')?.[1];
  const { t } = useTranslation();

  const renderTittle = useCallback(() => {
    switch ('/' + prefixPath) {
      case ROUTERS_PATHS.ROLES:
        return 'Role';
      case ROUTERS_PATHS.PROFILE:
        return 'Profile';
      case ROUTERS_PATHS.EMPLOYEE_MANAGEMENT:
        return 'Employee Management';
      case ROUTERS_PATHS.DEPARTMENT_MANAGEMENT:
        return 'Department Management';
      default:
        return t('content.clientList');
    }
  }, [prefixPath]);
  return (
    <div className='flex h-screen bg-background max-w-[1920px] mx-auto '>
      <div className='w-1/6 p-4'>
        <Link to={ROUTERS_PATHS.EMPLOYEE_MANAGEMENT}>
          <img src={Logo} alt='Logo' />
        </Link>
        <Sidebar />
      </div>
      <div className='w-5/6 m-4 ml-0 rounded-3xl bg-white relative overflow-y-auto un-scroll'>
        <Header title={renderTittle()} />
        <section className='max-w-[100%] h-auto bg-white pb-4 mb-2 mt-24 px-6'>{children}</section>
      </div>
    </div>
  );
}
