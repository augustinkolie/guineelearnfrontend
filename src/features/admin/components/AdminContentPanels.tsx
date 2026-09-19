'use client';

import React from 'react';
import { BookOpen, Video, FileText, Layers, Eye, EyeOff, Edit2, LayoutGrid, LayoutList, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContentStatsBarProps {
    content: any[];
    viewMode: 'GRID' | 'LIST';
    searchTerm: string;
    notification: { msg: string; type: 'success' | 'error' } | null;
    onSetViewMode: (mode: 'GRID' | 'LIST') => void;
    onSetSearchTerm: (v: string) => void;
    onOpenCreate: () => void;
}

export const ContentStatsBar: React.FC<ContentStatsBarProps> = ({
    content, viewMode, searchTerm, notification, onSetViewMode, onSetSearchTerm, onOpenCreate
}) => (
    <>
        {notification && (
            <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border animate-in slide-in-from-right-full duration-300 ${
                notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
                {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="font-bold text-sm">{notification.msg}</p>
            </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-black text-[#0F2D1E]">Contenu & Cours</h1>
                <p className="text-gray-500 font-medium text-xs">Gérez le catalogue des ressources éducatives.</p>
            </div>
            <button onClick={onOpenCreate} className="flex items-center gap-2 px-6 py-3 bg-[#1B6B3A] text-white rounded-lg font-bold active:scale-[0.98] shadow-[#1B6B3A]/20">
                + Nouveau contenu
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
                { label: 'Total Ressources', value: content.length, Icon: BookOpen, cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { label: 'Vidéos', value: content.filter(c => c.type === 'VIDEO').length, Icon: Video, cls: 'bg-blue-50 text-blue-600 border-blue-100' },
                { label: 'Documents PDF', value: content.filter(c => c.type === 'PDF').length, Icon: FileText, cls: 'bg-red-50 text-red-600 border-red-100' },
                { label: 'Matières actives', value: new Set(content.map(c => c.subject)).size, Icon: Layers, cls: 'bg-orange-50 text-orange-600 border-orange-100' },
            ].map(({ label, value, Icon, cls }) => (
                <div key={label} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md group flex items-center justify-between gap-6 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 shadow-sm border ${cls}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-tight">{label}</p>
                    </div>
                    <p className="text-3xl font-black text-[#0F2D1E] leading-none shrink-0">{value}</p>
                </div>
            ))}
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input type="text" placeholder="Rechercher un cours..." value={searchTerm} onChange={e => onSetSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none" />
            </div>
            <div className="flex items-center gap-2">
                {(['LIST', 'GRID'] as const).map(mode => (
                    <button key={mode} onClick={() => onSetViewMode(mode)}
                        className={`p-3 rounded-lg ${viewMode === mode ? 'bg-[#1B6B3A] text-white shadow-[#1B6B3A]/20' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}>
                        {mode === 'LIST' ? <LayoutList className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                    </button>
                ))}
            </div>
        </div>
    </>
);

interface ContentTableProps {
    filteredContent: any[];
    onPreview: (item: any) => void;
    onEdit: (item: any) => void;
    onToggle: (item: any) => void;
}

export const ContentTable: React.FC<ContentTableProps> = ({ filteredContent, onPreview, onEdit, onToggle }) => {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
            case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
            default: return <BookOpen className="w-5 h-5 text-emerald-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            {['Ressource', 'Niveau', 'Actions'].map(h => (
                                <th key={h} className={`px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredContent.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50/30 group">
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#E8F5EE]">{getTypeIcon(c.type)}</div>
                                        <div>
                                            <p className="font-bold text-sm text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">{c.title}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{c.subject}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-xs font-black text-[#0F2D1E]">{c.level}</td>
                                <td className="px-6 py-3 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button onClick={() => onPreview(c)} className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg"><Eye className="w-4 h-4" /></button>
                                        <button onClick={() => onEdit(c)} className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <div className="flex items-center gap-3 bg-gray-50/50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${c.isPublished === false ? 'text-gray-400' : 'text-emerald-500'}`}>
                                                {c.isPublished === false ? 'Masqué' : 'Actif'}
                                            </span>
                                            <button onClick={e => { e.stopPropagation(); onToggle(c); }}
                                                className={`relative w-9 h-5 rounded-full duration-300 focus:outline-none ${c.isPublished === false ? 'bg-gray-200' : 'bg-[#1B6B3A]'}`}>
                                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${c.isPublished === false ? 'translate-x-0' : 'translate-x-4'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
