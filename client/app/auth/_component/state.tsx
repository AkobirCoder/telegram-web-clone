'use client';

import React from 'react';
import SignIn from './sign-in';
import Verify from './verify';

const StateAuth = () => {
    return (
        <>
            <SignIn />
            <Verify />
        </>
    );
}

export default StateAuth;