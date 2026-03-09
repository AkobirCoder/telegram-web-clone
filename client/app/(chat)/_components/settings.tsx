import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import React from 'react';

const Settings = () => {
    return (
        <>
            <Button
                className='border border-zinc-300 dark:border-0' 
                size={'icon'} 
                variant={'secondary'}
            >
                <Menu />
            </Button>
        </>
    );
}

export default Settings;