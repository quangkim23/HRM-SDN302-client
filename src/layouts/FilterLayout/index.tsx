import React, { Dispatch, SetStateAction, useState } from 'react';
import { Icons } from '@/constants/svgIcon';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import InputCustom from '@/components/InputCustom/InputCustom';

export interface IFilterProps {
  id: any;
  value: string;
}
interface FilterLayoutProps {
  titleCreate?: string;
  typeStatus: number | undefined;
  setTypeStatus: Dispatch<SetStateAction<number | undefined>>;
  onCreate?: () => void;
  // search: string;
  onChangeSearch: Dispatch<SetStateAction<string>>;
  // listFilter?: Array<IFilterProps>;
  // valueSelect?: string;
  // onSelectFilter?: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  getMenu?: (pageIndex: number) => Promise<void>;
  hiddenStatus?: boolean;
  placeHoderSearch: string;
  filerByType?: boolean;
  setType?: Dispatch<SetStateAction<number | undefined>>;
}

const FilterLayout = (props: FilterLayoutProps) => {
  const { titleCreate, setTypeStatus, setType, onChangeSearch, onCreate, hiddenStatus, placeHoderSearch, filerByType } =
    props;
  const { t } = useTranslation();
  const STATUS_CASE = [
    {
      value: 0,
      title: 'All'
    },
    {
      value: 1,
      title: 'Active',
      color: 'bg-greenColor'
    },
    {
      value: 2,
      title: 'InActive',
      color: 'bg-yellowColor'
    }
  ];
  const TYPE_CASE = [
    {
      value: 0,
      title: 'All'
    },
    {
      value: 1,
      title: 'Team Group',
      color: 'bg-blue-600'
    },
    {
      value: 2,
      title: 'Team Activity',
      color: 'bg-green-600'
    }
  ];
  const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let currentValue = e.target.value;
    onChangeSearch(currentValue);
  };
  return (
    <div className='w-full flex flex-row pb-2 pt-1'>
      <div className='basis-2/5'>
        <Button type='submit' className='pl-2 h-[45px] space-x-2 rounded-[6px] ' onClick={onCreate && onCreate}>
          <Icons.PlusIcon className='fill-white' />
          <p className='text-sm font-bold'>{titleCreate}</p>
        </Button>
      </div>
      <div className='flex basis-3/5 justify-end gap-2'>
        {!hiddenStatus && (
          <Select
            onValueChange={value => {
              const selectedStatus = STATUS_CASE.find(item => item.title === value);
              setTypeStatus(selectedStatus?.value);
            }}
          >
            <SelectTrigger className='w-[250px] h-[45px] px-[14px] py-[10px]'>
              <SelectValue placeholder={`-- ${t('content.selectionMenuStatus')} --`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {STATUS_CASE.map((item, index) => {
                  return (
                    <SelectItem
                      key={index}
                      value={item.title}
                      className={`py-4 px-4 mt-2 text-[18px] text-sm font-medium rounded-[4px] ${item.color} hover:${item.color} focus:${item.color}`}
                    >
                      {item.title}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        {filerByType && (
          <Select
            onValueChange={value => {
              const selectedType = TYPE_CASE.find(item => item.title === value);
              setType && setType(selectedType?.value);
            }}
          >
            <SelectTrigger className='w-[250px] h-[45px] px-[14px] py-[10px]'>
              <SelectValue placeholder={`-- ${t('content.selectionMenuStatus')} --`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TYPE_CASE.map((item, index) => {
                  return (
                    <SelectItem
                      key={index}
                      value={item.title}
                      className={`py-4 px-4 mt-2 text-[18px] text-sm font-medium rounded-[4px] ${item.color} hover:${item.color} focus:${item.color}`}
                    >
                      {item.title}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <div className='relative w-1/3 flex items-center'>
          <InputCustom placeHoderSearch={placeHoderSearch} onChangeSearchValue={onChangeSearchValue} />
        </div>
      </div>
    </div>
  );
};
export default FilterLayout;
