import MessageCard from '@/components/cards/message.card';
import ChatLoading from '@/components/loadings/chat.loading';
import React from 'react';

const Chat = () => {
    return (
        <div className='flex flex-col justify-end z-40 min-h-[92vh]'>
            {/* --- Loading --- */}
            <ChatLoading />
            {/* --- Loading --- */}

            {/* --- Messages --- */}
            <MessageCard isReceived />
            <MessageCard />
            {/* --- Messages --- */}

            {/* --- Message input --- */}

            {/* --- Message input --- */}
        </div>
    );
}

export default Chat;