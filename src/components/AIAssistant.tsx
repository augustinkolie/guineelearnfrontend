'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    MessageCircleMore,
    X, 
    Send, 
    Bot, 
    Sparkles, 
    User,
    Minus,
    Maximize2
} from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
}

export const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Bonjour ! Je suis l'assistant intelligent de GuinéeLearn. Comment puis-je vous aider dans votre réussite scolaire aujourd'hui ?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const constraintsRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Thinking
        setTimeout(() => {
            const aiResponse = getMockResponse(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (input: string): string => {
        const text = input.toLowerCase();
        if (text.includes('inscrit') || text.includes('inscription') || text.includes('compte')) {
            return "Pour vous inscrire, cliquez sur le bouton 'S'identifier' en haut à droite, puis choisissez 'S'inscrire'. C'est gratuit et vous donne accès à des milliers de ressources !";
        }
        if (text.includes('prix') || text.includes('tarif') || text.includes('payer')) {
            return "GuinéeLearn propose une version gratuite pour tous. Nous avons aussi une offre 'Soutien' à 50,000 GNF/mois pour accéder aux cours vidéos premium et au suivi personnalisé.";
        }
        if (text.includes('bac') || text.includes('examen')) {
            return "Nous avons des sections dédiées aux anciens examens du BAC, BEPC et CEP. Vous y trouverez des annales corrigées pour vous entraîner efficacement.";
        }
        if (text.includes('cours') || text.includes('matière')) {
            return "Nous couvrons toutes les matières principales : Mathématiques, Français, Physique, Chimie, Biologie et Économie, du collège au lycée !";
        }
        if (text.includes('bonjour') || text.includes('salut')) {
            return "Bonjour ! Ravi de vous voir sur GuinéeLearn. Je suis là pour répondre à toutes vos questions sur la plateforme.";
        }
        return "C'est une excellente question ! En tant qu'assistant en phase bêta, je ne peux pas encore répondre à tout, mais je vous recommande de consulter notre catalogue de cours pour plus de détails.";
    };

    return (
        <>
            {/* Drag Constraints Area */}
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />

            <motion.div 
                drag
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={constraintsRef}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto"
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.8, transformOrigin: 'bottom right' }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.8 }}
                            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden shadow-[#1B6B3A]/10"
                        >
                            {/* Header */}
                            <div className="bg-[#0F2D1E] p-5 text-white cursor-move active:cursor-grabbing relative overflow-hidden">
                                {/* Unique Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1B6B3A 1.5px, transparent 1px)', backgroundSize: '12px 12px' }} />
                                
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                                <Bot className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0F2D1E] rounded-full" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm tracking-tight uppercase leading-none">Assistant GuinéeLearn</h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-[9px] text-emerald-500 font-extrabold uppercase tracking-widest leading-none">En ligne • Beta</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsOpen(false);
                                        }} 
                                        className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                {messages.map((msg) => (
                                    <div 
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm transition-all ${
                                            msg.sender === 'user' 
                                            ? 'bg-[#1B6B3A] text-white rounded-br-none shadow-lg shadow-[#1B6B3A]/20' 
                                            : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none shadow-sm'
                                        }`}>
                                            <p className="leading-relaxed">{msg.text}</p>
                                            <span className={`text-[9px] mt-1 block opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-3 shadow-sm">
                                            <div className="flex gap-1">
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Posez votre question..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:text-gray-400"
                                    />
                                    <button 
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isTyping}
                                        className="absolute right-2 top-1.5 p-2 bg-[#1B6B3A] text-white rounded-xl hover:bg-[#155230] disabled:bg-gray-300 disabled:hover:scale-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#1B6B3A]/20"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center mt-3 font-medium uppercase tracking-widest">
                                    Assistant Propulsé par <span className="text-[#1B6B3A] font-bold">GuinéeLearn AI</span>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        setIsOpen(!isOpen);
                    }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group relative cursor-grab active:cursor-grabbing ${
                        isOpen 
                        ? 'bg-white text-[#1B6B3A] rotate-90 border border-gray-100' 
                        : 'bg-[#1B6B3A] text-white shadow-[#1B6B3A]/30'
                    }`}
                >
                    {isOpen ? (
                        <X className="w-7 h-7" />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-[#1B6B3A] rounded-full animate-ping opacity-20" />
                            <MessageCircleMore className="w-7 h-7 relative z-10" />
                        </>
                    )}
                </motion.button>
            </motion.div>
        </>
    );
};
