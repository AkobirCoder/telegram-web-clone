'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

const Social = () => {
    const [isLoading, setLoading] = useState(false);

    const onSignIn = async (provider: string) => {
        setLoading(true);

        await signIn(provider, {callbackUrl: '/'});
    }

    return (
        <div className='grid grid-cols-2 w-full gap-1'>
            <Button variant={'outline'} onClick={() => onSignIn('google')} disabled={isLoading}>
                <span>Sign up with Google</span>
                <FaGoogle />
            </Button>
            <Button variant={'secondary'} className='border-none' onClick={() => onSignIn('github')} disabled={isLoading}>
                <span>Sign up with GitHub</span>
                <FaGithub />
            </Button>
        </div>
    );
}

export default Social;