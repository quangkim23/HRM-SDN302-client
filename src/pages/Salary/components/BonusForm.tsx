import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/constants/svgIcon';

interface BonusFormProps {
  onSubmit: (bonus: any) => void;
}

const BonusForm: React.FC<BonusFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<string>('performance');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    
    if (!type) {
      setError('Vui lòng chọn loại thưởng');
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
        <Label htmlFor="bonusType">Loại thưởng</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="bonusType">
            <SelectValue placeholder="Chọn loại thưởng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="performance">Thưởng hiệu suất</SelectItem>
            <SelectItem value="holiday">Thưởng ngày lễ</SelectItem>
            <SelectItem value="project">Thưởng dự án</SelectItem>
            <SelectItem value="other">Thưởng khác</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="bonusAmount">Số tiền</Label>
        <Input
          id="bonusAmount"
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
        <Label htmlFor="bonusDesc">Mô tả (tùy chọn)</Label>
        <Textarea
          id="bonusDesc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Thêm mô tả cho khoản thưởng..."
          rows={2}
        />
      </div>
      
      {error && <div className="text-sm text-red-500">{error}</div>}
      
      <Button type="button" onClick={handleSubmit} variant="outline" className="w-full">
        <Icons.PlusIcon className="mr-1 h-4 w-4" />
        Thêm thưởng
      </Button>
    </form>
  );
};

export default BonusForm;