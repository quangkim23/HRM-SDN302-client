import React from 'react';
import { Label } from '../ui/label';
import { Cross1Icon } from '@radix-ui/react-icons';

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

type Props = {
  id: string;
  handleDelete: (id: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingDelete: boolean;
};

const ModalDelete = (props: Props) => {
  const { id, handleDelete, open, setOpen, isLoadingDelete } = props;
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(open => !open);
      }}
    >
      <DialogContent className='w-[30vw] !max-w-[100%] p-0 border-none m-0 flex flex-col  z-[60]'>
        <DialogHeader className='w-full  px-4 py-2 bg-blue3Color  flex flex-row items-center justify-between rounded-t-[6px] top-0 z-[50]'>
          <Label className='text-[18px] font-bold leading-[42px] text-white'>Comfirm</Label>
          <DialogClose className='hover:opacity-70 outline-none flex items-center justify-center'>
            <Cross1Icon className='h-4 w-4 mb-2' color='white' stroke='white' />
          </DialogClose>
        </DialogHeader>
        <DialogTitle className=' w-full'>
          <div className='flex flex-col mt-2 mb-2 w-full items-center text-center justify-center'>
            <Label className='font-light text-[16px] leading-[1.5rem]'>
              Are you sure you want to delete this item?
            </Label>
            <Label className='font-light text-[16px] leading-[1.5rem]'>This action cannot be undone.</Label>
          </div>
        </DialogTitle>

        <DialogFooter className='mb-4 mr-4'>
          <button
            onClick={() => {
              handleDelete(id);
            }}
            disabled={isLoadingDelete}
            className={` w-24 h-[45px] rounded-[4px] bg-white text-red-500 text-[14px] font-semibold border-red-500 border  hover:bg-red-200/25`}
          >
            Delete
          </button>
          <DialogClose className='w-24 h-[45px] rounded-[4px] bg-blue3Color hover:bg-primary/90 flex items-center justify-center text-white text-[14px] font-semibold leading-[140%]'>
            Cancel
          </DialogClose>{' '}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ModalDelete;
