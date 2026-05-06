'use client';

import React, { useState, useEffect } from 'react';
import { 
    LifeBuoy, 
    Plus, 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    Send,
    Loader2,
    X,
    User,
    ArrowUpRight
} from 'lucide-react';
import { apiCall } from '@/utils/api';

interface StudentSupportViewProps {
    user: any;
}

export const StudentSupportView = ({ user }: StudentSupportViewProps) => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [newTicket, setNewTicket] = useState({ subject: '', category: 'TECHNIQUE', description: '' });
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const categories = ['TECHNIQUE', 'PEDAGOGIQUE', 'PAIEMENT', 'AUTRE'];

    const statusColors: any = {
        'EN_ATTENTE': 'bg-amber-500/10 text-amber-600',
        'OUVERT': 'bg-blue-500/10 text-blue-600',
        'URGENT': 'bg-rose-500/10 text-rose-600',
        'RESOLU': 'bg-emerald-500/10 text-emerald-600'
    };

    const statusLabels: any = {
        'EN_ATTENTE': 'En attente',
        'OUVERT': 'Ouvert (Réponse Admin)',
        'URGENT': 'Urgent',
        'RESOLU': 'Résolu'
    };

    const fetchTickets = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const data = await apiCall('/support', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTickets(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall('/support', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newTicket)
            });
            setNotification({ msg: 'Ticket créé avec succès !', type: 'success' });
            setIsCreateModalOpen(false);
            setNewTicket({ subject: '', category: 'TECHNIQUE', description: '' });
            fetchTickets();
        } catch (err) {
            setNotification({ msg: 'Erreur lors de la création', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenTicket = async (ticket: any) => {
        try {
            const token = localStorage.getItem('token');
            const fullTicket = await apiCall(`/support/${ticket.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedTicket(fullTicket);
            setIsDetailModalOpen(true);
        } catch (err) {
            setNotification({ msg: 'Impossible de charger le ticket', type: 'error' });
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const newMessage = await apiCall(`/support/${selectedTicket.id}/messages`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ content: replyText })
            });
            setSelectedTicket({
                ...selectedTicket,
                messages: [...selectedTicket.messages, newMessage]
            });
            setReplyText('');
            fetchTickets(); // Refresh background list
        } catch (err) {
            setNotification({ msg: 'Erreur lors de l\'envoi', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg  border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 font-bold" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Centre d'Assistance</h1>
                    <p className="text-gray-500 font-medium text-xs">Posez vos questions techniques ou pédagogiques.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm  active:scale-[0.98]   shadow-[#1B6B3A]/20"
                >
                    <Plus className="w-4 h-4" /> Nouveau Ticket
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#1B6B3A]" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Chargement de vos tickets...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="bg-white p-12 rounded-lg border border-dashed border-gray-200 text-center space-y-4">
                    <LifeBuoy className="w-12 h-12 text-gray-300 mx-auto" />
                    <div>
                        <h3 className="font-bold text-gray-600">Aucun ticket pour le moment</h3>
                        <p className="text-sm text-gray-400">Si vous avez un problème, n'hésitez pas à nous contacter.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} onClick={() => handleOpenTicket(ticket)} className="bg-white p-6 rounded-lg border border-gray-200  hover:  cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-4 h-4 text-[#1B6B3A]" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-black rounded uppercase">{ticket.ticketId}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${statusColors[ticket.status]}`}>
                                    {statusLabels[ticket.status]}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#0F2D1E] mb-2 line-clamp-1">{ticket.subject}</h3>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{ticket.description || "Pas de description supplémentaire."}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{ticket.category}</span>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                    <Clock className="w-3 h-3" /> {formatDate(ticket.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-8 max-w-lg w-full  animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#0F2D1E]">Ouvrir un ticket</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg ">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sujet *</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                                    placeholder="Ex: Problème d'accès à mon certificat"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm outline-none focus:bg-white focus:border-[#1B6B3A]/20 "
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                                <select 
                                    value={newTicket.category}
                                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm outline-none focus:bg-white focus:border-[#1B6B3A]/20 "
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea 
                                    rows={4}
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                                    placeholder="Décrivez votre problème en quelques mots..."
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm outline-none focus:bg-white focus:border-[#1B6B3A]/20  resize-none"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#1B6B3A] text-white rounded-lg font-black  shadow-[#1B6B3A]/20  active:scale-[0.98]  disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Envoyer ma demande"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {isDetailModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2D1E]/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-lg  relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-[#1B6B3A] text-white text-[10px] font-black rounded uppercase">{selectedTicket.ticketId}</span>
                                    <h3 className="text-lg font-black text-[#0F2D1E]">{selectedTicket.subject}</h3>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Statut : {statusLabels[selectedTicket.status]}</p>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-white rounded-lg  text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Description initiale</p>
                                <p className="text-sm font-medium text-[#0F2D1E] leading-relaxed">{selectedTicket.description || "Pas de description."}</p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Messages</h4>
                                {selectedTicket.messages.map((msg: any) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-4 rounded-lg max-w-[85%] ${
                                            msg.senderId === user.id 
                                            ? 'bg-[#1B6B3A] text-white rounded-tr-none' 
                                            : 'bg-gray-100 text-[#0F2D1E] rounded-tl-none'
                                        }`}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <p className={`text-[9px] mt-2 font-bold uppercase ${msg.senderId === user.id ? 'text-white/50' : 'text-gray-400'}`}>
                                                {formatDate(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-[#F8FAFC]">
                            <div className="flex items-end gap-3 max-w-3xl mx-auto">
                                <div className="flex-1 bg-white rounded-[26px] border border-gray-200 focus-within:border-[#1B6B3A]/40  duration-300 flex items-center px-4 py-1.5 min-h-[52px]">
                                    <textarea 
                                        rows={1}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Taper un message"
                                        className="flex-1 px-2 py-2.5 bg-transparent font-medium text-[15px] outline-none resize-none placeholder:text-gray-400 text-[#0F2D1E] max-h-32"
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = `${target.scrollHeight}px`;
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={handleSendReply}
                                    disabled={isSubmitting || !replyText.trim()}
                                    className={`h-[52px] w-[52px] shrink-0 flex items-center justify-center rounded-full  duration-300 ${
                                        !replyText.trim() 
                                        ? 'bg-[#D1D1D1] cursor-not-allowed' 
                                        : 'bg-[#1B6B3A] hover:bg-[#155230] hover:scale-105 active:scale-95  shadow-[#1B6B3A]/10'
                                    } group`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    ) : (
                                        <div className={`p-2.5 rounded-full transition-colors ${!replyText.trim() ? 'bg-black/5' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                            <Send className={`w-5 h-5 transition-transform ${!replyText.trim() ? 'fill-white/80' : 'fill-white translate-x-0.5 -translate-y-0.5'}`} />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
