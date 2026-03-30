import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { useCurrentContact } from '@/hooks/use-current';
import { useLoading } from '@/hooks/use-loading';
import { sliceText } from '@/lib/utils';
import { IMessage } from '@/types';
import { Settings2 } from 'lucide-react';
import Image from 'next/image';
import React, { FC } from 'react';

interface Props {
    messages: IMessage[],
}

const TopChat: FC<Props> = ({messages}) => {
    const {currentContact} = useCurrentContact();

    const {onlineUsers} = useAuth();

    const {typing} = useLoading();

    return (
        <div 
            className={`
                w-full flex items-center justify-between 
                sticky top-0 z-50 h-[8vh] 
                p-2 border-b border-b-zinc-300 dark:border-b-zinc-700 
                bg-background/50 backdrop-blur-sm
            `}
        >
            <div className='flex items-center'>
                <Avatar className='z-40'>
                    <AvatarImage 
                        src={currentContact?.avatar} 
                        alt={currentContact?.email} 
                        className='object-cover'
                    />
                    <AvatarFallback className='uppercase'>
                        {currentContact?.email[0]}
                    </AvatarFallback>
                </Avatar>
                <div className='ml-2'>
                    <h2 className='font-medium text-sm'>{currentContact?.email}</h2>
                    {/* --- Is typing... --- */}
                    {
                        currentContact?._id === typing?.sender?._id
                            ? typing.message.length > 0 && (
                                <div className='text-xs flex items-center gap-1 text-muted-foreground'>
                                    <p className='text-secondary-foreground animate-pulse line-clamp-1'>
                                        {sliceText(typing.message, 10)}
                                    </p>
                                    <div className='self-end mb-1'>
                                        <div className='flex justify-center items-center gap-1'>
                                            <div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animate-delay:-0.3s]'></div>
                                            <div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animate-delay:-0.10s]'></div>
                                            <div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animate-delay:-0.15s]'></div>
                                        </div>
                                    </div>
                                </div>
                            )
                            : typing.message && (
                                <p className='text-xs'>
                                    {
                                        onlineUsers.some((user) => user._id === currentContact?._id) ? (
                                            <>
                                                {/* --- Online --- */}
                                                <span className='text-green-500'>●</span> Online
                                                {/* --- Online --- */}
                                            </>
                                        ) : (
                                            <>
                                                {/* --- Offline --- */}
                                                <span className='text-muted-foreground'>●</span> Last seen recently
                                                {/* --- Offline --- */}
                                            </>
                                        )
                                    }
                                </p>
                            )
                    }
                    {
                        !typing.message && (
                            <p className='text-xs'>
                                {
                                    onlineUsers.some((user) => user._id === currentContact?._id) ? (
                                        <>
                                            {/* --- Online --- */}
                                            <span className='text-green-500'>●</span> Online
                                            {/* --- Online --- */}
                                        </>
                                    ) : (
                                        <>
                                            {/* --- Offline --- */}
                                            <span className='text-muted-foreground'>●</span> Last seen recently
                                            {/* --- Offline --- */}
                                        </>
                                    )
                                }
                            </p>
                        )
                    }
                    {/* --- Is typing... --- */}
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button 
                        className='border border-zinc-300 dark:border-0' 
                        size={'icon'} 
                        variant={'secondary'}
                    >
                        <Settings2 />
                    </Button>
                </SheetTrigger>
                <SheetContent 
                    className='w-80 p-4 border-l border-l-zinc-300 dark:border-l-zinc-700 overflow-y-scroll sidebar-custom-scrollbar' 
                >
                    <SheetHeader className='p-0'>
                        <SheetTitle>Contact info</SheetTitle>
                        <SheetDescription>
                            Information about the current contact
                        </SheetDescription>
                    </SheetHeader>
                    <div className='mx-auto h-36 relative'>
                        <Avatar className='w-full h-36'>
                            <AvatarImage 
                                src={currentContact?.avatar} 
                                alt={currentContact?.email} 
                                className='object-cover' 
                            />
                            <AvatarFallback
                                className='text-6xl uppercase'
                            >  
                                {currentContact?.email[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <Separator className='my-2' />

                    <h1 className='text-center text-xl'>
                        {currentContact?.email}
                    </h1>

                    <div className='flex flex-col space-y-1'>
                        {
                            currentContact?.firstName && (
                                <div className='flex items-center gap-1 mt-2'>
                                    <p>First name: </p>
                                    <p className='text-muted-foreground'>
                                        {currentContact.firstName}
                                    </p>
                                </div>
                            )
                        }
                        {
                            currentContact?.lastName && (
                                <div className='flex items-center gap-1 mt-2'>
                                    <p>Last name: </p>
                                    <p className='text-muted-foreground'>
                                        {currentContact.lastName}
                                    </p>
                                </div>
                            )
                        }
                        {
                            currentContact?.bio && (
                                <div className='flex items-center gap-1 mt-2'>
                                    <p className='text-justify'>
                                        About: <span className='text-muted-foreground'>
                                            {currentContact.bio}
                                        </span>
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <Separator className='my-2' />

                    <h2 className='text-xl'>Images</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        {
                            messages.filter((message) => message.image).map((msg) => {
                                return (
                                    <div key={msg._id} className='w-full h-36 relative'>
                                        <Image 
                                            src={msg.image}
                                            alt={msg._id}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className='object-cover rounded-md'
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default TopChat;