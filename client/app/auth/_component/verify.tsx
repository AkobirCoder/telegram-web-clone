import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { otpSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const Verify = () => {
    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            email: '',
            otp: '',
        },
    });

    function onSubmit(values: z.infer<typeof otpSchema>) {
        console.log(values);
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
                                    <Input placeholder='example@gmail.com' className='h-10 bg-secondary' {...field} />
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
                                    <InputOTP maxLength={6} className='w-full' pattern={REGEXP_ONLY_DIGITS} {...field}>
                                        <InputOTPGroup className='w-full'>
                                            <InputOTPSlot index={0} className='w-full h-10 dark:bg-primary-foreground bg-secondary' />
                                            <InputOTPSlot index={1} className='w-full h-10 dark:bg-primary-foreground bg-secondary' />
                                            <InputOTPSlot index={2} className='w-full h-10 dark:bg-primary-foreground bg-secondary' />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup className='w-full'>
                                            <InputOTPSlot index={3} className='w-full h-10 dark:bg-primary-foreground bg-secondary' />
                                            <InputOTPSlot index={4} className='w-full h-10 dark:bg-primary-foreground bg-secondary' />
                                            <InputOTPSlot index={5} className='w-full h-10 dark:bg-primary-foreground bg-secondary' />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage className='text-xs text-red-500 mt-1' />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full' size={'lg'}>Submit</Button> 
                </form>
            </Form>
        </div>
    );
}

export default Verify;