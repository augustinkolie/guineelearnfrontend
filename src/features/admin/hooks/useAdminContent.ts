'use client';

import { useState, useEffect, useRef } from 'react';
import { apiCall } from '@/utils/api';

const defaultCreateForm = {
    title: '', description: '', level: 'Terminale', track: 'GENERAL', subject: '', type: 'COURSE', source: 'INTERNAL', url: '', content: ''
};

export function useAdminContent() {
    const [content, setContent] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
    const [searchTerm, setSearchTerm] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<any>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [itemToPreview, setItemToPreview] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [createForm, setCreateForm] = useState(defaultCreateForm);
    const [createFiles, setCreateFiles] = useState<{ bookFile: File | null; coverImage: File | null }>({ bookFile: null, coverImage: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const bookFileRef = useRef<HTMLInputElement>(null);
    const coverImageRef = useRef<HTMLInputElement>(null);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await apiCall('/resources', { headers: { 'Authorization': `Bearer ${token}` } });
            setContent(data);
        } catch (err) {
            console.error(err);
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchContent(); }, []);

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
            const formData = new FormData();
            Object.entries(createForm).forEach(([key, value]) => {
                if (value !== undefined && value !== null) formData.append(key, value as string);
            });
            if (createFiles.bookFile) formData.append('bookFile', createFiles.bookFile);
            if (createFiles.coverImage) formData.append('coverImage', createFiles.coverImage);

            const newResource = await apiCall('/resources', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            setNotification({ msg: 'Ressource créée avec succès', type: 'success' });
            setContent(prev => [newResource, ...prev]);
            setIsCreateModalOpen(false);
            setCreateForm(defaultCreateForm);
            setCreateFiles({ bookFile: null, coverImage: null });
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
        } finally { setIsSubmitting(false); }
    };

    const handleToggleVisibility = async (item: any) => {
        try {
            const token = localStorage.getItem('token');
            const newValue = !item.isPublished;
            const formData = new FormData();
            formData.append('isPublished', String(newValue));
            await apiCall(`/resources/${item.id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            setNotification({ msg: newValue ? 'Ressource activée' : 'Ressource masquée', type: 'success' });
            setContent(prev => prev.map(c => c.id === item.id ? { ...c, isPublished: newValue } : c));
        } catch {
            setNotification({ msg: 'Erreur lors de la mise à jour de la visibilité', type: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall(`/resources/${itemToDelete.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            setNotification({ msg: 'Ressource supprimée avec succès', type: 'success' });
            setContent(prev => prev.filter(c => c.id !== itemToDelete.id));
            setIsDeleteModalOpen(false);
        } catch {
            setNotification({ msg: 'Erreur lors de la suppression', type: 'error' });
        } finally { setIsSubmitting(false); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemToEdit) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', itemToEdit.title);
            formData.append('subject', itemToEdit.subject);
            formData.append('level', itemToEdit.level);
            formData.append('type', itemToEdit.type);
            formData.append('description', itemToEdit.description || '');
            formData.append('url', itemToEdit.url || '');

            const updated = await apiCall(`/resources/${itemToEdit.id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            setNotification({ msg: 'Ressource mise à jour', type: 'success' });
            setContent(prev => prev.map(c => c.id === itemToEdit.id ? { ...c, ...updated } : c));
            setIsEditModalOpen(false);
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la mise à jour', type: 'error' });
        } finally { setIsSubmitting(false); }
    };

    const filteredContent = content.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
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
    };
}
