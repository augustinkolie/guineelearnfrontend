'use client';

import React from 'react';
import { 
    X, MessageSquare, Mic, MicOff, MoreVertical, Hand, Settings, 
    CircleSlash, Shield, Video, Grid, PenTool, Layout, ChevronRight, Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveSidePanelProps {
    title: string;
    activePanel: 'CHAT' | 'PEOPLE' | 'INFO' | 'SECURITY' | 'SETTINGS' | 'ACTIVITIES' | null;
    messages: { id: string; sender: string; text: string; time: string; isMe: boolean }[];
    chatInput: string;
    isMicMuted: boolean;
    isHandRaised: boolean;
    isNoiseSuppressionEnabled: boolean;
    showParticipantMenu: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onClosePanel: () => void;
    onSetChatInput: (val: string) => void;
    onSendMessage: () => void;
    onExecuteCommand: (cmd: string, args?: any) => void;
    onToggleHandRaised: () => void;
    onToggleNoiseSuppression: () => void;
    onToggleParticipantMenu: () => void;
    onSetActivePanel: (panel: any) => void;
}

export const LiveSidePanel: React.FC<LiveSidePanelProps> = ({
    title, activePanel, messages, chatInput, isMicMuted, isHandRaised,
    isNoiseSuppressionEnabled, showParticipantMenu, messagesEndRef,
    onClosePanel, onSetChatInput, onSendMessage, onExecuteCommand,
    onToggleHandRaised, onToggleNoiseSuppression, onToggleParticipantMenu, onSetActivePanel
}) => {
    if (!activePanel) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
                className="absolute right-0 top-0 bottom-4 w-96 bg-white m-4 rounded-lg flex flex-col overflow-hidden z-[220] shadow-2xl border border-black/5">
                <div className="p-6 flex items-center justify-between border-b">
                    <h4 className="text-lg font-medium text-[#202124]">
                        {activePanel === 'CHAT' ? 'Messages dans l\'appel' 
                        : activePanel === 'PEOPLE' ? 'Participants' 
                        : activePanel === 'INFO' ? 'Détails de la réunion'
                        : activePanel === 'SECURITY' ? 'Sécurité de la réunion'
                        : 'Paramètres'}
                    </h4>
                    <button onClick={onClosePanel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    {activePanel === 'CHAT' ? (
                        <div className="space-y-6 pr-1">
                            <div className="p-4 bg-blue-50 border border-blue-100/50 rounded-lg">
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    Les messages ne peuvent être vus que par les participants à l'appel et sont supprimés à la fin de celui-ci.
                                </p>
                            </div>
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                        <MessageSquare className="w-7 h-7 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400">Aucun message pour l'instant</p>
                                    <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto">Envoyez un message pour commencer la discussion.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                <span className="text-[11px] font-black text-gray-700">{msg.sender}</span>
                                                <span className="text-[9px] font-bold text-gray-400">{msg.time}</span>
                                            </div>
                                            <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-xs font-semibold leading-relaxed shadow-sm border ${
                                                msg.isMe ? 'bg-[#1B6B3A] text-white border-transparent rounded-tr-none' : 'bg-gray-100 text-gray-800 border-gray-200/50 rounded-tl-none'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    ) : activePanel === 'PEOPLE' ? (
                        <div className="space-y-4">
                            <div className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors relative">
                                <div className="w-10 h-10 rounded-full bg-[#1B6B3A] flex items-center justify-center text-white text-xs font-bold select-none">E</div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-900">Enseignant (Vous)</p>
                                    <p className="text-[10px] text-gray-500">Organisateur de la réunion</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onExecuteCommand('toggleAudio')} className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${isMicMuted ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                                        {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </button>
                                    <div className="relative">
                                        <button onClick={onToggleParticipantMenu} className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${showParticipantMenu ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        <AnimatePresence>
                                            {showParticipantMenu && (
                                                <>
                                                    <div className="fixed inset-0 z-20 cursor-default" onClick={onToggleParticipantMenu} />
                                                    <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 overflow-hidden">
                                                        <button onClick={() => { onToggleHandRaised(); onToggleParticipantMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left">
                                                            <Hand className={`w-4 h-4 ${isHandRaised ? 'text-[#8AB4F8]' : 'text-gray-400'}`} />
                                                            <span>{isHandRaised ? 'Baisser la main' : 'Lever la main'}</span>
                                                        </button>
                                                        <button onClick={() => { onSetActivePanel('SETTINGS'); onToggleParticipantMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left">
                                                            <Settings className="w-4 h-4 text-gray-400" />
                                                            <span>Paramètres audio/vidéo</span>
                                                        </button>
                                                        <button onClick={() => { onToggleNoiseSuppression(); onToggleParticipantMenu(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left">
                                                            <CircleSlash className={`w-4 h-4 ${isNoiseSuppressionEnabled ? 'text-emerald-500' : 'text-gray-400'}`} />
                                                            <span>{isNoiseSuppressionEnabled ? 'Désactiver suppr. bruit' : 'Activer suppr. bruit'}</span>
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
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
                                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
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
                                { icon: PenTool, label: 'Tableau blanc', desc: 'Collaborer sur des dessins et des notes', color: 'bg-emerald-50 text-emerald-600', action: () => onExecuteCommand('toggleWhiteboard') },
                                { icon: Layout, label: 'Sondages', desc: 'Recueillir l\'avis des participants', color: 'bg-blue-50 text-blue-600' },
                                { icon: MessageSquare, label: 'Questions-réponses', desc: 'Permettre aux participants de poser des questions', color: 'bg-orange-50 text-orange-600' },
                            ].map((act, i) => (
                                <button key={i} onClick={() => { if (act.action) act.action(); onClosePanel(); }} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 group">
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
                    <div className="p-4 border-t bg-white">
                        <div className="relative flex items-center">
                            <input type="text" placeholder="Envoyer un message à tous" value={chatInput} onChange={(e) => onSetChatInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSendMessage(); } }}
                                className="w-full pl-5 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold outline-none focus:bg-white focus:border-[#1B6B3A]/30 transition-all text-gray-800 placeholder:text-gray-400" />
                            <button onMouseDown={(e) => { e.preventDefault(); onSendMessage(); }} disabled={!chatInput.trim()}
                                className={`absolute right-1.5 p-2 rounded-full transition-all ${chatInput.trim() ? 'bg-[#1B6B3A] text-white hover:scale-105 hover:bg-[#15522d]' : 'text-gray-300 pointer-events-none'}`}>
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
