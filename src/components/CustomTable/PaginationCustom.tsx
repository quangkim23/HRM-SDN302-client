import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Input } from '../ui/input';
import { REGEX_NON_NUMBER } from '@/constants/regexExp';
import isString from 'lodash/isString';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PaginationCustomProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onChangePage: (pageIndex: number) => void;
  sizePage: number;
  setSizePage: Dispatch<SetStateAction<number>>;
}

const PaginationCustom = (props: PaginationCustomProps) => {
  const { pageIndex, pageSize, totalCount, onChangePage, setSizePage } = props;
  const [goToPage, setGoToPage] = React.useState<string>();
  const isFirstPage = pageIndex === 1;
  const lastPageIndex = Math.ceil(totalCount / pageSize);
  const isLastPage = pageIndex === lastPageIndex;
  const { t } = useTranslation();

  const pagesArray = React.useMemo(() => {
    const pages = new Set<number>();
    // Always include the first page
    pages.add(1);
    // Include the surrounding pages of the current page
    if (pageIndex > 2) pages.add(pageIndex - 1);
    pages.add(pageIndex);
    if (pageIndex < lastPageIndex - 1) pages.add(pageIndex + 1);
    // Always include the last page
    pages.add(lastPageIndex);

    return Array.from(pages).sort((a, b) => a - b);
  }, [pageIndex, lastPageIndex]);

  const handleClickPage = (pageIndex: number) => {
    onChangePage && onChangePage(pageIndex);
    setGoToPage('');
  };

  const handleNextPage = () => {
    onChangePage(pageIndex + 1);
    setGoToPage('');
  };

  const handlePreviousPage = () => {
    onChangePage(pageIndex - 1);
    setGoToPage('');
  };

  const valueDisplay = React.useCallback(
    (currentValue: string | undefined) => {
      if (isString(currentValue) && currentValue.trim() && Number(currentValue) <= lastPageIndex)
        return String(+currentValue);
      return '';
    },
    [lastPageIndex]
  );
  const handleChangeToPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event?.target;
    let currentValue = inputElement?.value?.replace(REGEX_NON_NUMBER, '');
    if (inputElement?.value && !currentValue) {
      return;
    }

    setGoToPage(String(currentValue));
    debouncedChangePage(Number(currentValue));
  };

  const debouncedChangePage = React.useCallback(
    debounce((newPageIndex: number) => {
      if (newPageIndex >= 1 && newPageIndex !== pageIndex && newPageIndex <= lastPageIndex) {
        onChangePage(newPageIndex);
        setGoToPage('');
      }
    }, 500),
    [lastPageIndex, pageIndex]
  );

  if (totalCount === 0) return null;
  return (
    <div className='flex items-center justify-between mt-5'>
      <div className='flex-1 text-sm'>
        {t('content.showing')} {(pageIndex - 1) * pageSize + 1} - {Math.min(pageIndex * pageSize, totalCount)}{' '}
        {t('content.of')}
        <span className='font-medium'> {totalCount}</span> {t('content.data')}
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm'>Rows per page</p>
          <Select
            defaultValue={pageSize.toString()}
            onValueChange={value => {
              setSizePage(Number(value));
            }}
          >
            <SelectTrigger className='w-[80px] h-[40px]'>
              <SelectValue placeholder='10' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center space-x-2'>
          <p className='text-sm'>{t('content.goToPage')}</p>
          <Input
            className='w-[52px] text-center'
            // value={valueDisplay(goToPage !== '' ? goToPage : pageIndex.toString())}
            value={valueDisplay(goToPage ?? pageIndex.toString())}
            onChange={handleChangeToPage}
          />
        </div>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' className='h-10 w-10 p-0' onClick={handlePreviousPage} disabled={isFirstPage}>
            <ChevronLeftIcon className='h-7 w-7' />
          </Button>
          <PaginationContent>
            {pagesArray.map((e, i) => (
              <React.Fragment key={e}>
                <PaginationItem
                  className='cursor-pointer'
                  onClick={() => {
                    if (e === pageIndex) return;
                    handleClickPage(e);
                  }}
                >
                  <PaginationLink isActive={e === pageIndex}>{e}</PaginationLink>
                </PaginationItem>
                {/* Add ellipsis between non-consecutive pages */}
                {pagesArray[i + 1] && pagesArray[i + 1] - e > 1 && (
                  <PaginationItem key={`ellipsis-${e}-${pagesArray[i + 1]}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </React.Fragment>
            ))}
          </PaginationContent>
          <Button variant='ghost' className='h-10 w-10 p-0' onClick={handleNextPage} disabled={isLastPage}>
            <ChevronRightIcon className='h-7 w-7' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationCustom;
