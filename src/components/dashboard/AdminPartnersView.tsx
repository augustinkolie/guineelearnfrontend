'use client';

import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Award, 
    Plus, 
    Globe, 
    Layout, 
    ExternalLink, 
    CheckCircle, 
    Clock, 
    XCircle,
    Building,
    User,
    Search,
    Filter,
    ArrowUpRight,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const INITIAL_SPONSORS = [
    { id: 1, name: 'Ministère de l\'Éducation', type: 'Institutionnel', placement: 'En-tête & Footer', status: 'Actif', logo: null },
    { id: 2, name: 'Orange Guinée', type: 'Entreprise', placement: 'Section Partenaires', status: 'Actif', logo: null },
    { id: 3, name: 'TotalEnergies', type: 'Sponsor Gold', placement: 'Cours Premium', status: 'Inactif', logo: null },
];

const INITIAL_BOURSES = [
    { id: 'BR-4001', student: 'Mamadou Touré', type: 'Aide Sociale', percent: '50%', status: 'En attente', date: '10/04/2026' },
    { id: 'BR-4002', student: 'Aïssatou Sow', type: 'Excédence Académique', percent: '100%', status: 'Approuvé', date: '08/04/2026' },
    { id: 'BR-4003', student: 'Sekou Bangoura', type: 'Réduction Rentrée', percent: '25%', status: 'Refusé', date: '05/04/2026' },
];

export const AdminPartnersView = () => {
    const [activeTab, setActiveTab] = useState<'sponsors' | 'bourses'>('sponsors');
    const [sponsors, setSponsors] = useState(INITIAL_SPONSORS);
    const [bourses, setBourses] = useState(INITIAL_BOURSES);
    
    // UI States
    const [searchTerm, setSearchTerm] = useState('');
    const [bourseFilter, setBourseFilter] = useState('Tous');
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal States
    const [isAddSponsorModalOpen, setIsAddSponsorModalOpen] = useState(false);
    const [isProcessBourseModalOpen, setIsProcessBourseModalOpen] = useState(false);
    const [selectedBourse, setSelectedBourse] = useState<any>(null);

    // Form States
    const [newSponsor, setNewSponsor] = useState({ name: '', type: 'Entreprise', placement: 'Général' });

    // Toast Timer
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Actions
    const handleAddSponsor = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulating API call
        setTimeout(() => {
            const partner = {
                id: Date.now(),
                ...newSponsor,
                status: 'Actif',
                logo: null
            };
            setSponsors([partner, ...sponsors]);
            setIsAddSponsorModalOpen(false);
            setNotification({ msg: `${newSponsor.name} ajouté avec succès`, type: 'success' });
            setNewSponsor({ name: '', type: 'Entreprise', placement: 'Général' });
            setIsSubmitting(false);
        }, 800);
    };

    const handleProcessBourse = (status: 'Approuvé' | 'Refusé') => {
        if (!selectedBourse) return;
        setIsSubmitting(true);

        setTimeout(() => {
            setBourses(prev => prev.map(b => 
                b.id === selectedBourse.id ? { ...b, status } : b
            ));
            setIsProcessBourseModalOpen(false);
            setNotification({ 
                msg: `Dossier ${selectedBourse.id} ${status.toLowerCase()} avec succès`, 
                type: 'success' 
            });
            setIsSubmitting(false);
        }, 600);
    };

    // Filtering
    const filteredBourses = bourses.filter(b => {
        const matchesSearch = b.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = bourseFilter === 'Tous' || 
                             (bourseFilter === 'Demandes' && b.status === 'En attente') ||
                             (bourseFilter === 'Approuvés' && b.status === 'Approuvé') ||
                             (bourseFilter === 'Refusés' && b.status === 'Refusé');
        return matchesSearch && matchesStatus;
    });

    const filteredSponsors = sponsors.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Notifications */}
            {notification && (
                <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-lg  border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 font-bold" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E] flex items-center gap-3 tracking-tight">
                        <Users className="w-6 h-6 text-[#1B6B3A]" />
                        Partenariats & Bourses
                    </h1>
                    <p className="text-gray-500 font-medium text-xs mt-1">Gérez l'écosystème de soutien et les aides financières.</p>
                </div>
                
                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
                    <button 
                        onClick={() => setActiveTab('sponsors')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm  ${activeTab === 'sponsors' ? 'bg-[#1B6B3A] text-white  shadow-[#1B6B3A]/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Building className="w-4 h-4" />
                        Sponsors
                    </button>
                    <button 
                        onClick={() => setActiveTab('bourses')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm  ${activeTab === 'bourses' ? 'bg-[#1B6B3A] text-white  shadow-[#1B6B3A]/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Award className="w-4 h-4" />
                        Bourses
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200  overflow-hidden relative group">
                    <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform text-gray-200">
                        <Building className="w-14 h-14" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Sponsors Actifs</p>
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs ring-1 ring-emerald-100 bg-emerald-50 w-fit px-2.5 py-1 rounded-full">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                {sponsors.filter(s => s.status === 'Actif').length} partenaires
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-[#0F2D1E] leading-none">{sponsors.filter(s => s.status === 'Actif').length.toString().padStart(2, '0')}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200  overflow-hidden relative group">
                    <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform text-gray-200">
                        <User className="w-14 h-14" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">En attente</p>
                            <p className="text-xs font-bold text-amber-600 italic">{bourses.filter(b => b.status === 'En attente').length} dossiers</p>
                        </div>
                        <h3 className="text-2xl font-black text-[#0F2D1E] leading-none">{bourses.filter(b => b.status === 'En attente').length}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200  overflow-hidden relative group">
                    <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform">
                        <Globe className="w-14 h-14 text-gray-200" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Total Aides</p>
                            <p className="text-xs font-bold text-gray-500 italic tracking-tight font-mono">GNF économisés</p>
                        </div>
                        <h3 className="text-2xl font-black text-[#1B6B3A] leading-none mt-1">12.5M</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            {activeTab === 'sponsors' ? (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Gestion des Partenaires</h3>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 md:min-w-[240px]">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Nom du partenaire..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:border-[#1B6B3A]/20  outline-none" 
                                />
                            </div>
                            <button 
                                onClick={() => setIsAddSponsorModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-lg font-bold    shadow-[#1B6B3A]/20 whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" /> Ajouter
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredSponsors.map((partner) => (
                            <div key={partner.id} className="bg-white p-3.5 rounded-lg border border-gray-200  space-y-3 hover:border-[#1B6B3A]/30  group">
                                <div className="h-14 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200 group-hover:bg-gray-100 transition-colors">
                                    <Building className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="text-sm font-bold text-[#0F2D1E] truncate pr-2">{partner.name}</h4>
                                        <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${partner.status === 'Actif' ? 'bg-emerald-50  shadow-emerald-500/50' : 'bg-gray-300'}`} />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{partner.type}</p>
                                </div>
                                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                        <Layout className="w-3.5 h-3.5 text-gray-400" />
                                        {partner.placement}
                                    </div>
                                    <button 
                                        onClick={() => setNotification({ msg: "Lien externe simulé", type: 'success' })}
                                        className="p-1.5 text-gray-400 hover:text-[#1B6B3A] transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200  flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg">
                            {['Tous', 'Demandes', 'Approuvés', 'Refusés'].map((sub) => (
                                <button 
                                    key={sub} 
                                    onClick={() => setBourseFilter(sub)}
                                    className={`px-5 py-1.5 rounded-lg font-bold text-xs  ${bourseFilter === sub ? 'bg-white  text-[#1B6B3A]' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1 md:max-w-xs">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Rechercher un dossier..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm font-medium focus:bg-white focus:border-[#1B6B3A]/20  outline-none" 
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-sans">
                                <thead className="bg-gray-50/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Dossier</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Élève</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type d'Aide</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Taux</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Statut</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredBourses.map((bourse) => (
                                        <tr key={bourse.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-5 text-sm font-black text-[#1B6B3A]">{bourse.id}</td>
                                            <td className="px-6 py-5 text-sm font-bold text-[#0F2D1E]">{bourse.student}</td>
                                            <td className="px-6 py-5 text-xs font-bold text-gray-500 whitespace-nowrap">{bourse.type}</td>
                                            <td className="px-6 py-5 text-center"><span className="text-xs font-black bg-gray-100 px-2 py-1 rounded-md">{bourse.percent}</span></td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5">
                                                    {bourse.status === 'Approuvé' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : bourse.status === 'Refusé' ? <XCircle className="w-4 h-4 text-rose-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                                                    <span className={`text-[10px] font-black uppercase ${bourse.status === 'Approuvé' ? 'text-emerald-600' : bourse.status === 'Refusé' ? 'text-rose-600' : 'text-amber-600'}`}>{bourse.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => { setSelectedBourse(bourse); setIsProcessBourseModalOpen(true); }}
                                                    className="text-xs font-black text-[#1B6B3A] hover:underline uppercase tracking-tighter disabled:opacity-30"
                                                    disabled={bourse.status !== 'En attente'}
                                                >
                                                    {bourse.status === 'En attente' ? 'Traiter' : 'Archivé'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals Implementation */}
            
            {/* 1. Add Sponsor Modal */}
            {isAddSponsorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-300 px-4">
                    <div className="bg-white rounded-lg w-full max-w-md  relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-black text-[#0F2D1E]">Nouveau Partenaire</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Ajout au catalogue</p>
                            </div>
                            <button onClick={() => setIsAddSponsorModalOpen(false)} className="p-2 hover:bg-white rounded-lg  text-gray-400 hover:text-rose-500 ">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSponsor} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom de l'organisation</label>
                                <input 
                                    type="text" required autoFocus
                                    placeholder="Ex: UNICEF Guinée"
                                    value={newSponsor.name}
                                    onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] focus:ring-4 focus:ring-[#1B6B3A]/5 outline-none "
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                                    <div className="relative">
                                        <select 
                                            value={newSponsor.type}
                                            onChange={(e) => setNewSponsor({...newSponsor, type: e.target.value})}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-gray-600 outline-none appearance-none cursor-pointer"
                                        >
                                            <option>Entreprise</option>
                                            <option>Institutionnel</option>
                                            <option>Sponsor Gold</option>
                                            <option>ONG</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Emplacement</label>
                                    <input 
                                        type="text" required
                                        value={newSponsor.placement}
                                        onChange={(e) => setNewSponsor({...newSponsor, placement: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] focus:ring-4 focus:ring-[#1B6B3A]/5 outline-none "
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#1B6B3A] text-white rounded-lg font-black text-sm  shadow-[#1B6B3A]/20 hover:bg-[#155230] hover:scale-[1.01] active:scale-[0.98]  flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmer l\'ajout'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Process Bourse Modal */}
            {isProcessBourseModalOpen && selectedBourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 px-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-lg w-full  animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-20 h-20 bg-[#1B6B3A]/10 text-[#1B6B3A] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-[#0F2D1E] mb-2">Décision de Bourse</h2>
                        <p className="text-gray-500 font-medium mb-8">Traitement du dossier de <span className="text-[#1B6B3A] font-bold">{selectedBourse.student}</span> ({selectedBourse.id})</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleProcessBourse('Refusé')}
                                disabled={isSubmitting}
                                className="py-4 border-2 border-rose-100 text-rose-500 rounded-lg font-black hover:bg-rose-50 hover:border-rose-200  flex flex-col items-center justify-center gap-2"
                            >
                                <XCircle className="w-6 h-6" />
                                Refuser
                            </button>
                            <button 
                                onClick={() => handleProcessBourse('Approuvé')}
                                disabled={isSubmitting}
                                className="py-4 bg-emerald-500 text-white rounded-lg font-black  shadow-emerald-500/20  active:scale-[0.98]  flex flex-col items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-6 h-6" />
                                Approuver
                            </button>
                        </div>
                        
                        <button 
                            disabled={isSubmitting}
                            onClick={() => setIsProcessBourseModalOpen(false)}
                            className="mt-8 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Annuler et fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
