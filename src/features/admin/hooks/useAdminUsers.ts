'use client';

import { useState, useEffect } from 'react';
import { apiCall } from '@/utils/api';

export const schoolLevelsMappingUsers: Record<string, string[]> = {
    "Primaire": ["1ère Année", "2ème Année", "3ème Année", "4ème Année", "5ème Année", "6ème Année"],
    "Collège": ["7ème Année", "8ème Année", "9ème Année", "10ème Année"],
    "Lycée": ["11ème SM", "11ème SE", "11ème SS", "12ème SM", "12ème SE", "12ème SS", "TSM", "TSE", "TSS"],
    "Université": ["Licence 1", "Licence 2", "Licence 3", "Master", "Doctorat"]
};

const defaultInviteForm = {
    fullName: '', email: '', phone: '', role: 'STUDENT', password: '', schoolLevel: '', subjects: ''
};

export function useAdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [userToShow, setUserToShow] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteForm, setInviteForm] = useState(defaultInviteForm);
    const [activeCategory, setActiveCategory] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true); setError('');
        try {
            const token = localStorage.getItem('token');
            const data = await apiCall('/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
            setUsers(data);
        } catch { setError('Impossible de charger les utilisateurs.'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        if (notification) {
            const t = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(t);
        }
    }, [notification]);

    const handleInviteUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const newUser = await apiCall('/admin/users', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: JSON.stringify(inviteForm) });
            setNotification({ msg: `${newUser.fullName} a été invité avec succès`, type: 'success' });
            setUsers(prev => [newUser, ...prev]);
            setIsInviteModalOpen(false);
            setInviteForm({ ...defaultInviteForm, schoolLevel: 'Terminale' });
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
        } finally { setIsSubmitting(false); }
    };

    const handleToggleStatus = async (targetUser: any) => {
        try {
            const token = localStorage.getItem('token');
            const updated = await apiCall(`/admin/users/${targetUser.id}/status`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
            setNotification({ msg: updated.status === 'SUSPENDED' ? `${updated.fullName} a été suspendu` : `${updated.fullName} a été réactivé`, type: 'success' });
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
                method: 'PUT', body: JSON.stringify({ fullName: userToEdit.fullName, email: userToEdit.email, role: userToEdit.role })
            });
            setNotification({ msg: 'Utilisateur mis à jour', type: 'success' });
            setUsers(prev => prev.map(u => u.id === userToEdit.id ? { ...u, ...updatedUser } : u));
            setIsEditModalOpen(false);
        } catch { setNotification({ msg: 'Erreur lors de la mise à jour', type: 'error' }); }
        finally { setIsSubmitting(false); }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
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

    return {
        users, isLoading, error, searchTerm, setSearchTerm, roleFilter, setRoleFilter,
        isDetailsModalOpen, setIsDetailsModalOpen, userToShow, setUserToShow,
        isEditModalOpen, setIsEditModalOpen, userToEdit, setUserToEdit,
        isSubmitting, notification,
        isInviteModalOpen, setIsInviteModalOpen, inviteForm, setInviteForm,
        activeCategory, setActiveCategory,
        fetchUsers, handleInviteUser, handleToggleStatus, handleUpdate,
        filteredUsers, getRoleBadgeColor
    };
}
