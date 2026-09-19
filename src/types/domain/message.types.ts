export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface FileData {
    name: string;
    size: string;
    type: string;
    url?: string;
    pages?: number;
}

export interface ApiMessage {
    id: string;
    senderId: string;
    text: string;
    time: string;
    status?: MessageStatus;
    isDeleted?: boolean;
    isStarred?: boolean;
    replyToId?: string;
    reaction?: string;
    audioUrl?: string;
    imageUrl?: string;
    fileData?: FileData;
}

export interface ApiConversation {
    conversationId: string;
    id: string;
    name: string;
    role?: string;
    avatar: string | null;
    status: 'en ligne' | 'hors ligne' | 'occupe';
    unreadCount: number;
    isFavorite?: boolean;
    lastMessage?: ApiMessage | null;
    messages: ApiMessage[];
}

export interface ApiContactUser {
    id: string;
    fullName: string;
    role: string;
}
