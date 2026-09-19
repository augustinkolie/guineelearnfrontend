'use client';

import React from 'react';
import { Users, Search, Filter, UserPlus, Mail, Calendar, Edit2, X, Loader2, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAdminUsers, schoolLevelsMappingUsers } from '@/features/admin/hooks/useAdminUsers';

/**
 * AdminUsersView (Conteneur ultra-léger < 130 lignes)
 * Conforme aux principes SOLID & GoF.
 */
export const AdminUsersView = ({ user }: { user: any }) => {
    const {
        isLoading, error, searchTerm, setSearchTerm, roleFilter, setRoleFilter,
        isDetailsModalOpen, setIsDetailsModalOpen, userToShow, setUserToShow,
        isEditModalOpen, setIsEditModalOpen, userToEdit, setUserToEdit,
        isSubmitting, notification,
        isInviteModalOpen, setIsInviteModalOpen, inviteForm, setInviteForm,
        activeCategory, setActiveCategory,
        fetchUsers, handleInviteUser, handleToggleStatus, handleUpdate,
        filteredUsers, getRoleBadgeColor
    } = useAdminUsers();

    if (isLoading) return <div className="flex flex-col items-center justify-center p-20 gap-4"><Loader2 className="w-10 h-10 text-[#1B6B3A] animate-spin" /><p className="text-gray-500 font-bold">Chargement des utilisateurs...</p></div>;
    if (error) return <div className="flex flex-col items-center justify-center p-20 gap-4 text-center"><AlertCircle className="w-12 h-12 text-red-500" /><h3 className="text-xl font-bold text-[#0F2D1E]">{error}</h3><button onClick={fetchUsers} className="mt-2 px-6 py-2 bg-[#1B6B3A] text-white rounded-lg font-bold">Réessayer</button></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border animate-in slide-in-from-right-full duration-300 ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-black text-[#0F2D1E]">Gestion Utilisateurs</h1><p className="text-gray-500 font-medium text-xs">Administrez les comptes et les accès de la plateforme.</p></div>
                <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm active:scale-[0.98] shadow-[#1B6B3A]/20">
                    <UserPlus className="w-4 h-4" /> Inviter un utilisateur
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Rechercher par nom ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none placeholder:text-gray-400" />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="flex-1 py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 outline-none cursor-pointer">
                        <option value="ALL">Tous les rôles</option>
                        <option value="STUDENT">Étudiants</option>
                        <option value="TEACHER">Professeurs</option>
                        <option value="PARENT">Parents</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-50/50">
                            {['Utilisateur', 'Rôle', 'Statut', "Date d'inscription", 'Actions'].map((h, i) => (
                                <th key={h} className={`px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className={`hover:bg-gray-50/30 group ${u.status === 'SUSPENDED' ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${u.status === 'SUSPENDED' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-gradient-to-br from-[#1B6B3A]/10 to-[#1B6B3A]/20 text-[#1B6B3A] border-[#1B6B3A]/10'}`}>
                                                {u.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">{u.fullName}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium mt-0.5"><Mail className="w-3 h-3" /> {u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border tracking-wider ${getRoleBadgeColor(u.role)}`}>{u.role}</span></td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'SUSPENDED' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                            <span className={`text-[11px] font-semibold ${u.status === 'SUSPENDED' ? 'text-amber-600' : 'text-emerald-600'}`}>{u.status === 'SUSPENDED' ? 'Suspendu' : 'Actif'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
                                            <Calendar className="w-3.5 h-3.5 text-gray-300" />
                                            {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-1 text-gray-400">
                                            <button onClick={() => { setUserToShow(u); setIsDetailsModalOpen(true); }} className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg" title="Voir les détails"><ChevronRight className="w-4 h-4" /></button>
                                            <button onClick={e => { e.stopPropagation(); handleToggleStatus(u); }} className={`relative w-9 h-5 rounded-full duration-300 ${u.status === 'SUSPENDED' ? 'bg-gray-200' : 'bg-[#1B6B3A]'}`}>
                                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${u.status === 'SUSPENDED' ? 'translate-x-0' : 'translate-x-4'}`} />
                                            </button>
                                            <button onClick={() => { setUserToEdit(u); setIsEditModalOpen(true); }} className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg" title="Modifier"><Edit2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center"><div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8 text-gray-300" /></div><h3 className="text-lg font-bold text-[#0F2D1E]">Aucun utilisateur trouvé</h3></div>
                )}
            </div>

            {/* Details Modal */}
            {isDetailsModalOpen && userToShow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-black text-[#0F2D1E]">Détails Utilisateur</h2><button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6 text-gray-400" /></button></div>
                        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg mb-6">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#1B6B3A] text-3xl font-black border border-gray-200">{userToShow.fullName.charAt(0)}</div>
                            <div><h3 className="text-2xl font-black text-[#0F2D1E]">{userToShow.fullName}</h3><p className="text-gray-400 font-bold text-sm">{userToShow.email}</p>
                                <span className={`mt-2 inline-block px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase ${getRoleBadgeColor(userToShow.role)}`}>{userToShow.role}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            {[['Téléphone', userToShow.phone || 'Non renseigné'], ["Date d'inscription", new Date(userToShow.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })]].map(([label, val]) => (
                                <div key={label} className="space-y-1.5"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</p><div className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E]">{val}</div></div>
                            ))}
                            {userToShow.studentProfile && <>
                                {[['Niveau scolaire', userToShow.studentProfile.schoolLevel], ['Série / Option', userToShow.studentProfile.track || 'Général']].map(([l, v]) => (
                                    <div key={l} className="space-y-1.5"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{l}</p><div className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E]">{v}</div></div>
                                ))}
                                {[['Établissement', userToShow.studentProfile.schoolName || 'Non renseigné'], ['Ville / Localité', userToShow.studentProfile.city || 'Non renseigné']].map(([l, v]) => (
                                    <div key={l} className="col-span-full space-y-1.5"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{l}</p><div className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E]">{v}</div></div>
                                ))}
                            </>}
                            {userToShow.teacherProfile && <>
                                <div className="col-span-full space-y-1.5"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Matières enseignées</p><div className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E]">{userToShow.teacherProfile.subjects}</div></div>
                                <div className="space-y-1.5"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Expérience</p><div className="px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E]">{userToShow.teacherProfile.experienceYears || '0'} ans</div></div>
                            </>}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && userToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-black text-[#0F2D1E]">Modifier Utilisateur</h2><button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6 text-gray-400" /></button></div>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            {[{ label: 'Nom complet', field: 'fullName', type: 'text' }, { label: 'Email', field: 'email', type: 'email' }].map(({ label, field, type }) => (
                                <div key={field} className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                                    <input type={type} required value={userToEdit[field]} onChange={e => setUserToEdit({ ...userToEdit, [field]: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg font-bold text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none" />
                                </div>
                            ))}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Rôle</label>
                                <select value={userToEdit.role} onChange={e => setUserToEdit({ ...userToEdit, role: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg font-bold text-[#0F2D1E] outline-none appearance-none cursor-pointer">
                                    {[['STUDENT', 'Étudiant'], ['TEACHER', 'Professeur'], ['PARENT', 'Parent'], ['ADMIN', 'Administrateur']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#1B6B3A] text-white rounded-lg font-black text-lg shadow-[#1B6B3A]/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4">
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-8 max-w-xl w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div><h2 className="text-xl font-black text-[#0F2D1E]">Inviter un utilisateur</h2><p className="text-gray-400 text-[11px] font-semibold mt-1">Créez un compte directement depuis l'interface administrateur.</p></div>
                            <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleInviteUser} className="mt-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[{ label: 'Nom complet *', field: 'fullName', type: 'text', placeholder: 'Ex: Mamadou Diallo' }, { label: 'Adresse Email *', field: 'email', type: 'email', placeholder: 'Ex: m.diallo@email.com' }, { label: 'Téléphone', field: 'phone', type: 'tel', placeholder: 'Ex: 621 00 00 00' }].map(({ label, field, type, placeholder }) => (
                                    <div key={field} className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                                        <input type={type} required={label.includes('*')} value={(inviteForm as any)[field]} onChange={e => setInviteForm({ ...inviteForm, [field]: e.target.value })} placeholder={placeholder}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none placeholder:font-normal placeholder:text-gray-400" />
                                    </div>
                                ))}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rôle *</label>
                                    <select required value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none appearance-none cursor-pointer">
                                        {[['STUDENT', 'Étudiant'], ['TEACHER', 'Professeur'], ['PARENT', 'Parent'], ['ADMIN', 'Administrateur']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                </div>
                                {inviteForm.role === 'STUDENT' && <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Niveau Global</label>
                                        <select value={activeCategory} onChange={e => { setActiveCategory(e.target.value); setInviteForm({ ...inviteForm, schoolLevel: schoolLevelsMappingUsers[e.target.value]?.[0] || '' }); }} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none appearance-none cursor-pointer">
                                            <option value="">Sélectionner Niveau</option>
                                            {Object.keys(schoolLevelsMappingUsers).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Classe / Année</label>
                                        <select required disabled={!activeCategory} value={inviteForm.schoolLevel} onChange={e => setInviteForm({ ...inviteForm, schoolLevel: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none appearance-none cursor-pointer disabled:opacity-50">
                                            <option value="">Sélectionner Classe</option>
                                            {activeCategory && schoolLevelsMappingUsers[activeCategory].map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                        </select>
                                    </div>
                                </>}
                                {inviteForm.role === 'TEACHER' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Matières enseignées</label>
                                        <input type="text" value={inviteForm.subjects} onChange={e => setInviteForm({ ...inviteForm, subjects: e.target.value })} placeholder="Ex: Mathématiques, Physique"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none placeholder:font-normal placeholder:text-gray-400" />
                                    </div>
                                )}
                                <div className="space-y-1.5 col-span-full">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mot de passe temporaire *</label>
                                    <input type="password" required minLength={6} value={inviteForm.password} onChange={e => setInviteForm({ ...inviteForm, password: e.target.value })} placeholder="Minimum 6 caractères"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] outline-none" />
                                </div>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm shadow-[#1B6B3A]/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-5 h-5" /> Créer le compte</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
