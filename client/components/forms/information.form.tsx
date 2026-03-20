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
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '@/http/axios';
import { IError } from '@/types';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { generateToken } from '@/lib/generate-token';

const InformationForm = () => {
    const {data: session, update} = useSession();

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: session?.currentUser?.firstName,
            lastName: session?.currentUser?.lastName,
            bio: session?.currentUser?.bio,
        }
    });

    const {mutate, isPending} = useMutation({
        mutationFn: async (payload: z.infer<typeof profileSchema>) => {
            const token = await generateToken(session?.currentUser?._id);

            const {data} = await axiosClient.put('/api/user/profile', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data;
        },

        onSuccess: () => {
            toast.success('Profile updated successfully');

            update();
        },

        onError: (error: IError) => {
            if (error?.response?.data?.message) {
                return toast.error(error.response.data.message);
            } else {
                return toast.error('Something went wrong');
            }
        }
    });

    const onSubmit = (data: z.infer<typeof profileSchema>) => {
        // API call to handle form submission

        // console.log(data);

        mutate(data);
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
                                        disabled={isPending}
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
                                        value={field.value || ""}
                                        disabled={isPending}
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
                                        value={field.value || ""}
                                        disabled={isPending}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full' disabled={isPending}>
                        Submit
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default InformationForm;