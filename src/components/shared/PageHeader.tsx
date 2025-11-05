import React, { ReactNode } from 'react';

interface PageHeaderProps {
  /**
   * Tiêu đề chính của trang
   */
  title: string;
  
  /**
   * Phụ đề hoặc mô tả của trang (tùy chọn)
   */
  subtitle?: string;
  
  /**
   * Các components hiển thị bên phải header (thường là các buttons)
   */
  actions?: ReactNode;
  
  /**
   * Các components hiển thị giữa tiêu đề và phụ đề (tùy chọn)
   */
  middleContent?: ReactNode;
  
  /**
   * CSS class bổ sung (tùy chọn)
   */
  className?: string;
}

/**
 * Component header chung cho các trang,
 * hiển thị tiêu đề, phụ đề và các action buttons
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  middleContent,
  className = '',
}) => {
  return (
    <div className={`pb-4 border-b ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
          {middleContent && <div className="mt-2">{middleContent}</div>}
          {subtitle && (
            <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
          )}
        </div>
        
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;