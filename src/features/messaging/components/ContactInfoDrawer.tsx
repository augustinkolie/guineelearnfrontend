'use client';

import React from 'react';
import { X, User, Phone, Video, Search, Bell, ShieldCheck } from 'lucide-react';
import { ApiConversation } from '@/types/domain/message.types';

interface ContactInfoDrawerProps {
    conversation: ApiConversation;
    onClose: () => void;
}

export const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({ conversation, onClose }) => {
    return (
        <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full z-20">
            {/* Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Infos du contact</h3>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Profile Detail */}
            <div className="p-6 flex flex-col items-center border-b border-slate-200 dark:border-slate-800">
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3 flex items-center justify-center">
                    {conversation.avatar ? (
                        <img src={conversation.avatar} alt={conversation.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-12 h-12 text-slate-400" />
                    )}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-lg">{conversation.name}</h4>
                <span className="text-xs text-slate-500 mt-1 capitalize">{conversation.status}</span>
            </div>

            {/* Quick Actions */}
            <div className="p-4 grid grid-cols-3 gap-2 border-b border-slate-200 dark:border-slate-800 text-center">
                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex flex-col items-center gap-1 text-xs">
                    <Phone className="w-4 h-4 text-emerald-500" /> Vocal
                </button>
                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex flex-col items-center gap-1 text-xs">
                    <Video className="w-4 h-4 text-emerald-500" /> Vidéo
                </button>
                <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex flex-col items-center gap-1 text-xs">
                    <Search className="w-4 h-4 text-emerald-500" /> Chercher
                </button>
            </div>

            {/* Settings */}
            <div className="p-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span>Mode silencieux</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Chiffrement de bout en bout</span>
                </div>
            </div>
        </div>
    );
};
