'use client';

import React, { useRef, useEffect } from 'react';
import { ApiMessage } from '@/types/domain/message.types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
    messages: ApiMessage[];
    currentUserId: string;
    onReply: (msg: ApiMessage) => void;
    onDelete: (msgId: string) => void;
    onStar: (msgId: string) => void;
    onReaction: (msgId: string, emoji: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    onReply,
    onDelete,
    onStar,
    onReaction,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-sm">
                <p>Aucun message dans cette conversation.</p>
                <p className="text-xs text-slate-500 mt-1">Envoyez un message pour commencer la discussion.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId || msg.senderId === 'me';
                return (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isMe={isMe}
                        onReply={onReply}
                        onDelete={onDelete}
                        onStar={onStar}
                        onReaction={onReaction}
                    />
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};
