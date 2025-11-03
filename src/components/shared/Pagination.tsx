import React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/constants/svgIcon';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}) => {
  // Nếu chỉ có 1 trang, không hiển thị pagination
  if (totalPages <= 1) return null;
  
  // Tạo mảng các số trang cần hiển thị
  const generatePaginationItems = () => {
    const items: (number | 'ellipsis')[] = [];
    
    // Luôn hiển thị trang đầu tiên
    items.push(1);
    
    // Tính toán trang đầu và trang cuối trong nhóm các trang hiển thị
    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);
    
    // Thêm dấu "..." nếu cần
    if (leftSibling > 2) {
      items.push('ellipsis');
    }
    
    // Thêm các trang ở giữa
    for (let i = leftSibling; i <= rightSibling; i++) {
      items.push(i);
    }
    
    // Thêm dấu "..." nếu cần
    if (rightSibling < totalPages - 1) {
      items.push('ellipsis');
    }
    
    // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };
  
  const items = generatePaginationItems();
  
  return (
    <div className="flex items-center justify-center space-x-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hidden sm:flex"
      >
        <Icons.ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Trang trước</span>
      </Button>
      
      {items.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="outline"
              size="sm"
              disabled
              className="cursor-default"
            >
              ...
            </Button>
          );
        }
        
        return (
          <Button
            key={`page-${item}`}
            variant={currentPage === item ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(item)}
            className={cn(
              "font-medium",
              currentPage === item ? "bg-primary text-primary-foreground" : ""
            )}
          >
            {item}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hidden sm:flex"
      >
        <Icons.ChevronRight className="h-4 w-4" />
        <span className="sr-only">Trang sau</span>
      </Button>
    </div>
  );
};

export default Pagination;