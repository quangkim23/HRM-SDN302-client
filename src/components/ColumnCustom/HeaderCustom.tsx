import { CaretDownIcon, CaretSortIcon, CaretUpIcon } from '@radix-ui/react-icons';

export const headerColumn = (
  field: string,
  title: string,
  sort: 'ASC' | 'DESC',
  handleSort: (field: string, sort: 'ASC' | 'DESC') => void,
  fieldSort?: string
) => {
  return (
    <>
      <button
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          handleSort(field, fieldSort === field && sort === 'DESC' ? 'ASC' : 'DESC');
        }}
        className='hover:text-blue3Color flex items-center cursor-pointer'
      >
        <p>{title}</p>
        {fieldSort === field ? (
          sort === 'DESC' ? (
            <CaretUpIcon className='ml-2 h-4 w-4' />
          ) : (
            <CaretDownIcon className='ml-2 h-4 w-4' />
          )
        ) : (
          <CaretDownIcon className='ml-2 h-4 w-4' />
        )}
      </button>
    </>
  );
};
