'use client';

import React from 'react';
import { Trophy, CheckCircle2, Plus, Sparkles, Clock, FileCheck, Target, X, Play } from 'lucide-react';
import { motion } from 'framer-motion';

import { useQuizState } from '@/features/quiz/hooks/useQuizState';
import { QuizCorrectionView } from '@/features/quiz/components/QuizCorrectionView';
import { QuizResultCard } from '@/features/quiz/components/QuizResultCard';
import { QuizActiveSession } from '@/features/quiz/components/QuizActiveSession';
import { CreateQuizModal } from '@/features/quiz/components/CreateQuizModal';

const QUIZZES_BY_LEVEL: Record<string, any[]> = {
    '1ère année': [],
    '10ème année': [],
    'Terminale SM': []
};

/**
 * QuizView (Conteneur ultra-léger < 80 lignes)
 * Respect des principes SOLID (SRP, ISP, DIP) et Design Pattern Facade / Hook.
 */
export const QuizView = ({ profile }: { profile: any }) => {
    const {
        displayedLevel, completedQuizzes, averageScore,
        isCreateModalOpen, setIsCreateModalOpen,
        newQuizData, setNewQuizData, isGenerating,
        activeQuiz, setActiveQuiz, currentQuestionIndex, setCurrentQuestionIndex,
        selectedOption, setSelectedOption, score, setScore,
        isQuizFinished, setIsQuizFinished, showExplanation, setShowExplanation,
        draftQuiz, userAnswers, setUserAnswers, showCorrection, setShowCorrection,
        elapsedSeconds, formatTime,
        handleSaveDraft, handleResumeDraft, handleDeleteDraft, handleFinishQuiz, handleCreateQuiz
    } = useQuizState(profile);

    const currentQuizzes = QUIZZES_BY_LEVEL[displayedLevel] || QUIZZES_BY_LEVEL['Terminale SM'];

    if (activeQuiz) {
        if (showCorrection) {
            return <QuizCorrectionView activeQuiz={activeQuiz} score={score} userAnswers={userAnswers} onBackToFinished={() => setShowCorrection(false)} onFinishQuiz={handleFinishQuiz} />;
        }
        if (isQuizFinished) {
            return <QuizResultCard activeQuiz={activeQuiz} score={score} elapsedSeconds={elapsedSeconds} formatTime={formatTime} onFinishQuiz={handleFinishQuiz} onShowCorrection={() => setShowCorrection(true)} />;
        }
        return (
            <QuizActiveSession
                activeQuiz={activeQuiz}
                currentQuestionIndex={currentQuestionIndex}
                selectedOption={selectedOption}
                showExplanation={showExplanation}
                elapsedSeconds={elapsedSeconds}
                formatTime={formatTime}
                onSelectOption={setSelectedOption}
                onValidate={() => {
                    setShowExplanation(true);
                    const newAnswers = [...userAnswers];
                    newAnswers[currentQuestionIndex] = selectedOption!;
                    setUserAnswers(newAnswers);
                    if (selectedOption === activeQuiz.questions[currentQuestionIndex].correctAnswerIndex) setScore(s => s + 1);
                }}
                onNextQuestion={() => {
                    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
                        setCurrentQuestionIndex(i => i + 1);
                        setSelectedOption(null);
                        setShowExplanation(false);
                    } else {
                        setIsQuizFinished(true);
                    }
                }}
                onQuit={() => { setActiveQuiz(null); setShowCorrection(false); }}
                onSaveDraft={handleSaveDraft}
            />
        );
    }

    return (
        <div className="h-full overflow-y-auto px-4 md:px-8 py-8 space-y-10">
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Centre de Quiz</h2>
                    <p className="text-gray-500 font-medium tracking-wide">
                        Entraînez-vous avec des tests adaptés à votre niveau : <span className="text-[#1B6B3A] font-bold">{displayedLevel}</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><Trophy className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Score Moyen</p>
                            <p className="text-lg font-black text-[#0F2D1E]">{averageScore}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A]"><CheckCircle2 className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Quiz Finis</p>
                            <p className="text-lg font-black text-[#0F2D1E]">{completedQuizzes}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <motion.div onClick={() => setIsCreateModalOpen(true)} whileHover={{ y: -5 }} className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-[#1B6B3A] hover:bg-[#F8FAFC] shadow-sm p-6 overflow-hidden group transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[220px]">
                    <div className="w-14 h-14 bg-[#E8F5EE] text-[#1B6B3A] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500"><Plus className="w-7 h-7" /></div>
                    <h3 className="text-base font-extrabold text-[#0F2D1E] mb-1 group-hover:text-[#1B6B3A] transition-colors">Créer un Quiz</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-4">Test sur-mesure</p>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[9px] font-black shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Sparkles className="w-3 h-3" />Généré par IA</div>
                </motion.div>

                {draftQuiz && (
                    <motion.div onClick={handleResumeDraft} whileHover={{ y: -5 }} className="bg-white rounded-lg border border-emerald-200 hover:border-emerald-500/40 shadow-sm p-1 overflow-hidden group transition-all duration-300 cursor-pointer">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-100">BROUILLON EN COURS</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#E8F5EE] rounded-full text-[#1B6B3A] text-[9px] font-black ring-4 ring-[#E8F5EE]/30"><Clock className="w-3 h-3" />Q. {draftQuiz.currentIndex + 1}/{draftQuiz.quiz.questions.length}</div>
                                    <button onClick={handleDeleteDraft} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Supprimer le brouillon"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <h3 className="text-base font-extrabold text-[#0F2D1E] mb-1 leading-tight group-hover:text-[#1B6B3A] transition-colors line-clamp-1">{draftQuiz.quiz.title}</h3>
                            <p className="text-[9px] font-bold text-gray-400 mb-4 uppercase tracking-widest line-clamp-1">{draftQuiz.quiz.subject || 'Test Personnalisé'}</p>
                            <div className="flex items-center gap-4 mb-5 text-gray-500">
                                <div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center"><FileCheck className="w-3.5 h-3.5 text-gray-400" /></div><span className="text-[10px] font-bold">{draftQuiz.quiz.questions.length} Ques.</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center"><Target className="w-3.5 h-3.5 text-gray-400" /></div><span className="text-[10px] font-bold">{Math.round(((draftQuiz.currentIndex) / draftQuiz.quiz.questions.length) * 100)}% complété</span></div>
                            </div>
                            <button onClick={handleResumeDraft} className="w-full py-3 rounded-lg bg-[#F8FAFC] group-hover:bg-[#1B6B3A] text-[#1B6B3A] group-hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#1B6B3A]/5 group-hover:border-[#1B6B3A] transition-colors">Reprendre le test <Play className="w-2.5 h-2.5 group-hover:fill-current" /></button>
                        </div>
                    </motion.div>
                )}
            </div>

            <CreateQuizModal isOpen={isCreateModalOpen} newQuizData={newQuizData} isGenerating={isGenerating} onClose={() => setIsCreateModalOpen(false)} onUpdateData={setNewQuizData} onSubmit={handleCreateQuiz} />
        </div>
    );
};
