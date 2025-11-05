import React from 'react';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { DATE_FORMAT_TYPE } from '@/constants/common';
import { convertToDate } from '@/utils';
import { headerColumn } from './HeaderCustom';

export const ColumnCustom = (
  type: string,
  title: string,
  field: string,
  path: string,
  urlPath: string,
  handleSort: (field: string, sort: 'ASC' | 'DESC') => void,
  sort: 'ASC' | 'DESC',
  fieldSort?: string
) => {
  const baseColumn = {
    id: field,
    accessorKey: field,
    meta: {
      headerClassName: 'min-w-[13rem]',
      cellClassName: 'text-[14px] font-normal whitespace-pre-wrap'
    }
  };
  const commonHeader = ({ column }: any) => {
    return (
      <Label className='text-left p-0 flex font-bold items-center'>
        {headerColumn(field, title, sort, handleSort, fieldSort)}
      </Label>
    );
  };
  const commonCell = ({ row }: any) => {
    let formattedTime;
    if (row.getValue(field) && type === 'time') {
      const timeValue = typeof row.getValue(field) === 'string' ? (row.getValue(field) as string) : '00:00'; // Đảm bảo timeValue là chuỗi
      const [hour, minute] = timeValue.split(':');
      const hourNumber = parseInt(hour, 10);

      const period = hourNumber >= 12 ? 'PM' : 'AM';
      const hourIn12Format = hourNumber % 12 || 12;
      formattedTime = `${hourIn12Format}:${minute} ${period}`;
    } else {
      formattedTime = '';
    }
    return (
      <Link
        to={`${urlPath.replace(':id', row.getValue(path) + '')}`}
        className='text-brownColor text-[14px] font-normal hover:text-blue3Color cursor-pointer whitespace-pre-wrap'
      >
        {type === 'number' ? Number(row.getValue(field)) : type === 'time' ? formattedTime : row.getValue(field)}
      </Link>
    );
  };
  if (type === 'date' || type === 'number') {
    return {
      ...baseColumn,
      filterFn: type === 'date' ? 'FilterDate' : 'FilterNumber',
      header:
        type === 'date'
          ? ({ column }: any) => {
              return (
                <Label className='text-left p-0 flex font-bold items-center'>
                  {headerColumn(field, title, sort, handleSort, fieldSort)}
                </Label>
                // <Popover>
                //   <PopoverTrigger className='flex items-center '>
                //     <p className='hover:text-blue3Color'>{title}</p>

                //     {fieldSort === field && sort === 'ASC' ? (
                //       <button
                //         onClick={e => {
                //           e.stopPropagation();
                //           e.preventDefault();
                //           handleSort(field, 'DESC');
                //         }}
                //         className='hover:text-blue3Color'
                //       >
                //         <CaretUpIcon className='ml-2 h-4 w-4' />
                //       </button>
                //     ) : fieldSort === field && sort === 'DESC' ? (
                //       <button
                //         onClick={e => {
                //           e.stopPropagation();
                //           e.preventDefault();
                //           handleSort(field, 'ASC');
                //         }}
                //         className='hover:text-blue3Color'
                //       >
                //         <CaretDownIcon className='ml-2 h-4 w-4' />
                //       </button>
                //     ) : (
                //       <button
                //         onClick={e => {
                //           e.stopPropagation();
                //           e.preventDefault();
                //           handleSort(field, 'DESC');
                //         }}
                //         className='hover:text-blue3Color'
                //       >
                //         <CaretUpIcon className='ml-2 h-4 w-4' />
                //       </button>
                //     )}
                //   </PopoverTrigger>
                //   <PopoverContent className='h-auto pb-1 pt-0 px-0 w-[15rem] flex flex-col gap-2'>
                //     <div className=' relative w-[15rem]'>
                //       <DatePicker
                //         format='DD-MM-YYYY'
                //         onChange={date => {
                //           if (date) {
                //             column.setFilterValue(date.$d);
                //           }
                //         }}
                //         style={{
                //           width: '100%',
                //           borderRadius: '8px',
                //           fontSize: '16px',
                //           fontWeight: '500',
                //           padding: '12px',
                //           borderColor: '#687197'
                //         }}
                //       />
                //     </div>
                //   </PopoverContent>
                // </Popover>
              );
            }
          : commonHeader,
      cell:
        type === 'date'
          ? ({ row }: any) => {
              const createdAt = row.getValue(field);
              return (
                <Link
                  to={`${urlPath.replace(':id', row.getValue(path) + '')}`}
                  className='text-brownColor text-[14px] font-normal hover:text-blue3Color cursor-pointer'
                >
                  {convertToDate(createdAt, DATE_FORMAT_TYPE.dmy)}
                </Link>
              );
            }
          : commonCell
    };
  }
  if (type === 'boolean') {
    return {
      ...baseColumn,
      header: ({ column }: any) => {
        return (
          <Label className='text-left p-0 flex font-bold items-center'>
            {headerColumn(field, title, sort, handleSort, fieldSort)}
          </Label>
        );
      },
      cell: ({ row }: any) => {
        return (
          <Label
            className={`text-brownColor text-[14px] w-full h-full font-normal hover:cursor-pointer cursor:pointer rounded-[12px] 
                p-2 px-8
              ${row.getValue(field) ? 'bg-green2Color text-greenColor border-greenColor border' : 'bg-pinkColor text-redColor border-redColor border'}
              `}
          >
            {row.getValue(field) ? 'True' : 'False'}
          </Label>
        );
      }
    };
  }

  return {
    ...baseColumn,
    filterFn: 'FilterString',
    header: commonHeader,
    cell: commonCell
  };
};
