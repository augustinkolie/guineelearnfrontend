'use client';

import { useState, useEffect, useRef } from 'react';
import { apiCall } from '@/utils/api';

export const schoolLevelsMapping: Record<string, string[]> = {
    "Primaire": ["1ère Année", "2ème Année", "3ème Année", "4ème Année", "5ème Année", "6ème Année"],
    "Collège": ["7ème Année", "8ème Année", "9ème Année", "10ème Année"],
    "Lycée": ["11ème SM", "11ème SE", "11ème SS", "12ème SM", "12ème SE", "12ème SS", "TSM", "TSE", "TSS"],
    "Université": ["Licence 1", "Licence 2", "Licence 3", "Master", "Doctorat"]
};

const defaultBookForm = {
    title: '', author: '', subject: '', description: '', level: 'Terminale', isPremium: false, type: 'BOOK', source: 'INTERNAL'
};

export function useAdminLibrary() {
    const [books, setBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tous');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedCover, setSelectedCover] = useState<File | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<any>(null);
    const [selectionCategory, setSelectionCategory] = useState<string>('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [bookForm, setBookForm] = useState(defaultBookForm);

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await apiCall('/resources', { headers: { 'Authorization': `Bearer ${token}` } });
            setBooks(data.filter((res: any) => res.type === 'BOOK'));
        } catch (err) {
            setNotification({ msg: 'Erreur lors du chargement des livres', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        if (isEditModalOpen && itemToEdit) {
            const category = Object.keys(schoolLevelsMapping).find(cat =>
                schoolLevelsMapping[cat].includes(itemToEdit.level)
            ) || '';
            setSelectionCategory(category);
        } else if (isCreateModalOpen) {
            setSelectionCategory('');
        }
    }, [isEditModalOpen, isCreateModalOpen, itemToEdit]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', bookForm.title);
            formData.append('author', bookForm.author);
            formData.append('subject', bookForm.subject);
            formData.append('description', bookForm.description);
            formData.append('level', bookForm.level);
            formData.append('isPremium', String(bookForm.isPremium));
            formData.append('type', 'BOOK');
            formData.append('source', 'INTERNAL');
            if (selectedFile) formData.append('bookFile', selectedFile);
            if (selectedCover) formData.append('coverImage', selectedCover);

            const newBook = await apiCall('/resources', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            setBooks(prev => [newBook, ...prev]);
            setNotification({ msg: `Le livre "${newBook.title}" a été ajouté !`, type: 'success' });
            setIsCreateModalOpen(false);
            setSelectedFile(null); setSelectedCover(null);
            setBookForm(defaultBookForm);
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
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
            formData.append('author', itemToEdit.author || '');
            formData.append('subject', itemToEdit.subject);
            formData.append('description', itemToEdit.description || '');
            formData.append('level', itemToEdit.level);
            formData.append('isPremium', String(itemToEdit.isPremium));
            if (selectedFile) formData.append('bookFile', selectedFile);
            if (selectedCover) formData.append('coverImage', selectedCover);

            const updated = await apiCall(`/resources/${itemToEdit.id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            setBooks(prev => prev.map(b => b.id === itemToEdit.id ? updated : b));
            setNotification({ msg: 'Livre mis à jour avec succès', type: 'success' });
            setIsEditModalOpen(false);
            setSelectedFile(null); setSelectedCover(null);
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la modification', type: 'error' });
        } finally { setIsSubmitting(false); }
    };

    const handleToggleVisibility = async (book: any) => {
        try {
            const token = localStorage.getItem('token');
            const newValue = !book.isPublished;
            const formData = new FormData();
            formData.append('isPublished', String(newValue));
            await apiCall(`/resources/${book.id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            setBooks(prev => prev.map(b => b.id === book.id ? { ...b, isPublished: newValue } : b));
            setNotification({ msg: newValue ? 'Livre visible dans la bibliothèque' : 'Livre masqué de la bibliothèque', type: 'success' });
        } catch {
            setNotification({ msg: 'Erreur lors de la mise à jour', type: 'error' });
        }
    };

    const filteredBooks = books.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Tous' || b.subject === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categoriesList = ['Tous', ...Array.from(new Set(books.map(b => b.subject)))];

    return {
        books, isLoading, viewMode, setViewMode, searchTerm, setSearchTerm,
        categoryFilter, setCategoryFilter, fileInputRef, coverInputRef,
        selectedFile, setSelectedFile, selectedCover, setSelectedCover,
        isCreateModalOpen, setIsCreateModalOpen, isEditModalOpen, setIsEditModalOpen,
        itemToEdit, setItemToEdit, selectionCategory, setSelectionCategory,
        isSubmitting, notification, bookForm, setBookForm,
        handleCreate, handleUpdate, handleToggleVisibility,
        filteredBooks, categoriesList
    };
}
