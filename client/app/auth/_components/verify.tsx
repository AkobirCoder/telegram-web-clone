import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/use-auth';
import { axiosClient } from '@/http/axios';
import { otpSchema } from '@/lib/validation';
import { IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { signIn } from 'next-auth/react';

const Verify = () => {
    const {email} = useAuth();

    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            email: email, // sign-in da kiritilgan emailni qabul qilish
            otp: '',
        },
    });

    const {mutate, isPending} = useMutation({
        mutationFn: async (otp: string) => {
            const {data} = await axiosClient.post<{user: IUser}>('/api/auth/verify', {email, otp});

            return data;
        },

        onSuccess: ({user}) => {
            signIn('credentials', {email: user.email, callbackUrl: '/'});

            toast.success('Successfully verified');
        },
    });

    function onSubmit(values: z.infer<typeof otpSchema>) {
        // API call to verify OTP

        // console.log(values);

        // window.open('/', '_self'); // bosh sahifaga o'tkazish

        mutate(values.otp);
    }
    
    return (
        <div className='w-full'>
            <p
                className='text-center text-mauve-500 text-sm'
            >
                We have sent you an email with a verification code. Please enter the code below.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='example@gmail.com' disabled className='h-10 bg-secondary' {...field} />
                                </FormControl>
                                <FormMessage className='text-xs text-red-500 mt-1' />
                            </FormItem>
                        )}
                    />  
                    <FormField 
                        control={form.control}
                        name='otp'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP 
                                        maxLength={6} 
                                        className='w-full' 
                                        pattern={REGEXP_ONLY_DIGITS} 
                                        {...field} 
                                        disabled={isPending}
                                    >
                                        <InputOTPGroup className='w-full'>
                                            <InputOTPSlot index={0} className='w-full h-10 dark:bg-zinc-800 bg-secondary' />
                                            <InputOTPSlot index={1} className='w-full h-10 dark:bg-zinc-800 bg-secondary' />
                                            <InputOTPSlot index={2} className='w-full h-10 dark:bg-zinc-800 bg-secondary' />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup className='w-full'>
                                            <InputOTPSlot index={3} className='w-full h-10 dark:bg-zinc-800 bg-secondary' />
                                            <InputOTPSlot index={4} className='w-full h-10 dark:bg-zinc-800 bg-secondary' />
                                            <InputOTPSlot index={5} className='w-full h-10 dark:bg-zinc-800 bg-secondary' />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage className='text-xs text-red-500 mt-1' />
                            </FormItem>
                        )}
                    />
                    <Button 
                        type='submit' 
                        className='w-full' 
                        size={'lg'} 
                        disabled={isPending}
                    >
                        Submit
                    </Button> 
                </form>
            </Form>
        </div>
    );
}

export default Verify;