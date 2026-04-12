'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import { allBooks } from "@/constants/books";
import { 
    Library, 
    BookOpen, 
    Search, 
    Filter, 
    Star, 
    Lock 
} from 'lucide-react';

interface StudentLibraryViewProps {
    user: any;
}

export const StudentLibraryView = ({ user }: StudentLibraryViewProps) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    
    const isPremium = user?.plan === 'PREMIUM';

    // Unique categories derivation
    const categories = useMemo(() => {
        const cats = ['Tous', ...new Set(allBooks.map(book => book.category))];
        return cats;
    }, []);

    // Filter logic
    const filteredBooks = useMemo(() => {
        return allBooks.filter(book => {
            // 1. Premium Access Check
            if (!isPremium && book.isPremium) return false;

            // 2. Category Check
            if (selectedCategory !== 'Tous' && book.category !== selectedCategory) return false;

            // 3. Search Query Check
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const matchesTitle = book.title.toLowerCase().includes(query);
                const matchesAuthor = book.author.toLowerCase().includes(query);
                const matchesCategory = book.category.toLowerCase().includes(query);
                if (!matchesTitle && !matchesAuthor && !matchesCategory) return false;
            }

            return true;
        });
    }, [searchQuery, selectedCategory, isPremium]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Ma Bibliothèque Digitale</h1>
                    <p className="text-gray-500 font-medium text-xs">Accédez à vos manuels scolaires et ressources de lecture.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0F2D1E]">
                            Plan {isPremium ? 'Premium' : 'Gratuit'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-2.5 pr-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4 transition-all focus-within:shadow-md">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un auteur, un titre, une matière..." 
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white transition-all text-sm font-medium"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="text-sm">×</span>
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 relative">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all cursor-pointer relative">
                        <Filter className="w-4 h-4" />
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <span>{selectedCategory === 'Tous' ? 'Filtres' : selectedCategory}</span>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBooks.map((book, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => router.push(`/dashboard/library/${book.slug}`)}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-1 active:scale-[0.98]"
                    >
                        <div className="aspect-[2/1] bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#E8F5EE] group-hover:text-[#1B6B3A] transition-all relative">
                            <BookOpen className="w-10 h-10" />
                            <div className="absolute top-3 right-3">
                                <span className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-[#1B6B3A] shadow-xs">
                                    {book.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-extrabold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors line-clamp-1 text-base leading-tight mb-1">
                                {book.title}
                            </h3>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mb-4">
                                {book.author}
                            </p>
                            
                            <div className="mt-auto">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={`w-2.5 h-2.5 ${star <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-100'}`} />
                                    ))}
                                    <span className="text-[9px] font-bold text-gray-400 ml-1">{book.rating || 4.2}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredBooks.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            <Library className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mb-1">Aucun livre trouvé</h3>
                        <p className="text-xs text-gray-500 max-w-[200px] font-medium leading-relaxed">
                            Nous n'avons rien trouvé pour "{searchQuery}". Essayez avec d'autres mots-clés.
                        </p>
                        <button 
                            onClick={() => {setSearchQuery(''); setSelectedCategory('Tous');}}
                            className="mt-6 text-[#1B6B3A] font-black text-[10px] uppercase tracking-widest hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
