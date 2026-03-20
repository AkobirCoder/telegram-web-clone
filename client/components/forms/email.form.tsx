import { oldEmailSchema, otpSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMutation } from '@tanstack/react-query';
import { generateToken } from '@/lib/generate-token';
import { signOut, useSession } from 'next-auth/react';
import { axiosClient } from '@/http/axios';
import { toast } from 'sonner';
import { IError } from '@/types';

const EmailForm = () => {
    const [verify, setVerify] = useState(false);

    const {data: session} = useSession();

    const emailForm = useForm<z.infer<typeof oldEmailSchema>>({
        resolver: zodResolver(oldEmailSchema),
        defaultValues: {
            email: '',
            oldEmail: session?.currentUser?.email,
        },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            email: '',
            otp: '',
        },
    });

    const otpMutation = useMutation({
        mutationFn: async (email: string) => {
            const token = await generateToken(session?.currentUser?._id);

            const {data} = await axiosClient.post<{email: string}>('/api/user/send-otp', {email}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data;
        },

        onSuccess: ({email}) => {
            toast.success('OTP sent to your email');

            otpForm.setValue('email', email);

            setVerify(true);
        },

        onError: (error: IError) => {
            if (error?.response?.data?.message) {
                return toast.error(error.response.data.message);
            } else {
                return toast.error('Something went wrong');
            }
        }
    });

    function onEmailSubmit(values: z.infer<typeof oldEmailSchema>) {
        // API call to email submit

        // otpForm.setValue('email', values.email);
        
        // setVerify(true);

        // console.log(values);

        otpMutation.mutate(values.email);
    }

    const verifyMutation = useMutation({
        mutationFn: async (otp: string) => {
            const token = await generateToken(session?.currentUser?._id);

            const {data} = await axiosClient.put('/api/user/email', 
                {
                    email: otpForm.getValues('email'), 
                    otp
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            return data;
        },

        onSuccess: () => {
            toast.success('Email updated successfully');
            
            signOut();
        },

        onError: (error: IError) => {
            if (error?.response?.data?.message) {
                return toast.error(error.response.data.message);
            } else {
                return toast.error('Something went wrong');
            }
        }
    });

    function onVerifySubmit(values: z.infer<typeof otpSchema>) {
        // API call to verify email

        // console.log(values);

        verifyMutation.mutate(values.otp);
    }

    return !verify ? (
        <>
            <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className='space-y-2'>
                    <FormField
                        control={emailForm.control}
                        name='oldEmail'
                        render={({ field }) => (
                            <FormItem>
                                <Label>Current email</Label>
                                <FormControl>
                                    <Input 
                                        placeholder='example@gmail.com' 
                                        className='h-10 bg-secondary' 
                                        {...field} 
                                        disabled 
                                    />
                                </FormControl>
                                <FormMessage className='text-xs text-red-500' />
                            </FormItem>
                        )}
                    />   
                    <FormField
                        control={emailForm.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <Label>Enter a new email</Label>
                                <FormControl>
                                    <Input 
                                        placeholder='example@gmail.com' 
                                        className='h-10 bg-secondary' 
                                        {...field} 
                                        disabled={otpMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage className='text-xs text-red-500' />
                            </FormItem>
                        )}
                    /> 
                    <Button 
                        type='submit' 
                        className='w-full' 
                        disabled={otpMutation.isPending}
                    >
                        Verify email
                    </Button>
                </form>
            </Form>
        </>
    ) : (
        <>
            <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onVerifySubmit)} className='w-full space-y-2'>
                    <Label>New email</Label>
                    <Input 
                        placeholder='example@gmail.com' 
                        className='h-10 bg-secondary' 
                        value={emailForm.getValues('email')} 
                        disabled 
                    />
                    <FormField 
                        control={otpForm.control}
                        name='otp'
                        render={({field}) => (
                            <FormItem>
                                <Label>One-Time Password</Label>
                                <FormControl>
                                    <InputOTP 
                                        maxLength={6} 
                                        className='w-full' 
                                        pattern={REGEXP_ONLY_DIGITS} 
                                        {...field}
                                        disabled={verifyMutation.isPending}
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
                        disabled={verifyMutation.isPending}
                    >
                        Submit
                    </Button> 
                </form>
            </Form>
        </>
    );  
}

export default EmailForm;