'use client'

import React, { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChildProps, IError } from '@/types';
import { toast } from 'sonner';

const handleQueryError = (error: Error | IError) => {
    if ((error as IError)?.response?.data?.message) {
        return toast.error((error as IError).response.data.message);
    } else {
        return toast.error('Something went wrong');
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: handleQueryError,
        },
    },
});

const QueryProvider: FC<ChildProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default QueryProvider;