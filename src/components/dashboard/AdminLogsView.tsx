'use client';

import React, { useState, useEffect } from 'react';
import { 
    History, 
    Shield, 
    FileText, 
    Users, 
    Settings as SettingsIcon, 
    Search, 
    Download,
    Terminal,
    ChevronDown,
    Activity,
    Clock,
    User,
    CheckCircle2,
    AlertTriangle,
    Zap
} from 'lucide-react';

const mockLogs = [
    { id: 1, type: 'SECURITY', action: 'Connexion Admin', user: 'Augustin K.', detail: 'Connexion réussie depuis 192.168.1.1', time: 'Il y a 2 min', status: 'success' },
    { id: 2, type: 'CONTENT', action: 'Nouveau Cours', user: 'Prof. Diallo', detail: 'Cours "Optique Géométrique" publié', time: 'Il y a 15 min', status: 'success' },
    { id: 3, type: 'USER', action: 'Suspension', user: 'Admin System', detail: 'Utilisateur ID #452 suspendu (Infraction)', time: 'Il y a 45 min', status: 'warning' },
    { id: 4, type: 'SYSTEM', action: 'Config Change', user: 'Augustin K.', detail: 'Désactivation du Mode Maintenance', time: 'Il y a 1h', status: 'info' },
    { id: 5, type: 'SECURITY', action: 'Échec Connexion', user: 'Unknown', detail: '3 tentatives échouées pour "admin_test"', time: 'Il y a 2h', status: 'danger' },
    { id: 6, type: 'CONTENT', action: 'Modif Quiz', user: 'Prof. Camara', detail: 'Quiz #12 mis à jour (Correction)', time: 'Il y a 4h', status: 'success' },
    { id: 7, type: 'USER', action: 'Inscription', user: 'Système', detail: 'Nouvel élève inscrit : Mariama B.', time: 'Il y a 6h', status: 'success' },
];

export const AdminLogsView = () => {
    const [filter, setFilter] = useState('Tous');

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SECURITY': return <Shield className="w-4 h-4 text-rose-500" />;
            case 'CONTENT': return <FileText className="w-4 h-4 text-emerald-500" />;
            case 'USER': return <Users className="w-4 h-4 text-blue-500" />;
            case 'SYSTEM': return <SettingsIcon className="w-4 h-4 text-purple-500" />;
            default: return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20';
            case 'danger': return 'bg-rose-500/10 border-rose-500/20';
            case 'info': return 'bg-blue-500/10 border-blue-500/20';
            default: return 'bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0F2D1E] flex items-center gap-3">
                        <History className="w-8 h-8 text-[#1B6B3A]" />
                        Logs & Audit
                    </h1>
                    <p className="text-gray-500 font-medium">Journal historique de toutes les actions système.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-[#0F2D1E] rounded-lg font-bold hover:bg-gray-50  ">
                        <Download className="w-5 h-5" />
                        Exporter CSV
                    </button>
                    <div className="h-10 w-px bg-gray-200 mx-2" />
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        STREAMING LIVE
                    </div>
                </div>
            </div>

            {/* Content Sidebar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200  space-y-6">
                        <h3 className="text-sm font-black text-[#0F2D1E] uppercase tracking-widest border-b border-gray-50 pb-4">Filtrer par type</h3>
                        <nav className="space-y-2">
                            {['Tous', 'Sécurité', 'Contenu', 'Utilisateurs', 'Système'].map((item) => (
                                <button 
                                    key={item}
                                    onClick={() => setFilter(item)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg  font-bold text-sm ${filter === item ? 'bg-[#1B6B3A] text-white  shadow-[#1B6B3A]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <span>{item}</span>
                                    {filter === item && <Zap className="w-3 h-3 text-emerald-300" />}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="bg-[#0F2D1E] p-6 rounded-lg  text-white space-y-4">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-sm font-black uppercase tracking-tight">Statistiques Globales</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Aujourd'hui</span>
                                <span className="text-sm font-black">1,242 logs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Alertes Critiques</span>
                                <span className="text-sm font-black text-rose-400">02</span>
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <p className="text-[10px] text-gray-500 italic">Dernier backup réussi à 00:00</p>
                        </div>
                    </div>
                </div>

                {/* Main Logs Feed */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une action, un utilisateur ou une IP..." 
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#1B6B3A]/30 focus: focus:shadow-[#1B6B3A]/5  font-medium text-[#0F2D1E]"
                        />
                    </div>

                    {/* Timeline Feed */}
                    <div className="space-y-4">
                        {mockLogs.map((log) => (
                            <div 
                                key={log.id} 
                                className={`flex items-start gap-4 p-5 rounded-lg border  hover:scale-[1.01] hover: hover:shadow-gray-200/50 bg-white group ${getStatusColor(log.status)}`}
                            >
                                <div className="mt-1 p-2 rounded-lg bg-white  border border-gray-200">
                                    {getTypeIcon(log.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-[#0F2D1E]">{log.action}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1B6B3A]">{log.user}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase">{log.time}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed truncate group-hover:text-gray-700 transition-colors">
                                        {log.detail}
                                    </p>
                                </div>
                                <div className="hidden group-hover:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[10px] font-black text-[#1B6B3A] uppercase tracking-widest bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Détails</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Placeholder */}
                    <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-xs font-black text-gray-400 uppercase tracking-widest hover:border-[#1B6B3A]/30 hover:text-[#1B6B3A]  group">
                        <span className="group-hover:animate-bounce inline-block mr-2">↓</span>
                        Charger plus d'événements
                    </button>
                </div>
            </div>
        </div>
    );
};
