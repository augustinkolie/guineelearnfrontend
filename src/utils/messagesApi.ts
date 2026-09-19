import { MessageService } from '@/services/messageService';
import { ApiConversation, ApiMessage, ApiContactUser, MessageStatus } from '@/types/domain/message.types';

export type { MessageStatus, ApiMessage, ApiConversation, ApiContactUser };

export const mapSenderForUi = (senderId: string, currentUserId: string) =>
    senderId === currentUserId ? 'me' : senderId;

export const mapMessageForUi = (msg: ApiMessage, currentUserId: string) => ({
    ...msg,
    senderId: mapSenderForUi(msg.senderId, currentUserId),
});

export const fetchConversations = (_token?: string) => MessageService.getConversations();

export const fetchMessages = (conversationId: string, _token?: string) => MessageService.getMessages(conversationId);

export const fetchContacts = (_token?: string) => MessageService.getContacts();

export const createConversation = (participantId: string, _token?: string) => MessageService.createConversation(participantId);

export const sendTextMessage = (
    conversationId: string,
    _token: string,
    data: { text?: string; replyToId?: string; audioUrl?: string; imageUrl?: string; fileName?: string; fileSize?: string; fileType?: string; fileUrl?: string; filePages?: number }
) => MessageService.sendTextMessage(conversationId, data);

export const sendFileMessage = (conversationId: string, _token: string, formData: FormData) =>
    MessageService.sendFileMessage(conversationId, formData);

export const deleteMessageApi = (messageId: string, forEveryone: boolean, _token?: string) =>
    MessageService.deleteMessage(messageId, forEveryone);

export const updateMessageApi = (
    messageId: string,
    _token: string,
    data: { isStarred?: boolean; reaction?: string | null }
) => MessageService.updateMessage(messageId, data);

export const blobUrlToFile = async (blobUrl: string, fileName: string, mimeType: string) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
};
