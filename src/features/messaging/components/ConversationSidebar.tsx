'use client';

import React, { useState } from 'react';
import { Search, Plus, Star, Phone, CheckCheck } from 'lucide-react';
import { ApiConversation } from '@/types/domain/message.types';

interface ConversationSidebarProps {
    conversations: ApiConversation[];
    activeConversationId: string | null;
    currentUserId: string;
    onSelectConversation: (id: string) => void;
    onNewChatClick: () => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
    conversations,
    activeConversationId,
    currentUserId,
    onSelectConversation,
    onNewChatClick,
    searchQuery,
    onSearchChange,
}) => {
    const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'favorites'>('all');

    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (filterTab === 'unread') return conv.unreadCount > 0;
        if (filterTab === 'favorites') return conv.isFavorite;
        return true;
    });

    return (
        <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Discussion</h2>
                    <button
                        onClick={onNewChatClick}
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition shadow"
                        title="Nouvelle discussion"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Recherche */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une conversation..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Filtres */}
                <div className="flex gap-2">
                    {(['all', 'unread', 'favorites'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterTab(tab)}
                            className={`px-3 py-1 text-xs rounded-full transition capitalize ${
                                filterTab === tab
                                    ? 'bg-emerald-500 text-white font-medium'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                        >
                            {tab === 'all' ? 'Toutes' : tab === 'unread' ? 'Non lues' : 'Favoris'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        Aucune conversation trouvée.
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const isActive = conv.id === activeConversationId;
                        const lastMsg = conv.lastMessage;
                        const isOnline = conv.status === 'en ligne';

                        return (
                            <div
                                key={conv.id}
                                onClick={() => onSelectConversation(conv.id)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                                    isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 overflow-hidden">
                                        {conv.avatar ? (
                                            <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                                        ) : (
                                            conv.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span
                                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                                        }`}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-semibold text-slate-800 dark:text-white truncate text-sm">
                                            {conv.name}
                                        </h4>
                                        {lastMsg && (
                                            <span className="text-xs text-slate-400 flex-shrink-0">
                                                {lastMsg.time}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                        <p className="truncate">
                                            {lastMsg?.text || (lastMsg?.fileData ? '📎 Pièce jointe' : 'Aucun message')}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <span className="ml-2 bg-emerald-500 text-white font-bold text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
