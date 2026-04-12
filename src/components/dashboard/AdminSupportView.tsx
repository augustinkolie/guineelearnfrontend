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

const mockTickets = [
    { id: 'TK-1024', user: 'Abdoulaye Diallo', category: 'Technique', subject: 'Problème de connexion aux quiz', priority: 'Haute', status: 'En attente', date: 'Il y a 10 min', avatar: null },
    { id: 'TK-1023', user: 'Mariama Camara', category: 'Pédagogique', subject: 'Incompréhension sur le cours de Physique', priority: 'Moyenne', status: 'Ouvert', date: 'Il y a 2h', avatar: null },
    { id: 'TK-1022', user: 'Ibrahima Sory', category: 'Paiement', subject: 'Échec de la transaction Orange Money', priority: 'Critique', status: 'Urgent', date: 'Il y a 5h', avatar: null },
    { id: 'TK-1021', user: 'Fatoumata Sylla', category: 'Technique', subject: 'Lien de téléchargement expiré', priority: 'Basse', status: 'Résolu', date: 'Hier', avatar: null },
    { id: 'TK-1020', user: 'Moussa Keita', category: 'Autre', subject: 'Suggestion pour la section Terminale', priority: 'Basse', status: 'Résolu', date: 'Il y a 2 jours', avatar: null },
];

export const AdminSupportView = () => {
    const [filter, setFilter] = useState('Tous');
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const statusColors: any = {
        'En attente': 'bg-amber-500/10 text-amber-600',
        'Ouvert': 'bg-blue-500/10 text-blue-600',
        'Urgent': 'bg-rose-500/10 text-rose-600',
        'Résolu': 'bg-emerald-500/10 text-emerald-600'
    };

    const priorityColors: any = {
        'Haute': 'text-amber-500',
        'Critique': 'text-rose-600',
        'Moyenne': 'text-blue-500',
        'Basse': 'text-gray-400'
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleOpenTicket = (ticket: any) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setNotification({ msg: 'Réponse envoyée avec succès', type: 'success' });
            setReplyText('');
            setIsSubmitting(false);
            setIsModalOpen(false);
        }, 1200);
    };

    const handleUpdateStatus = (newStatus: string) => {
        setIsSubmitting(true);
        setTimeout(() => {
            setNotification({ msg: `Statut mis à jour : ${newStatus}`, type: 'success' });
            setIsSubmitting(false);
            setIsModalOpen(false);
        }, 800);
    };
    
    const filteredTickets = mockTickets.filter(ticket => {
        const matchesSearch = 
            ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
            
        if (!matchesSearch) return false;
        
        if (filter === 'Tous') return true;
        if (filter === 'Urgents') return ticket.status === 'Urgent';
        if (filter === 'Résolus') return ticket.status === 'Résolu';
        if (filter === 'En attente') return ticket.status === 'En attente' || ticket.status === 'Ouvert';
        return ticket.status === filter;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 font-bold" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Centre de Support</h1>
                    <p className="text-gray-500 font-medium text-xs">Gérez les requêtes et l'assistance utilisateur.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En attente</p>
                            <p className="text-xl font-black text-amber-500">12</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgent</p>
                            <p className="text-xl font-black text-rose-500">03</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#1B6B3A]/20 disabled:opacity-50">
                        Nouveau Message
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl">
                    {['Tous', 'En attente', 'Urgents', 'Résolus'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2 rounded-lg font-bold text-xs transition-all ${filter === tab ? 'bg-white text-[#1B6B3A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 md:max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un ticket ou un utilisateur..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#1B6B3A]/20 transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {/* Ticket List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sujet du Ticket</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priorité</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTickets.map((ticket, i) => (
                                <tr key={i} className="group hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A] overflow-hidden">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0F2D1E]">{ticket.user}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{ticket.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="max-w-xs md:max-w-md">
                                            <p className="text-sm font-bold text-[#0F2D1E] truncate">{ticket.subject}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{ticket.category}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{ticket.date}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'Critique' ? 'bg-rose-500 pulse' : 'bg-current'} ${priorityColors[ticket.priority]}`} />
                                            <span className={`text-xs font-black uppercase ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusColors[ticket.status]}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => handleOpenTicket(ticket)}
                                            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#1B6B3A] shadow-sm hover:shadow-md border border-transparent hover:border-gray-50"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer / Pagination */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 italic">Affichage de {filteredTickets.length} ticket(s) sur {mockTickets.length} au total</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-xs font-bold text-[#1B6B3A] hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">Précédent</button>
                        <button className="px-4 py-2 text-xs font-bold text-white bg-[#1B6B3A] rounded-lg shadow-sm">Suivant</button>
                    </div>
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {isModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F2D1E]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-[#1B6B3A] text-white text-[10px] font-black rounded uppercase tracking-tighter">{selectedTicket.id}</span>
                                    <h3 className="text-lg font-black text-[#0F2D1E]">Détails du Ticket</h3>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Créé {selectedTicket.date} par {selectedTicket.user}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-rose-500 shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Static Info Bar */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Sujet du Ticket</p>
                                    <p className="text-sm font-bold text-[#0F2D1E] leading-relaxed">{selectedTicket.subject}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Statut Actuel</p>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-block ${statusColors[selectedTicket.status]}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                            </div>

                            {/* Message History (Mocked) */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Historique des échanges</h4>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#E8F5EE] shrink-0 flex items-center justify-center text-[#1B6B3A]">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 max-w-[85%]">
                                        <p className="text-xs text-[#0F2D1E] leading-relaxed font-medium">Bonjour, je n'arrive pas à accéder aux quiz de Mathématiques. Le bouton de démarrage ne répond pas après avoir cliqué sur "Commencer".</p>
                                        <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase">{selectedTicket.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-[#1B6B3A] text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-[#1B6B3A]/20 max-w-[85%]">
                                        <p className="text-xs leading-relaxed font-medium italic">En attente de réponse administrative...</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#1B6B3A] shrink-0 flex items-center justify-center text-white">
                                        <LifeBuoy className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Reply Input */}
                            <div className="space-y-2 pt-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rédiger une réponse</label>
                                <textarea 
                                    rows={4}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Tapez votre message ici..."
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#1B6B3A]/30 focus:ring-4 focus:ring-[#1B6B3A]/5 transition-all text-sm font-medium resize-none shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Modal Footer / Actions */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleUpdateStatus('Résolu')}
                                    disabled={isSubmitting}
                                    className="px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all uppercase tracking-wider"
                                >
                                    Fermer & Résoudre
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus('Urgent')}
                                    disabled={isSubmitting}
                                    className="px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-black hover:bg-rose-100 transition-all uppercase tracking-wider"
                                >
                                    Marquer Urgent
                                </button>
                            </div>
                            <button 
                                onClick={handleSendReply}
                                disabled={isSubmitting || !replyText.trim()}
                                className="flex items-center gap-2 px-8 py-2.5 bg-[#1B6B3A] text-white rounded-xl font-black hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20 text-sm disabled:opacity-50 disabled:shadow-none"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Envoyer la réponse
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
