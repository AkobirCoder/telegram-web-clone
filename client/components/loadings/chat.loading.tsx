import React from 'react';
import MessageLoading from './message.loading';

const ChatLoading = () => {
    return (
        <>
            <MessageLoading isReceived />
            <MessageLoading />
            <MessageLoading isReceived />
            <MessageLoading />
            <MessageLoading />
            <MessageLoading isReceived />
            <MessageLoading />
        </>
    );
}

export default ChatLoading;