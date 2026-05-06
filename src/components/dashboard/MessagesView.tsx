'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Search, 
    MoreVertical, 
    Paperclip, 
    Smile, 
    Send, 
    Check, 
    CheckCheck,
    Phone,
    Video,
    User,
    Plus,
    MessageSquarePlus,
    Mic,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    UserPlus,
    Link as LinkIcon,
    Calendar,
    MicOff,
    Copy,
    VideoOff,
    Lock,
    Hand,
    MonitorUp,
    MessageSquareText,
    X,
    Bell,
    Trash2,
    FileText,
    Camera,
    Image,
    Headphones,
    MapPin,
    BarChart2,
    Play,
    Pause,
    Star,
    Forward,
    CornerUpLeft,
    Reply,
    UserCircle,
    CheckSquare,
    ThumbsDown,
    Sticker,
    Leaf,
    Coffee,
    Car,
    Lightbulb,
    Music,
    Flag,
    Pencil,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const currentUser = { id: 'me' };

type Message = {
    id: string;
    senderId: string;
    text: string;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
    isDeleted?: boolean;
    isStarred?: boolean;
    replyToId?: string;
    reaction?: string;
    audioUrl?: string;
    imageUrl?: string;
    fileData?: {
        name: string;
        size: string;
        type: string;
        url?: string;
        pages?: number;
    };
};

type Contact = {
    id: string;
    name: string;
    avatar: string | null;
    status: 'en ligne' | 'hors ligne' | 'occupe';
    unreadCount: number;
    messages: Message[];
};

const mockContacts: Contact[] = [
    {
        id: '1',
        name: 'Abdoulaye Diallo',
        avatar: null,
        status: 'en ligne',
        unreadCount: 2,
        messages: [
            { id: 'm1', senderId: '1', text: 'Bonjour Monsieur, j\'ai une question sur le dernier TP.', time: '10:30' },
            { 
                id: 'm_file', 
                senderId: '1', 
                text: 'Voici le cours sur le Système Solaire.', 
                time: '10:32',
                fileData: {
                    name: 'Planete.pdf',
                    size: '2.4 MB',
                    type: 'application/pdf',
                    url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
                    pages: 14
                }
            },
            { id: 'm2', senderId: '1', text: 'Pour l\'exercice 3, la formule est-elle correcte ?', time: '10:31' },
            { id: 'm3', senderId: 'me', text: 'Bonjour Abdoulaye, oui la démarche est bonne, mais vérifie le signe.', time: '10:45', status: 'read' },
            { id: 'm4', senderId: '1', text: 'Ah je vois, merci beaucoup !', time: '11:02' },
        ]
    },
    {
        id: '2',
        name: 'Fatoumata Barry',
        avatar: null,
        status: 'hors ligne',
        unreadCount: 0,
        messages: [
            { id: 'm1', senderId: 'me', text: 'N\'oublie pas de rendre ton devoir avant ce soir.', time: 'Hier', status: 'read' },
            { id: 'm2', senderId: '2', text: 'C\'est noté, je le poste dans 1h.', time: 'Hier' }
        ]
    },
    {
        id: '3',
        name: 'Équipe Pédagogique',
        avatar: null,
        status: 'en ligne',
        unreadCount: 5,
        messages: [
            { id: 'm1', senderId: '3', text: 'Rappel de la réunion de 15h en salle B.', time: '08:00' },
            { id: 'm2', senderId: 'me', text: 'Bien reçu.', time: '08:15', status: 'delivered' }
        ]
    }
];

const EMOJI_CATEGORIES = [
    { icon: Smile, name: "Emojis et personnes", emojis: ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😻','😼','😽','🙀','😿','😾'] },
    { icon: Leaf, name: "Animaux et nature", emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷','🕸','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐓','🦃','🦚','🦜','🦢','🦩','🕊','🐇','🦝','🦨','🦡','🦦','🦥','🐁','🐀','🐿','🦔','🐾','🐉','🐲','🌵','🎄','🌲','🌳','🌴','🌱','🌿','☘️','🍀','🎍','🎋','🍃','🍂','🍁','🍄','🐚','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐️','🌟','✨','⚡️','☄️','💥','🔥','🌪','🌈','☀️','🌤','⛅️','🌥','☁️','🌦','🌧','⛈','🌩','🌨','❄️','☃️','⛄️','🌬','💨','💧','💦','☔️','☂️','🌊','🌫'] },
    { icon: Coffee, name: "Nourriture et boissons", emojis: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶','🌽','🥕','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🥪','🥙','🧆','🌮','🌯','🥗','🥘','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','☕️','🍵','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾','🧊','🥄','🍴','🍽','🥣','🥡','🥢','🧂'] },
    { icon: Car, name: "Voyages et lieux", emojis: ['🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🚚','🚛','🚜','🦯','🦽','🦼','🛴','🚲','🛵','🏍','🛺','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩','💺','🛰','🚀','🛸','🚁','🛶','⛵️','🚤','🛥','🛳','⛴','🚢','⚓️','⛽️','🚧','🚦','🚥','🚏','🗺','🗿','🗽','🗼','🏰','🏯','🏟','🎡','🎢','🎠','⛲️','⛱','🏖','🏝','🏜','🌋','⛰','🏔','🗻','🏕','⛺️','🏠','🏡','🏘','🏚','🏗','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏪','🏫','🏩','💒','🏛','⛪️','🕌','🕍','🛕','🕋','⛩','🛤','🛣','🗾','🎑','🏞','🌅','🌄','🌠','🎇','🎆','🌇','🌆','🏙','🌃','🌌','🌉','🌁'] },
    { icon: Lightbulb, name: "Objets", emojis: ['⌚️','📱','📲','💻','⌨️','🖥','🖨','🖱','🖲','🕹','🗜','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽','🎞','📞','☎️','📟','📠','📺','📻','🎙','🎚','🎛','🧭','⏱','⏲','⏰','🕰','⌛️','⏳','📡','🔋','🔌','💡','🔦','🕯','🪔','🧯','🛢','💸','💵','💴','💶','💷','💰','💳','💎','⚖️','🧰','🔧','🔨','⚒','🛠','⛏','🔩','⚙️','🧱','⛓','🧲','🔫','💣','🧨','🪓','🔪','🗡','⚔️','🛡','🚬','⚰️','⚱️','🏺','🔮','📿','🧿','💈','⚗️','🔭','🔬','🕳','🩹','🩺','💊','💉','🩸','🧬','🦠','🧫','🧪','🌡','🧹','🧺','🧻','🚽','🚰','🚿','🛁','🛀','🧼','🪒','🧽','🧴','🛎','🔑','🗝','🚪','🪑','🛋','🛏','🛌','🧸','🖼','🛍','🛒','🎁','🎈','🎏','🎀','🎊','🎉','🎎','🏮','🎐','🧧','✉️','📩','📨','📧','💌','📥','📤','📦','🏷','📪','📫','📬','📭','📮','📯','📜','📃','📄','📑','🧾','📊','📈','📉','🗒','🗓','📆','📅','🗑','📇','🗃','🗳','🗄','📋','📁','📂','🗂','🗞','📰','📓','📔','📒','📕','📗','📘','📙','📚','📖','🔖','🧷','🔗','📎','🖇','📐','📏','🧮','📌','📍','✂️','🖊','🖋','✒️','🖌','🖍','📝','✏️','🔍','🔎','🔏','🔐','🔒','🔓'] },
    { icon: Music, name: "Symboles", emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈️','♉️','♊️','♋️','♌️','♍️','♎️','♏️','♐️','♑️','♒️','♓️','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚️','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕️','🛑','⛔️','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗️','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯️','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿️','🅿️','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','⏏️','▶️','⏸','⏯','⏹','⏺','⏭','⏮','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','♾','💲','💱','™️','©️','®️','👁‍🗨','🔚','🔙','🔛','🔝','🔜','〰️','➰','➿','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫️','⚪️','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾️','◽️','◼️','◻️','⬛️','⬜️','🟫','🟥','🟧','🟨','🟩','🟦','🟪','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','💬','💭','🗯','♠️','♣️','♥️','♦️','🃏','🎴','🀄️','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧'] },
    { icon: Flag, name: "Drapeaux", emojis: ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏴‍☠️','🇦🇫','🇿🇦','🇦🇱','🇩🇿','🇩🇪','🇦🇩','🇦🇴','🇦🇮','🇦🇶','🇦🇬','🇸🇦','🇦🇷','🇦🇲','🇦🇼','🇦🇺','🇦🇹','🇦🇿','🇧🇸','🇧🇭','🇧🇩','🇧🇧','🇧🇪','🇧🇿','🇧🇯','🇧🇲','🇧🇹','🇧🇾','🇲🇲','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇨🇱','🇨🇳','🇨🇾','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇰🇵','🇰🇷','🇨🇷','🇨🇮','🇭🇷','🇨🇺','🇨🇼','🇩🇰','🇩🇯','🇩🇲','🇪🇬','🇸🇻','🇦🇪','🇪🇨','🇪🇷','🇪🇸','🇪🇪','🇺🇸','🇪🇹','🇫🇯','🇫🇮','🇫🇷','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇮','🇬🇷','🇬🇩','🇬🇱','🇬🇵','🇬🇺','🇬🇹','🇬🇳','🇬🇶','🇬🇼','🇬🇾','🇬🇫','🇭🇹','🇭🇳','🇭🇰','🇭🇺','🇮🇲','🇨🇽','🇳🇫','🇦🇽','🇰🇾','🇨🇨','🇨🇰','🇫🇴','🇫🇰','🇲🇵','🇲🇭','🇵🇳','🇸🇧','🇹🇨','🇻🇬','🇻🇮','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇸','🇮🇱','🇮🇹','🇯🇲','🇯🇵','🇯🇪','🇯🇴','🇰🇿','🇰🇪','🇰🇬','🇰🇮','🇽🇰','🇰🇼','🇱🇦','🇱🇸','🇱🇻','🇱🇧','🇱🇷','🇱🇾','🇱🇮','🇱🇹','🇱🇺','🇲🇴','🇲🇰','🇲🇬','🇲🇾','🇲🇼','🇲🇻','🇲🇱','🇲🇹','🇲🇦','🇲🇶','🇲🇺','🇲🇷','🇾🇹','🇲🇽','🇫🇲','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇸','🇲🇿','🇳🇦','🇳🇷','🇳🇵','🇳🇮','🇳🇪','🇳🇬','🇳🇺','🇳🇴','🇳🇨','🇳🇿','🇴🇲','🇺🇬','🇺🇿','🇵🇰','🇵🇼','🇵🇸','🇵🇦','🇵🇬','🇵🇾','🇳🇱','🇵🇪','🇵🇭','🇵🇱','🇵🇫','🇵🇷','🇵🇹','🇶🇦','🇨🇫','🇩🇴','🇷🇪','🇷🇴','🇬🇧','🇷🇺','🇷🇼','🇪🇭','🇧🇱','🇰🇳','🇸🇲','🇲🇫','🇵🇲','🇻🇨','🇸🇭','🇱🇨','🇸🇹','🇸🇳','🇷🇸','🇸🇨','🇸🇱','🇸🇬','🇸🇽','🇸🇰','🇸🇮','🇸🇴','🇸🇩','🇸🇸','🇱🇰','🇸🇪','🇨🇭','🇸🇷','🇸🇯','🇸🇿','🇸🇾','🇹🇯','🇹🇼','🇹🇿','🇹🇩','🇨🇿','🇹🇫','🇹🇭','🇹🇱','🇹🇬','🇹🇰','🇹🇴','🇹🇹','🇹🇳','🇹🇲','🇹🇷','🇹🇻','🇺🇦','🇪🇺','🇺🇾','🇻🇺','🇻🇦','🇻🇪','🇻🇳','🇼🇫','🇾🇪','🇿🇲','🇿🇼'] }
];

export const MessagesView = () => {
    const [contacts, setContacts] = useState<Contact[]>(mockContacts);
    const [activeContactId, setActiveContactId] = useState<string | null>(contacts[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isCallMenuOpen, setIsCallMenuOpen] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [callType, setCallType] = useState<'video'|'audio'>('audio');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [callReaction, setCallReaction] = useState<string|null>(null);
    const [toastMessage, setToastMessage] = useState<string|null>(null);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isSidebarMoreMenuOpen, setIsSidebarMoreMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favorites'>('all');
    const [activeTab, setActiveTab] = useState('discussion'); // discussion, status, group, call
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [isSearchingInChat, setIsSearchingInChat] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const cameraVideoRef = useRef<HTMLVideoElement>(null);
    const [chatSearchQuery, setChatSearchQuery] = useState('');
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const [isInputEmojiOpen, setIsInputEmojiOpen] = useState(false);
    const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
    const [activePickerTab, setActivePickerTab] = useState<'emoji'|'gif'|'sticker'>('emoji');
    const [activeAttachmentType, setActiveAttachmentType] = useState<string | null>(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [showFilePreview, setShowFilePreview] = useState(false);
    const [showOverlayEmoji, setShowOverlayEmoji] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingPaused, setIsRecordingPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
    const [isPlaybackPaused, setIsPlaybackPaused] = useState(false);
    const [playbackProgress, setPlaybackProgress] = useState(0);
    const [openDeleteMenuId, setOpenDeleteMenuId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, renderUpwards?: boolean, renderLeftwards?: boolean, messageId: string } | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set());
    const [forwardMessageId, setForwardMessageId] = useState<string | null>(null);
    const [reportMessageId, setReportMessageId] = useState<string | null>(null);
    const [pdfViewer, setPdfViewer] = useState<{ url: string; name: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const wasDiscardedRef = useRef(false);
    const recordingTimeRef = useRef(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording && !isRecordingPaused) {
            interval = setInterval(() => {
                setRecordingTime(prev => {
                    const next = prev + 1;
                    recordingTimeRef.current = next;
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording, isRecordingPaused]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (playingMessageId && !isPlaybackPaused) {
            interval = setInterval(() => {
                if (audioRef.current) {
                    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 30;
                    setPlaybackProgress(Math.floor(progress));
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [playingMessageId, isPlaybackPaused]);

    useEffect(() => {
        if (isCameraOpen && cameraStream && cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = cameraStream;
        }
    }, [isCameraOpen, cameraStream, capturedImage]);

    const startRealRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            audioChunksRef.current = [];
            setRecordingTime(0); // Reset for new session

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                if (wasDiscardedRef.current) {
                    wasDiscardedRef.current = false;
                    return;
                }
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                // Use the ref to get the absolute latest time
                sendSystemMessage(`🎤 Message vocal (${formatTime(recordingTimeRef.current)})`, audioUrl);
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setIsRecording(true);
            setIsRecordingPaused(false);
        } catch (err) {
            console.error("Mic access denied", err);
            setToastMessage("Microphone inaccessible");
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const handlePauseRecording = () => {
        if (recorderRef.current && isRecording && !isRecordingPaused) {
            recorderRef.current.pause();
            setIsRecordingPaused(true);
        }
    };

    const handleResumeRecording = () => {
        if (recorderRef.current && isRecording && isRecordingPaused) {
            recorderRef.current.resume();
            setIsRecordingPaused(false);
        }
    };

    const stopRealRecording = () => {
        if (recorderRef.current && isRecording) {
            recorderRef.current.stop();
            setIsRecording(false);
            setIsRecordingPaused(false);
        }
    };

    const sendSystemMessage = (text: string, audioUrl?: string, imageUrl?: string, fileData?: Message['fileData']) => {
        if (!activeContact) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            text: text,
            audioUrl: audioUrl,
            imageUrl: imageUrl,
            fileData: fileData,
            replyToId: replyingTo?.id,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setContacts(prev => prev.map(c => {
            if (c.id === activeContactId) {
                return { ...c, messages: [...c.messages, newMsg] };
            }
            return c;
        }));
    };

    const handleDeleteMessage = (messageId: string, forEveryone: boolean) => {
        setContacts(prev => prev.map(c => {
            if (c.id === activeContactId) {
                if (forEveryone) {
                    return {
                        ...c,
                        messages: c.messages.map(m => 
                            m.id === messageId ? { ...m, text: 'Ce message a été supprimé', isDeleted: true, audioUrl: undefined, imageUrl: undefined, fileData: undefined, reaction: undefined } : m
                        )
                    };
                } else {
                    return {
                        ...c,
                        messages: c.messages.filter(m => m.id !== messageId)
                    };
                }
            }
            return c;
        }));
    };

    const handleStarMessage = (messageId: string) => {
        setContacts(prev => prev.map(c => {
            if (c.id === activeContactId) {
                return {
                    ...c,
                    messages: c.messages.map(m => 
                        m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
                    )
                };
            }
            return c;
        }));
        setContextMenu(null);
    };

    const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
        e.preventDefault();
        
        // Si on clique dans la moitié inférieure, on ouvre le menu vers le haut
        const renderUpwards = e.clientY > window.innerHeight / 2;
        // Si on clique dans la moitié droite, on ouvre le menu vers la gauche
        const renderLeftwards = e.clientX > window.innerWidth / 2;

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            renderUpwards,
            renderLeftwards,
            messageId: messageId
        });
    };

    const handleReactToMessage = (messageId: string, emoji: string) => {
        setContacts(prev => prev.map(c => {
            if (c.id === activeContactId) {
                return {
                    ...c,
                    messages: c.messages.map(m => 
                        m.id === messageId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
                    )
                };
            }
            return c;
        }));
        setContextMenu(null);
    };

    const handlePrivateReply = (msg: Message) => {
        if (msg.senderId !== 'me' && contacts.some(c => c.id === msg.senderId)) {
            setActiveContactId(msg.senderId);
            setReplyingTo(msg);
        } else if (msg.senderId === 'me') {
            setToastMessage("Ceci est votre propre message.");
            setTimeout(() => setToastMessage(null), 2000);
        } else {
            setToastMessage("Ce contact n'existe pas.");
            setTimeout(() => setToastMessage(null), 2000);
        }
        setContextMenu(null);
    };

    const handleSendMessageTo = (msg: Message) => {
        if (msg.senderId !== 'me' && contacts.some(c => c.id === msg.senderId)) {
            setActiveContactId(msg.senderId);
        } else if (msg.senderId === 'me') {
            setToastMessage("Vous ne pouvez pas vous envoyer de message à vous-même ici.");
            setTimeout(() => setToastMessage(null), 2000);
        } else {
            setToastMessage("Ce contact n'existe pas.");
            setTimeout(() => setToastMessage(null), 2000);
        }
        setContextMenu(null);
    };

    const handleSelectMode = (msgId: string) => {
        setIsSelectionMode(true);
        setSelectedMessageIds(new Set([msgId]));
        setContextMenu(null);
    };

    const toggleMessageSelection = (msgId: string) => {
        setSelectedMessageIds(prev => {
            const next = new Set(prev);
            if (next.has(msgId)) next.delete(msgId);
            else next.add(msgId);
            return next;
        });
    };

    const handlePlayVoice = (msg: Message & { audioUrl?: string }) => {
        if (playingMessageId === msg.id) {
            if (isPlaybackPaused) {
                audioRef.current?.play();
                setIsPlaybackPaused(false);
            } else {
                audioRef.current?.pause();
                setIsPlaybackPaused(true);
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            if (msg.audioUrl) {
                const audio = new Audio(msg.audioUrl);
                audioRef.current = audio;
                audio.onended = () => {
                    setPlayingMessageId(null);
                    setIsPlaybackPaused(false);
                    setPlaybackProgress(0);
                };
                audio.play();
                setPlayingMessageId(msg.id);
                setIsPlaybackPaused(false);
                setPlaybackProgress(0);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const bgVideoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);

    const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeContact?.messages]);

    // WebRTC Camera Hook for Video Calls
    useEffect(() => {
        let activeStream: MediaStream | null = null;
        if (isCalling && callType === 'video') {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(mediaStream => {
                    activeStream = mediaStream;
                    streamRef.current = mediaStream;
                    // Apply initial states
                    mediaStream.getAudioTracks().forEach(t => t.enabled = !isMuted);
                    mediaStream.getVideoTracks().forEach(t => t.enabled = isVideoOn);

                    // Assign to both video elements
                    if (bgVideoRef.current) bgVideoRef.current.srcObject = mediaStream;
                    if (localVideoRef.current) localVideoRef.current.srcObject = mediaStream;
                })
                .catch(err => {
                    console.error("Camera access denied or unavailable", err);
                    setToastMessage("Impossible d'accéder à la caméra");
                    setTimeout(() => setToastMessage(null), 3000);
                });
        }
        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
            streamRef.current = null;
        };
    }, [isCalling, callType]);

    const toggleMute = () => {
        setIsMuted(prev => {
            const newState = !prev;
            if (streamRef.current) {
                streamRef.current.getAudioTracks().forEach(track => { track.enabled = !newState; });
            }
            return newState;
        });
    };

    const toggleVideo = () => {
        if (callType === 'audio') {
            // Upgrade audio call → video (WhatsApp-like)
            setCallType('video');
            setIsVideoOn(true);
            return;
        }

        if (isVideoOn) {
            // Downgrade video call → audio: stop video tracks & go back to audio mode
            if (streamRef.current) {
                streamRef.current.getVideoTracks().forEach(track => {
                    track.stop();
                    streamRef.current?.removeTrack(track);
                });
            }
            setIsVideoOn(false);
            setCallType('audio');
        } else {
            // Video was off during a video call, re-enable it
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(newStream => {
                    newStream.getVideoTracks().forEach(track => {
                        streamRef.current?.addTrack(track);
                    });
                    if (bgVideoRef.current) bgVideoRef.current.srcObject = streamRef.current;
                    if (localVideoRef.current) localVideoRef.current.srcObject = streamRef.current;
                    setIsVideoOn(true);
                })
                .catch(() => {
                    setToastMessage("Impossible d'activer la caméra");
                    setTimeout(() => setToastMessage(null), 3000);
                });
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeContact) return;
        if (!newMessage.trim() && selectedFiles.length === 0) return;

        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file, index) => {
                let finalMessage = index === 0 ? newMessage : ''; // Only apply caption to the first file for now, or we could support per-file captions later
                let imageUrl: string | undefined = undefined;
                let fileData: { name: string, size: string, type: string, url: string, pages: number } | undefined = undefined;

                if (file.type.startsWith('image/')) {
                    imageUrl = URL.createObjectURL(file);
                } else {
                    fileData = {
                        name: file.name,
                        size: (file.size / 1024).toFixed(1) + ' KB',
                        type: file.type,
                        url: URL.createObjectURL(file),
                        pages: 4
                    };
                }
                sendSystemMessage(finalMessage, undefined, imageUrl, fileData);
            });
        } else {
            sendSystemMessage(newMessage);
        }

        setNewMessage('');
        setSelectedFiles([]);
        setCurrentFileIndex(0);
        setShowFilePreview(false);
        setReplyingTo(null);
    };

    const handleCopyLink = () => {
        setIsCallMenuOpen(false);
        setToastMessage("Lien d'appel copié dans le presse-papiers !");
        setTimeout(() => setToastMessage(null), 3000);
    };

    const startCall = (type: 'video' | 'audio') => {
        setIsCallMenuOpen(false);
        setCallType(type);
        setIsCalling(true);
        setIsHandRaised(false);
        setIsScreenSharing(false);
        setShowEmojiPanel(false);
        setShowChatPanel(false);
        setShowAddPanel(false);
        setCallReaction(null);
    };

    const handleEndCall = () => {
        setIsCalling(false);
        setIsHandRaised(false);
        setIsScreenSharing(false);
        setShowEmojiPanel(false);
        setShowChatPanel(false);
        setShowAddPanel(false);
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(t => t.stop());
            screenStreamRef.current = null;
        }
    };

    const toggleHandRaise = () => {
        setIsHandRaised(prev => !prev);
        setShowEmojiPanel(false);
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            screenStreamRef.current?.getTracks().forEach(t => t.stop());
            screenStreamRef.current = null;
            setIsScreenSharing(false);
            setToastMessage('Partage d\'écran arrêté');
            setTimeout(() => setToastMessage(null), 2500);
        } else {
            try {
                const displayStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
                screenStreamRef.current = displayStream;
                // Show screen in local video
                if (localVideoRef.current) localVideoRef.current.srcObject = displayStream;
                if (bgVideoRef.current) bgVideoRef.current.srcObject = displayStream;
                setIsScreenSharing(true);
                setToastMessage('Partage d\'écran activé');
                setTimeout(() => setToastMessage(null), 2500);
                displayStream.getVideoTracks()[0].onended = () => {
                    setIsScreenSharing(false);
                    // Restore camera
                    if (streamRef.current) {
                        if (localVideoRef.current) localVideoRef.current.srcObject = streamRef.current;
                        if (bgVideoRef.current) bgVideoRef.current.srcObject = streamRef.current;
                    }
                };
            } catch {
                setToastMessage('Partage d\'écran annulé');
                setTimeout(() => setToastMessage(null), 2000);
            }
        }
    };

    const sendReaction = (emoji: string) => {
        setCallReaction(emoji);
        setShowEmojiPanel(false);
        setTimeout(() => setCallReaction(null), 3000);
    };

    const handleSelectContact = (contactId: string) => {
        setActiveContactId(contactId);
        // Clear unread count when opening chat
        setContacts(prev => prev.map(c => 
            c.id === contactId ? { ...c, unreadCount: 0 } : c
        ));
    };

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (activeFilter === 'unread') return (c.unreadCount ?? 0) > 0;
        if (activeFilter === 'favorites') return c.messages.some(m => m.isStarred);
        return true;
    });

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStream(stream);
            setIsCameraOpen(true);
            if (cameraVideoRef.current) cameraVideoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Camera access denied", err);
            setToastMessage("Impossible d'accéder à la caméra");
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            setCameraStream(null);
        }
        setIsCameraOpen(false);
        setCapturedImage(null);
    };

    const capturePhoto = () => {
        if (cameraVideoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = cameraVideoRef.current.videoWidth;
            canvas.height = cameraVideoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(cameraVideoRef.current, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);
            }
        }
    };

    const sendCapturedPhoto = () => {
        if (capturedImage) {
            sendSystemMessage('', undefined, capturedImage);
            stopCamera();
        }
    };

    return (
        <>
        {/* ─── Liseuse PDF plein écran ─── */}
        {pdfViewer && (
            <div className="fixed inset-0 z-[200] bg-[#111827] flex flex-col animate-in fade-in duration-300">
                <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#1F2937] border-b border-gray-800 shrink-0 ">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPdfViewer(null)}
                            className="w-9 h-9 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-white "
                            title="Fermer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-white font-bold text-sm line-clamp-1">{pdfViewer.name}</h2>
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Liseuse intégrée</p>
                        </div>
                    </div>
                    <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B6B3A]/20 text-[#34d399] text-[10px] font-bold uppercase tracking-widest border border-[#1B6B3A]/30">
                        <ChevronRight className="w-3.5 h-3.5" /> Bibliothèque GuinéeLearn
                    </span>
                </div>
                <div className="flex-1 w-full bg-[#111827]">
                    <iframe
                        src={`${pdfViewer.url}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-none"
                        title={pdfViewer.name}
                    />
                </div>
            </div>
        )}

        <div className={`flex flex-row w-full h-full overflow-hidden animate-in fade-in duration-500 transition-colors ${isDarkMode ? 'bg-[#111B21] border-[#1e2a30]' : 'bg-white border-gray-200'}`}>
            
            {/* --- SIDEBAR: CONTACT LIST --- */}
            <div className={`w-full md:w-[350px] lg:w-[400px] flex-shrink-0 flex-col border-r transition-colors ${
                isDarkMode ? 'bg-[#111B21] border-[#202C33]' : 'bg-white border-gray-200'
            } ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
                <div className={`h-16 flex items-center justify-between px-5 flex-shrink-0 ${isDarkMode ? 'bg-[#111B21]' : 'bg-white'}`}>
                    <h2 className={`text-[22px] font-black ${isDarkMode ? 'text-white' : 'text-[#0F2D1E]'}`}>Discussions</h2>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button 
                                onClick={() => setIsNewChatModalOpen(!isNewChatModalOpen)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:bg-[#202C33]' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <MessageSquarePlus className="w-5 h-5" />
                            </button>
                            <AnimatePresence>
                                {isNewChatModalOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNewChatModalOpen(false)} />
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className={`absolute left-0 top-full mt-2 w-64 rounded-lg  z-50 overflow-hidden border py-2 ${
                                                isDarkMode ? 'bg-[#233138] border-[#2A3942]' : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <div className="px-4 py-2 text-[12px] font-bold text-[#8696A0] uppercase tracking-widest border-b border-white/5 mb-1">Démarrer une discussion</div>
                                            {['Nouveau groupe', 'Nouvelle communauté', 'Nouveau contact'].map((item, idx) => (
                                                <button 
                                                    key={idx}
                                                    className={`w-full text-left px-4 py-3 text-[14px] font-medium transition-colors ${
                                                        isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#0F2D1E] hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setIsSidebarMoreMenuOpen(!isSidebarMoreMenuOpen)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:bg-[#202C33]' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            <AnimatePresence>
                                {isSidebarMoreMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsSidebarMoreMenuOpen(false)} />
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className={`absolute right-0 top-full mt-2 w-56 rounded-lg  z-50 overflow-hidden border py-2 ${
                                                isDarkMode ? 'bg-[#233138] border-[#2A3942]' : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            {[
                                                { label: 'Nouveau groupe', icon: UserPlus },
                                                { label: 'Messages importants', icon: Smile },
                                                { label: 'Paramètres', icon: Calendar },
                                                { label: 'Déconnexion', icon: ArrowLeft },
                                            ].map((item, idx) => (
                                                <button 
                                                    key={idx}
                                                    className={`w-full text-left px-6 py-3 text-[14px] font-medium transition-colors flex items-center gap-3 ${
                                                        isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#0F2D1E] hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                            <div className={`h-[1px] my-1 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
                                            <button 
                                                onClick={() => setIsDarkMode(!isDarkMode)}
                                                className={`w-full text-left px-6 py-3 text-[14px] font-medium transition-colors ${
                                                    isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#0F2D1E] hover:bg-gray-50'
                                                }`}
                                            >
                                                Mode {isDarkMode ? 'Clair' : 'Sombre'}
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Search Bar & Filters */}
                <div className="px-3 pb-3 flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8696A0]" />
                        <input 
                            type="text" 
                            placeholder="Rechercher ou démarrer une discussion"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg text-[15px] font-medium outline-none  ${
                                isDarkMode 
                                    ? 'bg-[#202C33] text-[#E9EDEF] placeholder:text-[#8696A0]' 
                                    : 'bg-gray-100 text-[#0F2D1E] placeholder:text-gray-500'
                            }`}
                        />
                    </div>
                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 pl-1">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-black transition-all duration-300 border ${
                            activeFilter === 'all'
                                ? (isDarkMode ? 'border-[#2A3942] text-[#00A884] bg-transparent' : 'border-gray-200 text-[#1B6B3A] bg-transparent shadow-sm')
                                : (isDarkMode ? 'border-transparent text-[#8696A0] hover:bg-[#202C33]' : 'border-transparent text-gray-500 hover:bg-gray-100')
                        }`}>Toutes</button>
                        <button 
                            onClick={() => setActiveFilter('unread')}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-black transition-all duration-300 border ${
                            activeFilter === 'unread'
                                ? (isDarkMode ? 'border-[#2A3942] text-[#00A884] bg-transparent' : 'border-gray-200 text-[#1B6B3A] bg-transparent shadow-sm')
                                : (isDarkMode ? 'border-transparent text-[#8696A0] hover:bg-[#202C33]' : 'border-transparent text-gray-500 hover:bg-gray-100')
                        }`}>Non lues</button>
                        <button 
                            onClick={() => setActiveFilter('favorites')}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-black transition-all duration-300 border ${
                            activeFilter === 'favorites'
                                ? (isDarkMode ? 'border-[#2A3942] text-[#00A884] bg-transparent' : 'border-gray-200 text-[#1B6B3A] bg-transparent shadow-sm')
                                : (isDarkMode ? 'border-transparent text-[#8696A0] hover:bg-[#202C33]' : 'border-transparent text-gray-500 hover:bg-gray-100')
                        }`}>Favoris</button>
                    </div>
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden pt-1">
                    {filteredContacts.map((contact) => {
                        const lastMsg = contact.messages[contact.messages.length - 1];
                        const isActive = contact.id === activeContactId;

                        return (
                            <button
                                key={contact.id}
                                onClick={() => handleSelectContact(contact.id)}
                                className={`w-full flex items-center gap-4 px-3 py-3 transition-colors text-left relative ${
                                    isDarkMode 
                                        ? `hover:bg-[#202C33] ${isActive ? 'bg-[#2A3942]' : 'bg-transparent'}`
                                        : `hover:bg-[#E8F5EE]/50 ${isActive ? 'bg-[#E8F5EE]/80' : 'bg-transparent'}`
                                }`}
                            >
                                {/* Active Indicator line (WhatsApp web style) */}
                                {isActive && (
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDarkMode ? 'bg-[#00A884]' : 'bg-[#1B6B3A]'}`} />
                                )}

                                {/* Avatar */}
                                <div className={`relative w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ml-1 ${
                                    isDarkMode ? 'bg-[#667781]' : 'bg-gray-200'
                                }`}>
                                    {contact.avatar ? (
                                        <img src={contact.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-7 h-7 text-[#CFD9DF]" />
                                    )}
                                    {contact.status === 'en ligne' && (
                                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 rounded-full translate-x-1 ${isDarkMode ? 'border-[#111B21]' : 'border-white'}`} />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 border-b border-transparent pr-2 pb-1" style={{ borderBottomColor: isDarkMode && !isActive ? 'rgba(134,150,160,0.15)' : 'transparent' }}>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={`text-[17px] font-bold truncate pr-2 ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#0F2D1E]'}`}>{contact.name}</h3>
                                        {lastMsg && (
                                            <span className={`text-[12px] whitespace-nowrap font-medium ${
                                                contact.unreadCount > 0 
                                                    ? (isDarkMode ? 'text-[#00A884]' : 'text-[#1B6B3A]') 
                                                    : 'text-[#8696A0]'
                                            }`}>
                                                {lastMsg.time}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className={`text-[14px] truncate ${
                                            contact.unreadCount > 0 
                                                ? (isDarkMode ? 'text-[#E9EDEF] font-bold' : 'text-[#0F2D1E] font-bold') 
                                                : (isDarkMode ? 'text-[#8696A0]' : 'text-gray-500')
                                        }`}>
                                            {lastMsg?.senderId === 'me' && 'Vous: '}
                                            {lastMsg?.text}
                                        </p>
                                        {contact.unreadCount > 0 && (
                                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                                                isDarkMode ? 'bg-[#00A884] text-[#111B21]' : 'bg-[#1B6B3A] text-white'
                                            }`}>
                                                {contact.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- MAIN CHAT AREA --- */}
            <div className={`relative flex-1 flex-col min-w-0 transition-colors overflow-hidden ${
                isDarkMode ? 'bg-[#0B141A]' : 'bg-[#F8FAFC]'
            } ${activeContactId ? 'flex' : 'hidden md:flex'}`}>
                {activeContact ? (
                    <>
                        {/* Chat Header */}
                        <div className={`h-20 flex items-center justify-between px-3 md:px-6 border-b flex-shrink-0 z-40  transition-colors ${
                            isDarkMode ? 'bg-[#202C33] border-[#2A3942]' : 'bg-white border-gray-200'
                        }`}>
                            <div 
                                className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 cursor-pointer"
                                onClick={() => setShowContactInfo(true)}
                            >
                                <button 
                                    className={`md:hidden p-2 -ml-2 transition-colors flex-shrink-0 ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={(e) => { e.stopPropagation(); setActiveContactId(null); }}
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`}>
                                     {activeContact.avatar ? (
                                        <img src={activeContact.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-400'}`} />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 pr-2">
                                    <h3 className={`text-sm md:text-base font-black truncate ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#0F2D1E]'}`}>{activeContact.name}</h3>
                                    <span className="text-[11px] font-bold text-emerald-500 capitalize truncate">{activeContact.status}</span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-0.5 md:gap-1 flex-shrink-0 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`}>
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsCallMenuOpen(!isCallMenuOpen)}
                                        className={`py-2 px-2 md:py-2 md:px-4 rounded-full transition-colors flex items-center gap-2 border shadow-xs ${
                                            isDarkMode 
                                                ? 'hover:bg-[#2A3942] text-[#E9EDEF] border-[#2A3942]' 
                                                : 'hover:bg-gray-50 text-[#0F2D1E] border-gray-200 md:mr-2'
                                        }`}
                                    >
                                        <Video className="w-5 h-5 md:w-[22px] md:h-[22px] stroke-[1.5]" />
                                        <span className="hidden md:inline text-[15px] font-bold">Appeler</span>
                                        <ChevronDown className="hidden md:block w-[18px] h-[18px] ml-0.5 opacity-80 stroke-[2.5]" />
                                    </button>
                                    
                                    {isSearchingInChat ? (
                                        <div className={`absolute inset-0 z-50 flex items-center px-4 animate-in slide-in-from-right duration-300 ${isDarkMode ? 'bg-[#202C33]' : 'bg-white'}`}>
                                            <button 
                                                onClick={() => { setIsSearchingInChat(false); setChatSearchQuery(''); }}
                                                className={`p-2 mr-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#2A3942]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <ArrowLeft className="w-6 h-6" />
                                            </button>
                                            <div className="flex-1 relative">
                                                <input 
                                                    autoFocus
                                                    type="text" 
                                                    placeholder="Rechercher des messages"
                                                    value={chatSearchQuery}
                                                    onChange={(e) => setChatSearchQuery(e.target.value)}
                                                    className={`w-full py-2 bg-transparent outline-none text-sm ${isDarkMode ? 'text-[#E9EDEF] placeholder:text-[#8696A0]' : 'text-[#0F2D1E] placeholder:text-gray-500'}`}
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-gray-700'}`}>
                                                    <ChevronUp className="w-5 h-5" />
                                                </button>
                                                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-gray-700'}`}>
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => { setIsSearchingInChat(false); setChatSearchQuery(''); }}
                                                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                    
                                    {isCallMenuOpen && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-20"
                                                onClick={() => setIsCallMenuOpen(false)}
                                            />
                                            <div className={`absolute right-[-60px] sm:right-0 top-full mt-2 w-[calc(100vw-32px)] sm:w-80 rounded-lg  z-30 overflow-hidden border p-2 animate-in fade-in zoom-in-95 duration-200 ${
                                                isDarkMode ? 'bg-[#233138] border-[#2A3942]' : 'bg-white border-gray-200'
                                            }`}>
                                                {/* Header info */}
                                                <div className="flex items-center gap-3 p-3 mb-2">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`}>
                                                        {activeContact.avatar ? (
                                                            <img src={activeContact.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className={`w-6 h-6 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-400'}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <h4 className={`font-bold text-[15px] truncate ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#0F2D1E]'}`}>{activeContact.name}</h4>
                                                        <span className="text-[#8696A0] text-[13px] truncate">en ligne aujourd'hui à 02:28</span>
                                                    </div>
                                                </div>

                                                {/* Main Action Buttons */}
                                                <div className="grid grid-cols-2 gap-2 mb-3 px-2">
                                                    <button onClick={() => startCall('audio')} className={`rounded-lg py-2.5 flex items-center justify-center gap-2.5 font-bold text-[13px] md:text-[14px] transition-colors border ${
                                                        isDarkMode 
                                                            ? 'bg-[#2A3942] hover:bg-[#3B4A54] text-[#00A884] border-[#3B4A54]' 
                                                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#1B6B3A] border-emerald-100'
                                                    }`}>
                                                        <Phone className="w-[18px] h-[18px] fill-current" />
                                                        Appel vocal
                                                    </button>
                                                    <button onClick={() => startCall('video')} className={`rounded-lg py-2.5 flex items-center justify-center gap-2.5 font-bold text-[13px] md:text-[14px] transition-colors border ${
                                                        isDarkMode 
                                                            ? 'bg-[#2A3942] hover:bg-[#3B4A54] text-[#00A884] border-[#3B4A54]' 
                                                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#1B6B3A] border-emerald-100'
                                                    }`}>
                                                        <Video className="w-[20px] h-[20px] fill-current" />
                                                        Appel vidéo
                                                    </button>
                                                </div>

                                                <div className={`w-[calc(100%-16px)] mx-auto h-[1px] mb-2 ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`} />

                                                {/* List Actions */}
                                                <div className="flex flex-col px-1 pb-1">
                                                    <button className={`flex items-center gap-4 w-full p-2.5 rounded-lg transition-colors group ${isDarkMode ? 'hover:bg-[#2A3942] text-[#8696A0]' : 'hover:bg-gray-50 text-gray-600'}`}>
                                                        <UserPlus className={`w-5 h-5 flex-shrink-0 transition-colors ${isDarkMode ? 'text-[#8696A0] group-hover:text-[#E9EDEF]' : 'text-gray-400 group-hover:text-[#0F2D1E]'}`} />
                                                        <span className={`font-semibold text-[15px] transition-colors ${isDarkMode ? 'group-hover:text-[#E9EDEF]' : 'group-hover:text-[#0F2D1E]'}`}>Nouvel appel de groupe</span>
                                                    </button>
                                                    <button onClick={handleCopyLink} className={`flex items-center gap-4 w-full p-2.5 rounded-lg transition-colors group ${isDarkMode ? 'hover:bg-[#2A3942] text-[#8696A0]' : 'hover:bg-gray-50 text-gray-600'}`}>
                                                        <LinkIcon className={`w-5 h-5 flex-shrink-0 transition-colors ${isDarkMode ? 'text-[#8696A0] group-hover:text-[#E9EDEF]' : 'text-gray-400 group-hover:text-[#0F2D1E]'}`} />
                                                        <span className={`font-semibold text-[15px] transition-colors ${isDarkMode ? 'group-hover:text-[#E9EDEF]' : 'group-hover:text-[#0F2D1E]'}`}>Envoyer le lien d'appel</span>
                                                    </button>
                                                    <button className={`flex items-center gap-4 w-full p-2.5 rounded-lg transition-colors group ${isDarkMode ? 'hover:bg-[#2A3942] text-[#8696A0]' : 'hover:bg-gray-50 text-gray-600'}`}>
                                                        <Calendar className={`w-5 h-5 flex-shrink-0 transition-colors ${isDarkMode ? 'text-[#8696A0] group-hover:text-[#E9EDEF]' : 'text-gray-400 group-hover:text-[#0F2D1E]'}`} />
                                                        <span className={`font-semibold text-[15px] transition-colors ${isDarkMode ? 'group-hover:text-[#E9EDEF]' : 'group-hover:text-[#0F2D1E]'}`}>Planifier un appel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setIsSearchingInChat(true)}
                                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[#2A3942] hover:text-[#E9EDEF]' : 'hover:bg-gray-50 hover:text-[#0F2D1E]'}`}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[#2A3942] hover:text-[#E9EDEF]' : 'hover:bg-gray-50 hover:text-[#0F2D1E]'}`}
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    <AnimatePresence>
                                        {isMoreMenuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className={`absolute right-0 top-full mt-2 w-52 rounded-lg  z-50 overflow-hidden border py-2 animate-in fade-in zoom-in-95 duration-200 ${
                                                        isDarkMode ? 'bg-[#233138] border-[#2A3942]' : 'bg-white border-gray-200'
                                                    }`}
                                                >
                                                    {[
                                                        { label: 'Infos du contact', action: () => { setShowContactInfo(true); setIsMoreMenuOpen(false); } },
                                                        { label: 'Sélectionner des messages', action: () => {} },
                                                        { label: 'Fermer la discussion', action: () => setActiveContactId(null) },
                                                        { label: 'Silence', action: () => {} },
                                                        { label: 'Messages éphémères', action: () => {} },
                                                        { label: 'Fond d\'écran', action: () => {} },
                                                        { label: 'Plus', action: () => {} },
                                                    ].map((item, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => { item.action(); setIsMoreMenuOpen(false); }}
                                                            className={`w-full text-left px-6 py-3 text-[14px] font-medium transition-colors ${
                                                                isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#0F2D1E] hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Messages List Area (WhatsApp style Background) */}
                        <div className="flex-1 relative overflow-hidden flex flex-col" style={{ backgroundColor: isDarkMode ? '#0B141A' : '#EFEAE2' }}>
                            {/* --- OVERLAY: FILE PREVIEW --- */}
                            <AnimatePresence>
                                {showFilePreview && selectedFiles.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute inset-0 z-50 flex flex-col bg-[#0B141A] text-white"
                                    >
                                        {/* Header */}
                                        <div className="h-16 flex items-center justify-between px-6 bg-[#0B141A] shrink-0">
                                            <button 
                                                onClick={() => { setSelectedFiles([]); setShowFilePreview(false); setNewMessage(''); setCurrentFileIndex(0); }}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                            <div className="flex-1 px-4 truncate font-medium text-sm">
                                                {selectedFiles[currentFileIndex]?.name}
                                            </div>
                                            <div className="w-10" /> {/* Spacer */}
                                        </div>

                                        {/* Preview Area */}
                                        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
                                            {selectedFiles[currentFileIndex]?.type.startsWith('image/') ? (
                                                <div className="w-full max-w-2xl h-full flex items-center justify-center overflow-hidden rounded-lg">
                                                    <img 
                                                        src={URL.createObjectURL(selectedFiles[currentFileIndex])} 
                                                        className="max-w-full max-h-full object-contain " 
                                                        alt="preview"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-center space-y-6">
                                                    <div className="relative w-48 h-64 bg-[#1F2937] rounded-lg flex items-center justify-center  border border-white/5">
                                                        <FileText className="w-24 h-24 text-[#8696A0] opacity-40" />
                                                        <div className="absolute top-0 right-0 w-8 h-8 bg-black/20 rounded-bl-xl" />
                                                        <div className="absolute bottom-4 left-0 right-0 text-[10px] font-black uppercase tracking-[0.2em] text-[#8696A0]">
                                                            {selectedFiles[currentFileIndex]?.name.split('.').pop()}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-medium text-white/90">Aucun aperçu disponible</h3>
                                                        <p className="text-sm text-[#8696A0]">
                                                            {(selectedFiles[currentFileIndex]?.size / (1024 * 1024)).toFixed(1)} Mo - {selectedFiles[currentFileIndex]?.name.split('.').pop()?.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer: Input + Send + Thumbnails */}
                                        <div className="bg-[#111B21] p-4 pt-6 shrink-0 flex flex-col items-center gap-6">
                                            {/* Caption Input Bar */}
                                            <div className="w-full max-w-4xl flex items-center gap-4 relative">
                                                <AnimatePresence>
                                                    {showOverlayEmoji && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setShowOverlayEmoji(false)} />
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                                className={`absolute bottom-full left-0 mb-4 rounded-lg  z-50 overflow-hidden flex flex-col h-[420px] w-[320px] sm:w-[400px] border ${
                                                                    isDarkMode ? 'bg-[#111B21] border-[#2A3942]' : 'bg-white border-gray-200'
                                                                }`}
                                                            >
                                                                {/* Categories Tabs */}
                                                                <div className={`flex items-center justify-between px-4 py-1 border-b transition-colors ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                                                    <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
                                                                        {EMOJI_CATEGORIES.map((category, i) => {
                                                                            const Icon = category.icon;
                                                                            return (
                                                                                <button 
                                                                                    key={i} 
                                                                                    type="button" 
                                                                                    onClick={() => setActiveEmojiCategory(i)}
                                                                                    className={`p-2.5 relative group transition-colors flex-shrink-0 ${activeEmojiCategory === i ? 'text-[#00A884]' : 'text-[#8696A0] hover:text-[#00A884]'}`}
                                                                                >
                                                                                    <Icon className="w-[22px] h-[22px]" />
                                                                                    {activeEmojiCategory === i && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00A884] rounded-t-full" />}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* Search Bar */}
                                                                <div className="px-4 py-3">
                                                                    <div className="relative">
                                                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8696A0]" />
                                                                        <input 
                                                                            type="text" 
                                                                            placeholder="Rechercher un emoji"
                                                                            className={`w-full bg-[#202C33] rounded-full py-2.5 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-[#00A884]  ${
                                                                                isDarkMode ? 'text-[#E9EDEF] placeholder:text-[#8696A0]' : 'text-[#0F2D1E] placeholder:text-gray-400'
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Content Section */}
                                                                <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar text-white">
                                                                    <h3 className={`text-[14px] font-bold mb-4 px-1 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`}>{EMOJI_CATEGORIES[activeEmojiCategory].name}</h3>
                                                                    <div className="grid grid-cols-8 gap-y-4">
                                                                        {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map((emoji, i) => (
                                                                            <button 
                                                                                key={i} 
                                                                                type="button"
                                                                                onClick={() => setNewMessage(prev => prev + emoji)}
                                                                                className="text-[28px] hover:bg-black/10 p-1.5 rounded-lg transition-transform active:scale-125 flex items-center justify-center"
                                                                            >
                                                                                {emoji}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Bottom Switcher */}
                                                                <div className={`px-4 py-4 border-t flex justify-center transition-colors ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                                                    <div className={`flex items-center p-1 rounded-full ${isDarkMode ? 'bg-[#202C33]' : 'bg-gray-100'}`}>
                                                                        <button className={`px-7 py-1.5 rounded-full bg-[#3B4A54] text-white `}><Smile className="w-5 h-5" /></button>
                                                                        <button className="px-7 py-1.5 rounded-full text-[#8696A0] hover:text-[#E9EDEF]"><div className="w-5 h-5 flex items-center justify-center font-bold text-xs">GIF</div></button>
                                                                        <button className="px-7 py-1.5 rounded-full text-[#8696A0] hover:text-[#E9EDEF]"><Sticker className="w-5 h-5" /></button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>

                                                <div className="flex-1 bg-[#2A3942] rounded-lg flex items-center px-4 py-3 ">
                                                    <input 
                                                        autoFocus
                                                        type="text" 
                                                        placeholder="Entrez un message" 
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#E9EDEF] placeholder:text-[#8696A0]"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSendMessage(e);
                                                            }
                                                        }}
                                                    />
                                                    <button 
                                                        onClick={() => setShowOverlayEmoji(!showOverlayEmoji)}
                                                        className={`transition-colors p-1 ${showOverlayEmoji ? 'text-[#00A884]' : 'text-[#8696A0] hover:text-[#E9EDEF]'}`}
                                                    >
                                                        <Smile className="w-6 h-6" />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={handleSendMessage}
                                                    className="w-12 h-12 bg-[#00A884] hover:bg-[#00C298] text-[#111B21] rounded-full flex items-center justify-center   active:scale-95"
                                                >
                                                    <Send className="w-6 h-6" />
                                                </button>
                                            </div>

                                            {/* Thumbnails pellicule */}
                                            <div className="flex items-center gap-3 pb-2 overflow-x-auto max-w-full px-4 no-scrollbar">
                                                {selectedFiles.map((file, idx) => (
                                                    <div key={idx} className="relative group/thumb shrink-0">
                                                        <div 
                                                            onClick={() => setCurrentFileIndex(idx)}
                                                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer   ${currentFileIndex === idx ? 'border-[#00A884]' : 'border-[#2A3942] hover:border-[#8696A0]'}`}
                                                        >
                                                            {file.type.startsWith('image/') ? (
                                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-[#1F2937] flex flex-col items-center justify-center">
                                                                    <FileText className="w-6 h-6 text-white/40" />
                                                                    <span className="text-[8px] font-bold uppercase mt-1">{file.name.split('.').pop()?.substring(0, 3)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newFiles = selectedFiles.filter((_, i) => i !== idx);
                                                                setSelectedFiles(newFiles);
                                                                if (newFiles.length === 0) setShowFilePreview(false);
                                                                else if (currentFileIndex >= newFiles.length) setCurrentFileIndex(newFiles.length - 1);
                                                            }}
                                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#111B21] text-white rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity border border-white/20 "
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-14 h-14 rounded-lg border-2 border-dashed border-[#2A3942] hover:border-[#8696A0] flex items-center justify-center transition-colors flex-shrink-0 group"
                                                >
                                                    <Plus className="w-6 h-6 text-[#8696A0] group-hover:text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Fixed Pattern Overlay */}
                            <div 
                                className="absolute inset-0 z-0 opacity-[0.7] pointer-events-none"
                                style={{ 
                                    backgroundImage: `url('/assets/images/whatsapp-bg-dark.png')`,
                                    backgroundSize: '450px',
                                    backgroundRepeat: 'repeat',
                                    filter: isDarkMode ? 'invert(1) brightness(2) contrast(1.5)' : 'none'
                                }}
                            />
                            
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 z-10">
                                <div className="flex justify-center mb-6">
                                <span className={`px-6 py-2 rounded-lg text-[13px] font-medium  transition-colors ${
                                    isDarkMode ? 'bg-[#182229] text-[#8696A0]' : 'bg-white text-gray-500'
                                }`}>
                                    Aujourd'hui
                                </span>
                            </div>

                            <AnimatePresence initial={false}>
                                {activeContact.messages.map((msg, idx) => {
                                    const isMe = msg.senderId === 'me';
                                    
                                    // Check if previous message was from the same sender to group them
                                    const prevMsg = idx > 0 ? activeContact.messages[idx - 1] : null;
                                    const isGrouped = prevMsg?.senderId === msg.senderId;

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex items-center group w-full ${isMe ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-6'}`}
                                            onClick={() => isSelectionMode ? toggleMessageSelection(msg.id) : undefined}
                                        >
                                            {isSelectionMode && (
                                                <div className={`mr-4 flex-shrink-0 cursor-pointer ${isMe ? 'order-last ml-4 mr-0' : ''}`}>
                                                    <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                                                        selectedMessageIds.has(msg.id) 
                                                            ? (isDarkMode ? 'bg-[#00A884] border-[#00A884]' : 'bg-[#1B6B3A] border-[#1B6B3A]')
                                                            : (isDarkMode ? 'border-[#8696A0]' : 'border-gray-400')
                                                    }`}>
                                                        {selectedMessageIds.has(msg.id) && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Container for Avatar + Bubble + Quick Reaction */}
                                            <div className={`flex flex-row items-end group/msg w-full max-w-[85%] md:max-w-[75%] lg:max-w-[65%] ${isMe ? 'justify-end ml-auto' : 'justify-start mr-auto'} gap-2`}>
                                                
                                                {/* Avatar (Left) */}
                                                {!isMe && (
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden mb-1">
                                                        {activeContact.avatar ? (
                                                            <img src={activeContact.avatar} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-200'}`}>
                                                                <User className="w-5 h-5 text-[#8696A0]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Quick reaction icon for ME (Left) */}
                                                {isMe && (
                                                    <div className="flex items-center opacity-0 group-hover/msg:opacity-100 transition-opacity mb-2">
                                                        <button 
                                                            className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:bg-[#202C33] hover:text-[#E9EDEF]' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                                            onClick={(e) => { e.stopPropagation(); handleReactToMessage(msg.id, '😀'); }}
                                                        >
                                                            <Smile className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}

                                                <div 
                                                    className={`flex flex-col relative  max-w-full min-w-0 ${
                                                    msg.imageUrl 
                                                        ? 'p-1 rounded-[14px] w-[350px] max-w-full' 
                                                        : msg.fileData
                                                            ? 'rounded-[14px] w-[320px] max-w-full'
                                                            : 'px-4 py-2.5 rounded-[14px]'
                                                } ${
                                                    isMe 
                                                        ? (isDarkMode ? 'bg-[#005C4B] text-[#E9EDEF]' : 'bg-[#D9FDD3] text-[#111B21]') + (!isGrouped ? ' rounded-tr-none' : ' rounded-tr-[2px]')
                                                        : (isDarkMode ? 'bg-[#202C33] text-[#E9EDEF]' : 'bg-white text-[#111B21]') + (!isGrouped ? ' rounded-tl-none' : ' rounded-tl-[2px]')
                                                }`}
                                                    onContextMenu={(e) => handleContextMenu(e, msg.id)}
                                                >
                                                {/* WhatsApp Tail */}
                                                {!isGrouped && isMe && (
                                                    <span className={`absolute top-0 -right-[8px] ${isDarkMode ? 'text-[#005C4B]' : 'text-[#D9FDD3]'}`}>
                                                        <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                                                            <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.026 6.958 1 5.188 1z" />
                                                            <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.026 6.958 0 5.188 0z" />
                                                        </svg>
                                                    </span>
                                                )}
                                                {!isGrouped && !isMe && (
                                                    <span className={`absolute top-0 -left-[8px] ${isDarkMode ? 'text-[#202C33]' : 'text-white'}`}>
                                                        <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                                                            <path opacity=".13" fill="#0000000" d="M1.533 3.568 8 12.193V1H2.812C1.042 1 .474 2.026 1.533 3.568z"></path>
                                                            <path fill="currentColor" d="M1.533 2.568 8 11.193V0H2.812C1.042 0 .474 1.026 1.533 2.568z"></path>
                                                        </svg>
                                                    </span>
                                                )}
                                                {/* Dropdown for deletion (WhatsApp style) */}
                                                {!msg.isDeleted && (
                                                    <div className={`absolute top-1 right-1 transition-opacity z-20 ${openDeleteMenuId === msg.id ? 'opacity-100' : 'opacity-0 group-hover/msg:opacity-100'}`}>
                                                        <div className="relative">
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenDeleteMenuId(openDeleteMenuId === msg.id ? null : msg.id);
                                                                }}
                                                                className={`p-0.5 rounded-full transition-colors ${isMe ? 'hover:bg-black/10 text-black/40' : 'hover:bg-black/5 text-[#8696A0]'}`}
                                                            >
                                                                <ChevronDown className="w-5 h-5" />
                                                            </button>
                                                            
                                                            <AnimatePresence>
                                                                {openDeleteMenuId === msg.id && (
                                                                    <>
                                                                        <div className="fixed inset-0 z-40" onClick={() => setOpenDeleteMenuId(null)} />
                                                                        <motion.div 
                                                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                                            className="absolute right-0 top-full mt-1 w-48 rounded-lg  z-50 overflow-hidden border bg-[#233138] border-[#2A3942]"
                                                                        >
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => { handleDeleteMessage(msg.id, false); setOpenDeleteMenuId(null); }}
                                                                                className="w-full text-left px-4 py-2.5 text-sm text-[#E9EDEF] hover:bg-[#182229] transition-colors"
                                                                            >
                                                                                Supprimer pour moi
                                                                            </button>
                                                                            {isMe && (
                                                                                <button 
                                                                                    type="button"
                                                                                    onClick={() => { handleDeleteMessage(msg.id, true); setOpenDeleteMenuId(null); }}
                                                                                    className="w-full text-left px-4 py-2.5 text-sm text-[#E9EDEF] hover:bg-[#182229] transition-colors"
                                                                                >
                                                                                    Supprimer pour tous
                                                                                </button>
                                                                            )}
                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Sender Info for Group Chat Simulation */}
                                                {!isMe && !msg.isDeleted && (
                                                    <div className="flex items-center gap-2 mb-1 pr-8 truncate">
                                                        <span className={`text-[14.5px] font-bold ${isDarkMode ? 'text-[#53bdeb]' : 'text-[#027EB5]'} cursor-pointer hover:underline`}>
                                                            ~ {activeContact.name}
                                                        </span>
                                                        <span className="text-[12.5px] text-[#8696A0] opacity-80 truncate">
                                                            +224 629 19 52 03
                                                        </span>
                                                    </div>
                                                )}

                                                {msg.isDeleted ? (
                                                    <div className="flex items-center gap-2 py-1 pr-10 opacity-60 italic text-[13.5px]">
                                                        <Lock className="w-3.5 h-3.5" />
                                                        <span>{msg.text}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        {/* Reply Citation in Bubble */}
                                                        {msg.replyToId && (
                                                            <div 
                                                                onClick={() => {
                                                                    const element = document.getElementById(msg.replyToId!);
                                                                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                }}
                                                                className={`mb-2 p-2.5 rounded-lg border-l-4 text-[15px] cursor-pointer transition-colors ${
                                                                    isMe 
                                                                        ? (isDarkMode ? 'border-[#53bdeb] bg-black/20' : 'border-[#027EB5] bg-black/5') 
                                                                        : (isDarkMode ? 'border-[#53bdeb] bg-black/20' : 'border-[#027EB5] bg-black/5')
                                                                }`}
                                                            >
                                                                <div className={`font-bold mb-1 ${isMe ? (isDarkMode ? 'text-[#53bdeb]' : 'text-[#027EB5]') : (isDarkMode ? 'text-[#53bdeb]' : 'text-[#027EB5]')}`}>
                                                                    {activeContact.messages.find(m => m.id === msg.replyToId)?.senderId === 'me' ? 'Vous' : activeContact.name}
                                                                </div>
                                                                <div className={`truncate opacity-80 ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>
                                                                    {activeContact.messages.find(m => m.id === msg.replyToId)?.text}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {msg.fileData ? (
                                                    <div className="flex flex-col w-full h-full">
                                                        <div className={`m-1 p-2 pt-2.5 pb-2.5 flex items-start gap-3 relative rounded-lg ${isDarkMode ? 'bg-[#182229]' : 'bg-black/5'}`}>
                                                            {(() => {
                                                                const ext = (msg.fileData!.name.split('.').pop() || '').toLowerCase();
                                                                let bgColor = '#7F8C8D';
                                                                if (['pdf'].includes(ext)) bgColor = '#F40F02';
                                                                else if (['doc', 'docx'].includes(ext)) bgColor = '#4285F4';
                                                                else if (['xls', 'xlsx'].includes(ext)) bgColor = '#0F9D58';
                                                                else if (['ppt', 'pptx'].includes(ext)) bgColor = '#DB4437';
                                                                
                                                                return (
                                                                    <div className="relative w-[44px] h-[52px] rounded flex-shrink-0 flex flex-col items-center justify-center " style={{ backgroundColor: bgColor }}>
                                                                        <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-black/20 rounded-bl-sm" />
                                                                        <span className="text-white font-bold text-[11px] mt-2 uppercase tracking-wide">{ext.substring(0, 4) || 'FILE'}</span>
                                                                    </div>
                                                                );
                                                            })()}
                                                            <div className="flex-1 min-w-0 pr-2 pt-0.5">
                                                                <div className={`text-[16px] leading-[22px] font-medium antialiased truncate mb-0.5 ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>{msg.fileData.name}</div>
                                                                <div className={`text-[13px] ${isDarkMode ? 'text-[#E9EDEF]/60' : 'text-[#111B21]/60'}`}>
                                                                    {(msg.fileData.type || '').includes('pdf') ? `${msg.fileData.pages || 4} pages • ` : ''}
                                                                    {(msg.fileData.name.split('.').pop() || '').toUpperCase()} • {msg.fileData.size}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {msg.text && (
                                                            <div className="px-2.5 pt-1 pb-1 relative">
                                                                <p className="text-[16px] leading-[22px] font-medium antialiased tracking-[-0.01em] whitespace-pre-wrap break-words [word-break:break-word]">
                                                                    {msg.text}
                                                                </p>
                                                                {/* Inline timestamp for file+caption messages */}
                                                                <span className="inline-flex items-center gap-1 float-right mt-0.5 mb-0.5 ml-1">
                                                                    {msg.isStarred && <Star className={`w-[11px] h-[11px] fill-current ${isMe ? 'text-black/30' : 'text-[#8696A0]'}`} />}
                                                                    <span className={`text-[12.5px] font-medium antialiased tracking-tight ${isMe ? (isDarkMode ? 'text-[#E9EDEF]/60' : 'text-[#111B21]/50') : 'text-[#8696A0]'}`}>{msg.time}</span>
                                                                    {isMe && (
                                                                        <span className={msg.status === 'read' ? (isDarkMode ? 'text-[#53bdeb]' : 'text-[#34B7F1]') : (isDarkMode ? 'text-[#E9EDEF]/60' : 'text-[#111B21]/40')}>
                                                                            {msg.status === 'sent' && <Check className="w-[16px] h-[16px]" />}
                                                                            {msg.status === 'delivered' && <CheckCheck className="w-[16px] h-[16px]" />}
                                                                            {msg.status === 'read' && <CheckCheck className="w-[16px] h-[16px]" />}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Bottom spacing for timestamp if no text */}
                                                        {!msg.text && <div className="h-[20px]" />}
                                                        
                                                        {/* Action Buttons: Ouvrir | Enregistrer sous... */}
                                                        <div className={`border-t mt-0.5 flex items-stretch divide-x rounded-b-[14px] overflow-hidden ${isDarkMode ? 'border-white/5 divide-white/5' : 'border-black/5 divide-black/5'}`}>
                                                            <button 
                                                                onClick={() => {
                                                                    const url = msg.fileData.url;
                                                                    const name = msg.fileData.name;
                                                                    if (url) {
                                                                        setPdfViewer({ url, name });
                                                                    } else {
                                                                        window.open('#', '_blank');
                                                                    }
                                                                }}
                                                                className={`flex-1 py-2.5 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/5`}
                                                            >
                                                                <span className={`text-[14px] font-medium ${isDarkMode ? 'text-[#00A884]' : 'text-[#1B6B3A]'}`}>Ouvrir</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    if (msg.fileData.url) {
                                                                        const link = document.createElement('a');
                                                                        link.href = msg.fileData.url;
                                                                        link.download = msg.fileData.name || 'document';
                                                                        document.body.appendChild(link);
                                                                        link.click();
                                                                        document.body.removeChild(link);
                                                                    }
                                                                }}
                                                                className={`flex-1 py-2.5 flex items-center justify-center cursor-pointer transition-colors hover:bg-black/5`}
                                                            >
                                                                <span className={`text-[14px] font-medium ${isDarkMode ? 'text-[#00A884]' : 'text-[#1B6B3A]'}`}>Enregistrer sous...</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : msg.imageUrl ? (
                                                    <div className="flex flex-col">
                                                        <div className="rounded-[10px] overflow-hidden flex items-center justify-center min-h-[150px] bg-black/5">
                                                            <img 
                                                                src={msg.imageUrl} 
                                                                className="w-full h-auto max-h-[400px] object-cover cursor-pointer hover:opacity-95 transition-opacity" 
                                                            />
                                                        </div>
                                                        {msg.text && (
                                                            <div className="px-1.5 pt-2 pb-1 relative">
                                                                <span className="text-[16px] leading-[22px] font-medium antialiased tracking-[-0.01em] whitespace-pre-wrap break-words [word-break:break-word]">
                                                                    {msg.text}
                                                                </span>
                                                                <span className="inline-block w-[50px] h-[15px]"></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : msg.text.startsWith('🎤') ? (
                                                    <div className="flex items-center gap-3 py-1 pr-14">
                                                        <div className="relative">
                                                            <button 
                                                                onClick={() => handlePlayVoice(msg)}
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 ${isMe ? 'text-[#111B21] hover:bg-black/10' : (isDarkMode ? 'text-[#8696A0] hover:text-[#00A884]' : 'text-[#8696A0] hover:text-[#00A884]')}`}
                                                            >
                                                                {(playingMessageId === msg.id && !isPlaybackPaused) ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            {/* Waveform simulator */}
                                                            <div className="flex items-end gap-[2px] h-6 mb-1">
                                                                {[10, 15, 8, 20, 12, 18, 6, 14, 10, 16, 8, 12, 10, 14, 6, 18, 10, 8, 12, 16, 10, 14, 6, 20, 10, 12, 8, 16, 10, 14].map((h, i) => (
                                                                    <div 
                                                                        key={i} 
                                                                        className={`w-[2px] rounded-full  duration-300 ${
                                                                            playingMessageId === msg.id && i < playbackProgress ? (isMe ? (isDarkMode ? 'bg-[#53bdeb]' : 'bg-[#027EB5]') : 'bg-[#00A884]') : (isMe ? 'bg-black/30' : 'bg-[#8696A0]/40')
                                                                        }`} 
                                                                        style={{ height: `${h}px` }} 
                                                                    />
                                                                ))}
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className={`text-[11px] ${isMe ? 'text-[#111B21]/70' : 'text-[#8696A0]'}`}>
                                                                    {playingMessageId === msg.id 
                                                                        ? formatTime(Math.floor(audioRef.current?.currentTime || 0)) 
                                                                        : (msg.text.split('(')[1]?.split(')')[0] || '0:05')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <span className="text-[16px] leading-[22px] font-medium antialiased tracking-[-0.01em] whitespace-pre-wrap break-words [word-break:break-word]">
                                                            {msg.text}
                                                        </span>
                                                        {/* Invisible spacer to push time float to bottom right */}
                                                        <span className="inline-block w-[60px] h-[15px]"></span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                            
                                            {/* Absolute timestamp — hidden when file+text renders inline timestamp */}
                                            {!((msg as any).fileData && msg.text) && (
                                            <div className={`absolute right-1.5 flex items-center gap-1 z-10 bg-gradient-to-l from-transparent via-transparent to-transparent ${(msg as any).fileData ? 'bottom-[45px]' : 'bottom-1'}`}>
                                                {msg.isStarred && (
                                                    <Star className={`w-[11px] h-[11px] fill-current ${isMe ? 'text-black/30' : 'text-[#8696A0]'}`} />
                                                )}
                                                <span className={`text-[12.5px] font-medium antialiased tracking-tight ${isMe ? (isDarkMode ? 'text-[#E9EDEF]/60' : 'text-[#111B21]/50') : 'text-[#8696A0]'}`}>
                                                    {msg.time}
                                                </span>
                                                {isMe && (
                                                    <span className={msg.status === 'read' ? (isDarkMode ? 'text-[#53bdeb]' : 'text-[#34B7F1]') : (isDarkMode ? 'text-[#E9EDEF]/60' : 'text-[#111B21]/40')}>
                                                        {msg.status === 'sent' && <Check className="w-[16px] h-[16px]" />}
                                                        {msg.status === 'delivered' && <CheckCheck className="w-[16px] h-[16px]" />}
                                                        {msg.status === 'read' && <CheckCheck className="w-[16px] h-[16px]" />}
                                                    </span>
                                                )}
                                            </div>
                                            )}

                                            {/* Reaction Badge */}
                                            <AnimatePresence>
                                                {msg.reaction && (
                                                    <motion.div 
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} z-30 px-1.5 py-0.5 rounded-full border  flex items-center gap-1 transition-colors ${
                                                            isDarkMode ? 'bg-[#202C33] border-[#2A3942]' : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <span className="text-[13px] leading-none">{msg.reaction}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Quick reaction icon for THEM (Right) */}
                                        {!isMe && (
                                            <div className="flex items-center opacity-0 group-hover/msg:opacity-100 transition-opacity mb-2">
                                                <button 
                                                    className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:bg-[#202C33] hover:text-[#E9EDEF]' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                                    onClick={(e) => { e.stopPropagation(); handleReactToMessage(msg.id, '😀'); }}
                                                >
                                                    <Smile className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                            <div ref={messagesEndRef} />
                            </div>


                        {/* Message Input Area — WhatsApp pill */}
                        <div className="relative">
                            {/* Reply Preview Bar */}
                            <AnimatePresence>
                                {replyingTo && (
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        className={`absolute bottom-full left-0 right-0 p-3 rounded-t-xl flex items-center gap-3 border-x border-t transition-colors z-10 ${
                                            isDarkMode ? 'bg-[#202C33] border-[#2A3942]' : 'bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <div className="w-1.5 h-10 bg-[#00A884] rounded-full flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-[#00A884] mb-1">
                                                {replyingTo.senderId === 'me' ? 'Vous' : activeContact.name}
                                            </div>
                                            <div className={`text-sm truncate ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`}>
                                                {replyingTo.text}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setReplyingTo(null)}
                                            className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-400'}`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {isSelectionMode ? (
                                <motion.div 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    className={`px-4 py-4 flex items-center justify-between border-t transition-colors relative z-20 ${
                                        isDarkMode ? 'bg-[#202C33] border-[#2A3942]' : 'bg-[#F0F2F5] border-gray-200'
                                    }`}
                                >
                                    <button onClick={() => { setIsSelectionMode(false); setSelectedMessageIds(new Set()); }} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                                        <X className={`w-6 h-6 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`} />
                                    </button>
                                    <div className={`text-[15px] font-bold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#0F2D1E]'}`}>{selectedMessageIds.size} sélectionné(s)</div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => { setForwardMessageId('multiple'); setIsSelectionMode(false); }} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-gray-700'}`}>
                                            <Forward className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => { 
                                            selectedMessageIds.forEach(id => handleDeleteMessage(id, false));
                                            setIsSelectionMode(false);
                                            setSelectedMessageIds(new Set());
                                        }} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-gray-700'}`}>
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                            <form
                                onSubmit={handleSendMessage}
                                className="px-4 pb-6 pt-3 flex items-center gap-4 flex-shrink-0 bg-transparent relative z-20"
                            >
                            {/* Floating pill container */}
                            <div className={`flex-1 flex items-center gap-3 rounded-full px-4 py-2.5 min-h-[52px]  ${
                                isDarkMode ? 'bg-[#202C33]' : 'bg-white'
                            }`}>
                                {/* Plus button & Attachment Menu */}
                                <div className="relative flex-shrink-0">
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsAttachmentMenuOpen(!isAttachmentMenuOpen); setIsInputEmojiOpen(false); }}
                                        className={`transition-colors p-1.5 rounded-full ${isDarkMode ? (isAttachmentMenuOpen ? 'text-[#00A884] bg-[#3B4A54]' : 'text-[#8696A0] hover:text-[#00A884]') : (isAttachmentMenuOpen ? 'text-[#1B6B3A] bg-gray-100' : 'text-gray-400 hover:text-[#1B6B3A]')}`}
                                    >
                                        <Plus className={`w-[26px] h-[26px] transition-transform duration-200 ${isAttachmentMenuOpen ? 'rotate-45' : ''}`} />
                                    </button>

                                    <button 
                                        type="button" 
                                        onClick={() => { setIsInputEmojiOpen(!isInputEmojiOpen); setIsAttachmentMenuOpen(false); }}
                                        className={`transition-colors p-2 rounded-full ${isDarkMode ? (isInputEmojiOpen ? 'text-[#00A884]' : 'text-[#8696A0] hover:text-[#00A884]') : (isInputEmojiOpen ? 'text-[#1B6B3A]' : 'text-gray-400 hover:text-[#1B6B3A]')}`}
                                    >
                                        <Smile className="w-[26px] h-[26px]" />
                                    </button>

                                    <AnimatePresence>
                                        {isInputEmojiOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsInputEmojiOpen(false)} />
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    className={`absolute bottom-full left-0 mb-4 rounded-lg  z-50 overflow-hidden flex flex-col h-[420px] w-[320px] sm:w-[400px] border ${
                                                        isDarkMode ? 'bg-[#111B21] border-[#2A3942]' : 'bg-white border-gray-200'
                                                    }`}
                                                >
                                                    {/* Categories Tabs */}
                                                    {activePickerTab === 'emoji' && (
                                                        <div className={`flex items-center justify-between px-4 py-1 border-b transition-colors ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                                            <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
                                                                {EMOJI_CATEGORIES.map((category, i) => {
                                                                    const Icon = category.icon;
                                                                    return (
                                                                        <button 
                                                                            key={i} 
                                                                            type="button" 
                                                                            onClick={() => setActiveEmojiCategory(i)}
                                                                            className={`p-2.5 relative group transition-colors flex-shrink-0 ${activeEmojiCategory === i ? 'text-[#00A884]' : 'text-[#8696A0] hover:text-[#00A884]'}`}
                                                                        >
                                                                            <Icon className="w-[22px] h-[22px]" />
                                                                            {activeEmojiCategory === i && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00A884] rounded-t-full" />}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Search Bar */}
                                                    <div className="px-4 py-3">
                                                        <div className="relative">
                                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8696A0]" />
                                                            <input 
                                                                type="text" 
                                                                placeholder={`Rechercher un ${activePickerTab === 'emoji' ? 'emoji' : activePickerTab}`}
                                                                className={`w-full bg-[#202C33] rounded-full py-2.5 pl-11 pr-4 text-sm outline-none border border-transparent focus:border-[#00A884]  ${
                                                                    isDarkMode ? 'text-[#E9EDEF] placeholder:text-[#8696A0]' : 'text-[#0F2D1E] placeholder:text-gray-400'
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                                                        {activePickerTab === 'emoji' ? (
                                                            <>
                                                                <h3 className={`text-[14px] font-bold mb-4 px-1 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`}>{EMOJI_CATEGORIES[activeEmojiCategory].name}</h3>
                                                                <div className="grid grid-cols-8 gap-y-4">
                                                                    {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map((emoji, i) => (
                                                                        <button 
                                                                            key={i} 
                                                                            type="button"
                                                                            onClick={() => setNewMessage(prev => prev + emoji)}
                                                                            className="text-[28px] hover:bg-black/10 p-1.5 rounded-lg transition-transform active:scale-125 flex items-center justify-center"
                                                                        >
                                                                            {emoji}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        ) : activePickerTab === 'gif' ? (
                                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                                <Smile className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-[#3B4A54]' : 'text-gray-200'}`} />
                                                                <p className={`font-medium ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-400'}`}>Recherche de GIFs via Giphy (à venir)</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                                <Sticker className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-[#3B4A54]' : 'text-gray-200'}`} />
                                                                <p className={`font-medium ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-400'}`}>Vos stickers apparaîtront ici</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Bottom Switcher */}
                                                    <div className={`px-4 py-4 border-t flex justify-center transition-colors ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                                        <div className={`flex items-center p-1 rounded-full ${isDarkMode ? 'bg-[#202C33]' : 'bg-gray-100'}`}>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setActivePickerTab('emoji')}
                                                                className={`px-7 py-1.5 rounded-full flex items-center justify-center transition-colors ${activePickerTab === 'emoji' ? (isDarkMode ? 'bg-[#3B4A54] text-white ' : 'bg-white text-[#0F2D1E] ') : (isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-[#0F2D1E]')}`}
                                                            >
                                                                <Smile className="w-5 h-5" />
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setActivePickerTab('gif')}
                                                                className={`px-7 py-1.5 rounded-full flex items-center justify-center transition-colors font-bold text-sm ${activePickerTab === 'gif' ? (isDarkMode ? 'bg-[#3B4A54] text-white ' : 'bg-white text-[#0F2D1E] ') : (isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-[#0F2D1E]')}`}
                                                            >
                                                                GIF
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setActivePickerTab('sticker')}
                                                                className={`px-7 py-1.5 rounded-full flex items-center justify-center transition-colors ${activePickerTab === 'sticker' ? (isDarkMode ? 'bg-[#3B4A54] text-white ' : 'bg-white text-[#0F2D1E] ') : (isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-[#0F2D1E]')}`}
                                                            >
                                                                <Sticker className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {isAttachmentMenuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setIsAttachmentMenuOpen(false)} />
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    className={`absolute bottom-full left-0 mb-4 w-64 rounded-lg  z-50 overflow-hidden border py-1.5 ${
                                                        isDarkMode ? 'bg-[#233138] border-[#2A3942]' : 'bg-white border-gray-200'
                                                    }`}
                                                >
                                                    {[
                                                        { icon: FileText, label: 'Document', color: '#7F66FF', type: 'document', accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt' },
                                                        { icon: Image, label: 'Photos et vidéos', color: '#009DE2', type: 'gallery', accept: 'image/*,video/*' },
                                                        { icon: Camera, label: 'Caméra', color: '#D3396D', type: 'camera' },
                                                        { icon: Headphones, label: 'Audio', color: '#FF7E1F', type: 'audio', accept: 'audio/*' },
                                                        { icon: UserCircle, label: 'Contact', color: '#009DE2', type: 'contact' },
                                                        { icon: BarChart2, label: 'Sondage', color: '#FFBC38', type: 'poll' },
                                                        { icon: Calendar, label: 'Événement', color: '#D3396D', type: 'event' },
                                                        { icon: Smile, label: 'Nouveau sticker', color: '#02796e', type: 'sticker' },
                                                    ].map((item, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className={`flex items-center gap-4 w-full px-4 py-3 transition-colors ${
                                                                isDarkMode ? 'hover:bg-[#182229] text-[#E9EDEF]' : 'hover:bg-gray-50 text-[#0F2D1E]'
                                                            }`}
                                                            onClick={() => {
                                                                setIsAttachmentMenuOpen(false);
                                                                if (item.type === 'camera') {
                                                                    startCamera();
                                                                } else if (item.type === 'poll' || item.type === 'contact' || item.type === 'event' || item.type === 'sticker') {
                                                                    setActiveAttachmentType(item.type);
                                                                    setToastMessage(`Fonctionnalité ${item.label} bientôt disponible`);
                                                                    setTimeout(() => setToastMessage(null), 2000);
                                                                } else {
                                                                    if (fileInputRef.current) {
                                                                        fileInputRef.current.accept = (item as any).accept || '*/*';
                                                                        fileInputRef.current.click();
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                                                <item.icon className="w-6 h-6" style={{ color: item.color }} />
                                                            </div>
                                                            <span className="font-medium text-[15px]">{item.label}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Text input area or Recording UI */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    {isRecording ? (
                                        <div className="flex items-center justify-between w-full h-10 px-2 animate-in slide-in-from-right duration-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                                                <span className={`font-bold text-sm ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#0F2D1E]'}`}>
                                                    {formatTime(recordingTime)}
                                                </span>
                                            </div>
                                            <div className={`flex-1 mx-4 h-1 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`}>
                                                <motion.div 
                                                    className="h-full bg-red-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min((recordingTime / 60) * 100, 100)}%` }}
                                                    transition={{ duration: 1, ease: "linear" }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Old small preview removed as it's replaced by the full-screen overlay */}
                                            <input
                                                type="text"
                                                placeholder={selectedFiles.length > 0 ? "Ajouter une légende..." : "Entrez un message"}
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className={`w-full bg-transparent outline-none text-[16px] font-medium antialiased tracking-[-0.01em] transition-colors ${
                                                    isDarkMode ? 'text-[#E9EDEF] placeholder:text-[#8696A0]' : 'text-[#0F2D1E] placeholder:text-gray-400'
                                                }`}
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Actions: Send, Mic, or Cancel Recording */}
                                {isRecording ? (
                                    <div className="flex items-center gap-4">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                if (recorderRef.current) {
                                                    wasDiscardedRef.current = true;
                                                    recorderRef.current.stop();
                                                    recorderRef.current.stream.getTracks().forEach(t => t.stop());
                                                }
                                                setIsRecording(false);
                                                setIsRecordingPaused(false);
                                                setRecordingTime(0);
                                            }}
                                            className={`transition-colors p-1 ${isDarkMode ? 'text-[#8696A0] hover:text-[#F15C6D]' : 'text-gray-400 hover:text-red-500'}`}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        
                                        <button 
                                            type="button" 
                                            onClick={isRecordingPaused ? handleResumeRecording : handlePauseRecording}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center  ${
                                                isRecordingPaused 
                                                    ? 'bg-red-500 text-white animate-pulse' 
                                                    : (isDarkMode ? 'bg-[#202C33] text-[#00A884]' : 'bg-emerald-50 text-[#1B6B3A]')
                                            }`}
                                        >
                                            {isRecordingPaused ? <Play className="w-5 h-5 fill-current ml-0.5" /> : <Pause className="w-5 h-5 fill-current" />}
                                        </button>

                                        <button 
                                            type="button" 
                                            onClick={stopRealRecording}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-[#00A884] text-[#111B21]' : 'bg-[#1B6B3A] text-white'}`}
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {(newMessage.trim() || selectedFiles.length > 0) ? (
                                            <button type="submit" className={`transition-colors flex-shrink-0 ${isDarkMode ? 'text-[#00A884] hover:text-[#00C298]' : 'text-[#1B6B3A] hover:text-[#0F2D1E]'}`}>
                                                <Send className="w-[24px] h-[24px]" />
                                            </button>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={() => { startRealRecording(); setIsAttachmentMenuOpen(false); setIsInputEmojiOpen(false); }}
                                                className={`transition-colors flex-shrink-0 ${isDarkMode ? 'text-[#8696A0] hover:text-[#00A884]' : 'text-gray-400 hover:text-[#1B6B3A]'}`}
                                            >
                                                <Mic className="w-[24px] h-[24px]" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </form>
                        )}
                    </div>
                </div>

                        <input 
                            type="file" 
                            multiple
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const newFiles = Array.from(e.target.files);
                                    setSelectedFiles(prev => [...prev, ...newFiles]);
                                    setShowFilePreview(true);
                                }
                            }} 
                        />
                    </>
                ) : (
                    <div className={`flex-1 flex flex-col items-center justify-center space-y-4 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-400'}`}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#202C33]' : 'bg-gray-100'}`}>
                            <Send className={`w-10 h-10 ml-1 ${isDarkMode ? 'text-[#2A3942]' : 'text-gray-300'}`} />
                        </div>
                        <p className="text-sm font-bold tracking-wide">Sélectionnez une conversation pour commencer</p>
                    </div>
                )}

                {/* --- OVERLAY: CONTACT INFO --- */}
                <AnimatePresence>
                {showContactInfo && activeContact && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`absolute inset-0 z-[100] flex flex-col  transition-colors ${
                            isDarkMode ? 'bg-[#0B141A]' : 'bg-[#F0F2F5]'
                        }`}
                    >
                        <div className={`h-[60px] flex items-center px-6 transition-colors ${
                            isDarkMode ? 'bg-[#111B21]' : 'bg-white'
                        }`}>
                            <div className="flex items-center gap-6 flex-1">
                                <button 
                                    onClick={() => setShowContactInfo(false)}
                                    className={`transition-colors ${isDarkMode ? 'text-[#aebac1] hover:text-[#E9EDEF]' : 'text-[#54656F] hover:text-[#0F2D1E]'}`}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className={`text-[16px] font-medium transition-colors ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>Infos du contact</h2>
                            </div>
                            <button className={`transition-colors ${isDarkMode ? 'text-[#aebac1] hover:text-[#E9EDEF]' : 'text-[#54656F] hover:text-[#0F2D1E]'}`}>
                                <Pencil className="w-5 h-5" />
                            </button>
                        </div>

                        <div className={`flex-1 overflow-y-auto transition-colors ${isDarkMode ? 'bg-[#0B141A]' : 'bg-[#F0F2F5]'}`}>
                            <div className={`py-8 px-6 flex flex-col items-center text-center  mb-2 transition-colors ${
                                isDarkMode ? 'bg-[#111B21]' : 'bg-white'
                            }`}>
                                <div className={`w-[200px] h-[200px] rounded-full overflow-hidden mb-5  ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`}>
                                    {activeContact.avatar ? (
                                        <img src={activeContact.avatar} alt="profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className={`w-32 h-32 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-300'}`} />
                                        </div>
                                    )}
                                </div>
                                <h3 className={`text-[24px] font-normal mb-1 transition-colors tracking-wide ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>{activeContact.name}</h3>
                                <p className="text-[16px] text-[#8696A0] mb-6">+224 629 26 00 73</p>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-3 w-full max-w-[340px]">
                                    <button className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-[#111B21] border-[#2A3942] hover:bg-[#202C33]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                        <Search className={`w-[26px] h-[26px] ${isDarkMode ? 'text-[#00A884]' : 'text-[#1B6B3A]'}`} />
                                        <span className={`text-[13px] font-medium ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>Rechercher</span>
                                    </button>
                                    <button className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-[#111B21] border-[#2A3942] hover:bg-[#202C33]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                        <Video className={`w-[26px] h-[26px] ${isDarkMode ? 'text-[#00A884]' : 'text-[#1B6B3A]'}`} />
                                        <span className={`text-[13px] font-medium ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>Vidéo</span>
                                    </button>
                                    <button className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-[#111B21] border-[#2A3942] hover:bg-[#202C33]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                        <Phone className={`w-[26px] h-[26px] ${isDarkMode ? 'text-[#00A884]' : 'text-[#1B6B3A]'}`} />
                                        <span className={`text-[13px] font-medium ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>Vocal</span>
                                    </button>
                                </div>
                            </div>

                            <div className={`px-8 py-5  mb-2 transition-colors ${isDarkMode ? 'bg-[#111B21]' : 'bg-white'}`}>
                                <h4 className={`text-[14px] font-medium mb-1 ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F]'}`}>Infos</h4>
                                <p className={`text-[16px] font-normal transition-colors ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>Informatique ma passion</p>
                            </div>

                            <div className={`p-8  mb-2 transition-colors ${isDarkMode ? 'bg-[#111B21]' : 'bg-white'}`}>
                                <div className="flex items-center justify-between mb-6 cursor-pointer group">
                                    <div className="flex items-center gap-5">
                                        <Image className={`w-[22px] h-[22px] ${isDarkMode ? 'text-[#aebac1]' : 'text-[#54656F]'}`} />
                                        <h4 className={`text-[16px] font-medium transition-colors ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#111B21]'}`}>Médias, liens et documents</h4>
                                    </div>
                                    <span className={`text-[14px] font-normal flex items-center gap-1 ${isDarkMode ? 'text-[#8696A0]' : 'text-[#54656F]'}`}>
                                        15 <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {activeContact.messages
                                        .filter(m => (m as any).imageUrl)
                                        .slice(-3)
                                        .map((msg, i) => (
                                            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-black/10 border border-white/5">
                                                <img src={(msg as any).imageUrl} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                            </div>
                                        ))}
                                    {activeContact.messages.filter(m => (m as any).imageUrl).length === 0 && (
                                        [1, 2, 3].map(i => (
                                            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`}>
                                                <Image className={`w-6 h-6 opacity-20 ${isDarkMode ? 'text-white' : 'text-gray-400'}`} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className={`p-6  mb-2 space-y-4 transition-colors ${isDarkMode ? 'bg-[#111B21]' : 'bg-white'}`}>
                                <div className={`flex items-center gap-4 p-2 rounded-lg transition-colors cursor-pointer group ${isDarkMode ? 'text-[#E9EDEF] hover:bg-[#202C33]' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Bell className="w-5 h-5 text-[#8696A0]" />
                                    <span className="font-semibold text-sm">Silence</span>
                                </div>
                                <div className={`flex items-center gap-4 p-2 rounded-lg transition-colors cursor-pointer group ${isDarkMode ? 'text-[#E9EDEF] hover:bg-[#202C33]' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Calendar className="w-5 h-5 text-[#8696A0]" />
                                    <span className="font-semibold text-sm">Messages éphémères</span>
                                </div>
                                <div className={`flex items-center gap-4 p-2 rounded-lg transition-colors cursor-pointer group ${isDarkMode ? 'text-[#E9EDEF] hover:bg-[#202C33]' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Lock className="w-5 h-5 text-[#8696A0]" />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">Chiffrement</span>
                                        <span className="text-[10px] text-[#8696A0]">Les messages sont chiffrés. Cliquez pour vérifier.</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-6  mb-8 space-y-4 transition-colors ${isDarkMode ? 'bg-[#111B21]' : 'bg-white'}`}>
                                <button className={`w-full flex items-center gap-4 p-2 rounded-lg transition-colors font-bold text-sm ${isDarkMode ? 'text-[#F15C6D] hover:bg-[#202C33]' : 'text-red-500 hover:bg-red-50'}`}>
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                    Bloquer {activeContact.name.split(' ')[0]}
                                </button>
                                <button className={`w-full flex items-center gap-4 p-2 rounded-lg transition-colors font-bold text-sm ${isDarkMode ? 'text-[#F15C6D] hover:bg-[#202C33]' : 'text-red-500 hover:bg-red-50'}`}>
                                    <Trash2 className="w-5 h-5" />
                                    Signaler {activeContact.name.split(' ')[0]}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            {/* --- CALLING OVERLAY --- */}
            {isCalling && activeContact && (
                <div className="fixed inset-0 z-50 bg-[#111B21] flex flex-col justify-between animate-in fade-in duration-300 overflow-hidden font-segoe">
                    
                    {/* No blurred background — clean dark screen like WhatsApp */}


                    {/* TOP BAR */}
                    <div className="relative z-10 flex items-center justify-center p-6 w-full">
                        <div className="absolute left-6 hidden md:flex items-center gap-2">
                            <div className="w-[22px] h-[22px] bg-[#25D366] rounded-full flex items-center justify-center  shadow-[#25D366]/20">
                                <Phone className="w-[11px] h-[11px] text-white fill-current" />
                            </div>
                            <span className="text-white text-[14px] font-bold tracking-wide">GuinéeLearn</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8696A0]">
                            <Lock className="w-3 h-3" />
                            <span className="text-[12px] font-medium">Chiffré de bout en bout</span>
                        </div>
                    </div>

                    {/* CENTER AVATAR + VIDEO */}
                    <div className="relative z-10 flex flex-col items-center flex-1 justify-start pt-12">
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mb-4 bg-[#2A3942] flex items-center justify-center ">
                            {activeContact.avatar ? (
                                <img src={activeContact.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-white/50" />
                            )}
                        </div>
                        <h2 className="text-white text-[24px] font-normal tracking-wide mb-1">{activeContact.name}</h2>
                        <p className="text-[#8696A0] text-[14px] mb-6">
                            {callType === 'audio' ? 'Appel vocal en cours...' : 'Appel vidéo en cours...'}
                        </p>

                        {/* Local video: large centered rectangle, like WhatsApp */}
                        {callType === 'video' && (
                            <div className="w-[300px] md:w-[400px] aspect-video bg-[#111] rounded-lg overflow-hidden border border-gray-700 ">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                            </div>
                        )}
                    </div>

                    {/* BOTTOM CONTROLS — WhatsApp Desktop exact replica */}
                    <div className="relative z-30 w-full px-5 h-[56px] flex items-center justify-between bg-[#111B21] border-t border-[#1e2a30]">
                        
                        {/* Left: Compact pill toggles */}
                        <div className="flex items-center gap-2">
                            {/* Camera pill */}
                            <button 
                                onClick={toggleVideo}
                                title={callType === 'audio' ? "Passer à l'appel vidéo" : (isVideoOn ? 'Désactiver la caméra' : 'Activer la caméra')}
                                className={`h-8 pl-2.5 pr-2 rounded-full flex items-center gap-1 
                                    ${callType === 'audio'
                                        ? 'bg-[#2A3942] text-white hover:bg-[#3B4A54]'
                                        : !isVideoOn
                                            ? 'bg-[#e4e6eb] text-[#111B21]'
                                            : 'bg-[#2A3942] text-white'
                                    }`}
                            >
                                {callType === 'audio' ? (
                                    <Video className="w-[17px] h-[17px]" />
                                ) : (
                                    !isVideoOn 
                                        ? <VideoOff className="w-[17px] h-[17px]" /> 
                                        : <Video className="w-[17px] h-[17px]" />
                                )}
                                <ChevronDown className="w-3 h-3 opacity-60" />
                            </button>

                            {/* Mic pill */}
                            <button 
                                onClick={toggleMute}
                                className={`h-8 pl-2.5 pr-2 rounded-full flex items-center gap-1 
                                    ${isMuted ? 'bg-[#e4e6eb] text-[#111B21]' : 'bg-[#2A3942] text-white hover:bg-[#3B4A54]'}`}
                            >
                                {isMuted ? <MicOff className="w-[17px] h-[17px]" /> : <Mic className="w-[17px] h-[17px]" />}
                                <ChevronDown className="w-3 h-3 opacity-60" />
                            </button>
                        </div>

                        {/* Center: Quick action icons */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Emoji reactions */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowEmojiPanel(p => !p); setShowAddPanel(false); setShowChatPanel(false); }}
                                    className={`transition-colors ${showEmojiPanel ? 'text-white' : 'text-[#8696A0] hover:text-white'}`}
                                    title="Réactions"
                                >
                                    <Smile className="w-[20px] h-[20px]" />
                                </button>
                                {showEmojiPanel && (
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#1F2C34] border border-[#2A3942] rounded-lg p-3 flex gap-3  z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        {['👍','❤️','😂','😮','😢','🙏'].map(e => (
                                            <button key={e} onClick={() => sendReaction(e)}
                                                className="text-2xl hover:scale-125 transition-transform"
                                            >{e}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Raise hand */}
                            <button
                                onClick={toggleHandRaise}
                                className={`transition-colors ${isHandRaised ? 'text-[#25D366]' : 'text-[#8696A0] hover:text-white'}`}
                                title={isHandRaised ? 'Baisser la main' : 'Lever la main'}
                            >
                                <Hand className="w-[20px] h-[20px]" />
                            </button>

                            {/* Screen share */}
                            <button
                                onClick={toggleScreenShare}
                                className={`transition-colors ${isScreenSharing ? 'text-[#25D366]' : 'text-[#8696A0] hover:text-white'}`}
                                title={isScreenSharing ? 'Arrêter le partage' : "Partager l'écran"}
                            >
                                <MonitorUp className="w-[20px] h-[20px]" />
                            </button>

                            {/* Add participant */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowAddPanel(p => !p); setShowEmojiPanel(false); setShowChatPanel(false); }}
                                    className={`transition-colors ${showAddPanel ? 'text-white' : 'text-[#8696A0] hover:text-white'}`}
                                    title="Ajouter participant"
                                >
                                    <UserPlus className="w-[20px] h-[20px]" />
                                </button>
                                {showAddPanel && (
                                    <div className="absolute bottom-10 right-0 bg-[#1F2C34] border border-[#2A3942] rounded-lg p-4  z-50 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <p className="text-white font-semibold mb-3 text-[14px]">Ajouter un participant</p>
                                        <input
                                            type="text"
                                            placeholder="Nom ou numéro..."
                                            className="w-full bg-[#2A3942] text-white placeholder:text-[#8696A0] rounded-lg px-3 py-2 text-[13px] outline-none border border-[#3B4A54] focus:border-[#25D366]"
                                        />
                                        <button className="mt-3 w-full bg-[#25D366] hover:bg-[#20b958] text-white rounded-lg py-2 text-[13px] font-semibold transition-colors">
                                            Inviter
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Chat panel toggle */}
                            <button
                                onClick={() => { setShowChatPanel(p => !p); setShowEmojiPanel(false); setShowAddPanel(false); }}
                                className={`transition-colors ${showChatPanel ? 'text-white' : 'text-[#8696A0] hover:text-white'}`}
                                title="Ouvrir le chat"
                            >
                                <MessageSquareText className="w-[20px] h-[20px]" />
                            </button>
                        </div>

                        {/* Right: End call pill */}
                        <button 
                            onClick={handleEndCall}
                            className="h-8 px-5 bg-[#ea3943] hover:bg-[#d43440] rounded-full flex items-center justify-center text-white transition-colors"
                            title="Raccrocher"
                        >
                            <Phone className="w-[17px] h-[17px] rotate-[135deg] fill-current" />
                        </button>
                    </div>

                    {/* Floating reaction emoji */}
                    {callReaction && (
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 text-6xl animate-bounce pointer-events-none">
                            {callReaction}
                        </div>
                    )}

                    {/* Hand raised indicator */}
                    {isHandRaised && (
                        <div className="absolute top-20 right-6 z-40 flex items-center gap-2 bg-[#25D366]/20 border border-[#25D366]/40 text-white px-4 py-2 rounded-full text-[13px] font-medium animate-pulse">
                            <Hand className="w-4 h-4 text-[#25D366]" />
                            <span>Main levée</span>
                        </div>
                    )}

                    {/* Screen sharing indicator */}
                    {isScreenSharing && (
                        <div className={`absolute top-20 left-6 z-40 flex items-center gap-2 border px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                            isDarkMode ? 'bg-[#00A884]/20 border-[#00A884]/40 text-[#00A884]' : 'bg-[#25D366]/20 border border-[#25D366]/40 text-emerald-600'
                        }`}>
                            <MonitorUp className="w-4 h-4" />
                            <span>Partage en cours</span>
                        </div>
                    )}

                    {/* Chat side panel */}
                    {showChatPanel && (
                        <div className={`absolute right-0 top-0 h-full w-[320px] z-40 flex flex-col animate-in slide-in-from-right duration-300 border-l ${
                            isDarkMode ? 'bg-[#111B21] border-[#2A3942]' : 'bg-white border-gray-200'
                        }`}>
                            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                <span className={`font-semibold ${isDarkMode ? 'text-[#E9EDEF]' : 'text-[#0F2D1E]'}`}>Messages de l'appel</span>
                                <button onClick={() => setShowChatPanel(false)} className="text-[#8696A0] hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 flex items-center justify-center text-[#8696A0] text-[13px]">
                                Aucun message pour l'instant
                            </div>
                            <div className={`p-3 border-t ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`}>
                                    <input 
                                        type="text" 
                                        placeholder="Envoyer un message..." 
                                        className={`flex-1 bg-transparent text-[13px] outline-none ${isDarkMode ? 'text-[#E9EDEF] placeholder:text-[#8696A0]' : 'text-[#0F2D1E] placeholder:text-gray-400'}`} 
                                    />
                                    <Send className="w-4 h-4 text-[#8696A0]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- ATTACHMENT MODALS --- */}
            <AnimatePresence>
                {activeAttachmentType && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                            onClick={() => setActiveAttachmentType(null)} 
                        />
                        
                        {activeAttachmentType === 'poll' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className={`relative w-full max-w-md rounded-lg  overflow-hidden ${isDarkMode ? 'bg-[#202C33] text-[#E9EDEF]' : 'bg-white text-[#0F2D1E]'}`}
                            >
                                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                    <h3 className="font-bold text-lg">Créer un sondage</h3>
                                    <button onClick={() => setActiveAttachmentType(null)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-[12px] font-black uppercase tracking-widest text-[#8696A0] mb-2 block">Question</label>
                                        <input 
                                            type="text" 
                                            placeholder="Posez une question" 
                                            value={pollQuestion}
                                            onChange={(e) => setPollQuestion(e.target.value)}
                                            className={`w-full bg-transparent border-b py-2 outline-none focus:border-emerald-500 transition-colors ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`} 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[12px] font-black uppercase tracking-widest text-[#8696A0] mb-2 block">Options</label>
                                        <input type="text" placeholder="Option 1" className={`w-full bg-transparent border-b py-2 outline-none focus:border-emerald-500 transition-colors ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`} />
                                        <input type="text" placeholder="Option 2" className={`w-full bg-transparent border-b py-2 outline-none focus:border-emerald-500 transition-colors ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`} />
                                        <button className={`flex items-center gap-2 text-xs font-bold ${isDarkMode ? 'text-[#00A884]' : 'text-[#1B6B3A]'}`}>+ Ajouter une option</button>
                                    </div>
                                </div>
                                <div className={`p-4 bg-black/5 flex justify-end gap-3`}>
                                    <button onClick={() => { setActiveAttachmentType(null); setPollQuestion(''); }} className="px-6 py-2 rounded-lg font-bold text-sm hover:bg-black/5 transition-colors">Annuler</button>
                                    <button onClick={() => { 
                                        if (pollQuestion.trim()) sendSystemMessage(`📊 Sondage : ${pollQuestion}`);
                                        setActiveAttachmentType(null); 
                                        setPollQuestion('');
                                        setToastMessage('Sondage envoyé !'); 
                                        setTimeout(() => setToastMessage(null), 2000); 
                                    }} className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors">Créer</button>
                                </div>
                            </motion.div>
                        )}

                        {activeAttachmentType === 'contact' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className={`relative w-full max-w-md rounded-lg  overflow-hidden ${isDarkMode ? 'bg-[#202C33] text-[#E9EDEF]' : 'bg-white text-[#0F2D1E]'}`}
                            >
                                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                    <h3 className="font-bold">Partager le contact</h3>
                                    <button onClick={() => setActiveAttachmentType(null)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-2 h-80 overflow-y-auto custom-scrollbar">
                                    {contacts.map(c => (
                                        <button key={c.id} onClick={() => { 
                                            sendSystemMessage(`👤 Contact : ${c.name}\nNuméro : +224 620 00 00 00`);
                                            setActiveAttachmentType(null); 
                                            setToastMessage(`Contact ${c.name} envoyé`); 
                                            setTimeout(() => setToastMessage(null), 2000); 
                                        }} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[#2A3942]' : 'hover:bg-gray-50'}`}>
                                            <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
                                                {c.avatar ? <img src={c.avatar} className="w-full h-full object-cover" /> : <User className="text-white" />}
                                            </div>
                                            <span className="font-medium">{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeAttachmentType === 'location' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className={`relative w-full max-w-md rounded-lg  overflow-hidden ${isDarkMode ? 'bg-[#202C33] text-[#E9EDEF]' : 'bg-white text-[#0F2D1E]'}`}
                            >
                                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                    <h3 className="font-bold">Partager la localisation</h3>
                                    <button onClick={() => setActiveAttachmentType(null)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-4 flex flex-col items-center">
                                    <div className="w-full h-64 bg-slate-200 rounded-lg mb-4 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
                                            <MapPin className="w-12 h-12" />
                                            <span className="text-sm font-medium">Chargement de la carte...</span>
                                        </div>
                                        <img src="https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-13.6,9.5,10/400x250?access_token=dummy" className="w-full h-full object-cover opacity-50" />
                                    </div>
                                    <button onClick={() => { 
                                        sendSystemMessage(`📍 Ma localisation : https://maps.google.com/?q=9.5, -13.6`);
                                        setActiveAttachmentType(null); 
                                        setToastMessage('Position envoyée'); 
                                        setTimeout(() => setToastMessage(null), 2000); 
                                    }} className="w-full py-3 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#20b958] transition-colors">
                                        Envoyer ma position actuelle
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </AnimatePresence>

            {/* --- TOAST --- */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-5 py-3 rounded-full  transition-colors ${
                            isDarkMode ? 'bg-[#202C33] text-[#E9EDEF] border border-[#2A3942]' : 'bg-[#0F2D1E] text-white'
                        }`}
                    >
                        <Check className={`w-4 h-4 ${isDarkMode ? 'text-[#00A884]' : 'text-[#25D366]'}`} />
                        <span className="text-sm font-bold">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* --- CONTEXT MENU (Right Click) --- */}
            <AnimatePresence>
                {contextMenu && (
                    <>
                        <div className="fixed inset-0 z-[100]" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ 
                                position: 'fixed',
                                top: contextMenu.renderUpwards ? 'auto' : contextMenu.y,
                                bottom: contextMenu.renderUpwards ? (window.innerHeight - contextMenu.y) : 'auto',
                                left: contextMenu.renderLeftwards ? 'auto' : contextMenu.x,
                                right: contextMenu.renderLeftwards ? (window.innerWidth - contextMenu.x) : 'auto',
                            }}
                            className={`fixed z-[101] animate-in fade-in zoom-in-95 duration-150`}
                        >
                            <div className="flex flex-col gap-2">
                                {/* Reaction pill */}
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border  w-max ${isDarkMode ? 'bg-[#233138] border-[#2A3942]' : 'bg-white border-gray-200'}`}>
                                    {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                                        <button 
                                            key={emoji}
                                            className="text-[26px] hover:scale-125 transition-transform duration-200"
                                            onClick={() => handleReactToMessage(contextMenu.messageId, emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                    <button className={`ml-1 p-1.5 rounded-full hover:bg-black/10 transition-colors ${isDarkMode ? 'text-[#8696A0] hover:text-[#E9EDEF]' : 'text-gray-500 hover:text-gray-800'}`}>
                                        <Plus className="w-[22px] h-[22px]" />
                                    </button>
                                </div>

                                {/* Main menu */}
                                <div className={`w-80 rounded-lg  overflow-hidden border ${isDarkMode ? 'bg-[#233138] border-[#2A3942]' : 'bg-white border-gray-200'}`}>
                                    <div className="flex flex-col py-2">
                                        {[
                                            { label: 'Répondre', icon: CornerUpLeft, action: () => { setReplyingTo(activeContact.messages.find(m => m.id === contextMenu.messageId) || null); setContextMenu(null); } },
                                            { label: 'Répondre en privé', icon: UserCircle, action: () => handlePrivateReply(activeContact.messages.find(m => m.id === contextMenu.messageId)!) },
                                            { label: `Envoyer un message à ${activeContact.messages.find(m => m.id === contextMenu.messageId)?.senderId === 'me' ? 'vous-même' : activeContact.name.toUpperCase()}`, icon: MessageSquareText, action: () => handleSendMessageTo(activeContact.messages.find(m => m.id === contextMenu.messageId)!) },
                                            { label: 'Copier', icon: Copy, action: () => { navigator.clipboard.writeText(activeContact.messages.find(m => m.id === contextMenu.messageId)?.text || ''); setContextMenu(null); } },
                                            { label: 'Transférer', icon: Forward, action: () => { setForwardMessageId(contextMenu.messageId); setContextMenu(null); } },
                                            { label: activeContact.messages.find(m => m.id === contextMenu.messageId)?.isStarred ? 'Retirer des importants' : 'Marquer comme important', icon: Star, action: () => handleStarMessage(contextMenu.messageId) },
                                        ].map((item, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={item.action}
                                                className={`w-full text-left px-5 py-3 text-[15px] font-medium transition-colors flex items-center gap-5 ${
                                                    isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#111B21] hover:bg-gray-50'
                                                }`}
                                            >
                                                <item.icon className={`w-[20px] h-[20px] flex-shrink-0 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`} />
                                                <span className="truncate">{item.label}</span>
                                            </button>
                                        ))}

                                        <div className={`my-1 h-[1px] w-[calc(100%-40px)] mx-auto ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`} />

                                        <button 
                                            onClick={() => handleSelectMode(contextMenu.messageId)}
                                            className={`w-full text-left px-5 py-3 text-[15px] font-medium transition-colors flex items-center gap-5 ${
                                                isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#111B21] hover:bg-gray-50'
                                            }`}
                                        >
                                            <CheckSquare className={`w-[20px] h-[20px] ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`} />
                                            <span>Sélectionner</span>
                                        </button>

                                        <div className={`my-1 h-[1px] w-[calc(100%-40px)] mx-auto ${isDarkMode ? 'bg-[#2A3942]' : 'bg-gray-100'}`} />

                                        <button 
                                            onClick={() => { setReportMessageId(contextMenu.messageId); setContextMenu(null); }}
                                            className={`w-full text-left px-5 py-3 text-[15px] font-medium transition-colors flex items-center gap-5 ${
                                                isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#111B21] hover:bg-gray-50'
                                            }`}
                                        >
                                            <ThumbsDown className={`w-[20px] h-[20px] ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-500'}`} />
                                            <span>Signaler</span>
                                        </button>

                                        <button 
                                            onClick={() => { setOpenDeleteMenuId(contextMenu.messageId); setContextMenu(null); }}
                                            className={`w-full text-left px-5 py-3 text-[15px] font-medium transition-colors flex items-center gap-5 ${
                                                isDarkMode ? 'text-[#E9EDEF] hover:bg-[#182229]' : 'text-[#111B21] hover:bg-gray-50'
                                            }`}
                                        >
                                            <Trash2 className={`w-[20px] h-[20px] ${isDarkMode ? 'text-[#F15C6D]' : 'text-red-500'}`} />
                                            <span className={`${isDarkMode ? 'text-[#F15C6D]' : 'text-red-500'}`}>Supprimer</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- CAMERA OVERLAY --- */}
            <AnimatePresence>
                {isCameraOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center font-segoe"
                    >
                        <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
                            <button onClick={stopCamera} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                            <span className="text-white font-bold tracking-wide">Prendre une photo</span>
                        </div>

                        <div className="relative w-full max-w-4xl aspect-video bg-[#111] overflow-hidden rounded-lg ">
                            {!capturedImage ? (
                                <video 
                                    ref={cameraVideoRef} 
                                    autoPlay 
                                    playsInline 
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                            ) : (
                                <img src={capturedImage} className="w-full h-full object-cover scale-x-[-1]" />
                            )}
                            
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
                                {!capturedImage ? (
                                    <button 
                                        onClick={capturePhoto}
                                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white group-active:scale-90 transition-transform" />
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => setCapturedImage(null)}
                                            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-colors"
                                        >
                                            Reprendre
                                        </button>
                                        <button 
                                            onClick={sendCapturedPhoto}
                                            className="px-8 py-2.5 bg-[#00A884] hover:bg-[#008F71] text-white rounded-full font-bold  flex items-center gap-2  active:scale-95"
                                        >
                                            <Send className="w-5 h-5" />
                                            Envoyer la photo
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- FORWARD MODAL --- */}
            <AnimatePresence>
                {forwardMessageId && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setForwardMessageId(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative w-full max-w-md rounded-lg  overflow-hidden ${isDarkMode ? 'bg-[#202C33] text-[#E9EDEF]' : 'bg-white text-[#0F2D1E]'}`}>
                            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-[#2A3942]' : 'border-gray-200'}`}>
                                <h3 className="font-bold text-lg">Transférer le message</h3>
                                <button onClick={() => setForwardMessageId(null)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-2 h-80 overflow-y-auto custom-scrollbar">
                                {contacts.map(c => (
                                    <button key={c.id} onClick={() => { setForwardMessageId(null); setToastMessage('Message transféré à ' + c.name); setTimeout(() => setToastMessage(null), 2000); }} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[#2A3942]' : 'hover:bg-gray-50'}`}>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-500 flex-shrink-0">
                                            {c.avatar ? <img src={c.avatar} className="w-full h-full object-cover" /> : <User className="text-white" />}
                                        </div>
                                        <span className="font-medium">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- REPORT MODAL --- */}
            <AnimatePresence>
                {reportMessageId && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReportMessageId(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative w-full max-w-sm rounded-lg  overflow-hidden p-6 ${isDarkMode ? 'bg-[#202C33] text-[#E9EDEF]' : 'bg-white text-[#0F2D1E]'}`}>
                            <h3 className="text-xl font-bold mb-4">Signaler ce contact ?</h3>
                            <p className={`text-[15px] mb-6 ${isDarkMode ? 'text-[#8696A0]' : 'text-gray-600'}`}>Les derniers messages de ce contact seront transférés. Ce contact ne saura pas que vous l'avez signalé.</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setReportMessageId(null)} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors ${isDarkMode ? 'hover:bg-[#2A3942] text-[#00A884]' : 'hover:bg-gray-100 text-[#1B6B3A]'}`}>Annuler</button>
                                <button onClick={() => { setReportMessageId(null); setToastMessage('Signalement envoyé'); setTimeout(() => setToastMessage(null), 2000); }} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors ${isDarkMode ? 'bg-[#00A884] text-[#111B21] hover:bg-[#008F71]' : 'bg-[#1B6B3A] text-white hover:bg-[#14522B]'}`}>Signaler</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
        </>
    );
};
