import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { ChevronDown, PlayCircle } from 'lucide-react';
import { SOUNDS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import useAudio from '@/hooks/use-audio';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

const NotificationForm = () => {
    const [selectedSound, setSelectedSound] = useState('');

    const {playSound} = useAudio();

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
                        Apple
                    </p>
                </div>

                <Popover>
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
                                            <Button size={'sm'} variant={'ghost'} className='justify-start'>
                                                {sound.label}
                                            </Button>
                                            <Button size={'icon'} variant={'ghost'}>
                                                <PlayCircle />
                                            </Button>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Button className='w-full font-bold mt-2'>Submit</Button>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator className='my-2' />

            <div className='flex items-center justify-between gap-0.5'>
                <div className='flex flex-col'>
                    <h3>Sending Sound</h3>
                    <p className='text-muted-foreground text-xs'>
                        Apple
                    </p>
                </div>

                <Popover>
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
                                            <Button size={'sm'} variant={'ghost'} className='justify-start'>
                                                {sound.label}
                                            </Button>
                                            <Button size={'icon'} variant={'ghost'}>
                                                <PlayCircle />
                                            </Button>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <Button className='w-full font-bold mt-2'>Submit</Button>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator className='my-2' />

            <div className='flex items-center justify-between gap-0.5'>
                <div className='flex flex-col'>
                    <h3>Mode Mute</h3>
                    <p className='text-muted-foreground text-xs'>
                        Muted
                    </p>
                </div>
                <Switch />
            </div>
        </>
    );
}

export default NotificationForm;