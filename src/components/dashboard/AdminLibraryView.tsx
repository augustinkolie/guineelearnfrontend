'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    Library, 
    Plus, 
    Search, 
    Filter, 
    BookOpen, 
    Star,
    Edit2,
    Trash2,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    User,
    Lock,
    Unlock,
    LayoutGrid,
    LayoutList,
    ChevronRight,
    ArrowUpRight,
    Upload,
    FileText,
    Eye,
    EyeOff,
    FileUp,
    Image
} from 'lucide-react';
import { apiCall, BASE_URL } from '@/utils/api';

interface AdminLibraryViewProps {
    user: any;
}

const schoolLevelsMapping: Record<string, string[]> = {
    "Primaire": ["1ère Année", "2ème Année", "3ème Année", "4ème Année", "5ème Année", "6ème Année"],
    "Collège": ["7ème Année", "8ème Année", "9ème Année", "10ème Année"],
    "Lycée": ["11ème SM", "11ème SE", "11ème SS", "12ème SM", "12ème SE", "12ème SS", "TSM", "TSE", "TSS"],
    "Université": ["Licence 1", "Licence 2", "Licence 3", "Master", "Doctorat"]
};

export const AdminLibraryView = ({ user }: AdminLibraryViewProps) => {
    const [books, setBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tous');

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToToggle, setItemToToggle] = useState<any>(null);
    const [itemToEdit, setItemToEdit] = useState<any>(null);
    const [selectionCategory, setSelectionCategory] = useState<string>('');
    const [selectedCover, setSelectedCover] = useState<File | null>(null);

    // Form states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    const [bookForm, setBookForm] = useState({
        title: '', 
        author: '', 
        subject: '', 
        description: '', 
        level: 'Terminale', 
        isPremium: false,
        type: 'BOOK',
        source: 'INTERNAL'
    });

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await apiCall('/resources', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const onlyBooks = data.filter((res: any) => res.type === 'BOOK');
            setBooks(onlyBooks);
        } catch (err) {
            console.error(err);
            setNotification({ msg: 'Erreur lors du chargement des livres', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

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
            
            if (selectedFile) {
                formData.append('bookFile', selectedFile);
            }
            if (selectedCover) {
                formData.append('coverImage', selectedCover);
            }

            const newBook = await apiCall('/resources', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            setBooks(prev => [newBook, ...prev]);
            setNotification({ msg: `Le livre "${newBook.title}" a été ajouté !`, type: 'success' });
            setIsCreateModalOpen(false);
            setSelectedFile(null);
            setSelectedCover(null);
            setBookForm({
                title: '', author: '', subject: '', description: '', level: 'Terminale', isPremium: false, type: 'BOOK', source: 'INTERNAL'
            });
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
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
            
            const formData = new FormData();
            formData.append('title', itemToEdit.title);
            formData.append('author', itemToEdit.author || '');
            formData.append('subject', itemToEdit.subject);
            formData.append('description', itemToEdit.description || '');
            formData.append('level', itemToEdit.level);
            formData.append('isPremium', String(itemToEdit.isPremium));
            
            if (selectedFile) {
                formData.append('bookFile', selectedFile);
            }
            if (selectedCover) {
                formData.append('coverImage', selectedCover);
            }

            const updated = await apiCall(`/resources/${itemToEdit.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            setBooks(prev => prev.map(b => b.id === itemToEdit.id ? updated : b));
            setNotification({ msg: 'Livre mis à jour avec succès', type: 'success' });
            setIsEditModalOpen(false);
            setSelectedFile(null);
            setSelectedCover(null);
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la modification', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-detect category when editing or creating
    useEffect(() => {
        if (isEditModalOpen && itemToEdit) {
            const category = Object.keys(schoolLevelsMapping).find(cat => 
                schoolLevelsMapping[cat as keyof typeof schoolLevelsMapping].includes(itemToEdit.level)
            ) || '';
            setSelectionCategory(category);
        } else if (isCreateModalOpen) {
            setSelectionCategory('');
        }
    }, [isEditModalOpen, isCreateModalOpen, itemToEdit]);

    const handleToggleVisibility = async (book: any) => {
        try {
            const token = localStorage.getItem('token');
            const newValue = !book.isPublished;
            const formData = new FormData();
            formData.append('isPublished', String(newValue));
            const updated = await apiCall(`/resources/${book.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            setBooks(prev => prev.map(b => b.id === book.id ? { ...b, isPublished: newValue } : b));
            setNotification({ msg: newValue ? 'Livre visible dans la bibliothèque' : 'Livre masqué de la bibliothèque', type: 'success' });
        } catch (err) {
            setNotification({ msg: 'Erreur lors de la mise à jour', type: 'error' });
        }
    };


    const filteredBooks = books.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Tous' || b.subject === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categoriesList = ['Tous', ...Array.from(new Set(books.map(b => b.subject)))];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-[#1B6B3A] animate-spin" />
                <p className="text-gray-500 font-bold">Ouverture des rayons...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-[120] flex items-center gap-3 px-6 py-4 rounded-lg  border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div>
                    <h1 className="text-3xl font-black text-[#0F2D1E] tracking-tight">Gestion Bibliothèque</h1>
                    <p className="text-gray-500 font-medium text-xs mt-1 leading-relaxed">Gérez le catalogue des ouvrages et manuels scolaires.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { setIsCreateModalOpen(true); setSelectedFile(null); }}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm  active:scale-[0.98]   shadow-[#1B6B3A]/20"
                    >
                        <Plus className="w-5 h-5" /> Ajouter un Livre
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Ouvrages', value: books.length, icon: Library, color: 'text-emerald-600 bg-emerald-50', barColor: 'bg-emerald-500' },
                    { label: 'Livres Premium', value: books.filter(b => b.isPremium).length, icon: Star, color: 'text-amber-600 bg-amber-50', barColor: 'bg-amber-500' },
                    { label: 'Catégories', value: categoriesList.length - 1, icon: BookOpen, color: 'text-blue-600 bg-blue-50', barColor: 'bg-blue-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between group hover:border-[#1B6B3A]/30 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-[#0F2D1E] leading-none">{stat.value}</p>
                            </div>
                        </div>
                        
                        {/* Signal Bars Diagram */}
                        <div className="flex items-end gap-1.5 h-12 px-2">
                            {[0.3, 0.5, 0.7, 1.0].map((h, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-1.5 rounded-full ${stat.barColor} transition-all duration-500 group-hover:scale-y-110`}
                                    style={{ 
                                        height: `${h * 100}%`,
                                        opacity: 0.15 + (idx * 0.25),
                                        transitionDelay: `${idx * 50}ms`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls & Filters */}
            <div className="bg-white/60 backdrop-blur-md p-4 rounded-lg border border-white/40  flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par titre ou auteur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#1B6B3A]/20 outline-none  placeholder:text-gray-400 font-medium"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50/50 px-4 py-2.5 rounded-lg group hover:bg-white hover: border border-transparent hover:border-gray-200  cursor-pointer min-w-[160px]">
                        <Filter className="w-4 h-4 text-gray-400 group-hover:text-[#1B6B3A] transition-colors" />
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-bold text-gray-600 cursor-pointer w-full"
                        >
                            {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="h-8 w-px bg-gray-100 mx-1" />
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50/50 rounded-lg">
                        <button 
                            onClick={() => setViewMode('LIST')}
                            className={`p-2.5 rounded-lg  ${viewMode === 'LIST' ? 'bg-white text-[#1B6B3A] ' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutList className="w-4.5 h-4.5" />
                        </button>
                        <button 
                            onClick={() => setViewMode('GRID')}
                            className={`p-2.5 rounded-lg  ${viewMode === 'GRID' ? 'bg-white text-[#1B6B3A] ' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="w-4.5 h-4.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-lg border border-gray-200  hover: overflow-hidden min-h-[400px]">
                {viewMode === 'LIST' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/30">
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ouvrage</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Auteur</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Niveau</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Accès</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50/20  group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#E8F5EE] group-hover:scale-105 ">
                                                    <BookOpen className="w-5 h-5 text-[#1B6B3A]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-[#0F2D1E] line-clamp-1">{book.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{book.subject}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                <User className="w-3.5 h-3.5 opacity-30" />
                                                {book.author || 'Inconnu'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-black text-[#0F2D1E] bg-gray-50 px-2 py-1 rounded-md">
                                                {book.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {book.isPremium ? (
                                                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit">
                                                    <Lock className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                                                    <Unlock className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Gratuit</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setItemToEdit(book); setIsEditModalOpen(true); setSelectedFile(null); }}
                                                    className="p-2.5 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] rounded-lg "
                                                >
                                                    <Edit2 className="w-4.5 h-4.5" />
                                                </button>
                                                {/* Toggle Switch - Visibility */}
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${book.isPublished === false ? 'text-gray-400' : 'text-emerald-600'}`}>
                                                        {book.isPublished === false ? 'Masqué' : 'Actif'}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleToggleVisibility(book); }}
                                                        className={`relative w-10 h-5 rounded-full  duration-300 focus:outline-none ${
                                                            book.isPublished === false ? 'bg-gray-200' : 'bg-[#1B6B3A]'
                                                        }`}
                                                    >
                                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full  transition-transform duration-300 ${
                                                            book.isPublished === false ? 'translate-x-0' : 'translate-x-5'
                                                        }`} />
                                                    </button>
                                                </div>


                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                        {filteredBooks.map((book) => (
                            <div key={book.id} className="group bg-gray-50/40 rounded-lg border border-transparent hover:border-[#1B6B3A]/20 hover:bg-white hover:   p-3 flex flex-col h-full">
                                <div className="aspect-[3/2] bg-white rounded-md mb-3 flex items-center justify-center text-[#1B6B3A]/10 group-hover:text-[#1B6B3A]/40  relative overflow-hidden border border-gray-200  text-center">
                                    {book.url?.toLowerCase().endsWith('.pdf') ? (
                                        <img 
                                            src={`${(BASE_URL && BASE_URL !== 'undefined') ? (BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL) : 'http://localhost:5000'}/api/resources/thumbnail/${book.id}?v=2`}
                                            alt={book.title}
                                            className="absolute inset-0 w-full h-full object-cover z-10"
                                            onError={(e) => {
                                                (e.target as any).style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    <BookOpen className={`w-16 h-16 group-hover:scale-110 transition-transform relative z-10 ${book.url?.toLowerCase().endsWith('.pdf') ? 'opacity-0' : ''}`} />
                                    {book.isPremium && (
                                        <div className="absolute top-4 right-4 p-2 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-lg  shadow-amber-500/30">
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    )}
                                    {book.url?.startsWith('/uploads/') && (
                                        <div className="absolute bottom-2 left-2 p-1 bg-emerald-500 text-white rounded-md flex items-center gap-1 ">
                                            <FileText className="w-3 h-3" />
                                            <span className="text-[8px] font-black uppercase">Fichier PDF</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{book.subject}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{book.level}</span>
                                    </div>
                                    <h4 className="text-base font-black text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors line-clamp-2 leading-tight tracking-tight">{book.title}</h4>
                                    <p className="text-xs font-bold text-gray-400 inline-flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                        {book.author || 'Auteur Inconnu'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-50 mt-3 opacity-0 group-hover:opacity-100  translate-y-2 group-hover:translate-y-0">
                                    <button 
                                        onClick={() => { setItemToEdit(book); setIsEditModalOpen(true); setSelectedFile(null); }}
                                        className="p-2.5 text-gray-400 hover:text-[#1B6B3A] bg-gray-50 rounded-lg hover:bg-[#E8F5EE] "
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                        {/* Toggle Switch - Visibility (Grid) */}
                                        <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-lg  border border-gray-200">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleToggleVisibility(book); }}
                                                className={`relative w-9 h-4.5 rounded-full  duration-300 focus:outline-none ${
                                                    book.isPublished === false ? 'bg-gray-200' : 'bg-[#1B6B3A]'
                                                }`}
                                            >
                                                <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-xs transition-transform duration-300 ${
                                                    book.isPublished === false ? 'translate-x-0' : 'translate-x-4.5'
                                                }`} />
                                            </button>
                                        </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredBooks.length === 0 && (
                    <div className="p-24 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mb-6  border-dashed border-gray-200">
                            <Library className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-[#0F2D1E] mb-2 tracking-tight">Bibliothèque vide</h3>
                        <p className="text-sm text-gray-400 max-w-[280px] font-medium leading-relaxed mb-8">Nous n'avons trouvé aucun ouvrage correspondant à votre recherche.</p>
                        <button 
                            onClick={() => {setSearchTerm(''); setCategoryFilter('Tous');}}
                            className="px-6 py-2.5 bg-gray-100 text-[#0F2D1E] rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-200 "
                        >
                            Réinitialiser
                        </button>
                    </div>
                )}
            </div>

            {/* Create & Edit Modal */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F2D1E]/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-lg p-6 lg:p-8 max-w-xl w-full mx-4  animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black text-[#0F2D1E] tracking-tight">
                                    {isCreateModalOpen ? 'Nouvel Ouvrage' : 'Modifier le Livre'}
                                </h2>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1B6B3A]" /> Admin / Bibliothèque Digitale
                                </p>
                            </div>
                            <button 
                                onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); setSelectedFile(null); }}
                                className="p-2 hover:bg-gray-50 rounded-lg "
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={isCreateModalOpen ? handleCreate : handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="col-span-full space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de l'ouvrage *</label>
                                    <input 
                                        type="text" required 
                                        value={isCreateModalOpen ? bookForm.title : itemToEdit.title}
                                        onChange={(e) => isCreateModalOpen ? setBookForm({...bookForm, title: e.target.value}) : setItemToEdit({...itemToEdit, title: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] focus:ring-4 focus:ring-[#1B6B3A]/10 outline-none  placeholder:font-normal"
                                        placeholder="Ex: Manuel de Philosophie - Terminale"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-xs">Auteur / Éditeur</label>
                                    <input 
                                        type="text"
                                        value={isCreateModalOpen ? bookForm.author : itemToEdit.author || ''}
                                        onChange={(e) => isCreateModalOpen ? setBookForm({...bookForm, author: e.target.value}) : setItemToEdit({...itemToEdit, author: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] focus:ring-4 focus:ring-[#1B6B3A]/10 outline-none  placeholder:font-normal"
                                        placeholder="Ex: Pr. Ibrahim Keita"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-xs">Matière *</label>
                                    <input 
                                        type="text" required
                                        value={isCreateModalOpen ? bookForm.subject : itemToEdit.subject}
                                        onChange={(e) => isCreateModalOpen ? setBookForm({...bookForm, subject: e.target.value}) : setItemToEdit({...itemToEdit, subject: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] focus:ring-4 focus:ring-[#1B6B3A]/10 outline-none  placeholder:font-normal"
                                        placeholder="Ex: Mathématiques"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-xs">Niveau Global *</label>
                                    <select 
                                        value={selectionCategory}
                                        onChange={(e) => {
                                            const cat = e.target.value;
                                            setSelectionCategory(cat);
                                            const firstClass = schoolLevelsMapping[cat as keyof typeof schoolLevelsMapping]?.[0] || '';
                                            if (isCreateModalOpen) setBookForm({ ...bookForm, level: firstClass });
                                            else setItemToEdit({ ...itemToEdit, level: firstClass });
                                        }}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <option value="">Sélectionner Niveau</option>
                                        {Object.keys(schoolLevelsMapping).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-xs">Classe / Année *</label>
                                    <select 
                                        value={isCreateModalOpen ? bookForm.level : itemToEdit.level}
                                        onChange={(e) => isCreateModalOpen ? setBookForm({...bookForm, level: e.target.value}) : setItemToEdit({...itemToEdit, level: e.target.value})}
                                        required
                                        disabled={!selectionCategory}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner Classe</option>
                                        {selectionCategory && schoolLevelsMapping[selectionCategory as keyof typeof schoolLevelsMapping].map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5 flex flex-col justify-end">
                                    <button 
                                        type="button"
                                        onClick={() => isCreateModalOpen ? setBookForm({...bookForm, isPremium: !bookForm.isPremium}) : setItemToEdit({...itemToEdit, isPremium: !itemToEdit.isPremium})}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest  border-2 ${
                                            (isCreateModalOpen ? bookForm.isPremium : itemToEdit.isPremium) 
                                                ? 'bg-amber-50 border-amber-500 text-amber-700  shadow-amber-500/10' 
                                                : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'
                                        }`}
                                    >
                                        <Star className={`w-3.5 h-3.5 ${(isCreateModalOpen ? bookForm.isPremium : itemToEdit.isPremium) ? 'fill-amber-500' : ''}`} />
                                        {(isCreateModalOpen ? bookForm.isPremium : itemToEdit.isPremium) ? 'Premium' : 'Gratuit'}
                                    </button>
                                </div>

                                {/* File Upload Section */}
                                <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Fichier du Livre (PDF) *</label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer  hover:bg-emerald-50/50 group ${
                                                selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-[#1B6B3A]/30'
                                            }`}
                                        >
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                accept=".pdf"
                                                className="hidden" 
                                            />
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center  ${selectedFile ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:scale-110'}`}>
                                                {selectedFile ? <CheckCircle2 className="w-6 h-6" /> : <FileUp className="w-6 h-6" />}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[11px] font-black text-[#0F2D1E] line-clamp-1 max-w-[150px]">
                                                    {selectedFile ? selectedFile.name : 'Choisir le PDF'}
                                                </p>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">
                                                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'CLIQUEZ ICI'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Image de Couverture</label>
                                        <div 
                                            onClick={() => coverInputRef.current?.click()}
                                            className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer  hover:bg-emerald-50/50 group ${
                                                selectedCover ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-[#1B6B3A]/30'
                                            }`}
                                        >
                                            <input 
                                                type="file" 
                                                ref={coverInputRef} 
                                                onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
                                                accept="image/*"
                                                className="hidden" 
                                            />
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center  ${selectedCover ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:scale-110'}`}>
                                                {selectedCover ? <CheckCircle2 className="w-6 h-6" /> : <Image className="w-6 h-6" />}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[11px] font-black text-[#0F2D1E] line-clamp-1 max-w-[150px]">
                                                    {selectedCover ? selectedCover.name : 'Choisir l\'image'}
                                                </p>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">
                                                    {selectedCover ? `${(selectedCover.size / 1024).toFixed(1)} KB` : 'OPTIONNEL'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-full space-y-1.5 pt-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Résumé / Description</label>
                                    <textarea 
                                        rows={3}
                                        value={isCreateModalOpen ? bookForm.description : itemToEdit.description || ''}
                                        onChange={(e) => isCreateModalOpen ? setBookForm({...bookForm, description: e.target.value}) : setItemToEdit({...itemToEdit, description: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0F2D1E] focus:ring-4 focus:ring-[#1B6B3A]/10 outline-none  resize-none placeholder:font-normal"
                                        placeholder="Décrivez brièvement l'ouvrage..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || (isCreateModalOpen && !selectedFile)}
                                    className="w-full py-4 bg-[#1B6B3A] text-white rounded-lg font-black text-sm uppercase tracking-widest  shadow-[#1B6B3A]/30 hover:scale-[1.01] active:scale-[0.99]  flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isCreateModalOpen ? 'Publier l\'ouvrage' : 'Enregistrer')}
                                </button>
                            </div>
                        </form>
                </div>
            </div>
        )}
    </div>
);
};
