'use client'

import React, { FC } from 'react';
import { SessionProvider as Session } from 'next-auth/react';
import { ChildProps } from '@/types';

const SessionProvider: FC<ChildProps> = ({children}) => {
    return (
        <Session>{children}</Session>
    );
}

export default SessionProvider;