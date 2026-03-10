'use client'

import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
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

const HomePage = () => {
    const {currentContact} = useCurrentContact(); 

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

    useEffect(() => {
        router.replace('/');
    }, []);

    const onCreateContact = (values: z.infer<typeof emailSchema>) => {
        // API call to create contact

        console.log(values);
    }

    const onSendMessage = (values: z.infer<typeof messageSchema>) => {
        // API call to send message

        console.log(values);
    }

    const contacts = [
        {
            _id: '1',
            email: 'akobir@gmail.com',
            avatar: 'https://github.com/shadcn.png',
            firstName: 'Akobir',
            lastName: 'Usmonov',
            bio: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere, omnis! Unde eaque incidunt sit vero ratione facilis voluptate placeat labore.'
        },
        {
            _id: '2',
            email: 'zoe@gmail.com',
            avatar: 'https://github.com/shadcn.png',
            firstName: 'Zoe',
            lastName: 'Nill',
            bio: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere, omnis! Unde eaque incidunt sit vero ratione facilis voluptate placeat labore.'
        },
        {
            _id: '3',
            email: 'jhondoe@gmail.com',
            avatar: 'https://github.com/shadcn.png',
            firstName: 'Jhon',
            lastName: 'Doe',
            bio: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere, omnis! Unde eaque incidunt sit vero ratione facilis voluptate placeat labore.'
        },
        {
            _id: '4',
            email: 'kamikadze@gmail.com',
            avatar: 'https://github.com/shadcn.png',
            firstName: 'Hiroku',
            lastName: 'Kamiratu',
            bio: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere, omnis! Unde eaque incidunt sit vero ratione facilis voluptate placeat labore.'
        },
        {
            _id: '5',
            email: 'simple@gmail.com',
            avatar: 'https://github.com/shadcn.png',
            firstName: 'Sayed',
            lastName: 'AliYusuf',
            bio: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere, omnis! Unde eaque incidunt sit vero ratione facilis voluptate placeat labore.'
        },
    ];

    return (
        <>
            {/* --- Sidebar --- */}
            <div className='w-80 h-screen border-r border-r-zinc-300 dark:border-r-zinc-700 fixed inset-0 z-50'>
                {/* --- Loading --- */}
                {/* <div className='w-full h-[95vh] flex justify-center items-center'>
                    <Loader2 size={50} className='animate-spin' />
                </div> */}
                {/* --- Loading --- */}

                {/* --- Contact list --- */}
                <ContactList contacts={contacts} />
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