'use client';

import React from 'react';
import SignIn from './sign-in';
import Verify from './verify';
import { useAuth } from '@/hooks/use-auth';

const StateAuth = () => {
    const {step} = useAuth();

    return (
        <>
            {step === 'login' && <SignIn />}
            {step === 'verify' && <Verify />}
        </>
    );
}

export default StateAuth;