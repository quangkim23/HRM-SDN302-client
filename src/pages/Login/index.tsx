import { LoginBg } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ERROR_MESSAGE } from '@/constants/error-message';
import { Icons } from '@/constants/svgIcon';
import useAuth from '@/hooks/useAuth';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import useStoreLoading from '@/store/loadingStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Login() {
  const { signIn } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isShowPass, setIsShowPass] = React.useState<boolean>(false);
  const { showLoading, hideLoading } = useStoreLoading();

  const formSchema = z.object({
    email: z.string().min(1, {
      message: ERROR_MESSAGE.fieldRequired
    }),
    // .email({
    //   message: ERROR_MESSAGE.regExpEmail
    // })
    password: z.string().min(1, {
      message: ERROR_MESSAGE.fieldRequired
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    showLoading();
    try {
      const res = await axiosInstance({
        method: 'POST',
        url: URL_PATHS.SIG_IN,
        data: {
          email: values?.email,
          password: values?.password
        }
      });

      if (res) {
        const submitData = {
          token: res?.data?.accessToken,
          refreshToken: res?.data?.refreshToken
        };
        signIn(submitData);
      }
    } catch (error: any) {
      setErrorMessage(error?.errorMessage);
    } finally {
      hideLoading();
    }
  }

  const toggleShowPass = () => {
    setIsShowPass(!isShowPass);
  };

  return (
    <div className='grid grid-cols-2 bg-white'>
      <div className='col-span-1 relative '>
        <img src={LoginBg} alt='LoginBg' className='object-cover w-full h-screen' />
        <p className='absolute 2xl:top-[16%] top-[24%] left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl 2xl:text-6xl text-white text-center'>
          EXPLORE OUR
          <br />
          SOURCE CODE
        </p>
      </div>
      <div className='col-span-1 flex flex-col space-y-[56px] items-center self-center px-[10%] lg:px-[18%]'>
        <Label className='text-[32px] text-primary font-extrabold'>Login</Label>
        {errorMessage && (
          <div className='border border-redColor rounded-lg w-full py-[10px] px-4'>
            <p className='text-base text-redColor'>{errorMessage}</p>
          </div>
        )}
        <Form {...form}>
          <form className='space-y-6 w-full'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field} className='h-[52px] text-base rounded-lg' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='Password'
                        {...field}
                        className='h-[52px] pr-12 text-base rounded-lg'
                        type={isShowPass ? 'text' : 'password'}
                      />
                      <div
                        className='absolute top-1/2 transform -translate-y-1/2 right-3 hover:opacity-70 cursor-pointer'
                        onClick={toggleShowPass}
                      >
                        {isShowPass ? <Icons.EyeOpen /> : <Icons.EyeNone />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full h-12 space-x-2 ' onClick={form.handleSubmit(onSubmit)}>
              <Label className='text-base font-bold'>Login</Label>
              <Icons.RightArrow />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
