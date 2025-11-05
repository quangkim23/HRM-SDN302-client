import React, { Dispatch, SetStateAction, useState } from 'react';
import { FaSliders } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa6';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { field } from '../../constants/productType';
import { useTranslation } from 'react-i18next';
import InputCustom from '../InputCustom/InputCustom';
export interface IFilterProps {
  id: any;
  value: string;
}
interface FilterLayoutProps {
  titleCreate?: string;
  field: field[];
  setField: Dispatch<SetStateAction<field[]>>;
  handleActiveField: (field: string) => void;
  onCreate?: () => void;
  searchClientId: string;
  onChangeSearchClientId: Dispatch<SetStateAction<string>>;
  searchClientName: string;
  onChangeSearchClientName: Dispatch<SetStateAction<string>>;
  // listFilter?: Array<IFilterProps>;
  // valueSelect?: string;
  // onSelectFilter?: Dispatch<SetStateAction<string>>;
  // callbackGetData?: any;
}

const FilterClient = (props: FilterLayoutProps) => {
  const { titleCreate, field, onCreate, handleActiveField, onChangeSearchClientId, onChangeSearchClientName } = props;
  const { t } = useTranslation();
  const [searchKey, setSearchKey] = useState<string>('');
  const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>, type?: string) => {
    let currentValue = e.target.value;
    if (type === 'id') {
      onChangeSearchClientId && onChangeSearchClientId(currentValue);
    } else {
      onChangeSearchClientName && onChangeSearchClientName(currentValue);
    }
  };
  const onChangeSearchKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  return (
    <div className='w-full flex flex-row pb-2 pt-1'>
      <div className='basis-2/5'>
        {/*{titleCreate && (*/}
        {/*  <Button type='submit' className='pl-2 h-12 space-x-2 rounded-lg' onClick={onCreate && onCreate}>*/}
        {/*    <Icons.PlusIcon className='fill-white' />*/}
        {/*    <p className='text-sm font-bold'>{titleCreate}</p>*/}
        {/*  </Button>*/}
        {/*)}*/}
      </div>
      <div className='flex basis-3/5 justify-end gap-2'>
        <div className='relative w-[8rem]'>
          <Popover
            onOpenChange={() => {
              setSearchKey('');
            }}
          >
            <PopoverTrigger className='w-full h-[45px] text-sm rounded-[6px]  border border-input'>
              <div className='flex w-full justify-center items-center gap-4 '>
                <FaSliders />
                <p className='font-bold'>{t('content.view')}</p>
              </div>
            </PopoverTrigger>
            <PopoverContent align='start' className='w-[18rem]  h-auto pb-4 pt-0 px-0'>
              <div className=' relative'>
                <InputCustom
                  placeHoderSearch='Enter search keyword'
                  onChangeSearchValue={onChangeSearchKey}
                  additionalClass='border-0 shadow-none border-b border-b-slate-200 outline-none rounded-[0px] focus-visible:border-b-slate-200'
                />
              </div>

              <div className='w-full max-h-[30rem] overflow-y-auto un-scroll px-4'>
                {field
                  .filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase()))
                  .map((items, index) => (
                    <div key={index}>
                      <div
                        className={`p-2 hover:bg-green2Color rounded-[4px] cursor-pointer pl-8 mt-2 relative ${items.isActive ? 'bg-green2Color text-greenColor border border-greenColor' : 'border border-transparent'}`}
                        onClick={e => {
                          e.preventDefault();
                          handleActiveField(items.title);
                        }}
                      >
                        {items.isActive && <FaCheck className='absolute left-[6px] top-[12px]' />}
                        {items.title}
                      </div>
                    </div>
                  ))}

                {field.filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase())).length === 0 && (
                  <div className='text-center mt-4 text-gray-500'>No data</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className='relative w-1/3'>
          <InputCustom
            placeHoderSearch={t('content.enterSearchClientId')}
            onChangeSearchValue={onChangeSearchValue}
            type='id'
          />
        </div>
        <div className='relative w-1/3'>
          <InputCustom
            placeHoderSearch={t('content.enterSearchClientName')}
            onChangeSearchValue={onChangeSearchValue}
            type='name'
          />
        </div>
      </div>
    </div>
  );
};
export default FilterClient;
