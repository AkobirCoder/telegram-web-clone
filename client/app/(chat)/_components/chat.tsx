import MessageCard from '@/components/cards/message.card';
import ChatLoading from '@/components/loadings/chat.loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { messageSchema } from '@/lib/validation';
import { Paperclip, Send, Smile } from 'lucide-react';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';
import emojies from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from 'next-themes';
import { useLoading } from '@/hooks/use-loading';
import { IMessage } from '@/types';
import { useCurrentContact } from '@/hooks/use-current';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UploadDropzone } from '@/lib/uploadthing';
import { useSession } from 'next-auth/react';

interface Props {
    messages: IMessage[],
    messageForm: UseFormReturn<z.infer<typeof messageSchema>>,
    onSubmitMessage: (values: z.infer<typeof messageSchema>) => Promise<void>,
    onReadMessages: () => Promise<void>,
    onReactionMessage: (reaction: string, messageId: string) => Promise<void>,
    onDeleteMessage: (messageId: string) => Promise<void>,
    onTyping: (event: ChangeEvent<HTMLInputElement>) => void,
}

const Chat: FC<Props> = ({messages, messageForm, onSubmitMessage, onReadMessages, onReactionMessage, onDeleteMessage, onTyping}) => {
    const [open, setOpen] = useState(false);

    const {resolvedTheme} = useTheme();

    const {loadMessages} = useLoading();

    const {editedMessage, setEditedMessage, currentContact} = useCurrentContact();

    const {data: session} = useSession();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const scrollRef = useRef<HTMLFormElement | null>(null);

    // chatni filtrlash va duplicate message larni olib tashlash, bir user yuborgan message shu userning boshqa contactiga tushmaydi

    const filteredMessages = messages.filter((message, index, self) => {
        return ((message.sender._id === session?.currentUser?._id && message.receiver._id === currentContact?._id) || 
            (message.sender._id === currentContact?._id && message.receiver._id === session?.currentUser?._id)) &&
        index === self.findIndex((m) => m._id === message._id); // duplicate ni oldini olish
    });

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});

        onReadMessages();
    }, [messages]);

    useEffect(() => {
        if (editedMessage) {
            messageForm.setValue('text', editedMessage.text);

            scrollRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [editedMessage]);

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
                    loadMessages ? (
                        <ChatLoading />
                    ) : (
                        //* --- Start conversation --- *//
                        messages.length === 0 && (
                            <div className='w-full h-[88vh] flex items-center justify-center'>
                                <div
                                    className='text-[100px] cursor-pointer'
                                    onClick={() => onSubmitMessage({text: '👋'})}
                                >
                                    👋
                                </div>
                            </div>
                        )
                        //* --- Start conversation --- *//
                    )
                }
                {/* --- Loading --- */}

                {/* --- Messages --- */}
                {
                    filteredMessages.map((message, index) => {
                        return (
                            <MessageCard
                                key={index}
                                message={message}
                                onReactionMessage={onReactionMessage}
                                onDeleteMessage={onDeleteMessage}
                            />
                        )
                    })
                }
                {/* --- Messages --- */}
            </div>

            {/* --- Message input --- */}
            <Form {...messageForm}>
                <form 
                    onSubmit={messageForm.handleSubmit(onSubmitMessage)} 
                    className={`
                        flex items-center w-full p-2 
                        sticky z-30 bottom-0 
                        bg-background/50 backdrop-blur-sm
                        border-t border-t-zinc-300 dark:border-t-0
                    `}
                    ref={scrollRef}
                >
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                size={'icon'} 
                                className='h-9 border-r-0 border-zinc-300 dark:border-0' 
                                type='button' 
                                variant={'secondary'}
                            >
                                <Paperclip />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='rounded-none'>
                            <DialogHeader>
                                <DialogTitle />
                            </DialogHeader>
                            <UploadDropzone 
                                endpoint={'imageUploader'}
                                onClientUploadComplete={(res) => {
                                    onSubmitMessage({text: '', image: res[0].ufsUrl});
                                    setOpen(false);
                                }}
                                config={{
                                    appendOnPaste: true,
                                    mode: 'auto',
                                }}
                            />
                        </DialogContent>
                    </Dialog>
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
                                        onChange={(event) => {
                                            field.onChange(event.target.value);
                                            onTyping(event);
                                            if (event.target.value === '') setEditedMessage(null);
                                        }}
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