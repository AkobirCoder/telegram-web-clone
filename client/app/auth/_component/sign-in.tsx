import { emailSchema } from '@/lib/validation';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignIn = () => {
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: ''
        },
    });

    function onSubmit(values: z.infer<typeof emailSchema>) {
        console.log(values);
    }

    return (
        <div className='w-full'>
            <p
                className='text-center text-mauve-500 text-sm'
            >
                Telegram is a messaging app with a focus on speed and security. It is super-fast, simple and free.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
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
                    <Button type='submit' className='w-full' size={'lg'}>Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default SignIn;