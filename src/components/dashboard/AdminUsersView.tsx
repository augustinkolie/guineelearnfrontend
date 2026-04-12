'use client';

import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Search, 
    Filter, 
    UserPlus, 
    Mail, 
    Calendar,
    Ban,
    Edit2,
    X,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    UserCircle,
    ShieldCheck,
    Phone,
    BookOpen,
    GraduationCap,
    MapPin,
    School
} from 'lucide-react';
import { apiCall } from '@/utils/api';

interface AdminUsersViewProps {
    user: any;
    profile?: any;
}

export const AdminUsersView = ({ user }: AdminUsersViewProps) => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    
    // Modal states
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [userToShow, setUserToShow] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    // Invite modal
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        fullName: '', email: '', phone: '', role: 'STUDENT', password: '', schoolLevel: 'Terminale', subjects: ''
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const data = await apiCall('/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les utilisateurs.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // handleDelete has been removed - no account deletion from this UI.

    const handleInviteUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const newUser = await apiCall('/admin/users', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(inviteForm)
            });
            setNotification({ msg: `${newUser.fullName} a été invité avec succès`, type: 'success' });
            setUsers(prev => [newUser, ...prev]);
            setIsInviteModalOpen(false);
            setInviteForm({ fullName: '', email: '', phone: '', role: 'STUDENT', password: '', schoolLevel: 'Terminale', subjects: '' });
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (targetUser: any) => {
        try {
            const token = localStorage.getItem('token');
            const updated = await apiCall(`/admin/users/${targetUser.id}/status`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const isSuspended = updated.status === 'SUSPENDED';
            setNotification({ 
                msg: isSuspended ? `${updated.fullName} a été suspendu` : `${updated.fullName} a été réactivé`, 
                type: 'success' 
            });
            setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, status: updated.status } : u));
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la modification du statut', type: 'error' });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userToEdit) return;
        setIsSubmitting(true);
        try {
            const updatedUser = await apiCall(`/admin/users/${userToEdit.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    fullName: userToEdit.fullName,
                    email: userToEdit.email,
                    role: userToEdit.role
                })
            });
            setNotification({ msg: 'Utilisateur mis à jour', type: 'success' });
            setUsers(prev => prev.map(u => u.id === userToEdit.id ? { ...u, ...updatedUser } : u));
            setIsEditModalOpen(false);
        } catch (err) {
            setNotification({ msg: 'Erreur lors de la mise à jour', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-50 text-red-600 border-red-100';
            case 'TEACHER': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PARENT': return 'bg-purple-50 text-purple-600 border-purple-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-[#1B6B3A] animate-spin" />
                <p className="text-gray-500 font-bold">Chargement des utilisateurs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h3 className="text-xl font-bold text-[#0F2D1E]">{error}</h3>
                <button 
                    onClick={fetchUsers}
                    className="mt-2 px-6 py-2 bg-[#1B6B3A] text-white rounded-xl font-bold"
                >
                    Réessayer
                </button>
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
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Gestion Utilisateurs</h1>
                    <p className="text-gray-500 font-medium text-xs">Administrez les comptes et les accès de la plateforme.</p>
                </div>
                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#1B6B3A]/20 disabled:opacity-50"
                >
                    <UserPlus className="w-4 h-4" /> Inviter un utilisateur
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="flex-1 py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#1B6B3A]/20 cursor-pointer"
                    >
                        <option value="ALL">Tous les rôles</option>
                        <option value="STUDENT">Étudiants</option>
                        <option value="TEACHER">Professeurs</option>
                        <option value="PARENT">Parents</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Utilisateur</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Rôle</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Statut</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Date d'inscription</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className={`hover:bg-gray-50/30 transition-all group ${u.status === 'SUSPENDED' ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                                                u.status === 'SUSPENDED' 
                                                    ? 'bg-gray-100 text-gray-400 border-gray-200' 
                                                    : 'bg-gradient-to-br from-[#1B6B3A]/10 to-[#1B6B3A]/20 text-[#1B6B3A] border-[#1B6B3A]/10'
                                            }`}>
                                                {u.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">{u.fullName}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium mt-0.5">
                                                    <Mail className="w-3 h-3" /> {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border tracking-wider ${getRoleBadgeColor(u.role)}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'SUSPENDED' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                            <span className={`text-[11px] font-semibold ${
                                                u.status === 'SUSPENDED' ? 'text-amber-600' : 'text-emerald-600'
                                            }`}>
                                                {u.status === 'SUSPENDED' ? 'Suspendu' : 'Actif'}
                                            </span>
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
                                            <button 
                                                onClick={() => { setUserToShow(u); setIsDetailsModalOpen(true); }}
                                                className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg transition-all" 
                                                title="Voir les détails"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(u)}
                                                className={`p-1.5 rounded-lg transition-all ${
                                                    u.status === 'SUSPENDED' 
                                                        ? 'hover:bg-emerald-50 hover:text-emerald-600 text-amber-400' 
                                                        : 'hover:bg-amber-50 hover:text-amber-500'
                                                }`}
                                                title={u.status === 'SUSPENDED' ? 'Réactiver le compte' : 'Suspendre le compte'}
                                            >
                                                {u.status === 'SUSPENDED' 
                                                    ? <ShieldCheck className="w-4 h-4" /> 
                                                    : <Ban className="w-4 h-4" />
                                                }
                                            </button>
                                            <button 
                                                onClick={() => { setUserToEdit(u); setIsEditModalOpen(true); }}
                                                className="p-1.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg transition-all" 
                                                title="Modifier"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F2D1E]">Aucun utilisateur trouvé</h3>
                        <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche.</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {isDetailsModalOpen && userToShow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#0F2D1E]">Détails Utilisateur</h2>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-50">
                                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#1B6B3A] text-3xl font-black shadow-sm border border-gray-100">
                                    {userToShow.fullName.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-[#0F2D1E] tracking-tight">{userToShow.fullName}</h3>
                                    <p className="text-gray-400 font-bold text-sm tracking-tight">{userToShow.email}</p>
                                    <div className="pt-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase ${getRoleBadgeColor(userToShow.role)}`}>
                                            {userToShow.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Téléphone</p>
                                    <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                        {userToShow.phone || 'Non renseigné'}
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date d'inscription</p>
                                    <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                        {new Date(userToShow.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* Role Specific Details */}
                                {userToShow.studentProfile && (
                                    <>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Niveau scolaire</p>
                                            <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                                {userToShow.studentProfile.schoolLevel}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Série / Option</p>
                                            <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                                {userToShow.studentProfile.track || 'Général'}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 col-span-full">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Établissement</p>
                                            <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                                {userToShow.studentProfile.schoolName || 'Non renseigné'}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 col-span-full">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ville / Localité</p>
                                            <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                                {userToShow.studentProfile.city || 'Non renseigné'}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {userToShow.teacherProfile && (
                                    <>
                                        <div className="space-y-1.5 col-span-full">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Matières enseignées</p>
                                            <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                                {userToShow.teacherProfile.subjects}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Expérience</p>
                                            <div className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E]">
                                                {userToShow.teacherProfile.experienceYears || '0'} ans
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#0F2D1E]">Modifier Utilisateur</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nom complet</label>
                                <input 
                                    type="text" 
                                    required
                                    value={userToEdit.fullName}
                                    onChange={(e) => setUserToEdit({...userToEdit, fullName: e.target.value})}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={userToEdit.email}
                                    onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value})}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Rôle</label>
                                <select 
                                    value={userToEdit.role}
                                    onChange={(e) => setUserToEdit({...userToEdit, role: e.target.value})}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="STUDENT">Étudiant</option>
                                    <option value="TEACHER">Professeur</option>
                                    <option value="PARENT">Parent</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-[#1B6B3A] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite / Create User Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-black text-[#0F2D1E]">Inviter un utilisateur</h2>
                                <p className="text-gray-400 text-[11px] font-semibold mt-1">Créez un compte directement depuis l'interface administrateur.</p>
                            </div>
                            <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleInviteUser} className="mt-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nom complet *</label>
                                    <input type="text" required
                                        value={inviteForm.fullName}
                                        onChange={(e) => setInviteForm({...inviteForm, fullName: e.target.value})}
                                        placeholder="Ex: Mamadou Diallo"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse Email *</label>
                                    <input type="email" required
                                        value={inviteForm.email}
                                        onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                                        placeholder="Ex: m.diallo@email.com"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
                                    <input type="tel"
                                        value={inviteForm.phone}
                                        onChange={(e) => setInviteForm({...inviteForm, phone: e.target.value})}
                                        placeholder="Ex: 621 00 00 00"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rôle *</label>
                                    <select required
                                        value={inviteForm.role}
                                        onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="STUDENT">Étudiant</option>
                                        <option value="TEACHER">Professeur</option>
                                        <option value="PARENT">Parent</option>
                                        <option value="ADMIN">Administrateur</option>
                                    </select>
                                </div>

                                {/* Conditional: Student level */}
                                {inviteForm.role === 'STUDENT' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Niveau scolaire</label>
                                        <select
                                            value={inviteForm.schoolLevel}
                                            onChange={(e) => setInviteForm({...inviteForm, schoolLevel: e.target.value})}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option>Terminale</option>
                                            <option>1ère</option>
                                            <option>2ème</option>
                                            <option>3ème</option>
                                            <option>Licence 1</option>
                                            <option>Licence 2</option>
                                            <option>Licence 3</option>
                                        </select>
                                    </div>
                                )}

                                {/* Conditional: Teacher subjects */}
                                {inviteForm.role === 'TEACHER' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Matières enseignées</label>
                                        <input type="text"
                                            value={inviteForm.subjects}
                                            onChange={(e) => setInviteForm({...inviteForm, subjects: e.target.value})}
                                            placeholder="Ex: Mathématiques, Physique"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1.5 col-span-full">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mot de passe temporaire *</label>
                                    <input type="password" required minLength={6}
                                        value={inviteForm.password}
                                        onChange={(e) => setInviteForm({...inviteForm, password: e.target.value})}
                                        placeholder="Minimum 6 caractères"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                    />
                                    <p className="text-[10px] text-gray-400 ml-1 mt-1">L'utilisateur devra changer ce mot de passe à sa première connexion.</p>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-5 h-5" /> Créer le compte</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
