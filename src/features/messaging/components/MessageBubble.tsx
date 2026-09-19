'use client';

import React from 'react';
import { ApiMessage } from '@/types/domain/message.types';
import { CheckCheck, Trash2, Reply, Star, FileText, Download } from 'lucide-react';

interface MessageBubbleProps {
    message: ApiMessage;
    isMe: boolean;
    onReply: (msg: ApiMessage) => void;
    onDelete: (msgId: string) => void;
    onStar: (msgId: string) => void;
    onReaction: (msgId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isMe,
    onReply,
    onDelete,
    onStar,
    onReaction,
}) => {
    return (
        <div className={`flex flex-col mb-3 ${isMe ? 'items-end' : 'items-start'} group relative`}>
            <div
                className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                    isMe
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-700/50'
                }`}
            >
                {/* Image */}
                {message.imageUrl && (
                    <img
                        src={message.imageUrl}
                        alt="Image transmise"
                        className="rounded-lg max-h-60 w-full object-cover mb-2"
                    />
                )}

                {/* Audio */}
                {message.audioUrl && (
                    <audio controls src={message.audioUrl} className="w-full mb-2" />
                )}

                {/* Document / Fichier */}
                {message.fileData && (
                    <div className="flex items-center gap-3 p-2 bg-black/10 dark:bg-white/10 rounded-lg mb-2">
                        <FileText className="w-8 h-8 flex-shrink-0 text-emerald-400" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">{message.fileData.name}</p>
                            <p className="text-[10px] opacity-75">{message.fileData.size}</p>
                        </div>
                        {message.fileData.url && (
                            <a
                                href={message.fileData.url}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 hover:bg-black/20 rounded transition"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                )}

                {/* Texte */}
                {message.text && <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>}

                {/* Pied de message (Heure + Statut) */}
                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                    <span>{message.time}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                </div>
            </div>

            {/* Barre d'action rapide au survol */}
            <div
                className={`absolute top-0 ${
                    isMe ? '-left-20' : '-right-20'
                } opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow flex items-center gap-1 p-1`}
            >
                <button
                    onClick={() => onReply(message)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"
                    title="Répondre"
                >
                    <Reply className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => onStar(message.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-amber-500"
                    title="Favori"
                >
                    <Star className="w-3.5 h-3.5" />
                </button>
                {isMe && (
                    <button
                        onClick={() => onDelete(message.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-red-500"
                        title="Supprimer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
};
