'use client';

import React, { useState, useEffect } from 'react';
import { 
    BookOpen, 
    Plus, 
    Search, 
    Filter, 
    FileText, 
    Video, 
    Eye,
    Edit2,
    Trash2,
    Layers,
    LayoutGrid,
    LayoutList,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    Globe
} from 'lucide-react';
import { apiCall } from '@/utils/api';

interface AdminContentViewProps {
    user: any;
}

export const AdminContentView = ({ user }: AdminContentViewProps) => {
    const [content, setContent] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<any>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [itemToPreview, setItemToPreview] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Form States
    const [createForm, setCreateForm] = useState({
        title: '', description: '', level: 'Terminale', track: 'GENERAL', subject: '', type: 'COURSE', source: 'PDF', url: '', content: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await apiCall('/resources', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setContent(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const newResource = await apiCall('/resources', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(createForm)
            });
            setNotification({ msg: 'Ressource créée avec succès', type: 'success' });
            setContent(prev => [newResource, ...prev]);
            setIsCreateModalOpen(false);
            setCreateForm({
                title: '', description: '', level: 'Terminale', track: 'GENERAL', subject: '', type: 'COURSE', source: 'PDF', url: '', content: ''
            });
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall(`/resources/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotification({ msg: 'Ressource supprimée avec succès', type: 'success' });
            setContent(prev => prev.filter(c => c.id !== itemToDelete.id));
            setIsDeleteModalOpen(false);
        } catch (err) {
            setNotification({ msg: 'Erreur lors de la suppression', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemToEdit) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const updated = await apiCall(`/resources/${itemToEdit.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    title: itemToEdit.title,
                    subject: itemToEdit.subject,
                    level: itemToEdit.level,
                    type: itemToEdit.type,
                    description: itemToEdit.description,
                    url: itemToEdit.url,
                })
            });
            setNotification({ msg: 'Ressource mise à jour', type: 'success' });
            setContent(prev => prev.map(c => c.id === itemToEdit.id ? { ...c, ...updated } : c));
            setIsEditModalOpen(false);
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la mise à jour', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredContent = content.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
            case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
            default: return <BookOpen className="w-5 h-5 text-emerald-500" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-[#1B6B3A] animate-spin" />
                <p className="text-gray-500 font-bold">Chargement du catalogue...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             {/* Notifications */}
             {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Contenu & Cours</h1>
                    <p className="text-gray-500 font-medium text-xs">Gérez le catalogue des ressources éducatives.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#1B6B3A]/20 disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> Nouveau contenu
                </button>
            </div>

            {/* Quick Stats Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Total Ressources</p>
                    </div>
                    <p className="text-lg font-black text-[#0F2D1E] leading-none">{content.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                            <Video className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Vidéos</p>
                    </div>
                    <p className="text-lg font-black text-[#0F2D1E] leading-none">{content.filter(c => c.type === 'VIDEO').length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Documents PDF</p>
                    </div>
                    <p className="text-lg font-black text-[#0F2D1E] leading-none">{content.filter(c => c.type === 'PDF').length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center transition-transform group-hover:scale-110 shrink-0">
                            <Layers className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Matières actives</p>
                    </div>
                    <p className="text-lg font-black text-[#0F2D1E] leading-none">{new Set(content.map(c => c.subject)).size}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un cours..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setViewMode('LIST')}
                        className={`p-3 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-[#1B6B3A] text-white shadow-lg shadow-[#1B6B3A]/20' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutList className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('GRID')}
                        className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-[#1B6B3A] text-white shadow-lg shadow-[#1B6B3A]/20' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {viewMode === 'LIST' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ressource</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Niveau</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredContent.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/30 transition-all group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-[#E8F5EE]">
                                                    {getTypeIcon(c.type)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">{c.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{c.subject}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 underline decoration-[#1B6B3A]/20 underline-offset-4 text-xs font-black text-[#0F2D1E]">
                                            {c.level}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 text-gray-400">
                                                <button onClick={() => { setItemToPreview(c); setIsPreviewModalOpen(true); }} className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg transition-all" title="Voir"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => { setItemToEdit(c); setIsEditModalOpen(true); }} className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg transition-all" title="Modifier"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => { setItemToDelete(c); setIsDeleteModalOpen(true); }} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {filteredContent.map((c) => (
                            <div key={c.id} className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#1B6B3A]/20 transition-all group p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-white rounded-lg group-hover:bg-[#E8F5EE] transition-colors shadow-sm">
                                            {getTypeIcon(c.type)}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setItemToPreview(c); setIsPreviewModalOpen(true); }} className="p-1.5 bg-white text-gray-400 rounded-md hover:text-[#1B6B3A] shadow-sm"><Eye className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => { setItemToEdit(c); setIsEditModalOpen(true); }} className="p-1.5 bg-white text-gray-400 rounded-md hover:text-[#1B6B3A] shadow-sm"><Edit2 className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => { setItemToDelete(c); setIsDeleteModalOpen(true); }} className="p-1.5 bg-white text-gray-400 rounded-md hover:text-red-500 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#0F2D1E] mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-[#1B6B3A] transition-colors">{c.title}</h4>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 mt-3">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{c.subject}</p>
                                        <p className="text-[11px] font-bold text-[#1B6B3A]">{c.level}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {isPreviewModalOpen && itemToPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-[#0F2D1E]">Aperçu de la ressource</h2>
                            <button onClick={() => setIsPreviewModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="flex shrink-0 items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                                    {getTypeIcon(itemToPreview.type)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#0F2D1E] leading-snug">{itemToPreview.title}</h3>
                                    <p className="text-[10px] font-bold text-[#1B6B3A] uppercase tracking-wider">{itemToPreview.subject} • {itemToPreview.level}</p>
                                </div>
                            </div>
                            {itemToPreview.description && (
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Description</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{itemToPreview.description}</p>
                                </div>
                            )}
                            {itemToPreview.content && (
                                <div className="border border-gray-100 rounded-xl p-4 bg-white overflow-hidden prose max-w-none prose-sm prose-green">
                                    <div dangerouslySetInnerHTML={{ __html: itemToPreview.content }} />
                                </div>
                            )}
                            {itemToPreview.url && (
                                <div className="flex items-center justify-center pt-2">
                                    <a href={itemToPreview.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B6B3A] text-white text-sm rounded-xl font-bold shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] transition-all">
                                        <Globe className="w-4 h-4" /> Ouvrir le lien externe
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && itemToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-[#0F2D1E]">Modifier la ressource</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du cours</label>
                                <input 
                                    type="text" required value={itemToEdit.title}
                                    onChange={(e) => setItemToEdit({...itemToEdit, title: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Matière</label>
                                <input 
                                    type="text" required value={itemToEdit.subject}
                                    onChange={(e) => setItemToEdit({...itemToEdit, subject: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Niveau</label>
                                <input 
                                    type="text" required value={itemToEdit.level}
                                    onChange={(e) => setItemToEdit({...itemToEdit, level: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de ressource</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['COURSE', 'VIDEO', 'PDF'].map((t) => (
                                        <button key={t} type="button" onClick={() => setItemToEdit({...itemToEdit, type: t})} className={`py-2.5 rounded-xl border font-bold text-xs transition-all ${itemToEdit.type === t ? 'bg-[#E8F5EE] border-[#1B6B3A] text-[#1B6B3A]' : 'bg-white border-gray-100 text-gray-400'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-full pt-2">
                                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-black text-[#0F2D1E] text-center mb-2">Confirmer la suppression</h2>
                        <p className="text-sm text-gray-500 text-center mb-6 font-medium">
                            Êtes-vous sûr de vouloir supprimer <span className="text-[#0F2D1E] font-bold">{itemToDelete?.title}</span> ? Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-50 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">Annuler</button>
                            <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-[#0F2D1E]">Nouveau contenu</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de la ressource *</label>
                                <input 
                                    type="text" required value={createForm.title}
                                    placeholder="Ex: Exercices types Bac"
                                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea 
                                    rows={3} 
                                    value={createForm.description}
                                    placeholder="Courte description du contenu..."
                                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all resize-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Matière *</label>
                                <input 
                                    type="text" required value={createForm.subject}
                                    placeholder="Ex: Mathématiques"
                                    onChange={(e) => setCreateForm({...createForm, subject: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Niveau *</label>
                                <select 
                                    required value={createForm.level}
                                    onChange={(e) => setCreateForm({...createForm, level: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option>Terminale</option>
                                    <option>1ère</option>
                                    <option>2ème</option>
                                    <option>3ème</option>
                                    <option>Licence</option>
                                    <option>Master</option>
                                </select>
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de ressource *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['COURSE', 'VIDEO', 'PDF'].map((t) => (
                                        <button key={t} type="button" onClick={() => setCreateForm({...createForm, type: t})} className={`py-2.5 rounded-xl border font-bold text-xs transition-all ${createForm.type === t ? 'bg-[#E8F5EE] border-[#1B6B3A] text-[#1B6B3A]' : 'bg-white border-gray-100 text-gray-400'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL (Optionnel)</label>
                                <input 
                                    type="url" value={createForm.url}
                                    placeholder="Lien Youtube, Google Drive, etc."
                                    onChange={(e) => setCreateForm({...createForm, url: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="col-span-full pt-2">
                                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créer la ressource'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
