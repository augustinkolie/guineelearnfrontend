'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { 
    BookOpen, 
    ArrowLeft, 
    Star, 
    Download, 
    Share2, 
    CheckCircle,
    Library,
    Clock,
    Globe,
    GraduationCap,
    X,
    Maximize2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Book } from '@/constants/books';
import { BASE_URL } from '@/utils/api';

interface BookDetailViewProps {
    book: Book;
    user: any;
}

export const BookDetailView = ({ book, user }: BookDetailViewProps) => {
    const isPremium = user?.plan === 'PREMIUM';
    const [imageError, setImageError] = React.useState(false);
    const [isReading, setIsReading] = React.useState(false);
    
    // Construction de l'URL du PDF
    const fullPdfUrl = useMemo(() => {
        // Pour les nouveaux livres (dynamiques), on utilise le tunnel API dédié
        if (book.isDynamic || book.pdfUrl) {
            const base = (BASE_URL && BASE_URL !== 'undefined') ? BASE_URL : 'http://localhost:5000';
            const cleanBase = base.replace(/\/+$/, '');
            
            // Si c'est un livre dynamique, on utilise la nouvelle route API de visualisation
            if (book.isDynamic) {
                return `${cleanBase}/api/resources/view/${book.id}`;
            }
            
            // Sinon (statique avec pdfUrl), on utilise l'URL directe
            const path = book.pdfUrl?.startsWith('/') ? book.pdfUrl : `/${book.pdfUrl}`;
            return `${cleanBase}${path}`;
        }
        
        return null;
    }, [book.pdfUrl, book.id, book.isDynamic]);

    // Construction de l'URL de la couverture
    const fullCoverUrl = useMemo(() => {
        if (!book.coverUrl) return null;
        if (book.coverUrl.startsWith('http')) return book.coverUrl;
        
        const base = (BASE_URL && BASE_URL !== 'undefined') ? BASE_URL : 'http://localhost:5000';
        const cleanBase = base.replace(/\/+$/, '');
        const path = book.coverUrl.startsWith('/') ? book.coverUrl : `/${book.coverUrl}`;
        return `${cleanBase}${path}`;
    }, [book.coverUrl]);
    
    // Construction de l'URL de la vignette (si on doit générer à la volée)
    const thumbnailUrl = useMemo(() => {
        if (book.id && book.isDynamic) {
             const base = (BASE_URL && BASE_URL !== 'undefined') ? BASE_URL : 'http://localhost:5000';
             const cleanBase = base.replace(/\/+$/, '');
             return `${cleanBase}/api/resources/thumbnail/${book.id}?v=2`;
        }
        return null;
    }, [book.id, book.isDynamic]);
    
    return (
        <>
            {/* Liseuse Intégrée PDF */}
            {isReading && fullPdfUrl ? (
                <div className="fixed inset-0 z-[100] bg-[#111827] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between px-6 py-4 bg-[#1F2937] border-b border-gray-800 shrink-0 ">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsReading(false)}
                                className="w-10 h-10 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-white  "
                                title="Fermer la liseuse"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-white font-black text-sm md:text-base line-clamp-1">{book.title}</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{book.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1B6B3A]/20 text-[#34d399] text-[10px] font-black uppercase tracking-widest border border-[#1B6B3A]/30">
                                <BookOpen className="w-3.5 h-3.5" /> Liseuse intégrée
                            </span>
                        </div>
                    </div>
                    {/* Conteneur de l'iframe optimisé pour les PDF */}
                    <div className="flex-1 w-full bg-[#111827] relative pt-0">
                        {/* On ajoute #toolbar=1 pour s'assurer que Firefox/Chrome affichent la barre d'outils native */}
                        <iframe 
                            src={`${fullPdfUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-none"
                            title={book.title}
                        />
                    </div>
                </div>
            ) : null}

        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* Back Button */}
                <Link 
                    href="/dashboard/library"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1B6B3A] font-bold text-xs mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retour à la bibliothèque
                </Link>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                    <div className="w-full lg:w-[320px] flex-shrink-0">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-emerald-50 rounded-[40px] blur-2xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity" />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-gray-200 p-0 aspect-[3/4] flex items-center justify-center relative overflow-hidden"
                            >
                                {fullCoverUrl && !imageError ? (
                                    <img 
                                        src={fullCoverUrl} 
                                        alt={book.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={() => setImageError(true)}
                                    />
                                ) : thumbnailUrl && !imageError ? (
                                    <img 
                                        src={thumbnailUrl}
                                        alt={book.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={() => setImageError(true)}
                                    />
                                ) : null}
                                
                                {/* Fallback icon - s'affiche par l'état React si aucune image n'est disponible ou s'il y a une erreur */}
                                <div className="fallback-icon absolute inset-0 flex flex-col items-center justify-center bg-[#1B6B3A] text-white p-6 text-center" style={{ display: !fullCoverUrl && !thumbnailUrl || imageError ? 'flex' : 'none' }}>
                                    <BookOpen className="w-16 h-16 opacity-30 mb-4" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">{book.title}</h4>
                                    <div className="w-8 h-1 bg-emerald-400 mx-auto mt-2 rounded-full" />
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center text-center">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Lecture</span>
                                <span className="text-xs font-black text-[#0F2D1E] italic">15-20 h</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center text-center">
                                <span className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Note</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-black text-[#0F2D1E]">{book.rating || 4.5}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-[#1B6B3A] text-[9px] font-black rounded-lg uppercase tracking-widest border border-[#1B6B3A]/10">
                                    {book.category}
                                </span>
                                {book.isPremium && (
                                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-amber-200">
                                        Premium
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-3xl font-black text-[#0F2D1E] leading-tight tracking-tight">
                                {book.title}
                            </h1>
                            <p className="text-lg font-bold text-emerald-600 uppercase tracking-tight">
                                par <span className="hover:underline cursor-pointer">{book.author}</span>
                            </p>

                            {/* LIEN DE SECOURS DIRECT : Ouvrir dans la liseuse */}
                            {fullPdfUrl && (
                                <div className="mt-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B6B3A] animate-pulse shadow-[0_0_8px_rgba(27,107,58,0.5)]" />
                                    <p className="text-[10px] font-black text-[#1B6B3A] uppercase tracking-widest">
                                        Accès instantané : <button onClick={() => setIsReading(true)} className="underline hover:text-emerald-800 transition-colors ml-1 cursor-pointer">Cliquer pour ouvrir le livre</button>
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={`w-4 h-4 ${star <= (book.rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                    ))}
                                    <span className="text-sm font-bold text-gray-400 ml-2">{book.reviewsCount || 0} évaluations</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gray-100" />

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-[#0F2D1E] uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#1B6B3A] rounded-full" />
                                Description de l'ouvrage
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {book.description || "Un ouvrage de référence essentiel pour les étudiants en Guinée."}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Langue</p>
                                        <p className="text-sm font-bold text-[#0F2D1E]">Français</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Niveau</p>
                                        <p className="text-sm font-bold text-[#0F2D1E]">{book.level || 'Lycée / Université'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Publication</p>
                                        <p className="text-sm font-bold text-[#0F2D1E]">{book.publicationDate || "2024"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-10">
                            {fullPdfUrl ? (
                                <button 
                                    onClick={() => setIsReading(true)}
                                    className="flex-1 py-3.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm  shadow-[#1B6B3A]/20  active:scale-[0.98]  flex items-center justify-center gap-3 no-underline group"
                                >
                                    <BookOpen className="w-5 h-5 group-hover:-rotate-12 transition-transform" /> Lire maintenant
                                </button>
                            ) : (
                                <button 
                                    onClick={() => alert("Le contenu numérique n'est pas disponible pour cet ouvrage.")}
                                    className="flex-1 py-3.5 bg-gray-100 text-gray-400 rounded-lg font-bold text-sm  flex items-center justify-center gap-3 cursor-not-allowed"
                                >
                                    <BookOpen className="w-5 h-5" /> Contenu indisponible
                                </button>
                            )}

                            <div className="relative group/download">
                                {fullPdfUrl && isPremium ? (
                                    <a 
                                        href={fullPdfUrl} 
                                        download={`${book.title}.pdf`}
                                        className="px-5 py-3.5 bg-gray-50 text-[#0F2D1E] rounded-lg font-bold  border border-gray-200 flex items-center gap-2 hover:bg-gray-100 group" 
                                        title="Télécharger le manuel"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                ) : (
                                    <button 
                                        disabled={!isPremium}
                                        onClick={() => !fullPdfUrl && alert("Le téléchargement n'est pas disponible.")}
                                        className={`px-5 py-3.5 bg-gray-50 text-[#0F2D1E] rounded-lg font-bold  border border-gray-200 flex items-center gap-2 ${!isPremium ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-gray-100'}`} 
                                        title={isPremium ? "Téléchargement indisponible" : "Téléchargement réservé aux Premium"}
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                )}
                                    {!isPremium && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F2D1E] text-white text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover/download:opacity-100 transition-opacity whitespace-nowrap ">
                                            RESERVE AUX PREMIUM
                                        </div>
                                    )}
                                </div>
                                <button className="px-5 py-3.5 bg-gray-50 text-[#0F2D1E] rounded-lg font-bold hover:bg-gray-100  border border-gray-200" title="Partager">
                                    <Share2 className="w-5 h-5" />
                                </button>
                        </div>
                    </div>
                </div>

            </div>
            </div>
        </>
    );
};
