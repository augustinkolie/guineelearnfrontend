'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
    BookOpen, 
    CheckCircle2, 
    XCircle, 
    ArrowLeft, 
    Loader2, 
    Sparkles, 
    Trophy,
    GraduationCap,
    Clock,
    ChevronRight,
    BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ReviewPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lessonId = searchParams.get('id');
    
    const [user, setUser] = useState<any>(null);
    const [dueLessons, setDueLessons] = useState<any[]>([]);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Get user profile
                const profileData = await apiCall('/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(profileData.user);

                // Get due lessons
                const lessons = await apiCall(`/lesson-progress/due/${profileData.user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDueLessons(lessons);

                // If specific lessonId requested, select it
                if (lessonId) {
                    const lesson = lessons.find((l: any) => l.lessonId === lessonId);
                    if (lesson) {
                        setCurrentLesson(lesson);
                    } else {
                        // Maybe it's not "due" but we still want to review it?
                        // For now, just take the first one or null
                        if (lessons.length > 0) setCurrentLesson(lessons[0]);
                    }
                } else if (lessons.length > 0) {
                    setCurrentLesson(lessons[0]);
                }
            } catch (err) {
                console.error("Error fetching review data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [lessonId, router]);

    const handleUpdateProgress = async (isSuccess: boolean) => {
        if (!currentLesson || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall('/lesson-progress/update', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lessonId: currentLesson.lessonId,
                    isSuccess
                })
            });

            if (isSuccess) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    moveToNext();
                }, 2000);
            } else {
                moveToNext();
            }
        } catch (err) {
            console.error("Error updating progress", err);
            setIsSubmitting(false);
        }
    };

    const moveToNext = () => {
        const currentIndex = dueLessons.findIndex(l => l.id === currentLesson.id);
        const nextLessons = dueLessons.filter(l => l.id !== currentLesson.id);
        setDueLessons(nextLessons);
        
        if (nextLessons.length > 0) {
            setCurrentLesson(nextLessons[0]);
        } else {
            setCurrentLesson(null);
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                <p className="text-[#0F2D1E] font-bold">Préparation de votre session de révision...</p>
            </div>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 hover:bg-white rounded-xl border border-gray-100 transition-all text-gray-400 hover:text-[#1B6B3A]"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-[#0F2D1E]">Révision Intelligente</h1>
                            <p className="text-sm font-medium text-gray-500">Mémorisation à long terme activée</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <BrainCircuit className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{dueLessons.length} leçons à revoir</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {currentLesson ? (
                        <motion.div 
                            key={currentLesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-lg border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden"
                        >
                            {/* Lesson Banner */}
                            <div className="bg-[#1B6B3A] px-8 py-10 text-white relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
                                            {currentLesson.resource.subject}
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-400/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-400/30 text-emerald-300">
                                            Niveau {currentLesson.successLevel}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black">{currentLesson.resource.title}</h2>
                                    <p className="text-white/70 font-medium max-w-2xl">{currentLesson.resource.description || 'Révisez cette leçon pour consolider vos acquis.'}</p>
                                </div>
                            </div>

                            {/* Content Placeholder / Mini Quiz Simulation */}
                            <div className="p-8 space-y-8">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-[#0F2D1E] mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-[#1B6B3A]" />
                                        Résumé de la leçon
                                    </h3>
                                    <div className="prose prose-emerald max-w-none text-gray-600 font-medium leading-relaxed">
                                        {currentLesson.resource.content ? (
                                            <div dangerouslySetInnerHTML={{ __html: currentLesson.resource.content }} />
                                        ) : (
                                            <p>Le contenu détaillé de cette leçon est disponible dans votre bibliothèque. Prenez un moment pour vous remémorer les points clés de ce cours.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dernière révision</p>
                                            <p className="text-sm font-bold text-[#0F2D1E]">{new Date(currentLesson.lastReviewedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Série actuelle</p>
                                            <p className="text-sm font-bold text-[#0F2D1E]">{currentLesson.streak} réussites</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-8 border-t border-gray-50">
                                    <p className="text-center text-sm font-bold text-gray-500 mb-6">Comment évaluez-vous votre maîtrise de cette leçon ?</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button 
                                            disabled={isSubmitting || showSuccess}
                                            onClick={() => handleUpdateProgress(false)}
                                            className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-red-50 bg-red-50/10 hover:bg-red-50 hover:border-red-200 transition-all gap-2 disabled:opacity-50"
                                        >
                                            <XCircle className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-black text-red-600 uppercase tracking-widest text-xs">J'ai oublié</span>
                                        </button>
                                        <button 
                                            disabled={isSubmitting || showSuccess}
                                            onClick={() => handleUpdateProgress(true)}
                                            className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-emerald-50 bg-emerald-50/10 hover:bg-emerald-50 hover:border-emerald-200 transition-all gap-2 disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-black text-emerald-600 uppercase tracking-widest text-xs">Je maîtrise</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Success Overlay */}
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-emerald-500 text-white p-8 rounded-full shadow-2xl shadow-emerald-500/20 mb-6"
                                        >
                                            <CheckCircle2 className="w-16 h-16" />
                                        </motion.div>
                                        <h3 className="text-2xl font-black text-[#0F2D1E] mb-2">Excellent !</h3>
                                        <p className="text-gray-500 font-medium">Votre niveau de maîtrise augmente.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 rounded-lg border border-gray-100 shadow-xl text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                <Trophy className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#0F2D1E]">Tout est à jour !</h2>
                                <p className="text-gray-500 font-medium mt-2">Vous avez terminé toutes vos révisions pour aujourd'hui.</p>
                            </div>
                            <button 
                                onClick={() => router.push('/dashboard')}
                                className="px-8 py-4 bg-[#1B6B3A] text-white rounded-md font-bold shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] transition-all flex items-center gap-2 mx-auto"
                            >
                                Retour au tableau de bord
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                <p className="text-[#0F2D1E] font-bold">Chargement de la session...</p>
            </div>
        }>
            <ReviewPageContent />
        </Suspense>
    );
}
