'use client';

import React from 'react';
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
    GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Book } from '@/constants/books';

interface BookDetailViewProps {
    book: Book;
    user: any;
}

export const BookDetailView = ({ book, user }: BookDetailViewProps) => {
    const isPremium = user?.plan === 'PREMIUM';
    
    return (
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
                    {/* Visual Side (Amazon Style) */}
                    <div className="w-full lg:w-[320px] flex-shrink-0">
                        <div className="relative group">
                            {/* Decorative Background Blob */}
                            <div className="absolute -inset-4 bg-emerald-50 rounded-[40px] blur-2xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity" />
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-gray-100 p-8 aspect-[3/4] flex items-center justify-center relative overflow-hidden"
                            >
                                <BookOpen className="w-32 h-32 text-gray-100" />
                                <div className="absolute top-5 left-5">
                                    <div className="bg-[#1B6B3A] text-white p-2.5 rounded-xl shadow-lg">
                                        <Library className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Quick Stats below cover */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Lecture</span>
                                <span className="text-xs font-black text-[#0F2D1E] italic">15-20 h</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
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
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Langue</p>
                                        <p className="text-sm font-bold text-[#0F2D1E]">Français</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Niveau</p>
                                        <p className="text-sm font-bold text-[#0F2D1E]">Lycée / Université</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
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
                            <button className="flex-1 py-3.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                <BookOpen className="w-5 h-5" /> Commencer la lecture
                            </button>
                                <div className="relative group/download">
                                    <button 
                                        disabled={!isPremium}
                                        className={`px-5 py-3.5 bg-gray-50 text-[#0F2D1E] rounded-xl font-bold transition-all border border-gray-100 flex items-center gap-2 ${!isPremium ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-gray-100'}`} 
                                        title={isPremium ? "Télécharger le manuel" : "Téléchargement réservé aux Premium"}
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    {!isPremium && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F2D1E] text-white text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover/download:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                            RESERVE AUX PREMIUM
                                        </div>
                                    )}
                                </div>
                                <button className="px-5 py-3.5 bg-gray-50 text-[#0F2D1E] rounded-xl font-bold hover:bg-gray-100 transition-all border border-gray-100" title="Partager">
                                    <Share2 className="w-5 h-5" />
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
