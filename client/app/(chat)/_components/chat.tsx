import MessageCard from '@/components/cards/message.card';
import ChatLoading from '@/components/loadings/chat.loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { messageSchema } from '@/lib/validation';
import { Paperclip, Send, Smile } from 'lucide-react';
import React, { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

interface Props {
    messageForm: UseFormReturn<z.infer<typeof messageSchema>>,
    onSendMessage: (values: z.infer<typeof messageSchema>) => void,
}

const Chat: FC<Props> = ({messageForm, onSendMessage}) => {
    return (
        <div className='flex flex-col justify-end z-40 h-[92vh]'>
            <div className='flex-1 overflow-y-auto'>
                {/* --- Loading --- */}
                <ChatLoading />
                {/* --- Loading --- */}
                {/* --- Messages --- */}
                <MessageCard isReceived />
                <MessageCard isReceived />
                <MessageCard />
                <MessageCard />
                <MessageCard isReceived />
                <MessageCard isReceived />
                <MessageCard />
                <MessageCard />
                <MessageCard isReceived />
                <MessageCard isReceived />
                <MessageCard />
                <MessageCard />
                <MessageCard isReceived />
                <MessageCard isReceived />
                <MessageCard />
                <MessageCard />
                {/* --- Messages --- */}
                {/* --- Start conversation --- */}
                {/* <div className='w-full h-[88vh] flex items-center justify-center'>
                    <div
                        className='text-[100px] cursor-pointer'
                        onClick={() => onSendMessage({text: '👋'})}
                    >
                        👋
                    </div>
                </div> */}
                {/* --- Start conversation --- */}
            </div>

            {/* --- Message input --- */}
            <Form {...messageForm}>
                <form 
                    onSubmit={messageForm.handleSubmit(onSendMessage)} 
                    className='flex items-center w-full p-2 sticky z-30 bottom-0 bg-background/90 backdrop-blur-md'
                >
                    <Button size={'icon'} className='h-9 border-0' type='button' variant={'secondary'}>
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
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button size={'icon'} className='h-9 border-0' type='button' variant={'secondary'}>
                        <Smile />
                    </Button>
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