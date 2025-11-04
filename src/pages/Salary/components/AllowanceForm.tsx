import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/constants/svgIcon';

interface AllowanceFormProps {
  onSubmit: (allowance: any) => void;
}

const AllowanceForm: React.FC<AllowanceFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<string>('transportation');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    if (!type) {
      setError('Vui lòng chọn loại phụ cấp');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Số tiền phải lớn hơn 0');
      return;
    }
    
    onSubmit({
      type,
      amount: amountValue,
      description
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    setError('');
  };

  return (
    <form className="space-y-3">
      <div>
        <Label htmlFor="allowanceType">Loại phụ cấp</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="allowanceType">
            <SelectValue placeholder="Chọn loại phụ cấp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transportation">Phụ cấp đi lại</SelectItem>
            <SelectItem value="housing">Phụ cấp nhà ở</SelectItem>
            <SelectItem value="meal">Phụ cấp ăn uống</SelectItem>
            <SelectItem value="phone">Phụ cấp điện thoại</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="allowanceAmount">Số tiền</Label>
        <Input
          id="allowanceAmount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (parseFloat(e.target.value) > 0) setError('');
          }}
          placeholder="Nhập số tiền..."
        />
      </div>
      
      <div>
        <Label htmlFor="allowanceDesc">Mô tả (tùy chọn)</Label>
        <Textarea
          id="allowanceDesc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Thêm mô tả cho khoản phụ cấp..."
          rows={2}
        />
      </div>
      
      {error && <div className="text-sm text-red-500">{error}</div>}
      
      <Button type="button" variant="outline" className="w-full" onClick={handleSubmit}>
        <Icons.PlusIcon className="mr-1 h-4 w-4" />
        Thêm phụ cấp
      </Button>
    </form>
  );
};

export default AllowanceForm;