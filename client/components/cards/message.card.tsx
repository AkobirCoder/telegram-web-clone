import { useCurrentContact } from '@/hooks/use-current';
import { CONST } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { IMessage } from '@/types';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import React, { FC } from 'react';

interface Props {
    // isReceived?: boolean,
    message: IMessage,
}

const MessageCard: FC<Props> = ({message}) => {
    const {currentContact} = useCurrentContact();

    return (
        <div className={cn('m-2.5 font-light text-xs flex', 
            message.receiver._id !== currentContact?._id 
            ? 'justify-start' 
            : 'justify-end'
        )}>
            <div className={cn('relative inline p-2.5 pr-12 max-w-full', 
                message.receiver._id === currentContact?._id 
                ? 'bg-primary' 
                : 'bg-secondary-foreground/20 border border-zinc-400 dark:border-0'
            )}>
                <p className={cn('text-sm', 
                    message.receiver._id !== currentContact?._id 
                    ? 'text-zinc-700 dark:text-white' 
                    : 'text-white'
                )}>
                    {message.text}
                </p>
                <div className={cn('flex gap-0.75 absolute text-[9px] right-1 bottom-0 opacity-60',
                    message.receiver._id !== currentContact?._id
                    ? 'text-zinc-700 dark:text-white'
                    : 'text-white'
                )}>
                    <p>{format(message.updatedAt, 'hh:mm a')}</p>
                    <div className='self-end'>
                        {
                            message.receiver._id === currentContact?._id && (
                                message.status === CONST.READ ? (
                                    <CheckCheck size={12} />
                                ) : (
                                    <Check size={12} />
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageCard;