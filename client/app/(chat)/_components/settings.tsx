import DangerZoneForm from '@/components/forms/danger-zone.form';
import EmailForm from '@/components/forms/email.form';
import InformationForm from '@/components/forms/information.form';
import NotificationForm from '@/components/forms/notification.form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { axiosClient } from '@/http/axios';
import { generateToken } from '@/lib/generate-token';
import { UploadButton, UploadDropzone } from '@/lib/uploadthing';
import { useMutation } from '@tanstack/react-query';
import { LogIn, Menu, Moon, Settings2, Sun, Upload, UserPlus, Volume2, VolumeOff } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface IPayload {
    muted?: boolean,
    avatar?: string,
}

const Settings = () => {
    const {data: session, update} = useSession();

    const {resolvedTheme, setTheme} = useTheme();

    const {mutate, isPending} = useMutation({
        mutationFn: async (payload: IPayload) => {
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
        }
    });

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const showProfileHandler = () => {
        setIsProfileOpen((prevState) => {
            return !prevState;
        });
    }

    // const switchModeHandler = (checked: boolean) => {
    //     setTheme(checked ? 'dark' : 'light');
    // }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className='border border-zinc-300 dark:border-0' 
                        size={'icon'} 
                        variant={'secondary'}
                    >
                        <Menu />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='p-0 mt-1 w-80 rounded-none'>
                    <h2 className='pt-4 pl-2 text-muted-foreground'>
                        Settings: <span className='text-black dark:text-white'>
                            {
                                session?.currentUser.email ? (
                                    session?.currentUser.email
                                ) : (
                                    'example@gmail.com'
                                )
                            }
                        </span>
                    </h2>

                    <Separator className='my-2' />

                    <div className='flex flex-col'>
                        <div  
                            className='flex items-center justify-between p-2 hover:bg-secondary cursor-pointer'
                            onClick={showProfileHandler}
                        >
                            <div className='flex items-center gap-1'>
                                <Settings2 size={16} />
                                <span className='text-sm'>Profile</span>
                            </div>
                        </div>

                        <div 
                            className='flex items-center justify-between p-2 hover:bg-secondary cursor-pointer'
                            onClick={() => window.location.reload()}
                        >
                            <div className='flex items-center gap-1'>
                                <UserPlus size={16} />
                                <span className='text-sm'>Create contact</span>
                            </div>
                        </div>

                        <div className='flex items-center justify-between p-2 hover:bg-secondary cursor-pointer'>
                            <div className='flex items-center gap-1'>
                                {
                                    !session?.currentUser?.muted ? (
                                        <>
                                            <VolumeOff size={16} />
                                            <span className='text-sm'>Mute</span>
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 size={16} />
                                            <span className='text-sm'>Unmute</span>
                                        </>
                                    )
                                }
                                
                            </div>
                            <Switch
                                checked={!session?.currentUser?.muted} 
                                onCheckedChange={() => mutate({muted: !session?.currentUser?.muted})} 
                                disabled={isPending}
                            />
                        </div>

                        <div className='flex items-center justify-between p-2 hover:bg-secondary cursor-pointer'>
                            <div className='flex items-center gap-1'>
                                {
                                    resolvedTheme === 'dark' 
                                        ? <Sun size={16} />
                                        : <Moon size={16} />
                                }
                                <span className='text-sm'>
                                    {
                                        resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'
                                    }
                                </span>
                            </div>
                            <Switch
                                checked={resolvedTheme === 'dark' ? true : false}
                                onCheckedChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                // checked={resolvedTheme === 'dark'}
                                // onCheckedChange={switchModeHandler}
                            />
                        </div>

                        <div 
                            className='flex items-center justify-between p-2 bg-red-500 cursor-pointer'
                            onClick={() => signOut()}
                        >
                            <div className='flex items-center gap-1'>
                                <LogIn size={16} />
                                <span className='text-sm'>Logout</span>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <SheetContent side='left' className='w-80! p-4 border-r border-r-zinc-300 dark:border-r-zinc-700 overflow-y-scroll sidebar-custom-scrollbar'>
                    <SheetHeader className='p-0'>
                        <SheetTitle className='text-2xl'>My profile</SheetTitle>
                        <SheetDescription>Customize profile</SheetDescription>
                    </SheetHeader>

                    <Separator className='my-2' />
                    
                    <div className='mx-auto w-1/2 h-36 relative'>
                        <Avatar className='w-full h-36'>
                            <AvatarImage 
                                className='object-cover'
                                src={session?.currentUser?.avatar} 
                                alt={session?.currentUser?.email} 
                            />
                            <AvatarFallback className='text-center'>
                                Please upload your photo
                            </AvatarFallback>
                        </Avatar>
                        <UploadButton
                            className='absolute right-0 bottom-0 rounded-full bg-primary'
                            appearance={{
                                allowedContent: {display: 'none'},
                                button: {width: 40, height: 40}
                            }}
                            content={{button: <Upload size={16} />}}
                            endpoint={'imageUploader'}
                            onClientUploadComplete={(res) => {
                                // console.log(res);
                                mutate({avatar: res[0].ufsUrl});
                            }}
                            config={{
                                appendOnPaste: true,
                                mode: 'auto',
                            }}
                        />
                    </div>

                    <Accordion type="single" collapsible defaultValue="item-1" className='mt-4'>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className='bg-secondary rounded-none px-3'>
                                Basic information
                            </AccordionTrigger>
                            <AccordionContent className='px-3 mt-2'>
                                {/*  --- Information form --- */}
                                <InformationForm />
                                {/*  --- Information form --- */}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className='mt-2'>
                            <AccordionTrigger className='bg-secondary rounded-none px-3'>
                                Email
                            </AccordionTrigger>
                            <AccordionContent className='px-3 mt-2'>
                                {/*  --- Email form --- */}
                                <EmailForm />
                                {/*  --- Email form --- */}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className='mt-2'>
                            <AccordionTrigger className='bg-secondary rounded-none px-3'>
                                Notification
                            </AccordionTrigger>
                            <AccordionContent className='px-3 mt-2'>
                                {/*  --- Notification form --- */}
                                <NotificationForm />
                                {/*  --- Notification form --- */}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className='mt-2'>
                            <AccordionTrigger className='bg-secondary rounded-none px-3'>
                                Danger zone
                            </AccordionTrigger>
                            <AccordionContent className='px-3 mt-2'>
                                {/*  --- Danger zone form --- */}
                                <DangerZoneForm />
                                {/*  --- Danger zone form --- */}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </SheetContent>
            </Sheet>
        </>
    );
}

export default Settings;