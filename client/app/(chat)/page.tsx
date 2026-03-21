'use client'

import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ContactList from './_components/contact-list';
import { useRouter } from 'next/navigation';
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
import { IError, IUser } from '@/types';
import { toast } from 'sonner';

const HomePage = () => {
    const {data: session} = useSession();

    const {currentContact} = useCurrentContact(); 

    const {setCreating, setLoading, isLoading} = useLoading();

    const [contacts, setContacts] = useState<IUser[]>([]);

    const router = useRouter();

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

    useEffect(() => {
        router.replace('/');
    }, []);

    useEffect(() => {
        if (session?.currentUser?._id) {
            getContacts();
        }
    }, [session?.currentUser]);

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

            console.log(data);

            setContacts((prevState) => {
                return [...prevState, data.contact];
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

    const onSendMessage = (values: z.infer<typeof messageSchema>) => {
        // API call to send message

        console.log(values);
    }

    return (
        <>
            {/* --- Sidebar --- */}
            <div className='w-80 h-screen border-r border-r-zinc-300 dark:border-r-zinc-700 fixed inset-0 z-50'>
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
                            <TopChat />
                            {/* --- Top chat --- */}

                            {/* --- Chat message --- */}
                            <Chat
                                messageForm={messageForm} 
                                onSendMessage={onSendMessage}
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