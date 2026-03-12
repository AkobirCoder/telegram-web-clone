import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { confirmTextShema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

const DangerZoneForm = () => {
    const form = useForm<z.infer<typeof confirmTextShema>>({
        resolver: zodResolver(confirmTextShema),
        defaultValues: {
            confirmText: '',
        },
    });

    function onSubmit(values: z.infer<typeof confirmTextShema>) {
        // API call to confirm delete

        console.log(values);
    }

    return (
        <>
            <p className='text-xs text-muted-foreground text-center'>
                Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        className='mt-2 w-full font-bold'
                        variant={'destructive'}
                    >
                        Delete permenantly
                    </Button>
                </DialogTrigger>
                <DialogContent className='rounded-none'>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                            <FormField
                                control={form.control}
                                name='confirmText'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Please type <span className='font-bold'>DELETE</span> to confirm.
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className='h-10 bg-secondary'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='text-xs text-red-500' />
                                    </FormItem>
                                )}
                            />
                            <Button className='w-full font-bold'>Submit</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DangerZoneForm;