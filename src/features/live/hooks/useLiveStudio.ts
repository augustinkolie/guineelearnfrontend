'use client';

import { useState, useRef, useEffect } from 'react';

export function useLiveStudio(title: string, onClose: () => void) {
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [floatingEmojis, setFloatingEmojis] = useState<{ id: number, emoji: string, x: number }[]>([]);
    const [activePanel, setActivePanel] = useState<'CHAT' | 'PEOPLE' | 'INFO' | 'SECURITY' | 'SETTINGS' | 'ACTIVITIES' | null>(null);
    const [isNoiseSuppressionEnabled, setIsNoiseSuppressionEnabled] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [messages, setMessages] = useState<{ id: string; sender: string; text: string; time: string; isMe: boolean }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [showParticipantMenu, setShowParticipantMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activePanel === 'CHAT') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activePanel]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadJitsiScript = () => {
            return new Promise((resolve) => {
                if (window.JitsiMeetExternalAPI) {
                    resolve(true);
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://meet.jit.si/external_api.js';
                script.async = true;
                script.onload = () => resolve(true);
                document.body.appendChild(script);
            });
        };

        const initJitsi = async () => {
            await loadJitsiScript();
            if (jitsiContainerRef.current && !apiRef.current) {
                const domain = 'meet.jit.si';
                const options = {
                    roomName: `GuineeLearn_${title.replace(/\s+/g, '_')}`,
                    width: '100%', height: '100%',
                    parentNode: jitsiContainerRef.current,
                    configOverwrite: { startWithAudioMuted: false, startWithVideoMuted: false, prejoinPageEnabled: false, disableDeepLinking: true },
                    interfaceConfigOverwrite: { TOOLBAR_BUTTONS: [], SETTINGS_SECTIONS: [], SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false, FILM_STRIP_MAX_HEIGHT: 0 },
                    userInfo: { displayName: 'Enseignant GuinéeLearn' }
                };
                apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

                apiRef.current.addEventListeners({
                    audioMuteStatusChanged: (e: any) => setIsMicMuted(e.muted),
                    videoMuteStatusChanged: (e: any) => setIsCamOff(e.muted),
                    videoConferenceJoined: () => {
                        setTimeout(() => { if (apiRef.current) apiRef.current.executeCommand('setVirtualBackground', false); }, 2000);
                    },
                    incomingMessage: (data: any) => {
                        const isMe = data.nick === 'Enseignant GuinéeLearn' || data.from === 'local' || data.nick === 'Enseignant (Vous)';
                        setMessages(prev => {
                            if (isMe && prev.length > 0 && prev[prev.length - 1].text === data.message && prev[prev.length - 1].isMe) return prev;
                            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return [...prev, { id: `${Date.now()}_${Math.random()}`, sender: isMe ? 'Vous' : (data.nick || 'Participant'), text: data.message, time: timeStr, isMe }];
                        });
                    },
                    outgoingMessage: (data: any) => {
                        setMessages(prev => {
                            if (prev.length > 0 && prev[prev.length - 1].text === data.message && prev[prev.length - 1].isMe) return prev;
                            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return [...prev, { id: `${Date.now()}_${Math.random()}`, sender: 'Vous', text: data.message, time: timeStr, isMe: true }];
                        });
                    },
                    videoConferenceLeft: () => onClose(),
                    readyToClose: () => onClose(),
                });
            }
        };

        initJitsi();
        return () => {
            if (apiRef.current) {
                apiRef.current.dispose();
                apiRef.current = null;
            }
        };
    }, [title, onClose]);

    const triggerReaction = (emoji: string) => {
        const id = Date.now();
        const x = Math.random() * 100 - 50;
        setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
        setTimeout(() => {
            setFloatingEmojis(prev => prev.filter(e => e.id !== id));
        }, 3000);
    };

    const executeCommand = (cmd: string, args: any = {}) => {
        if (apiRef.current) {
            apiRef.current.executeCommand(cmd, args);
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const messageText = chatInput.trim();
        if (apiRef.current) {
            apiRef.current.executeCommand('sendChatMessage', messageText);
        }
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].text === messageText && prev[prev.length - 1].isMe) return prev;
            return [...prev, { id: `${Date.now()}_${Math.random()}`, sender: 'Vous', text: messageText, time: timeStr, isMe: true }];
        });
        setChatInput('');
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return {
        jitsiContainerRef, isMicMuted, isCamOff, isHandRaised, setIsHandRaised,
        showReactions, setShowReactions, showMoreOptions, setShowMoreOptions,
        floatingEmojis, activePanel, setActivePanel, isNoiseSuppressionEnabled, setIsNoiseSuppressionEnabled,
        currentTime, messages, chatInput, setChatInput, showParticipantMenu, setShowParticipantMenu,
        messagesEndRef, triggerReaction, executeCommand, handleSendMessage, toggleFullScreen
    };
}
