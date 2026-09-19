'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiConversation, ApiMessage, ApiContactUser } from '@/types/domain/message.types';
import { MessageService } from '@/services/messageService';

export function useMessagingState(currentUserId: string) {
    const [conversations, setConversations] = useState<ApiConversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [contacts, setContacts] = useState<ApiContactUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessageText, setNewMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [activeAttachmentModal, setActiveAttachmentModal] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [convs, cnts] = await Promise.all([
                MessageService.getConversations().catch(() => []),
                MessageService.getContacts().catch(() => []),
            ]);
            setConversations(convs);
            setContacts(cnts);
            if (convs.length > 0 && !activeConversationId) {
                setActiveConversationId(convs[0].id);
            }
        } catch (err) {
            console.error('Error loading messaging data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [activeConversationId]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSendMessage = async (text: string) => {
        if (!activeConversationId || !text.trim()) return;
        try {
            const sentMsg = await MessageService.sendTextMessage(activeConversationId, { text });
            setConversations(prev =>
                prev.map(c => {
                    if (c.id === activeConversationId) {
                        return {
                            ...c,
                            lastMessage: sentMsg,
                            messages: [...c.messages, sentMsg],
                        };
                    }
                    return c;
                })
            );
            setNewMessageText('');
        } catch (err) {
            showToast('Erreur envoi du message');
        }
    };

    const handleToggleFavorite = () => {
        if (!activeConversationId) return;
        setConversations(prev =>
            prev.map(c => (c.id === activeConversationId ? { ...c, isFavorite: !c.isFavorite } : c))
        );
        showToast('Favoris mis à jour');
    };

    return {
        conversations,
        activeConversationId,
        activeConversation,
        contacts,
        searchQuery,
        setSearchQuery,
        newMessageText,
        setNewMessageText,
        isLoading,
        isDarkMode,
        setIsDarkMode,
        showContactInfo,
        setShowContactInfo,
        activeAttachmentModal,
        setActiveAttachmentModal,
        toastMessage,
        setActiveConversationId,
        handleSendMessage,
        handleToggleFavorite,
        showToast,
    };
}
