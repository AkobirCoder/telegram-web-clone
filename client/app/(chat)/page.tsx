import { Loader2 } from 'lucide-react';
import React from 'react';
import ContactList from './_components/contact-list';

const HomePage = () => {
    const contacts = [
        {
            _id: '1',
            email: 'akobir@gmail.com',
            avatar: 'https://github.com/shadcn.png',
        },
        {
            _id: '2',
            email: 'zoe@gmail.com',
            avatar: 'https://github.com/shadcn.png',
        },
        {
            _id: '3',
            email: 'jhondoe@gmail.com',
            avatar: 'https://github.com/shadcn.png',
        },
        {
            _id: '4',
            email: 'kamikadze@gmail.com',
            avatar: 'https://github.com/shadcn.png',
        },
        {
            _id: '5',
            email: 'simple@gmail.com',
            avatar: 'https://github.com/shadcn.png',
        },
    ];

    return (
        <>
            {/* --- Sidebar --- */}
            <div className='w-80 h-screen border-r border-r-gray-700 fixed inset-0 z-50'>
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

            {/* --- Chat Area --- */}
        </>
    );
}

export default HomePage;