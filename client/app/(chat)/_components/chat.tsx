import MessageCard from '@/components/cards/message.card';
import ChatLoading from '@/components/loadings/chat.loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { messageSchema } from '@/lib/validation';
import { Paperclip, Send, Smile } from 'lucide-react';
import React, { FC, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';
import emojies from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from 'next-themes';
import { useLoading } from '@/hooks/use-loading';
import { IMessage } from '@/types';

interface Props {
    messageForm: UseFormReturn<z.infer<typeof messageSchema>>,
    onSendMessage: (values: z.infer<typeof messageSchema>) => Promise<void>,
    onReadMessages: () => Promise<void>,
    messages: IMessage[],
}

const Chat: FC<Props> = ({messageForm, onSendMessage, messages, onReadMessages}) => {
    const {resolvedTheme} = useTheme();

    const {loadMessages} = useLoading();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const scrollRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
        onReadMessages();
    }, [messages]);

    const handleEmojiSelect = (emoji: string) => {
        const input = inputRef.current;

        if (!input) return;

        const text = messageForm.getValues('text');

        const start = input.selectionStart ?? 0;

        const end = input.selectionEnd ?? 0;

        const newText = text.slice(0, start) + emoji + text.slice(end);

        messageForm.setValue('text', newText);

        setTimeout(() => {
            input.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);

        // messageForm.setValue('text', messageForm.getValues('text') + emoji);
    }
    
    return (
        <div className='flex flex-col justify-end z-40 min-h-[92vh]'>
            <div className='flex-1 overflow-y-auto'>
                {/* --- Loading --- */}
                {
                    loadMessages && (
                        <ChatLoading />
                    )
                }
                {/* --- Loading --- */}

                {/* --- Messages --- */}
                {
                    messages.map((message) => {
                        return (
                            <MessageCard
                                key={message._id}
                                message={message}
                            />
                        )
                    })
                }
                {/* --- Messages --- */}

                {/* --- Start conversation --- */}
                {
                    messages.length === 0 && (
                        <div className='w-full h-[88vh] flex items-center justify-center'>
                            <div
                                className='text-[100px] cursor-pointer'
                                onClick={() => onSendMessage({text: '👋'})}
                            >
                                👋
                            </div>
                        </div>
                    )
                }
                {/* --- Start conversation --- */}
            </div>

            {/* --- Message input --- */}
            <Form {...messageForm}>
                <form 
                    onSubmit={messageForm.handleSubmit(onSendMessage)} 
                    className={`
                        flex items-center w-full p-2 
                        sticky z-30 bottom-0 
                        bg-background/50 backdrop-blur-sm
                        border-t border-t-zinc-300 dark:border-t-0
                    `}
                    ref={scrollRef}
                >
                    <Button 
                        size={'icon'} 
                        className='h-9 border-r-0 border-zinc-300 dark:border-0' 
                        type='button' 
                        variant={'secondary'}
                    >
                        <Paperclip />
                    </Button>
                    <FormField
                        control={messageForm.control}
                        name='text'
                        render={({ field }) => (
                            <FormItem className='flex-1 min-w-0'>
                                <FormControl>
                                    <Input
                                        className={`
                                            bg-secondary
                                            border-l border-l-muted-foreground 
                                            border-r border-r-muted-foreground
                                            h-9 w-full
                                        `}
                                        placeholder='Type a message'
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={() => field.onBlur()}
                                        ref={inputRef}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                size={'icon'} 
                                className='h-9 border-l-0 border-zinc-300 dark:border-0' 
                                type='button' 
                                variant={'secondary'}
                            >
                                <Smile />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                            className='p-0 border-none rounded-md absolute right-4 bottom-14'
                        >
                            <Picker 
                                data={emojies} 
                                theme={resolvedTheme === 'dark' ? 'dark' : 'light'} 
                                onEmojiSelect={(emoji: {native: string}) => handleEmojiSelect(emoji.native)}
                            />
                        </PopoverContent>
                    </Popover>
                    
                    <Button type='submit' className='h-9 border-0' size={'icon'}>
                        <Send />
                    </Button>
                </form>
            </Form>
            {/* --- Message input --- */}
        </div>
    );
}

export default Chat;