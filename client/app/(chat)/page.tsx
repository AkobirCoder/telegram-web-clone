'use client'

import { Loader2 } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ContactList from './_components/contact-list';
import { useRouter, useSearchParams } from 'next/navigation';
import AddContact from './_components/add-contact';
import { useCurrentContact } from '@/hooks/use-current';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { emailSchema, messageSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import TopChat from './_components/top-chat';
import Chat from './_components/chat';
import { useLoading } from '@/hooks/use-loading';
import { axiosClient } from '@/http/axios';
import { generateToken } from '@/lib/generate-token';
import { useSession } from 'next-auth/react';
import { IError, IMessage, IUser } from '@/types';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';
import useAudio from '@/hooks/use-audio';
import { CONST } from '@/lib/constants';

interface GetSocketType {
    newMessage: IMessage,
    updatedMessage: IMessage,
    deletedMessage: IMessage,
    filteredMessages: IMessage[],
    receiver: IUser,
    sender: IUser,
    message: string,
}

const HomePage = () => {
    const {data: session} = useSession();

    const {setOnlineUsers} = useAuth();
    
    const {playSound} = useAudio();

    const searchParams = useSearchParams();

    const {currentContact, editedMessage, setEditedMessage} = useCurrentContact(); 

    const {setCreating, setLoading, setLoadMessages, isLoading, setTyping} = useLoading();

    const [contacts, setContacts] = useState<IUser[]>([]);

    const [messages, setMessages] = useState<IMessage[]>([]);

    const router = useRouter();

    const socket = useRef<ReturnType<typeof io> | null>(null);

    // const CONTACT_ID = searchParams.get('chat');

    const contactForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: '',
        },
    });

    const messageForm = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            text: '',
            image: '',
        },
    });

    const getContacts = async () => {
        setLoading(true);

        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.get<{contacts: IUser[]}>('/api/user/contacts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setContacts(data.contacts);
        } catch {
            toast.error('Cannot fetch contacts');
        } finally {
            setLoading(false);
        }
    }

    const getMessages = async () => {
        setLoadMessages(true);

        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.get<{messages: IMessage[]}>(`/api/user/messages/${currentContact?._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages(data.messages);

            setContacts((prevState) => {
                return prevState.map((item) => {
                    return item._id === currentContact?._id
                        ? {...item, lastMessage: item.lastMessage
                            ? {...item.lastMessage, status: CONST.READ}
                            : null
                        }
                        : item
                });
            });
        } catch {
            toast.error('Cannot fetch messages');
        } finally {
            setLoadMessages(false);
        }
    }

    useEffect(() => {
        router.replace('/');

        socket.current = io('ws://localhost:5000');
    }, []);

    useEffect(() => {
        if (session?.currentUser?._id) {
            socket.current?.emit('addOnlineUser', session?.currentUser); // emit - ma'lumotlarni socketga yuboradi

            socket.current?.on('getOnlineUsers', (data: {socketId: string, user: IUser}[]) => {        
                setOnlineUsers(data.map((dataItem) => dataItem.user));
            });

            getContacts();
        }
    }, [session?.currentUser]);

    useEffect(() => {
        if (session?.currentUser) {
            socket.current?.on('getCreatedUser', user => {
                // console.log('Created by user', user);

                setContacts((prevState) => {
                    const isExist = prevState.some((item) => item._id === user._id);

                    return isExist ? prevState : [...prevState, user];
                });
            });

            socket.current?.on('getNewMessage', ({newMessage, receiver, sender}: GetSocketType) => {
                // console.log(newMessage);

                // console.log('CONTACT_ID', CONTACT_ID);

                setTyping({sender: null, message: ''});

                if (currentContact?._id === newMessage.sender._id) { // faqat contactlar orasida message ma'lumotlarini ko'rsatish
                    setMessages((prevState) => {
                        const isExist = prevState.some((item) => item._id === newMessage._id);

                        return isExist ? prevState : [...prevState, newMessage];
                    });
                }

                setContacts((prevState) => {
                    return prevState.map((contact) => {
                        if (contact._id === sender._id) {
                            return {...contact, lastMessage: {
                                ...newMessage, 
                                status: currentContact?._id === sender._id 
                                    ? CONST.READ 
                                    : newMessage.status
                            }}
                        }

                        return contact;
                    });
                });

                toast.success(`${sender.email.split('@')[0]} sent you a message`);

                if (!receiver.muted) {
                    playSound(receiver.notificationSound);
                }
            });

            socket.current?.on('getReadMessages', (messages: IMessage[]) => {
                setMessages((prevState) => {
                    return prevState.map((item) => {
                        const message = messages.find((msg) => {
                            return msg._id === item._id;
                        });

                        return message ? {...item, status: CONST.READ} : item;
                    });
                });
            });

            socket.current?.on('getUpdatedMessage', ({updatedMessage, receiver, sender}: GetSocketType) => {
                setTyping({sender: null, message: ''});

                setMessages((prevState) => {
                    return prevState.map((item) => {
                        return item._id === updatedMessage._id
                            ? {
                                ...item, 
                                reaction: updatedMessage.reaction, 
                                text: updatedMessage.text,
                                editedStatus: true,
                            }
                            : item
                    });
                });

                setContacts((prevState) => {
                    return prevState.map((item) => {
                        return item._id === sender._id
                            ? {
                                ...item,
                                lastMessage: item.lastMessage?._id === updatedMessage._id
                                    ? updatedMessage
                                    : item.lastMessage,
                            }
                            : item;
                    });
                });
            });

            socket.current?.on('getDeletedMessage', ({deletedMessage, filteredMessages, sender}: GetSocketType) => {
                setMessages((prevState) => {
                    return prevState.filter((item) => {
                        return item._id !== deletedMessage._id;
                    });
                });

                const lastMessage = filteredMessages.length 
                    ? filteredMessages[filteredMessages.length - 1] 
                    : null;

                setContacts((prevState) => {
                    return prevState.map((item) => {
                        return item._id === sender._id
                            ? {
                                ...item,
                                lastMessage: item.lastMessage?._id === deletedMessage._id
                                    ? lastMessage
                                    : item.lastMessage,
                            }
                            : item;
                    });
                });
            });

            socket.current?.on('getTyping', ({sender, message}: GetSocketType) => {
                if (currentContact?._id === sender._id) {
                    setTyping({sender, message});
                }
            });
        }
    }, [session?.currentUser, socket, currentContact?._id]);

    useEffect(() => {
        if (currentContact?._id) {
            getMessages();
        }
    }, [currentContact]);

    const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
        // API call to create contact

        // console.log(values);

        setCreating(true);

        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.post<{contact: IUser}>('/api/user/contact', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log(data);

            setContacts((prevState) => {
                return [...prevState, data.contact];
            });

            socket.current?.emit('createContact', {
                currentUser: session?.currentUser,
                receiver: data.contact,
            });

            toast.success('Contact added succesfully');

            contactForm.reset();
        
        } catch (error: any) {
            if ((error as IError)?.response?.data?.message) {
                return toast.error((error as IError).response.data.message);
            } else {
                return toast.error('Something went wrong');
            }
        } finally {
            setCreating(false);
        }
    }

    const onSubmitMessage = async (values: z.infer<typeof messageSchema>) => {
        setCreating(true);

        if (editedMessage?._id) {
            onEditMessage(editedMessage._id, values.text);
        } else {
            onSendMessage(values);
        }
    }

    const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
        // API call to send message

        // console.log(values);

        setCreating(true);

        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.post<GetSocketType>('/api/user/message', {...values, receiver: currentContact?._id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages((prevState) => {
                return [...prevState, data.newMessage]
            });

            setContacts((prevState) => {
                return prevState.map((item) => {
                    return item._id === currentContact?._id 
                    ? {...item, lastMessage: {...data.newMessage, status: CONST.READ}}
                    : item
                });
            });

            socket.current?.emit('sendMessage', {
                newMessage: data.newMessage,
                receiver: data.receiver,
                sender: data.sender,
            });

            messageForm.reset();

            if (!data.sender.muted) {
                playSound(data.sender.sendingSound);
            }
        } catch {
            toast.error('Cannot send message');
        } finally {
            setCreating(false);
        }
    }

    const onEditMessage = async (messageId: string, text: string) => {
        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.put<{updatedMessage: IMessage}>(`/api/user/message/${messageId}`, {messageId, text}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages((prevState) => {
                return prevState.map((item) => {
                    return item._id === data.updatedMessage._id
                        ? {
                            ...item,
                            text: data.updatedMessage.text,
                            editedStatus: true,
                        }
                        : item;
                });
            });

            socket.current?.emit('updateMessage', {
                updatedMessage: data.updatedMessage,
                receiver: currentContact,
                sender: session?.currentUser,
            });

            messageForm.reset();

            setContacts((prevState) => {
                return prevState.map((item) => {
                    return item._id === currentContact?._id
                        ? {
                            ...item,
                            lastMessage: item.lastMessage?._id === messageId
                                ? data.updatedMessage
                                : item.lastMessage,
                        }
                        : item;
                });
            });

            setEditedMessage(null);
        } catch {
            toast.error('Cannot edit message');
        }
    }

    const onReadMessages = async () => {
        const receivedMessages = messages.filter((message) => {
            return message.receiver._id === session?.currentUser?._id;
        }).filter((message) => {
            return message.status !== CONST.READ;
        });

        if (receivedMessages.length === 0) return;

        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.post<{messages: IMessage[]}>('/api/user/message-read', {messages: receivedMessages}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages((prevState) => {
                return prevState.map((item) => {
                    const message = data.messages.find((msg) => {
                        return msg._id === item._id;
                    });

                    return message ? {...item, status: CONST.READ} : item;
                });
            });
            
            socket.current?.emit('readMessages', {
                receiver: currentContact,
                messages: data.messages,
            });
        } catch {
            toast.error('Cannot read messages');
        }
    }

    const onReactionMessage = async (reaction: string, messageId: string) => {
        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.post<{updatedMessage: IMessage}>('/api/user/reaction', {messageId, reaction}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages((prevState) => {
                return prevState.map((item) => {
                    return item._id === data.updatedMessage._id
                        ? {...item, reaction: data.updatedMessage.reaction}
                        : item;
                });
            });

            socket.current?.emit('updateMessage', {
                updatedMessage: data.updatedMessage,
                receiver: currentContact,
                sender: session?.currentUser,
            });
        } catch {
            toast.error('Cannot react a message');
        }
    }

    const onDeleteMessage = async (messageId: string) => {
        const token = await generateToken(session?.currentUser?._id);

        try {
            const {data} = await axiosClient.delete<{deletedMessage: IMessage}>(`/api/user/message/${messageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const filteredMessages = messages.filter((message) => {
                return message._id !== data.deletedMessage._id;
            });

            const lastMessage = filteredMessages.length 
                ? filteredMessages[filteredMessages.length - 1] 
                : null;

            setMessages(filteredMessages);

            setContacts((prevState) => {
                return prevState.map((item) => {
                    return item._id === currentContact?._id
                        ? {
                            ...item,
                            lastMessage: item.lastMessage?._id === messageId
                                ? lastMessage
                                : item.lastMessage,
                        }
                        : item;
                });
            });

            socket.current?.emit('deleteMessage', {
                deletedMessage: data.deletedMessage,
                receiver: currentContact,
                sender: session?.currentUser,
                filteredMessages,
            });
        } catch {
            toast.error('Cannot delete message');
        }
    }

    const onTyping = (event: ChangeEvent<HTMLInputElement>) => {
        socket.current?.emit('typing', {
            receiver: currentContact,
            sender: session?.currentUser,
            message: event.target.value,
        });
    }

    return (
        <>
            {/* --- Sidebar --- */}
            <div className='w-80 h-screen border-r border-r-zinc-300 dark:border-r-zinc-700 fixed inset-0 z-50 overflow-y-scroll sidebar-custom-scrollbar'>
                {/* --- Loading --- */}
                {
                    isLoading && (
                        <div className='w-full h-[95vh] flex justify-center items-center'>
                            <Loader2 size={50} className='animate-spin' />
                        </div>
                    )
                }
                {/* --- Loading --- */}

                {/* --- Contact list --- */}
                {
                    !isLoading && (
                        <ContactList contacts={contacts} />
                    )
                }
                {/* --- Contact list --- */}
            </div>
            {/* --- Sidebar --- */}

            {/* --- Chat Area --- */}
            <div className='pl-80 w-full'>
                {/* --- Add contact --- */}
                {
                    !currentContact?._id && <AddContact
                        contactForm={contactForm}
                        onCreateContact={onCreateContact}
                    />
                }
                {/* --- Add contact --- */}

                {/* --- Chat --- */}
                {
                    currentContact?._id && (
                        <div className='w-full relative'>
                            {/* --- Top chat --- */}
                            <TopChat messages={messages} />
                            {/* --- Top chat --- */}

                            {/* --- Chat message --- */}
                            <Chat
                                messages={messages}
                                messageForm={messageForm} 
                                onSubmitMessage={onSubmitMessage}
                                onReadMessages={onReadMessages}
                                onReactionMessage={onReactionMessage}
                                onDeleteMessage={onDeleteMessage}
                                onTyping={onTyping}
                            />
                            {/* --- Chat message --- */}
                        </div>
                    )
                }
                {/* --- Chat --- */}
            </div>
            {/* --- Chat Area --- */}
        </>
    );
}

export default HomePage;