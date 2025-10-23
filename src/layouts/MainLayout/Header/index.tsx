import { Label } from '@/components/ui/label';
import { useUserInfo } from '@/store/userInfoStore';
import ELEMENT_ID from '@/constants/element-id';
import { Icons } from '@/constants/svgIcon';
import { useNavigate } from 'react-router';
import { ROUTERS_PATHS } from '@/constants/router-paths';

interface HeaderProps {
  title: string;
}

const Header = (props: HeaderProps) => {
  const { title } = props;
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  // const domNode = document.getElementById(ELEMENT_ID.BREADCRUMB_CONTAINER);
  return (
    <div className='pr-8 pt-4 fixed w-5/6  top-0  z-10 max-w-[1600px]'>
      <div className='bg-white rounded-t-[6px] py-2 px-6 pr-0'>
        <div className='flex justify-between items-center'>
          <Label className='text-[#000000] text-3xl font-semibold'>{title}</Label>
          <div className='flex gap-8 items-center cursor-pointer' onClick={() => navigate(ROUTERS_PATHS.PROFILE)}>
            <div className='rounded-full h-12 space-x-2 flex bg-primary items-center px-1 hover:opacity-70 '>
              {userInfo?.image ? (
                <img
                  src={`${userInfo?.image}`}
                  alt='pic'
                  className='object-cover object-center rounded-full h-10 w-10'
                />
              ) : (
                <Icons.AvatarIcon className='rounded-full h-10 w-10' />
              )}
              <div className='flex flex-col items-center pr-3'>
                <Label className='text-base font-bold text-white'>{userInfo?.fullName}</Label>
                <span className='text-xs text-white/80'>{userInfo?.employeeCode}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='pt-6' id={ELEMENT_ID.BREADCRUMB_CONTAINER} />
      </div>
    </div>
  );
};
export default Header;
