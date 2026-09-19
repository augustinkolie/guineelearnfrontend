'use client';

import React from 'react';
import { Trophy, FileCheck, Clock, Target } from 'lucide-react';

interface QuizResultCardProps {
    activeQuiz: any;
    score: number;
    elapsedSeconds: number;
    formatTime: (sec: number) => string;
    onFinishQuiz: () => void;
    onShowCorrection: () => void;
}

export const QuizResultCard: React.FC<QuizResultCardProps> = ({
    activeQuiz, score, elapsedSeconds, formatTime, onFinishQuiz, onShowCorrection
}) => {
    const accuracy = Math.round((score / activeQuiz.questions.length) * 100);

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-[#E8F5EE] text-[#1B6B3A] rounded-full flex items-center justify-center mb-2">
                    <Trophy className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-[#0F2D1E]">Quiz Terminé !</h2>
                <p className="text-gray-500 font-medium max-w-md">
                    Vous avez complété le quiz généré par IA : <br/>
                    <span className="text-[#0F2D1E] font-bold">&quot;{activeQuiz.title}&quot;</span>
                </p>
            </div>

            <div className="bg-white rounded-lg p-10 shadow-xl shadow-gray-100 border border-gray-100 w-full max-w-lg flex flex-col items-center space-y-8">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">VOTRE SCORE</p>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-7xl font-black text-[#1B6B3A]">{score}</span>
                        <span className="text-3xl font-bold text-gray-300">/ {activeQuiz.questions.length}</span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <button onClick={onFinishQuiz} className="w-full py-4 bg-[#1B6B3A] text-white rounded-md font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#1B6B3A]/20 hover:bg-[#14532D] transition-all">
                        ENREGISTRER & QUITTER
                        <FileCheck className="w-5 h-5" />
                    </button>
                    <button onClick={onShowCorrection} className="w-full text-sm font-bold text-[#1B6B3A] hover:underline underline-offset-4">
                        Consulter la correction détaillée
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                <div className="bg-[#F8FBF9] p-6 rounded-lg border border-[#E8F5EE] flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4 text-[#1B6B3A]" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Temps passé</span>
                    </div>
                    <p className="text-2xl font-black text-[#0F2D1E]">{formatTime(elapsedSeconds)}</p>
                </div>
                <div className="bg-[#F8FBF9] p-6 rounded-lg border border-[#E8F5EE] flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Target className="w-4 h-4 text-[#1B6B3A]" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Précision</span>
                    </div>
                    <p className="text-2xl font-black text-[#0F2D1E]">{accuracy}%</p>
                </div>
            </div>
        </div>
    );
};
