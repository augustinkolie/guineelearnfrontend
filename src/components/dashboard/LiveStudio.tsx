'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
    Mic, 
    MicOff, 
    Video, 
    VideoOff, 
    PhoneOff, 
    Hand, 
    Monitor, 
    MoreVertical, 
    Info, 
    Users, 
    MessageSquare, 
    ShieldAlert, 
    Grid,
    Type,
    Smile,
    X,
    ChevronUp,
    PenTool,
    Settings,
    Maximize,
    MonitorPlay,
    CircleSlash,
    Shield,
    Layout,
    ChevronRight,
    LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveStudioProps {
    title: string;
    onClose: () => void;
}

export const LiveStudio = ({ title, onClose }: LiveStudioProps) => {
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
                    width: '100%',
                    height: '100%',
                    parentNode: jitsiContainerRef.current,
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        prejoinPageEnabled: false,
                        disableDeepLinking: true,
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [], // Hide default toolbar
                        SETTINGS_SECTIONS: [],
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        FILM_STRIP_MAX_HEIGHT: 0,
                    },
                    userInfo: {
                        displayName: 'Enseignant GuinéeLearn'
                    }
                };
                apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

                // Event Listeners
                apiRef.current.addEventListeners({
                    audioMuteStatusChanged: (e: any) => setIsMicMuted(e.muted),
                    videoMuteStatusChanged: (e: any) => setIsCamOff(e.muted),
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
    }, [title]);

    const triggerReaction = (emoji: string) => {
        const id = Date.now();
        const x = Math.random() * 100 - 50; // Random horizontal offset
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

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const ControlButton = ({ 
        icon: Icon, 
        onClick, 
        active = false, 
        danger = false, 
        badge = false,
        label = "",
        color = ""
    }: { 
        icon: any, 
        onClick: () => void, 
        active?: boolean, 
        danger?: boolean, 
        badge?: boolean,
        label?: string,
        color?: string
    }) => (
        <button 
            onClick={onClick}
            className={`relative group flex items-center justify-center  ${
                danger 
                ? 'w-14 h-10 rounded-full bg-[#EA4335] text-white hover:bg-[#D93025]  shadow-red-500/20' 
                : active 
                ? (color ? `w-10 h-10 rounded-full bg-[${color}] text-[#202124]` : 'w-10 h-10 rounded-full bg-[#EA4335] text-white') 
                : 'w-10 h-10 rounded-full bg-[#3C4043] text-white hover:bg-[#434649]'
            }`}
            style={color && active ? { backgroundColor: color } : {}}
        >
            <Icon className={`w-5 h-5 ${active && !danger && !color ? 'text-white' : ''}`} />
            
            {badge && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#8AB4F8] border-2 border-[#202124]" />}
            {label && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#202124] text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10  z-50">
                    {label}
                </div>
            )}
        </button>
    );

    return (
        <div className="fixed inset-0 z-[200] bg-[#202124] flex flex-col font-sans overflow-hidden">
            {/* Top Bar (Google Meet Style - usually empty or floating code) */}
            <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-lg border border-white/5 flex items-center gap-3">
                    <span className="text-white/80 font-medium text-sm">{title}</span>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-white/40 text-xs font-mono">abc-defg-hij</span>
                </div>
            </div>

            {/* Floating Reactions Layer */}
            <div className="absolute inset-0 pointer-events-none z-[190] overflow-hidden">
                <AnimatePresence>
                    {floatingEmojis.map((e) => (
                        <motion.div
                            key={e.id}
                            initial={{ opacity: 0, y: window.innerHeight / 2, x: `calc(50% + ${e.x}px)`, scale: 0.5 }}
                            animate={{ 
                                opacity: [0, 1, 1, 0], 
                                y: -100, 
                                x: `calc(50% + ${e.x + (Math.random() * 40 - 20)}px)`,
                                scale: e.emoji === '👏' ? [0.5, 1.3, 0.8, 1.3, 1] : [0.5, 1.2, 1],
                                rotate: e.emoji === '👏' ? [0, -10, 10, -10, 0] : Math.random() * 20 - 10
                            }}
                            transition={{ 
                                duration: 2.5, 
                                ease: "easeOut",
                                scale: e.emoji === '👏' ? { repeat: 3, duration: 0.5 } : { duration: 0.5 },
                                rotate: e.emoji === '👏' ? { repeat: 3, duration: 0.5 } : { duration: 0.5 }
                            }}
                            className="absolute text-4xl"
                        >
                            {e.emoji}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Video / Jitsi Area */}
            <div className="flex-1 relative flex">
                <div 
                    className={`flex-1 relative  duration-500 ${activePanel ? 'mr-96' : ''}`}
                    onClick={() => {
                        setShowReactions(false);
                        setShowMoreOptions(false);
                    }}
                >
                    <div ref={jitsiContainerRef} className="absolute inset-0" />
                    
                    {/* Placeholder for camera off */}
                    {isCamOff && (
                        <div className="absolute inset-0 bg-[#202124] flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-[#1B6B3A] text-white flex items-center justify-center text-3xl font-bold ">
                                E
                            </div>
                        </div>
                    )}
                </div>

                {/* Side Panels */}
                <AnimatePresence>
                    {activePanel && (
                        <motion.div 
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            className="absolute right-0 top-0 bottom-24 w-96 bg-white m-4 rounded-lg flex flex-col  overflow-hidden"
                        >
                            <div className="p-6 flex items-center justify-between border-b">
                                <h4 className="text-lg font-medium text-[#202124]">
                                    {activePanel === 'CHAT' ? 'Messages dans l\'appel' 
                                    : activePanel === 'PEOPLE' ? 'Participants' 
                                    : activePanel === 'INFO' ? 'Détails de la réunion'
                                    : activePanel === 'SECURITY' ? 'Sécurité de la réunion'
                                    : 'Paramètres'}
                                </h4>
                                <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                {activePanel === 'CHAT' ? (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                                Les messages ne peuvent être vus que par les participants à l'appel et sont supprimés à la fin de celui-ci.
                                            </p>
                                        </div>
                                        <div className="text-center py-10">
                                            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                            <p className="text-sm text-gray-400">Aucun message pour l'instant</p>
                                        </div>
                                    </div>
                                ) : activePanel === 'PEOPLE' ? (
                                    <div className="space-y-4">
                                        <button className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-[#1B6B3A] flex items-center justify-center text-white text-xs font-bold">
                                                E
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-medium text-gray-900">Enseignant (Vous)</p>
                                                <p className="text-[10px] text-gray-500">Organisateur de la réunion</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Mic className="w-4 h-4 text-gray-400" />
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </button>
                                    </div>
                                ) : activePanel === 'SECURITY' ? (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100/50">
                                            <div className="flex gap-3">
                                                <Shield className="w-5 h-5 text-emerald-600" />
                                                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                                                    Utilisez ces paramètres pour contrôler les accès et les interactions dans votre réunion.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Accès rapide', desc: 'Les personnes non invitées doivent demander à participer' },
                                                { label: 'Partage d\'écran', desc: 'Autoriser tout le monde à partager son écran' },
                                                { label: 'Envoyer des messages', desc: 'Autoriser tout le monde à envoyer des messages' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between py-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                                        <p className="text-[10px] text-gray-500">{item.desc}</p>
                                                    </div>
                                                    <div className="w-10 h-5 bg-[#1B6B3A] rounded-full relative cursor-pointer shadow-inner">
                                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full " />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : activePanel === 'SETTINGS' ? (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Audio</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <Mic className="w-4 h-4 text-gray-500" />
                                                    <select className="flex-1 bg-transparent text-sm font-medium outline-none">
                                                        <option>Microphone par défaut</option>
                                                        <option>Microphone (Realtek High Definition Audio)</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <Grid className="w-4 h-4 text-gray-500" />
                                                    <select className="flex-1 bg-transparent text-sm font-medium outline-none">
                                                        <option>Haut-parleurs par défaut</option>
                                                        <option>Casque (Audio haute définition)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Vidéo</p>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                                                <Video className="w-4 h-4 text-gray-500" />
                                                <select className="flex-1 bg-transparent text-sm font-medium outline-none">
                                                    <option>Caméra Web HD</option>
                                                    <option>OBS Virtual Camera</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : activePanel === 'ACTIVITIES' ? (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-500 font-medium mb-4">Utilisez ces outils pour stimuler l'interaction.</p>
                                        {[
                                            { icon: PenTool, label: 'Tableau blanc', desc: 'Collaborer sur des dessins et des notes', color: 'bg-emerald-50 text-emerald-600', action: () => executeCommand('toggleWhiteboard') },
                                            { icon: Layout, label: 'Sondages', desc: 'Recueillir l\'avis des participants', color: 'bg-blue-50 text-blue-600' },
                                            { icon: MessageSquare, label: 'Questions-réponses', desc: 'Permettre aux participants de poser des questions', color: 'bg-orange-50 text-orange-600' },
                                        ].map((act, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => { if(act.action) act.action(); setActivePanel(null); }}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg  border border-transparent hover:border-gray-200 group"
                                            >
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${act.color} group-hover:scale-110 transition-transform`}>
                                                    <act.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-black text-gray-900">{act.label}</p>
                                                    <p className="text-[10px] text-gray-500">{act.desc}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300" />
                                            </button>
                                        ))}
                                    </div>
                                ) : activePanel === 'INFO' ? (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-black text-gray-900 mb-2">Informations de connexion</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                                <span>meet.jit.si/GuineeLearn_{title.replace(/\s+/g, '_')}</span>
                                                <button className="text-[#1B6B3A] font-black uppercase tracking-widest hover:underline hover:underline-offset-4">Copier</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {activePanel === 'CHAT' && (
                                <div className="p-6 border-t">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Envoyer un message à tout le monde"
                                            className="w-full pl-5 pr-12 py-4 bg-gray-100 rounded-full text-sm outline-none focus:bg-gray-200 "
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#1B6B3A]">
                                            <Smile className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Bar (Google Meet Style) */}
            <div className="h-20 bg-[#202124] px-6 flex items-center justify-between border-t border-white/5">
                {/* Left: Time and Code */}
                <div className="flex items-center gap-4 text-white min-w-[200px]">
                    <span className="text-sm font-medium">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-sm font-medium">abc-defg-hij</span>
                </div>

                {/* Center: Main Controls */}
                <div className="flex items-center gap-3">
                    <ControlButton 
                        icon={isMicMuted ? MicOff : Mic} 
                        onClick={() => executeCommand('toggleAudio')}
                        active={isMicMuted}
                        label={isMicMuted ? "Réactiver le micro" : "Couper le micro"}
                    />
                    <ControlButton 
                        icon={isCamOff ? VideoOff : Video} 
                        onClick={() => executeCommand('toggleVideo')}
                        active={isCamOff}
                        label={isCamOff ? "Activer la caméra" : "Couper la caméra"}
                    />
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <ControlButton 
                        icon={Type} 
                        onClick={() => {}}
                        label="Sous-titres"
                    />
                    <div className="relative">
                        <AnimatePresence>
                            {showReactions && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-[#3C4043] rounded-full p-1.5 flex items-center gap-1  border border-white/10 z-[210]"
                                >
                                    {['💖', '👍', '🎉', '👏', '😂', '😮', '😢', '🤔'].map((emoji) => (
                                        <button 
                                            key={emoji}
                                            onClick={() => {
                                                triggerReaction(emoji);
                                                setShowReactions(false);
                                            }}
                                            className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-full  hover:scale-125"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <ControlButton 
                            icon={Smile} 
                            onClick={() => setShowReactions(!showReactions)}
                            active={showReactions}
                            label="Envoyer une réaction"
                        />
                    </div>
                    <ControlButton 
                        icon={Monitor} 
                        onClick={() => executeCommand('toggleShareScreen')}
                        label="Présenter maintenant"
                    />
                    <ControlButton 
                        icon={Hand} 
                        onClick={() => {
                            setIsHandRaised(!isHandRaised);
                            executeCommand('toggleRaiseHand');
                        }}
                        color={isHandRaised ? '#8AB4F8' : undefined}
                        active={isHandRaised}
                        label={isHandRaised ? "Baisser la main" : "Lever la main"}
                    />
                    <div className="relative">
                        <AnimatePresence>
                            {showMoreOptions && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-14 right-0 w-64 bg-[#3C4043] rounded-lg py-2  border border-white/10 z-[210]"
                                >
                                    {[
                                        { icon: PenTool, label: 'Tableau blanc', desc: 'Ouvrir une session Jamboard', action: () => executeCommand('toggleWhiteboard') },
                                        { icon: MonitorPlay, label: 'Enregistrer la réunion', desc: 'Indisponible en version gratuite', action: () => alert("Cette fonctionnalité nécessite un abonnement Établissement.") },
                                        { icon: Maximize, label: 'Plein écran', action: toggleFullScreen },
                                        { icon: CircleSlash, label: isNoiseSuppressionEnabled ? 'Désactiver la suppression du bruit' : 'Activer la suppression du bruit', action: () => setIsNoiseSuppressionEnabled(!isNoiseSuppressionEnabled) },
                                        { icon: Shield, label: 'Sécurité de la réunion', action: () => setActivePanel('SECURITY') },
                                        { icon: Settings, label: 'Paramètres', action: () => setActivePanel('SETTINGS') },
                                    ].map((opt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => {
                                                if (opt.action) opt.action();
                                                setShowMoreOptions(false);
                                            }}
                                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                                        >
                                            <opt.icon className={`w-5 h-5 text-white/70 group-hover:text-white ${opt.label.includes(' suppression') && isNoiseSuppressionEnabled ? 'text-emerald-400' : ''}`} />
                                            <div>
                                                <p className="text-sm font-medium text-white">{opt.label}</p>
                                                {opt.desc && <p className="text-[10px] text-white/40">{opt.desc}</p>}
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <ControlButton 
                            icon={MoreVertical} 
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                            active={showMoreOptions}
                            label="Plus d'options"
                        />
                    </div>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <ControlButton 
                        icon={PhoneOff} 
                        onClick={onClose}
                        danger
                        label="Quitter l'appel"
                    />
                </div>

                {/* Right: Info, People, Chat, Activities, Security */}
                <div className="flex items-center gap-1 min-w-[280px] justify-end">
                    <button 
                        onClick={() => setActivePanel(activePanel === 'INFO' ? null : 'INFO')}
                        className={`p-3 rounded-full transition-colors ${activePanel === 'INFO' ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]' : 'text-white hover:bg-white/5'}`}
                    >
                        <Info className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setActivePanel(activePanel === 'PEOPLE' ? null : 'PEOPLE')}
                        className={`p-3 rounded-full transition-colors relative ${activePanel === 'PEOPLE' ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]' : 'text-white hover:bg-white/5'}`}
                    >
                        <Users className="w-5 h-5" />
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#8AB4F8] border-2 border-[#202124]" />
                    </button>
                    <button 
                        onClick={() => setActivePanel(activePanel === 'CHAT' ? null : 'CHAT')}
                        className={`p-3 rounded-full transition-colors relative ${activePanel === 'CHAT' ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]' : 'text-white hover:bg-white/5'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EA4335] border-2 border-[#202124]" />
                    </button>
                    <button 
                        onClick={() => setActivePanel(activePanel === 'ACTIVITIES' ? null : 'ACTIVITIES')}
                        className={`p-3 rounded-full transition-colors ${activePanel === 'ACTIVITIES' ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]' : 'text-white hover:bg-white/5'}`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setActivePanel(activePanel === 'SECURITY' ? null : 'SECURITY')}
                        className={`p-3 rounded-full transition-colors ${activePanel === 'SECURITY' ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]' : 'text-white hover:bg-white/5'}`}
                    >
                        <Shield className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}
