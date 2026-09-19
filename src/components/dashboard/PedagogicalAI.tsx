'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Bot, 
    Sparkles, 
    BookOpen,
    Languages,
    RotateCcw,
    Lightbulb,
    FileText,
    HelpCircle,
    Settings,
    User,
    ChevronRight,
    Volume2,
    Paperclip,
    Smile,
    Mic,
    Menu,
    X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { apiCall } from '../../utils/api';

interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: string;
}

type AssistantMode = 'normal' | 'professeur' | 'enfant' | 'examen';

export const PedagogicalAI = () => {
    const [mode, setMode] = useState<AssistantMode>('normal');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Bonjour. Je suis votre assistant pédagogique GuinéeLearn. Sur quel concept ou sujet souhaitez-vous travailler aujourd'hui ?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickActions = [
        { label: "Explique-moi simplement", prompt: "Peux-tu m'expliquer ce concept très simplement ?", icon: Lightbulb },
        { label: "Donne un exemple", prompt: "Donne-moi un exemple concret.", icon: BookOpen },
        { label: "Fais un résumé", prompt: "Fais-moi un résumé clair.", icon: FileText },
        { label: "Pose-moi des questions", prompt: "Pose-moi des questions sur ce sujet.", icon: HelpCircle },
        { label: "Français facile", prompt: "Explique en français facile.", icon: Volume2 },
    ];

    const localLanguages = ["SOUSSOU", "PEUL (PULAR)", "MALINKÉ"];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (customPrompt?: string) => {
        const textToSend = customPrompt || inputValue;
        if (!textToSend.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);

        // Define system prompts based on mode
        const modePrompts = {
            normal: "Tu es l'Assistant IA Pédagogique de GuinéeLearn. Pour les exercices (surtout en Maths, Physique, Chimie), ne donne jamais la réponse directement. Décompose TOUJOURS en étapes détaillées, signale les erreurs fréquentes et donne des astuces de résolution. \n\nIMPORTANT : Utilise EXCLUSIVEMENT les délimiteurs '$' pour les formules en ligne et '$$' pour les formules en bloc pour le rendu mathématique.",
            professeur: "Tu es un Professeur expert. Pour les matières scientifiques, fournis une correction rigoureuse pas à pas. Structure tes réponses avec : 1. Méthode, 2. Étapes détaillées, 3. Erreurs classiques à éviter, 4. Astuces pour gagner du temps. \n\nIMPORTANT : Utilise EXCLUSIVEMENT les délimiteurs '$' pour les formules en ligne et '$$' pour les formules en bloc pour le rendu mathématique.",
            enfant: "Tu es un tuteur pour enfants. Explique les exercices comme un jeu, étape par étape, avec des mots simples et encourageants. \n\nIMPORTANT : Utilise EXCLUSIVEMENT les délimiteurs '$' pour les formules en ligne et '$$' pour les formules en bloc pour le rendu mathématique.",
            examen: "Tu es un coach d'examen. Pour les exercices, montre exactement comment rédiger pour obtenir tous les points. Insiste sur les erreurs fatales qui font perdre des points au Bac/Brevet guinéen. \n\nIMPORTANT : Utilise EXCLUSIVEMENT les délimiteurs '$' pour les formules en ligne et '$$' pour les formules en bloc pour le rendu mathématique."
        };

        try {
            const data = await apiCall('/ai/chat', {
                method: 'POST',
                body: JSON.stringify({
                    messages: [
                        { 
                            role: "system", 
                            content: `${modePrompts[mode]} \n\nTES RÈGLES STRICTES : \n1. N'utilise JAMAIS d'emojis. \n2. Utilise uniquement le format Markdown standard. \n3. Si tu génères un tableau, utilise obligatoirement le format de tableau Markdown avec des traits de séparation (| et -). \n4. Pas de balises HTML comme <br>. \n5. Reste concentré sur les matières du programme guinéen : Mathématiques, Physique, Chimie, Biologie (SVT), Français, Histoire, Géographie, Philosophie, Économie.` 
                        },
                        ...messages.map(m => ({ role: m.sender === 'ai' ? 'assistant' : 'user', content: m.text })),
                        { role: "user", content: textToSend }
                    ]
                })
            });

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: data.choices[0].message.content,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    const formatText = (text: string) => {
        let formatted = text.replace(/<br\s*\/?>/gi, '\n');
        
        // Convert [ ... ] or \[ ... \] to $$ ... $$ (Block math)
        formatted = formatted.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$');
        formatted = formatted.replace(/\[\s*(.*?)\s*\]/g, (match, p1) => {
            // Only convert if it looks like math (contains \ or ^ or _)
            if (p1.includes('\\') || p1.includes('^') || p1.includes('_')) {
                return `$$${p1}$$`;
            }
            return match;
        });

        // Convert \( ... \) to $ ... $ (Inline math)
        formatted = formatted.replace(/\\\(/g, '$').replace(/\\\)/g, '$');
        
        return formatted;
    };

    return (
        <div className="flex flex-col h-screen bg-[#F0F2F5] overflow-hidden font-sans">
            {/* Header - Responsive */}
            <div className="bg-white border-b border-emerald-100 p-4 flex items-center justify-between px-4 md:px-8 h-16 shrink-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 -ml-2 lg:hidden text-emerald-800 hover:bg-emerald-50 rounded-xl"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-[#1B6B3A] rounded-full flex items-center justify-center shadow-lg shadow-[#1B6B3A]/20">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-sm md:text-base font-black text-[#0F2D1E] leading-tight">Assistant</h1>
                        <p className="text-[9px] font-black text-[#1B6B3A] uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1 h-1 bg-[#1B6B3A] rounded-full animate-pulse" />
                            En ligne
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar max-w-[50%] sm:max-w-none">
                    {[
                        { id: 'normal', label: 'Standard' },
                        { id: 'professeur', label: 'Prof' },
                        { id: 'enfant', label: 'Enfant' },
                        { id: 'examen', label: 'Examen' }
                    ].map((m) => (
                        <button 
                            key={m.id} 
                            onClick={() => setMode(m.id as AssistantMode)}
                            className={`text-[10px] md:text-xs font-black transition-all relative py-2 whitespace-nowrap ${mode === m.id ? 'text-[#1B6B3A]' : 'text-gray-400'}`}
                        >
                            {m.label}
                            {mode === m.id && <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#1B6B3A] rounded-full" />}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 md:gap-4 text-emerald-800/40">
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setMessages([])} />
                    <Settings className="hidden xs:block w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-[#0F2D1E]" />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar Left - Responsive Overlay for Mobile */}
                <aside className={`
                    absolute lg:relative z-40 h-full w-72 md:w-80 bg-white border-r border-emerald-50 flex flex-col p-6 overflow-y-auto no-scrollbar shrink-0 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="mb-10">
                        <h4 className="text-[10px] font-black text-[#0F2D1E] uppercase tracking-[0.2em] mb-8 px-2 border-l-2 border-[#1B6B3A] pl-3">
                             Actions Rapides
                        </h4>
                        <div className="space-y-6 px-2 md:px-4">
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(action.prompt)}
                                    className="w-full flex items-center gap-5 text-left transition-all group"
                                >
                                    <div className="p-2.5 bg-[#1B6B3A]/5 rounded-xl group-hover:bg-[#1B6B3A] transition-all shadow-sm group-hover:shadow-[#1B6B3A]/20">
                                        <action.icon className="w-4 h-4 text-[#1B6B3A] group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-xs md:text-[13px] font-bold text-gray-700 group-hover:text-[#0F2D1E] tracking-tight">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-[#0F2D1E] uppercase tracking-[0.2em] mb-8 px-2 border-l-2 border-[#1B6B3A] pl-3">
                            Traduire
                        </h4>
                        <div className="grid grid-cols-1 gap-3 px-2">
                            {localLanguages.map((lang, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(`Traduis en ${lang}.`)}
                                    className="w-full p-4 bg-[#1B6B3A]/5 border border-[#1B6B3A]/10 text-[#0F2D1E] text-[10px] font-black rounded-xl hover:bg-[#1B6B3A] hover:text-white hover:border-[#1B6B3A] transition-all uppercase tracking-wider shadow-sm"
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div 
                        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Chat Container */}
                <div className="flex-1 flex flex-col overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                    <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 scroll-smooth no-scrollbar">
                        <div className="max-w-4xl mx-auto w-full space-y-6 pb-28">
                            {messages.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`relative max-w-[90%] md:max-w-[85%] px-4 md:px-5 py-3 md:py-4 shadow-sm border ${
                                        msg.sender === 'user' 
                                        ? 'bg-[#DCF8C6] border-emerald-200 text-gray-800 rounded-2xl rounded-tr-none' 
                                        : 'bg-white border-gray-100 text-gray-800 rounded-2xl rounded-tl-none'
                                    }`}>
                                        <div className="prose prose-sm max-w-none ai-content text-[14px] md:text-[15px] leading-relaxed text-gray-800">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkMath, remarkGfm]} 
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {formatText(msg.text)}
                                            </ReactMarkdown>
                                        </div>
                                        <div className="flex justify-end mt-1 gap-1.5 items-center">
                                            <span className="text-[9px] md:text-[10px] font-bold text-emerald-800/40 uppercase tracking-tighter">{msg.timestamp}</span>
                                            {msg.sender === 'user' && (
                                                <div className="flex">
                                                    <span className="text-emerald-500 text-[10px]">✓</span>
                                                    <span className="text-emerald-500 text-[10px] -ml-1">✓</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Telegram-style Input Bar - Responsive */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-[#F0F2F5] via-[#F0F2F5] to-transparent">
                        <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-3 px-1">
                            {/* The Main Input Bubble */}
                            <div className="flex-1 bg-white rounded-[24px] md:rounded-[28px] shadow-md flex items-end p-1.5 md:p-2 transition-all focus-within:shadow-xl border border-emerald-100 focus-within:border-emerald-300">
                                <button className="p-2 md:p-3.5 text-emerald-800/40 hover:text-emerald-600 transition-colors">
                                    <Smile className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                
                                <textarea 
                                    rows={1}
                                    placeholder="Message"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    className="flex-1 py-2.5 md:py-3.5 px-2 md:px-3 bg-transparent text-sm md:text-[15px] outline-none placeholder:text-gray-400 font-medium text-gray-800 resize-none max-h-32 md:max-h-48 no-scrollbar"
                                />
                                
                                <button className="p-2 md:p-3.5 text-emerald-800/40 hover:text-emerald-600 transition-colors">
                                    <Paperclip className="w-5 h-5 md:w-6 md:h-6 -rotate-45" />
                                </button>
                            </div>

                            {/* The Circular Send Button */}
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleSend()}
                                className={`w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-all shrink-0 ${
                                    inputValue.trim() 
                                    ? 'bg-[#1B6B3A] text-white shadow-[#1B6B3A]/20' 
                                    : 'bg-white text-[#1B6B3A]/30 shadow-black/5 border border-[#1B6B3A]/5'
                                }`}
                            >
                                {inputValue.trim() ? (
                                    <Send className="w-5 h-5 md:w-6 md:h-6 translate-x-0.5 -translate-y-0.5 rotate-45" fill="currentColor" />
                                ) : (
                                    <Mic className="w-5 h-5 md:w-6 md:h-6" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .ai-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                    border: 2px solid #ECFDF5;
                    background: white;
                    border-radius: 12px;
                    overflow-x: auto;
                    display: block;
                }
                .ai-content th, .ai-content td {
                    border: 1px solid #ECFDF5;
                    padding: 10px md:14px;
                    text-align: left;
                    min-width: 100px;
                }
                .ai-content th {
                    background-color: #F0FDF4;
                    font-weight: 900;
                    color: #065F46;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.05em;
                }
                .ai-content tr:nth-child(even) {
                    background-color: #F9FAFB;
                }
                
                @media (max-width: 640px) {
                    .ai-content table { font-size: 12px; }
                    .ai-content th, .ai-content td { padding: 8px; }
                }
            `}</style>
        </div>
    );
};
