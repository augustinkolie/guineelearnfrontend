'use client';

import React from 'react';
import { Phone, Video, Star, MoreVertical, Search } from 'lucide-react';
import { ApiConversation } from '@/types/domain/message.types';

interface ChatHeaderProps {
    conversation: ApiConversation;
    onStartAudioCall: () => void;
    onStartVideoCall: () => void;
    onToggleFavorite: () => void;
    onToggleSearch: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    conversation,
    onStartAudioCall,
    onStartVideoCall,
    onToggleFavorite,
    onToggleSearch,
}) => {
    const isOnline = conversation.status === 'en ligne';

    return (
        <div className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm flex-shrink-0">
            {/* User Info */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 overflow-hidden">
                        {conversation.avatar ? (
                            <img src={conversation.avatar} alt={conversation.name} className="w-full h-full object-cover" />
                        ) : (
                            conversation.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-base leading-tight">
                        {conversation.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
                <button
                    onClick={onStartAudioCall}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    title="Appel vocal"
                >
                    <Phone className="w-5 h-5" />
                </button>
                <button
                    onClick={onStartVideoCall}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    title="Appel vidéo"
                >
                    <Video className="w-5 h-5" />
                </button>
                <button
                    onClick={onToggleFavorite}
                    className={`p-2 rounded-full transition ${
                        conversation.isFavorite
                            ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={conversation.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                    <Star className={`w-5 h-5 ${conversation.isFavorite ? 'fill-amber-500' : ''}`} />
                </button>
                <button
                    onClick={onToggleSearch}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    title="Rechercher dans la discussion"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
