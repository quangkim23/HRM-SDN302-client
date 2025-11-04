import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/constants/svgIcon';
import { format } from 'date-fns';

interface PreliminarySalaryBannerProps {
  month: number;
  year: number;
  calculationDate?: string;
}

const PreliminarySalaryBanner: React.FC<PreliminarySalaryBannerProps> = ({
  month,
  year,
  calculationDate
}) => {
  // Format ngày từ ISO string nếu có
  const formattedDate = calculationDate 
    ? format(new Date(calculationDate), 'dd/MM/yyyy HH:mm') 
    : format(new Date(), 'dd/MM/yyyy HH:mm');
  
  const monthName = new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(year, month - 1, 1));
  
  return (
    <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
      <Icons.AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Đây là bản lương tạm tính</AlertTitle>
      <AlertDescription className="text-yellow-700">
        Đây là bản tạm tính lương tháng {monthName} năm {year} tính đến ngày {formattedDate}. 
        Số liệu có thể thay đổi khi tính lương chính thức vào cuối tháng.
      </AlertDescription>
    </Alert>
  );
};

export default PreliminarySalaryBanner;