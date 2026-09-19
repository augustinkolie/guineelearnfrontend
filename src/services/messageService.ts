import { httpClient } from './httpClient';
import { ApiConversation, ApiMessage, ApiContactUser } from '@/types/domain/message.types';
import { BASE_URL } from '@/utils/api';

/**
 * Service de Messagerie (DIP / Repository Pattern)
 * Encapsule toutes les interactions réseau de la messagerie.
 */
export class MessageService {
    public static async getConversations(): Promise<ApiConversation[]> {
        return httpClient.get<ApiConversation[]>('/messages/conversations');
    }

    public static async getMessages(conversationId: string): Promise<ApiMessage[]> {
        return httpClient.get<ApiMessage[]>(`/messages/conversations/${conversationId}/messages`);
    }

    public static async getContacts(): Promise<ApiContactUser[]> {
        return httpClient.get<ApiContactUser[]>('/messages/contacts');
    }

    public static async createConversation(participantId: string): Promise<ApiConversation> {
        return httpClient.post<ApiConversation>('/messages/conversations', { participantId });
    }

    public static async sendTextMessage(
        conversationId: string,
        data: {
            text?: string;
            replyToId?: string;
            audioUrl?: string;
            imageUrl?: string;
            fileName?: string;
            fileSize?: string;
            fileType?: string;
            fileUrl?: string;
            filePages?: number;
        }
    ): Promise<ApiMessage> {
        return httpClient.post<ApiMessage>(`/messages/conversations/${conversationId}/messages`, data);
    }

    public static async sendFileMessage(conversationId: string, formData: FormData): Promise<ApiMessage> {
        return httpClient.post<ApiMessage>(`/messages/conversations/${conversationId}/messages`, formData);
    }

    public static async deleteMessage(messageId: string, forEveryone: boolean): Promise<void> {
        return httpClient.delete<void>(`/messages/messages/${messageId}`, { forEveryone });
    }

    public static async updateMessage(
        messageId: string,
        data: { isStarred?: boolean; reaction?: string | null }
    ): Promise<ApiMessage> {
        return httpClient.patch<ApiMessage>(`/messages/messages/${messageId}`, data);
    }
}
