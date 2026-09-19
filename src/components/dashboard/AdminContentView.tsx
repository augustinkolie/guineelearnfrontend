'use client';

import React from 'react';
import { BookOpen, Video, FileText, Loader2, X, Globe, CheckCircle2, FileUp, Image, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { useAdminContent } from '@/features/admin/hooks/useAdminContent';
import { ContentStatsBar, ContentTable } from '@/features/admin/components/AdminContentPanels';

/**
 * AdminContentView (Conteneur ultra-léger < 100 lignes)
 * Conforme aux principes SOLID & GoF.
 */
export const AdminContentView = ({ user }: { user: any }) => {
    const {
        content, isLoading, viewMode, setViewMode, searchTerm, setSearchTerm,
        isDeleteModalOpen, setIsDeleteModalOpen, itemToDelete, setItemToDelete,
        isEditModalOpen, setIsEditModalOpen, itemToEdit, setItemToEdit,
        isPreviewModalOpen, setIsPreviewModalOpen, itemToPreview, setItemToPreview,
        isCreateModalOpen, setIsCreateModalOpen,
        createForm, setCreateForm, createFiles, setCreateFiles,
        isSubmitting, notification,
        bookFileRef, coverImageRef,
        handleCreate, handleToggleVisibility, handleDelete, handleUpdate,
        filteredContent
    } = useAdminContent();

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
            case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
            default: return <BookOpen className="w-5 h-5 text-emerald-500" />;
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#1B6B3A] animate-spin" />
            <p className="text-gray-500 font-bold">Chargement du catalogue...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ContentStatsBar
                content={content}
                viewMode={viewMode}
                searchTerm={searchTerm}
                notification={notification}
                onSetViewMode={setViewMode}
                onSetSearchTerm={setSearchTerm}
                onOpenCreate={() => setIsCreateModalOpen(true)}
            />

            {viewMode === 'LIST' ? (
                <ContentTable
                    filteredContent={filteredContent}
                    onPreview={item => { setItemToPreview(item); setIsPreviewModalOpen(true); }}
                    onEdit={item => { setItemToEdit(item); setIsEditModalOpen(true); }}
                    onToggle={handleToggleVisibility}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    {filteredContent.map((c) => (
                        <div key={c.id} className="bg-gray-50/50 rounded-lg border border-gray-200 overflow-hidden hover:border-[#1B6B3A]/20 group p-4 flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-white rounded-lg group-hover:bg-[#E8F5EE]">{getTypeIcon(c.type)}</div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setItemToPreview(c); setIsPreviewModalOpen(true); }} className="p-1.5 bg-white text-gray-400 rounded-md hover:text-[#1B6B3A]"><Eye className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => { setItemToEdit(c); setIsEditModalOpen(true); }} className="p-1.5 bg-white text-gray-400 rounded-md hover:text-[#1B6B3A]"><Edit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={e => { e.stopPropagation(); handleToggleVisibility(c); }}
                                        className={`p-1.5 rounded-md ${c.isPublished === false ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {c.isPublished === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-[#0F2D1E] mb-1 line-clamp-2 group-hover:text-[#1B6B3A]">{c.title}</h4>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-3">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{c.subject}</p>
                                    <p className="text-[11px] font-bold text-[#1B6B3A]">{c.level}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {isPreviewModalOpen && itemToPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-[#0F2D1E]">Aperçu de la ressource</h2>
                            <button onClick={() => setIsPreviewModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex shrink-0 items-center justify-center w-10 h-10 bg-white rounded-lg">{getTypeIcon(itemToPreview.type)}</div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#0F2D1E]">{itemToPreview.title}</h3>
                                    <p className="text-[10px] font-bold text-[#1B6B3A] uppercase">{itemToPreview.subject} • {itemToPreview.level}</p>
                                </div>
                            </div>
                            {itemToPreview.description && <p className="text-xs text-gray-600 leading-relaxed">{itemToPreview.description}</p>}
                            {itemToPreview.url && (
                                <a href={itemToPreview.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B6B3A] text-white text-sm rounded-lg font-bold">
                                    <Globe className="w-4 h-4" /> Ouvrir le lien externe
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && itemToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-[#0F2D1E]">Modifier la ressource</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du cours</label>
                                <input type="text" required value={itemToEdit.title} onChange={e => setItemToEdit({ ...itemToEdit, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Matière</label>
                                <input type="text" required value={itemToEdit.subject} onChange={e => setItemToEdit({ ...itemToEdit, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Niveau</label>
                                <input type="text" required value={itemToEdit.level} onChange={e => setItemToEdit({ ...itemToEdit, level: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none" />
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['COURSE', 'VIDEO', 'PDF'].map(t => (
                                        <button key={t} type="button" onClick={() => setItemToEdit({ ...itemToEdit, type: t })}
                                            className={`py-2.5 rounded-lg border font-bold text-xs ${itemToEdit.type === t ? 'bg-[#E8F5EE] border-[#1B6B3A] text-[#1B6B3A]' : 'bg-white border-gray-200 text-gray-400'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-full pt-2">
                                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6" /></div>
                        <h2 className="text-lg font-black text-[#0F2D1E] text-center mb-2">Confirmer la suppression</h2>
                        <p className="text-sm text-gray-500 text-center mb-6">Supprimer <span className="font-bold text-[#0F2D1E]">{itemToDelete?.title}</span> ?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-50 text-gray-500 rounded-lg text-sm font-bold">Annuler</button>
                            <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-3 bg-red-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-[#0F2D1E]">Nouveau contenu</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre *</label>
                                <input type="text" required placeholder="Ex: Exercices types Bac" value={createForm.title} onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Matière *</label>
                                <input type="text" required placeholder="Ex: Mathématiques" value={createForm.subject} onChange={e => setCreateForm({ ...createForm, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Niveau *</label>
                                <select required value={createForm.level} onChange={e => setCreateForm({ ...createForm, level: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm outline-none appearance-none">
                                    {['Terminale', '1ère', '2ème', '3ème', 'Licence', 'Master'].map(l => <option key={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="col-span-full space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['COURSE', 'VIDEO', 'PDF'].map(t => (
                                        <button key={t} type="button" onClick={() => setCreateForm({ ...createForm, type: t })}
                                            className={`py-2.5 rounded-lg border font-bold text-xs ${createForm.type === t ? 'bg-[#E8F5EE] border-[#1B6B3A] text-[#1B6B3A]' : 'bg-white border-gray-200 text-gray-400'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {createForm.type === 'PDF' && (
                                <div className="col-span-full space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fichier PDF *</label>
                                    <div onClick={() => bookFileRef.current?.click()} className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer ${createFiles.bookFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-[#1B6B3A]/30'}`}>
                                        <input type="file" ref={bookFileRef} accept="application/pdf" onChange={e => setCreateFiles({ ...createFiles, bookFile: e.target.files?.[0] || null })} className="hidden" />
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${createFiles.bookFile ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                            {createFiles.bookFile ? <CheckCircle2 className="w-6 h-6" /> : <FileUp className="w-6 h-6" />}
                                        </div>
                                        <p className="text-sm font-bold text-[#0F2D1E]">{createFiles.bookFile ? createFiles.bookFile.name : 'Choisir le PDF'}</p>
                                    </div>
                                </div>
                            )}
                            <div className="col-span-full pt-2">
                                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2">
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
