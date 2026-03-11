import { profileSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const InformationForm = () => {
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            bio: '',
        }
    });

    const onSubmit = (values: z.infer<typeof profileSchema>) => {
        // API call to handle form submission

        console.log(values);
    }

    return (
        <>
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmit)} className='space-y-2'>
                    <FormField 
                        control={profileForm.control}
                        name='firstName'
                        render={({ field }) => (
                            <FormItem>
                                <Label>First name</Label>
                                <FormControl>
                                    <Input 
                                        className='bg-secondary'
                                        placeholder='Akobir'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-xs text-red-500' />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={profileForm.control}
                        name='lastName'
                        render={({ field }) => (
                            <FormItem>
                                <Label>Last name</Label>
                                <FormControl>
                                    <Input 
                                        className='bg-secondary'
                                        placeholder='Usmonov'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-xs text-red-500' />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={profileForm.control}
                        name='bio'
                        render={({ field }) => (
                            <FormItem>
                                <Label>Bio</Label>
                                <FormControl>
                                    <Textarea 
                                        className='bg-secondary'
                                        placeholder='Enter anything about yourself'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full'>
                        Submit
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default InformationForm;