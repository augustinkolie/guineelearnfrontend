'use client';

import React, { useState, useEffect } from 'react';
import { 
    LifeBuoy, 
    Search, 
    Filter, 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    ChevronRight,
    User,
    ArrowUpRight,
    MoreHorizontal,
    X,
    Send,
    Loader2
} from 'lucide-react';
import { apiCall } from '@/utils/api';

export const AdminSupportView = ({ user }: { user: any }) => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('Tous');
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const statusColors: any = {
        'EN_ATTENTE': 'bg-amber-500/10 text-amber-600',
        'OUVERT': 'bg-blue-500/10 text-blue-600',
        'URGENT': 'bg-rose-500/10 text-rose-600',
        'RESOLU': 'bg-emerald-500/10 text-emerald-600'
    };

    const priorityColors: any = {
        'HAUTE': 'text-amber-500',
        'CRITIQUE': 'text-rose-600',
        'MOYENNE': 'text-blue-500',
        'BASSE': 'text-gray-400'
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
            setNotification({ msg: 'Erreur lors du chargement des tickets', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleOpenTicket = async (ticket: any) => {
        try {
            const token = localStorage.getItem('token');
            const fullTicket = await apiCall(`/support/${ticket.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedTicket(fullTicket);
            setIsModalOpen(true);
        } catch (err) {
            setNotification({ msg: 'Impossible de charger les détails', type: 'error' });
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
            setNotification({ msg: 'Réponse envoyée avec succès', type: 'success' });
            fetchTickets();
        } catch (err) {
            setNotification({ msg: 'Erreur lors de l\'envoi', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall(`/support/${selectedTicket.id}/status`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            setNotification({ msg: `Statut mis à jour : ${newStatus}`, type: 'success' });
            setIsModalOpen(false);
            fetchTickets();
        } catch (err) {
            setNotification({ msg: 'Erreur de mise à jour', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = 
            ticket.user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
            
        if (!matchesSearch) return false;
        
        if (filter === 'Tous') return true;
        if (filter === 'Urgents') return ticket.status === 'URGENT';
        if (filter === 'Résolus') return ticket.status === 'RESOLU';
        if (filter === 'En attente') return ticket.status === 'EN_ATTENTE' || ticket.status === 'OUVERT';
        return ticket.status === filter;
    });

    const pendingCount = tickets.filter(t => t.status === 'EN_ATTENTE' || t.status === 'OUVERT').length;
    const urgentCount = tickets.filter(t => t.status === 'URGENT').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[110] flex items-center gap-3 px-6 py-4 rounded-lg  border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 font-bold" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Centre de Support</h1>
                    <p className="text-gray-500 font-medium text-xs">Gérez les requêtes et l'assistance utilisateur.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-6 py-3 rounded-lg border border-gray-200  flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En attente</p>
                            <p className="text-xl font-black text-amber-500">{pendingCount.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgent</p>
                            <p className="text-xl font-black text-rose-500">{urgentCount.toString().padStart(2, '0')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200  flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg">
                    {['Tous', 'En attente', 'Urgents', 'Résolus'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2 rounded-lg font-bold text-xs  ${filter === tab ? 'bg-white text-[#1B6B3A] ' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 md:max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg outline-none focus:bg-white focus:border-[#1B6B3A]/20  text-sm font-medium"
                    />
                </div>
            </div>

            {/* Ticket List */}
            <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sujet du Ticket</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priorité</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#1B6B3A] mx-auto mb-2" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Chargement...</p>
                                    </td>
                                </tr>
                            ) : filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-medium italic">Aucun ticket trouvé.</td>
                                </tr>
                            ) : filteredTickets.map((ticket, i) => (
                                <tr key={ticket.id} onClick={() => handleOpenTicket(ticket)} className="group hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A]">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0F2D1E]">{ticket.user?.fullName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{ticket.ticketId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="max-w-xs md:max-w-md">
                                            <p className="text-sm font-bold text-[#0F2D1E] truncate">{ticket.subject}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{ticket.category}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'CRITIQUE' ? 'bg-rose-500 animate-pulse' : 'bg-current'} ${priorityColors[ticket.priority]}`} />
                                            <span className={`text-xs font-black uppercase ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusColors[ticket.status]}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#1B6B3A] ">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {isModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F2D1E]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-2xl rounded-lg  relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 shrink-0">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-[#1B6B3A] text-white text-[10px] font-black rounded uppercase">{selectedTicket.ticketId}</span>
                                    <h3 className="text-lg font-black text-[#0F2D1E]">Répondre au Ticket</h3>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Utilisateur : {selectedTicket.user?.fullName}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-lg  text-gray-400 hover:text-rose-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Description de l'utilisateur</p>
                                <p className="text-sm font-bold text-[#0F2D1E] leading-relaxed">{selectedTicket.description || 'Pas de description.'}</p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Messages</h4>
                                {selectedTicket.messages.map((msg: any) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-4 rounded-lg max-w-[85%] ${
                                            msg.senderId === user.id 
                                            ? 'bg-[#1B6B3A] text-white rounded-tr-none  shadow-[#1B6B3A]/10' 
                                            : 'bg-gray-100 text-[#0F2D1E] rounded-tl-none border border-gray-200'
                                        }`}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <p className={`text-[9px] mt-2 font-bold uppercase ${msg.senderId === user.id ? 'text-white/50' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50/30 flex flex-col gap-4">
                            <textarea 
                                rows={3}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Tapez votre réponse ici..."
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#1B6B3A]/30  text-sm font-medium resize-none"
                            />
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleUpdateStatus('RESOLU')}
                                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-100 "
                                    >
                                        Résolu
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus('URGENT')}
                                        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase hover:bg-rose-100 "
                                    >
                                        Urgent
                                    </button>
                                </div>
                                <button 
                                    onClick={handleSendReply}
                                    disabled={isSubmitting || !replyText.trim()}
                                    className="px-8 py-2.5 bg-[#1B6B3A] text-white rounded-lg font-black text-sm hover:scale-105  disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
