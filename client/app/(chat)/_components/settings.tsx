import DangerZoneForm from '@/components/forms/danger-zone.form';
import EmailForm from '@/components/forms/email.form';
import InformationForm from '@/components/forms/information.form';
import NotificationForm from '@/components/forms/notification.form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { LogIn, Menu, Moon, Settings2, Sun, Upload, UserPlus, VolumeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';

const Settings = () => {
    const {resolvedTheme, setTheme} = useTheme();

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const showProfileHandler = () => {
        setIsProfileOpen((prevState) => {
            return !prevState;
        })
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
                            example@gmail.com
                        </span>
                    </h2>

                    <Separator className='my-2' />

                    <div className='flex flex-col'>
                        <div onClick={showProfileHandler} className='flex items-center justify-between p-2 hover:bg-secondary cursor-pointer'>
                            <div className='flex items-center gap-1'>
                                <Settings2 size={16} />
                                <span className='text-sm'>Profile</span>
                            </div>
                        </div>

                        <div className='flex items-center justify-between p-2 hover:bg-secondary cursor-pointer'>
                            <div className='flex items-center gap-1'>
                                <UserPlus size={16} />
                                <span className='text-sm'>Create contact</span>
                            </div>
                        </div>

                        <div className='flex items-center justify-between p-2 hover:bg-secondary cursor-pointer'>
                            <div className='flex items-center gap-1'>
                                <VolumeOff size={16} />
                                <span className='text-sm'>Mute</span>
                            </div>
                            <Switch />
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

                        <div className='flex items-center justify-between p-2 bg-destructive cursor-pointer'>
                            <div className='flex items-center gap-1'>
                                <LogIn size={16} />
                                <span className='text-sm'>Logout</span>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <SheetContent side='left' className='w-80! p-4 border-r border-r-zinc-300 dark:border-r-zinc-700'>
                    <SheetHeader className='p-0'>
                        <SheetTitle className='text-2xl'>My profile</SheetTitle>
                        <SheetDescription>This action cannot be undone.</SheetDescription>
                    </SheetHeader>

                    <Separator className='my-2' />

                    <div className='mx-auto w-1/2 h-36 relative'>
                        <Avatar className='w-full h-36'>
                            <AvatarFallback className='text-6xl uppercase'>
                                AU
                            </AvatarFallback>
                        </Avatar>
                        <Button size={'icon'} className='absolute right-5 bottom-0 rounded-full'>
                            <Upload size={16} />
                        </Button>
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