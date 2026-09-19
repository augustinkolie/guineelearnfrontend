'use client';

import React, { useState } from 'react';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    onAttachmentClick: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onAttachmentClick }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSendMessage(text);
        setText('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-shrink-0"
        >
            <button
                type="button"
                onClick={onAttachmentClick}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                title="Ajouter une pièce jointe"
            >
                <Paperclip className="w-5 h-5" />
            </button>

            <button
                type="button"
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition hidden sm:block"
                title="Emojis"
            >
                <Smile className="w-5 h-5" />
            </button>

            <input
                type="text"
                placeholder="Tapez un message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {text.trim() ? (
                <button
                    type="submit"
                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition shadow"
                    title="Envoyer"
                >
                    <Send className="w-4 h-4" />
                </button>
            ) : (
                <button
                    type="button"
                    className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    title="Enregistrer un message vocal"
                >
                    <Mic className="w-5 h-5" />
                </button>
            )}
        </form>
    );
};
