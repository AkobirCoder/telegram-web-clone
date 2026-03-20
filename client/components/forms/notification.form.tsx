import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CheckCheckIcon, ChevronDown, PlayCircle } from 'lucide-react';
import { SOUNDS } from '@/lib/constants';
import { cn, getSoundLabel } from '@/lib/utils';
import useAudio from '@/hooks/use-audio';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { useMutation } from '@tanstack/react-query';
import { generateToken } from '@/lib/generate-token';
import { useSession } from 'next-auth/react';
import { axiosClient } from '@/http/axios';
import { toast } from 'sonner';

interface IPayload {
    muted?: boolean,
    notificationSound?: string,
    sendingSound?: string,
}

const NotificationForm = () => {
    const [selectedSound, setSelectedSound] = useState('');

    const {playSound} = useAudio();

    const {data: session, update} = useSession();

    const [isNotification, setIsNotification] = useState(false);

    const [isSending, setIsSending] = useState(false);

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

            setIsNotification(false);

            setIsSending(false);
        }
    });

    const onPlaySound = (value: string) => {
        setSelectedSound(value);

        playSound(value);
    }

    return (
        <>
            <div className='flex items-center justify-between gap-0.5'>
                <div className='flex flex-col'>
                    <h3>Notification Sound</h3>
                    <p className='text-muted-foreground text-xs'>
                        {getSoundLabel(session?.currentUser?.notificationSound)}
                    </p>
                </div>

                <Popover open={isNotification} onOpenChange={setIsNotification}>
                    <PopoverTrigger asChild>
                        <Button size={'sm'} className='rounded-none'>
                            Select <ChevronDown />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80 rounded-none p-4' align='end'>
                        <div className='flex flex-col space-y-1'>
                            {
                                SOUNDS.map((sound) => {
                                    return (
                                        <div 
                                            key={sound.label} 
                                            className={cn('flex items-center justify-between bg-secondary cursor-pointer hover:bg-primary', 
                                                selectedSound === sound.value && 'bg-primary'
                                            )}
                                            onClick={() => onPlaySound(sound.value)}
                                        >
                                            <div className='justify-start pl-2'>
                                                {sound.label}
                                            </div>
                                            {
                                                session?.currentUser?.notificationSound === sound.value ? (
                                                    <Button className='border-none' size={'icon'}>
                                                        <CheckCheckIcon />
                                                    </Button>
                                                ) : (
                                                    <Button className='border-none' size={'icon'} variant={'ghost'}>
                                                        <PlayCircle />
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Button 
                            className='w-full font-bold mt-2'
                            disabled={isPending}
                            onClick={() => mutate({notificationSound: selectedSound})}
                        >
                            Submit
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator className='my-2' />

            <div className='flex items-center justify-between gap-0.5'>
                <div className='flex flex-col'>
                    <h3>Sending Sound</h3>
                    <p className='text-muted-foreground text-xs'>
                        {getSoundLabel(session?.currentUser?.sendingSound)}
                    </p>
                </div>

                <Popover open={isSending} onOpenChange={setIsSending}>
                    <PopoverTrigger asChild>
                        <Button size={'sm'} className='rounded-none'>
                            Select <ChevronDown />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80 rounded-none p-4' align='end'>
                        <div className='flex flex-col space-y-1'>
                            {
                                SOUNDS.map((sound) => {
                                    return (
                                        <div 
                                            key={sound.label} 
                                            className={cn('flex items-center justify-between bg-secondary cursor-pointer hover:bg-primary', 
                                                selectedSound === sound.value && 'bg-primary'
                                            )}
                                            onClick={() => onPlaySound(sound.value)}
                                        >
                                            <div className='justify-start pl-2'>
                                                {sound.label}
                                            </div>
                                            {
                                                session?.currentUser?.sendingSound === sound.value ? (
                                                    <Button className='border-none' size={'icon'}>
                                                        <CheckCheckIcon />
                                                    </Button>
                                                ) : (
                                                    <Button className='border-none' size={'icon'} variant={'ghost'}>
                                                        <PlayCircle />
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Button 
                            className='w-full font-bold mt-2'
                            disabled={isPending}
                            onClick={() => mutate({sendingSound: selectedSound})}
                        >
                            Submit
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator className='my-2' />

            <div className='flex items-center justify-between gap-0.5'>
                <div className='flex flex-col'>
                    <h3>Mode Mute</h3>
                    <p className='text-muted-foreground text-xs'>
                        {
                            !session?.currentUser?.muted? 'Muted' : 'Unmuted'
                        }
                    </p>
                </div>
                <Switch 
                    checked={!session?.currentUser?.muted} 
                    onCheckedChange={() => mutate({muted: !session?.currentUser?.muted})} 
                    disabled={isPending}
                />
            </div>
        </>
    );
}

export default NotificationForm;