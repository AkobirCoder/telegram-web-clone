import { useCurrentContact } from '@/hooks/use-current';
import { CONST } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { IMessage } from '@/types';
import { format } from 'date-fns';
import { Check, CheckCheck, Edit2, Trash } from 'lucide-react';
import React, { FC } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '../ui/context-menu';
import Image from 'next/image';

interface Props {
    // isReceived?: boolean,
    message: IMessage,
    onReactionMessage: (reaction: string, messageId: string) => Promise<void>,
    onDeleteMessage: (messageId: string) => Promise<void>,
}

const MessageCard: FC<Props> = ({message, onReactionMessage, onDeleteMessage}) => {
    const {currentContact, setEditedMessage} = useCurrentContact();

    const reactions = ['🩷','👍','👋','😊','😄','😍','👎','🤬','👻','💡'];

    return (
        <div className={cn('m-2.5 font-light text-xs flex', 
            message.receiver._id !== currentContact?._id 
            ? 'justify-start' 
            : 'justify-end'
        )}>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div className={cn('relative inline p-2.5 pr-12 max-w-full backdrop-blur-md', 
                        message.receiver._id === currentContact?._id 
                        ? 'bg-primary' 
                        : 'bg-secondary-foreground/20'
                    )}>
                        {
                            message.image && (
                                <Image src={message.image} alt={message.image} width={300} height={250} />
                            )
                        }
                        {
                            message.text.length > 0 && (
                                <p className={cn('text-sm', 
                                    message.receiver._id !== currentContact?._id 
                                    ? 'text-zinc-700 dark:text-white' 
                                    : 'text-white'
                                )}>
                                    {message.text}
                                </p>
                            )
                        }
                        <div className={cn('flex gap-0.75 absolute text-[9px] right-1 bottom-0 opacity-60',
                            message.receiver._id !== currentContact?._id
                            ? 'text-zinc-700 dark:text-white'
                            : 'text-white'
                        )}>
                            {
                                message.editedStatus && (
                                    <span className='italic mr-1'>edited</span>
                                )
                            }
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
                        <span className='absolute -right-2 -bottom-2'>{message.reaction}</span>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className='w-56 p-0 mb-10'>
                    <ContextMenuItem className='grid grid-cols-5'>
                        {
                            reactions.map((reaction) => {
                                return (
                                    <div 
                                        key={reaction} 
                                        className={cn('text-xl cursor-pointer p-1 hover:bg-primary/50 transition-all', 
                                            message.reaction === reaction && 'bg-primary/50'
                                        )}
                                        onClick={() => onReactionMessage(reaction, message._id)}
                                    >
                                        {reaction}
                                    </div>
                                );
                            })
                        }
                    </ContextMenuItem>
                    {
                        message.sender._id !== currentContact?._id && (
                            <>
                                <ContextMenuSeparator />
                                {
                                    !message.image && (
                                        <ContextMenuItem className='cursor-pointer' onClick={() => setEditedMessage(message)}>
                                            <Edit2 size={14} className='mr-2' /> <span>Edit</span>
                                        </ContextMenuItem>
                                    )
                                }
                                <ContextMenuItem className='cursor-pointer' onClick={() => onDeleteMessage(message._id)}>
                                    <Trash size={14} className='mr-2' /> <span>Delete</span>
                                </ContextMenuItem>
                            </>
                        )
                    }
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
}

export default MessageCard;