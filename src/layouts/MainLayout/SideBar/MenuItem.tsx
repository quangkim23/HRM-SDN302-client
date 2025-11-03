import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface MenuItemProps {
  title: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  href: string;
  keyPath: string;
  activeMenu: boolean;
  onClickMenu: (key: string) => void;
}

const MenuItem = (props: MenuItemProps) => {
  const { title, icon, activeIcon, href, activeMenu, keyPath, onClickMenu } = props;
  return (
    <Link
      to={href}
      className={cn(
        'flex flex-row items-center gap-4 p-4 rounded-3xl ',
        activeMenu ? 'bg-primary' : 'hover:bg-primary/10'
      )}
      onClick={() => onClickMenu(keyPath)}
    >
      {activeMenu ? activeIcon : icon}
      <p className={cn('text-[#667097] font-normal', activeMenu && 'font-bold text-white')}>{title}</p>
    </Link>
  );
};

export default MenuItem;
