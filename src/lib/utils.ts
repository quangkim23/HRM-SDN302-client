import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// <Popover>
// <PopoverTrigger className='w-full h-[52px] text-sm rounded-lg  border border-input'>
//   <div className='flex w-full justify-center items-center gap-4'>
//     <FaFilter />
//     <p className='font-bold'>Filter</p>
//   </div>
// </PopoverTrigger>
// <PopoverContent className='w-[18rem] max-h-[30rem] overflow-y-auto flex flex-col gap-4 '>
//   <div className='flex flex-col gap-2'>
//     <p className='font-bold'>Sort By:</p>
//     <RadioGroup className='flex flex-wrap gap-2'>
//       <div className='flex items-center space-x-2'>
//         <RadioGroupItem value='selectionId' id='selectionId' />
//         <Label htmlFor='selectionId'>Selection Id</Label>
//       </div>
//       <div className='flex items-center space-x-2'>
//         <RadioGroupItem value='name' id='name' />
//         <Label htmlFor='name'>Name</Label>
//       </div>
//     </RadioGroup>

//     <p className='font-bold'>Arranged in order:</p>
//     <RadioGroup className='flex flex-wrap gap-2'>
//       <div className='flex items-center space-x-2'>
//         <RadioGroupItem value='aes' id='aes' />
//         <Label htmlFor='aes'>AES</Label>
//       </div>
//       <div className='flex items-center space-x-2'>
//         <RadioGroupItem value='des' id='des' />
//         <Label htmlFor='des'>DES</Label>
//       </div>
//     </RadioGroup>
//   </div>
// </PopoverContent>
// </Popover>
