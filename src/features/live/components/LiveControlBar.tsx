'use client';

import React from 'react';
import { 
    Mic, MicOff, Video, VideoOff, PhoneOff, Hand, Monitor, 
    MoreVertical, Info, Users, MessageSquare, Grid, Smile, 
    Type, PenTool, Settings, Maximize, MonitorPlay, CircleSlash, Shield 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlButtonProps {
    icon: any;
    onClick: () => void;
    active?: boolean;
    danger?: boolean;
    badge?: boolean;
    label?: string;
    color?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ 
    icon: Icon, onClick, active = false, danger = false, badge = false, label = "", color = "" 
}) => (
    <button 
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        className={`relative group flex items-center justify-center ${
            danger ? 'w-14 h-10 rounded-full bg-[#EA4335] text-white hover:bg-[#D93025] shadow-red-500/20' 
            : active ? (color ? `w-10 h-10 rounded-full bg-[${color}] text-[#202124]` : 'w-10 h-10 rounded-full bg-[#EA4335] text-white') 
            : 'w-10 h-10 rounded-full bg-[#3C4043] text-white hover:bg-[#434649]'
        }`}
        style={color && active ? { backgroundColor: color } : {}}
    >
        <Icon className={`w-5 h-5 ${active && !danger && !color ? 'text-white' : ''}`} />
        {badge && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#8AB4F8] border-2 border-[#202124]" />}
        {label && (
            <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#3C4043] text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity delay-100 whitespace-nowrap pointer-events-none border border-white/10 z-[230] shadow-lg">
                {label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3C4043] rotate-45 -mt-1 border-r border-b border-white/10" />
            </div>
        )}
    </button>
);

interface LiveControlBarProps {
    currentTime: Date;
    isMicMuted: boolean;
    isCamOff: boolean;
    isHandRaised: boolean;
    showReactions: boolean;
    showMoreOptions: boolean;
    isNoiseSuppressionEnabled: boolean;
    activePanel: string | null;
    onExecuteCommand: (cmd: string, args?: any) => void;
    onToggleHandRaised: () => void;
    onToggleReactions: () => void;
    onTriggerReaction: (emoji: string) => void;
    onToggleMoreOptions: () => void;
    onToggleFullScreen: () => void;
    onToggleNoiseSuppression: () => void;
    onSetActivePanel: (panel: any) => void;
    onClose: () => void;
}

export const LiveControlBar: React.FC<LiveControlBarProps> = ({
    currentTime, isMicMuted, isCamOff, isHandRaised, showReactions, showMoreOptions,
    isNoiseSuppressionEnabled, activePanel, onExecuteCommand, onToggleHandRaised,
    onToggleReactions, onTriggerReaction, onToggleMoreOptions, onToggleFullScreen,
    onToggleNoiseSuppression, onSetActivePanel, onClose
}) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#202124] px-6 flex items-center justify-between border-t border-white/5 z-[210]">
            <div className="flex items-center gap-4 text-white min-w-[200px]">
                <span className="text-sm font-medium">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-sm font-medium">abc-defg-hij</span>
            </div>

            <div className="flex items-center gap-3">
                <ControlButton icon={isMicMuted ? MicOff : Mic} onClick={() => onExecuteCommand('toggleAudio')} active={isMicMuted} label={isMicMuted ? "Réactiver le micro" : "Couper le micro"} />
                <ControlButton icon={isCamOff ? VideoOff : Video} onClick={() => onExecuteCommand('toggleVideo')} active={isCamOff} label={isCamOff ? "Activer la caméra" : "Couper la caméra"} />
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ControlButton icon={Type} onClick={() => {}} label="Sous-titres" />
                <div className="relative">
                    <AnimatePresence>
                        {showReactions && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-[#3C4043] rounded-full p-1.5 flex items-center gap-1 border border-white/10 z-[230] shadow-2xl">
                                {['💖', '👍', '🎉', '👏', '😂', '😮', '😢', '🤔'].map((emoji) => (
                                    <button key={emoji} onClick={() => { onTriggerReaction(emoji); onToggleReactions(); }} className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-full hover:scale-125">
                                        {emoji}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <ControlButton icon={Smile} onClick={onToggleReactions} active={showReactions} label="Envoyer une réaction" />
                </div>
                <ControlButton icon={Monitor} onClick={() => onExecuteCommand('toggleShareScreen')} label="Présenter maintenant" />
                <ControlButton icon={Hand} onClick={onToggleHandRaised} color={isHandRaised ? '#8AB4F8' : undefined} active={isHandRaised} label={isHandRaised ? "Baisser la main" : "Lever la main"} />
                <div className="relative">
                    <AnimatePresence>
                        {showMoreOptions && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-14 right-0 w-64 bg-[#3C4043] rounded-lg py-2 border border-white/10 z-[230] shadow-2xl">
                                {[
                                    { icon: PenTool, label: 'Tableau blanc', desc: 'Ouvrir une session Jamboard', action: () => onExecuteCommand('toggleWhiteboard') },
                                    { icon: MonitorPlay, label: 'Enregistrer la réunion', desc: 'Indisponible en version gratuite', action: () => alert("Cette fonctionnalité nécessite un abonnement Établissement.") },
                                    { icon: Maximize, label: 'Plein écran', action: onToggleFullScreen },
                                    { icon: CircleSlash, label: isNoiseSuppressionEnabled ? 'Désactiver la suppression du bruit' : 'Activer la suppression du bruit', action: onToggleNoiseSuppression },
                                    { icon: Shield, label: 'Sécurité de la réunion', action: () => onSetActivePanel('SECURITY') },
                                    { icon: Settings, label: 'Paramètres', action: () => onSetActivePanel('SETTINGS') },
                                ].map((opt, i) => (
                                    <button key={i} onClick={() => { if (opt.action) opt.action(); onToggleMoreOptions(); }} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left group">
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
                    <ControlButton icon={MoreVertical} onClick={onToggleMoreOptions} active={showMoreOptions} label="Plus d'options" />
                </div>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ControlButton icon={PhoneOff} onClick={onClose} danger label="Quitter l'appel" />
            </div>

            <div className="flex items-center gap-1 min-w-[280px] justify-end">
                {['INFO', 'PEOPLE', 'CHAT', 'ACTIVITIES', 'SECURITY'].map((panelKey) => {
                    const icons: Record<string, any> = { INFO: Info, PEOPLE: Users, CHAT: MessageSquare, ACTIVITIES: Grid, SECURITY: Shield };
                    const IconComp = icons[panelKey];
                    const isActive = activePanel === panelKey;
                    return (
                        <button key={panelKey} onMouseDown={(e) => { e.preventDefault(); onSetActivePanel(isActive ? null : panelKey); }}
                            className={`p-3 rounded-full transition-colors relative ${isActive ? 'bg-[#8AB4F8]/10 text-[#8AB4F8]' : 'text-white hover:bg-white/5'}`}>
                            <IconComp className="w-5 h-5" />
                            {panelKey === 'PEOPLE' && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#8AB4F8] border-2 border-[#202124]" />}
                            {panelKey === 'CHAT' && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EA4335] border-2 border-[#202124]" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
