'use client';

import React from 'react';
import { 
    Clock, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    Trophy,
    Play
} from 'lucide-react';
import { motion } from 'framer-motion';

const QUIZZES_BY_LEVEL: Record<string, any[]> = {
    '1ère année': [
        { id: 1, title: 'Calcul : Les Additions', subject: 'Mathématiques', questions: 10, duration: '15 min', difficulty: 'Débutant', score: 85 },
        { id: 2, title: 'Lecture : Les voyelles', subject: 'Français', questions: 12, duration: '10 min', difficulty: 'Facile', score: null },
        { id: 3, title: 'Écriture : Alphabet', subject: 'Français', questions: 15, duration: '20 min', difficulty: 'Moyen', score: null }
    ],
    '10ème année': [
        { id: 1, title: 'Maths : Fonctions', questions: 20, duration: '30 min', difficulty: 'Brevet', score: 75 },
        { id: 2, title: 'Physique : Énergie', questions: 15, duration: '25 min', difficulty: 'Moyen', score: null }
    ],
    'Terminale SM': [
        { id: 1, title: 'Maths : Probabilités', subject: 'Mathématiques', questions: 20, duration: '45 min', difficulty: 'Avancé', score: 92, status: 'Terminé' },
        { id: 2, title: 'Physique : Cinématique', subject: 'Physique', questions: 15, duration: '30 min', difficulty: 'Lycée', score: 68, status: 'Corrigé' },
        { id: 3, title: 'Chimie : Acides / Bases', subject: 'Chimie', questions: 18, duration: '40 min', difficulty: 'Expert', score: null, status: 'Disponible' },
        { id: 4, title: 'Philosophie : La Liberté', subject: 'Philosophie', questions: 12, duration: '20 min', difficulty: 'Moyen', score: null, status: 'Disponible' },
        { id: 5, title: 'Anglais : Conditionals', subject: 'Anglais', questions: 25, duration: '35 min', difficulty: 'Intermédiaire', score: null, status: 'Disponible' }
    ]
};

export const QuizView = ({ profile }: { profile: any }) => {
    const rawLevel = profile?.subLevel || profile?.schoolLevel || 'Terminale SM';
    const displayedLevel = rawLevel === 'Primaire' ? '1ère année' : rawLevel;
    const currentQuizzes = QUIZZES_BY_LEVEL[displayedLevel] || QUIZZES_BY_LEVEL['Terminale SM'];

    const getDifficultyColor = (diff: string) => {
        switch(diff) {
            case 'Facile': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Moyen': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Avancé':
            case 'Expert': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header / Stats Summary */}
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Centre de Quiz</h2>
                    <p className="text-gray-500 font-medium tracking-wide">
                        Entraînez-vous avec des tests adaptés à votre niveau : <span className="text-[#1B6B3A] font-bold">{displayedLevel}</span>
                    </p>
                </div>

                        <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Score Moyen</p>
                            <p className="text-lg font-black text-[#0F2D1E]">80%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A]">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Quiz Finis</p>
                            <p className="text-lg font-black text-[#0F2D1E]">12</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {currentQuizzes.map((quiz) => (
                    <motion.div
                        key={quiz.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 p-1 overflow-hidden group"
                    >
                        <div className="p-7">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getDifficultyColor(quiz.difficulty)}`}>
                                    {quiz.difficulty}
                                </div>
                                {quiz.score !== null && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E8F5EE] rounded-full text-[#1B6B3A] text-xs font-black ring-4 ring-[#E8F5EE]/50">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        {quiz.score}%
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-extrabold text-[#0F2D1E] mb-2 leading-tight group-hover:text-[#1B6B3A] transition-colors">
                                {quiz.title}
                            </h3>
                            <p className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest text-[10px]">
                                {quiz.subject}
                            </p>

                            <div className="flex items-center gap-6 mb-8 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FileCheck className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="text-xs font-bold">{quiz.questions} Ques.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="text-xs font-bold">{quiz.duration}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-2xl bg-[#F8FAFC] group-hover:bg-[#1B6B3A] text-[#1B6B3A] group-hover:text-white font-black text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-2 border-[#1B6B3A]/5 group-hover:border-[#1B6B3A] group-hover:shadow-lg group-hover:shadow-[#1B6B3A]/30">
                                {quiz.score !== null ? 'Revoir le test' : 'Commencer'}
                                <Play className="w-3 h-3 group-hover:fill-current" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Placeholder for missing icon since I used FileCheck which I didn't import yet
import { FileCheck } from 'lucide-react';
