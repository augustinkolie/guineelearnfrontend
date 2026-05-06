'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Clock, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    Trophy,
    Play,
    FileCheck,
    Plus,
    Sparkles,
    X,
    BookOpen,
    Layers,
    Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiCall, BASE_URL, logActivity } from '@/utils/api';

const QUIZZES_BY_LEVEL: Record<string, any[]> = {
    '1ère année': [],
    '10ème année': [],
    'Terminale SM': []
};

export const QuizView = ({ profile }: { profile: any }) => {
    const rawLevel = profile?.subLevel || profile?.schoolLevel || 'Terminale SM';
    const displayedLevel = rawLevel === 'Primaire' ? '1ère année' : rawLevel;
    const currentQuizzes = QUIZZES_BY_LEVEL[displayedLevel] || QUIZZES_BY_LEVEL['Terminale SM'];

    // Calculate dynamic stats from profile
    const completedQuizzes = profile?.completedQuizzes || 0;
    const globalScore = profile?.globalScore || 0;
    const averageScore = completedQuizzes > 0 ? Math.round(globalScore / completedQuizzes) : 0;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newQuizData, setNewQuizData] = useState({
        subject: '',
        chapter: '',
        lesson: '',
        difficulty: 'Moyen'
    });
    const [isGenerating, setIsGenerating] = useState(false);

    // Quiz Taking States
    const [activeQuiz, setActiveQuiz] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [draftQuiz, setDraftQuiz] = useState<any>(null);

    // Timer state
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Format seconds to MM:SS
    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Start/stop timer based on quiz state
    useEffect(() => {
        if (activeQuiz && !isQuizFinished) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [activeQuiz, isQuizFinished]);

    // Reset timer when a new quiz starts
    useEffect(() => {
        if (activeQuiz && !isQuizFinished) {
            setElapsedSeconds(0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeQuiz]);

    React.useEffect(() => {
        const saved = localStorage.getItem('guineelearn_quiz_draft');
        if (saved) {
            try {
                setDraftQuiz(JSON.parse(saved));
            } catch(e) {}
        } else {
            setDraftQuiz(null);
        }
    }, [activeQuiz]); // Reload draft status when coming back to main view

    // Auto-save draft when progress changes
    React.useEffect(() => {
        if (activeQuiz && !isQuizFinished) {
            const draft = {
                quiz: activeQuiz,
                currentIndex: currentQuestionIndex,
                score: score
            };
            localStorage.setItem('guineelearn_quiz_draft', JSON.stringify(draft));
        }
    }, [activeQuiz, currentQuestionIndex, score, isQuizFinished]);

    const handleSaveDraft = () => {
        alert("Progression sauvegardée ! Vous pourrez reprendre ce quiz plus tard.");
        setActiveQuiz(null);
    };

    const handleResumeDraft = () => {
        if (draftQuiz) {
            setActiveQuiz(draftQuiz.quiz);
            setCurrentQuestionIndex(draftQuiz.currentIndex);
            setScore(draftQuiz.score);
            setSelectedOption(null);
            setShowExplanation(false);
            setIsQuizFinished(false);
        }
    };

    const handleDeleteDraft = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Voulez-vous vraiment supprimer ce brouillon ?")) {
            localStorage.removeItem('guineelearn_quiz_draft');
            setDraftQuiz(null);
        }
    };

    const handleFinishQuiz = async () => {
        try {
            const token = localStorage.getItem('token');
            const percentScore = Math.round((score / activeQuiz.questions.length) * 100);
            
            await fetch(`${BASE_URL}/api/user/quiz-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: activeQuiz.subject || 'Test IA',
                    score: percentScore,
                    average: percentScore // simplified for now
                })

            });

            // Enregistrer comme activité pour le dashboard
            await logActivity({
                subject: activeQuiz.subject || 'Quiz',
                lesson: activeQuiz.title || 'Evaluation IA',
                status: 'Terminé',
                progress: percentScore
            });

            localStorage.removeItem('guineelearn_quiz_draft');
            setDraftQuiz(null);
            setActiveQuiz(null);
            
            // Reload page or re-fetch profile if needed to update global stats
            window.location.reload();
        } catch (err) {
            console.error("Error saving quiz result:", err);
            // Even if save fails, clear draft and return
            localStorage.removeItem('guineelearn_quiz_draft');
            setDraftQuiz(null);
            setActiveQuiz(null);
        }
    };

    const handleCreateQuiz = async () => {
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL && BASE_URL !== 'undefined' ? (BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL) : 'http://localhost:5000'}/api/quiz/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: newQuizData.subject,
                    chapter: newQuizData.chapter,
                    lesson: newQuizData.lesson,
                    level: displayedLevel,
                    difficulty: newQuizData.difficulty
                })
            });

            if (!response.ok) {
                let errorMsg = "Erreur serveur";
                try {
                    const errData = await response.json();
                    if (errData.message) errorMsg = errData.message;
                } catch(e) {}
                throw new Error(errorMsg);
            }

            const quiz = await response.json();
            
            setIsGenerating(false);
            setIsCreateModalOpen(false);
            setNewQuizData({ subject: '', chapter: '', lesson: '', difficulty: 'Moyen' });
            
            setActiveQuiz(quiz);
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setScore(0);
            setIsQuizFinished(false);
            setShowExplanation(false);
            
            // Initial save for the new quiz
            const draft = { quiz, currentIndex: 0, score: 0 };
            localStorage.setItem('guineelearn_quiz_draft', JSON.stringify(draft));
        } catch (err: any) {
            console.error(err);
            alert(`Erreur lors de la génération du quiz : ${err.message}`);
            setIsGenerating(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch(diff) {
            case 'Facile': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Moyen': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Avancé':
            case 'Expert': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    if (activeQuiz) {
        if (isQuizFinished) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-4 space-y-8 animate-in fade-in zoom-in duration-500">
                    {/* Header Info */}
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-16 h-16 bg-[#E8F5EE] text-[#1B6B3A] rounded-full flex items-center justify-center mb-2">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-[#0F2D1E]">Quiz Terminé !</h2>
                        <p className="text-gray-500 font-medium max-w-md">
                            Vous avez complété le quiz généré par IA : <br/>
                            <span className="text-[#0F2D1E] font-bold">"{activeQuiz.title}"</span>
                        </p>
                    </div>

                    {/* Main Score Card */}
                    <div className="bg-white rounded-lg p-10 shadow-xl shadow-gray-100 border border-gray-100 w-full max-w-lg flex flex-col items-center space-y-8">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">VOTRE SCORE</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-7xl font-black text-[#1B6B3A]">{score}</span>
                                <span className="text-3xl font-bold text-gray-300">/ {activeQuiz.questions.length}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <button 
                                onClick={handleFinishQuiz}
                                className="w-full py-4 bg-[#1B6B3A] text-white rounded-md font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#1B6B3A]/20 hover:bg-[#14532D] transition-all"
                            >
                                ENREGISTRER & QUITTER
                                <FileCheck className="w-5 h-5" />
                            </button>
                            <button className="w-full text-sm font-bold text-[#1B6B3A] hover:underline underline-offset-4">
                                Consulter la correction détaillée
                            </button>
                        </div>
                    </div>

                    {/* Lower Stats Row */}
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
                            <p className="text-2xl font-black text-[#0F2D1E]">{Math.round((score / activeQuiz.questions.length) * 100)}%</p>
                        </div>
                    </div>

                    <p className="text-xs font-medium text-gray-400">
                        Besoin d'aide ? <span className="text-[#1B6B3A] font-bold cursor-pointer hover:underline">Contactez le support pédagogique</span>
                    </p>
                </div>
            );
        }

        const currentQ = activeQuiz.questions[currentQuestionIndex];

        return (
            <div className="bg-[#F8FAFC] h-full flex flex-col animate-in fade-in duration-300 overflow-hidden">
                {/* Header Navbar */}
                <div className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-[#0F2D1E] font-bold text-sm">
                            Quiz {activeQuiz.title?.split('-')[0] || 'Généré par IA'}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500 font-medium">
                            {activeQuiz.title?.split('-')[1] || 'Test personnalisé'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Live Timer */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F5EE] rounded-md">
                            <Clock className="w-3.5 h-3.5 text-[#1B6B3A]" />
                            <span className="text-[#1B6B3A] font-black text-sm tabular-nums">{formatTime(elapsedSeconds)}</span>
                        </div>
                        <button 
                            onClick={() => setActiveQuiz(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-4 py-10">
                    <div className="max-w-4xl mx-auto">
                        
                        {/* Progress Section */}
                        <div className="mb-8">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">
                                PROGRESSION DU TEST
                            </p>
                            <div className="flex items-end justify-between mb-3">
                                <h2 className="text-2xl font-bold text-[#0F2D1E]">
                                    Question {currentQuestionIndex + 1} <span className="text-gray-400 font-medium text-xl">SUR {activeQuiz.questions.length}</span>
                                </h2>
                                <span className="text-lg font-black text-[#0F2D1E]">
                                    {Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E8F5EE] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#1B6B3A] transition-all duration-500"
                                    style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-start gap-3 sm:gap-4 mb-6">
                                <div className="w-10 h-10 shrink-0 bg-[#E8F5EE] text-[#1B6B3A] rounded-md flex items-center justify-center font-serif italic font-black text-lg shadow-sm">
                                    Σ
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-base sm:text-lg md:text-xl font-bold text-[#0F2D1E] pt-1 sm:pt-1.5 leading-relaxed break-words ${currentQ.imageUrl ? 'mb-6' : 'mb-2'}`}>
                                        {currentQ.question}
                                    </h3>
                                    
                                    {/* Image / Graph Section (Only if provided by AI) */}
                                    {currentQ.imageUrl && (
                                        <div className="w-full bg-[#0F2D1E] rounded-2xl overflow-hidden shadow-inner mb-2 flex items-center justify-center relative border border-gray-100">
                                            <img 
                                                src={currentQ.imageUrl} 
                                                alt="Graphique de la question" 
                                                className="w-full h-auto max-h-[400px] object-contain transition-all duration-500"
                                                onError={(e) => {
                                                    // Masquer l'image si le lien fourni par l'IA est cassé
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {currentQ.options.map((option: string, idx: number) => {
                                    let optionClass = "border-gray-100 bg-white text-gray-700 hover:border-gray-300";
                                    let letterClass = "bg-gray-50 text-gray-500 group-hover:bg-gray-100";
                                    
                                    if (showExplanation) {
                                        if (idx === currentQ.correctAnswerIndex) {
                                            optionClass = "border-[#1B6B3A] bg-[#CBE4D3] text-[#1B6B3A] font-bold";
                                            letterClass = "bg-[#1B6B3A] text-white";
                                        } else if (idx === selectedOption) {
                                            optionClass = "border-rose-400 bg-rose-50 text-rose-600";
                                            letterClass = "bg-rose-100 text-rose-600";
                                        } else {
                                            optionClass = "border-gray-100 text-gray-400 opacity-50";
                                        }
                                    } else if (selectedOption === idx) {
                                        optionClass = "border-[#1B6B3A] bg-[#CBE4D3] text-[#1B6B3A] font-bold shadow-sm";
                                        letterClass = "bg-[#1B6B3A] text-white";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !showExplanation && setSelectedOption(idx)}
                                            disabled={showExplanation}
                                            className={`w-full p-4 rounded-md border text-left transition-all duration-200 ${optionClass} flex items-center gap-4 group`}
                                        >
                                            <div className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center font-black text-xs transition-colors ${letterClass}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="flex-1 text-sm md:text-base leading-snug">{option}</span>
                                            
                                            {/* Checkmark icon for selected option */}
                                            {(!showExplanation && selectedOption === idx) && (
                                                <div className="w-5 h-5 rounded-full bg-[#1B6B3A] flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-3 h-3 text-[#CBE4D3]" />
                                                </div>
                                            )}
                                            {showExplanation && idx === currentQ.correctAnswerIndex && (
                                                <div className="w-5 h-5 rounded-full bg-[#1B6B3A] flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-3 h-3 text-[#CBE4D3]" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Actions / Footer of Card */}
                            <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
                                <button 
                                    onClick={() => setActiveQuiz(null)}
                                    className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-sm transition-colors w-full md:w-auto py-2 md:py-0"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Quitter
                                </button>

                                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={handleSaveDraft}
                                            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-md bg-[#E8F5EE] text-[#1B6B3A] font-bold text-sm hover:bg-[#D1E8D5] transition-colors whitespace-nowrap"
                                        >
                                            Sauvegarder le brouillon
                                        </button>

                                        {!showExplanation ? (
                                            <button
                                                onClick={() => {
                                                    setShowExplanation(true);
                                                    if (selectedOption === currentQ.correctAnswerIndex) {
                                                        setScore(s => s + 1);
                                                    }
                                                }}
                                                disabled={selectedOption === null}
                                                className="w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-md bg-[#1B6B3A] text-white font-bold text-sm hover:bg-[#14532D] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md whitespace-nowrap"
                                            >
                                                Valider
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
                                                        setCurrentQuestionIndex(i => i + 1);
                                                        setSelectedOption(null);
                                                        setShowExplanation(false);
                                                    } else {
                                                        setIsQuizFinished(true);
                                                    }
                                                }}
                                                className="w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-md bg-[#1B6B3A] text-white font-bold text-sm hover:bg-[#14532D] transition-colors flex items-center justify-center gap-2 shadow-md whitespace-nowrap"
                                            >
                                                {currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Question Suivante' : 'Terminer'}
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                </div>
                            </div>
                            
                            {/* Explanation Dropdown (if evaluated) */}
                            {showExplanation && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={`mt-6 p-5 rounded-md border ${selectedOption === currentQ.correctAnswerIndex ? 'bg-[#E8F5EE] border-[#1B6B3A]/20' : 'bg-rose-50 border-rose-200'}`}
                                >
                                    <h4 className={`text-xs font-black uppercase tracking-widest mb-1.5 ${selectedOption === currentQ.correctAnswerIndex ? 'text-[#1B6B3A]' : 'text-rose-600'}`}>
                                        {selectedOption === currentQ.correctAnswerIndex ? 'Bonne Réponse ! 🎉' : 'Incorrect...'}
                                    </h4>
                                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                        {currentQ.explanation}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                        
                        {/* Final Footer Text */}
                        <div className="text-center pb-8 pt-4">
                            <p className="text-[10px] text-gray-400 font-medium">
                                © 2024 GuinéeLearn - Système d'Evaluation Académique Certifié
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto px-4 md:px-8 py-8 space-y-10">
            {/* Header / Stats Summary */}
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Centre de Quiz</h2>
                    <p className="text-gray-500 font-medium tracking-wide">
                        Entraînez-vous avec des tests adaptés à votre niveau : <span className="text-[#1B6B3A] font-bold">{displayedLevel}</span>
                    </p>
                </div>

                        <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200  flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Score Moyen</p>
                            <p className="text-lg font-black text-[#0F2D1E]">{averageScore}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200  flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A]">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Quiz Finis</p>
                            <p className="text-lg font-black text-[#0F2D1E]">{completedQuizzes}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                
                {/* Create New Quiz Card */}
                <motion.div
                    onClick={() => setIsCreateModalOpen(true)}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-[#1B6B3A] hover:bg-[#F8FAFC] shadow-sm p-6 overflow-hidden group transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[220px]"
                >
                    <div className="w-14 h-14 bg-[#E8F5EE] text-[#1B6B3A] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                        <Plus className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#0F2D1E] mb-1 group-hover:text-[#1B6B3A] transition-colors">
                        Créer un Quiz
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
                        Test sur-mesure
                    </p>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[9px] font-black shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Sparkles className="w-3 h-3" />
                        Généré par IA
                    </div>
                </motion.div>

                {/* Resume Draft Card (If exists) */}
                {draftQuiz && (
                    <motion.div
                        onClick={handleResumeDraft}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg border border-emerald-200 hover:border-emerald-500/40 shadow-sm p-1 overflow-hidden group transition-all duration-300 cursor-pointer"
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-100">
                                    BROUILLON EN COURS
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#E8F5EE] rounded-full text-[#1B6B3A] text-[9px] font-black ring-4 ring-[#E8F5EE]/30">
                                        <Clock className="w-3 h-3" />
                                        Q. {draftQuiz.currentIndex + 1}/{draftQuiz.quiz.questions.length}
                                    </div>
                                    <button 
                                        onClick={handleDeleteDraft}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Supprimer le brouillon"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-base font-extrabold text-[#0F2D1E] mb-1 leading-tight group-hover:text-[#1B6B3A] transition-colors line-clamp-1">
                                {draftQuiz.quiz.title}
                            </h3>
                            <p className="text-[9px] font-bold text-gray-400 mb-4 uppercase tracking-widest line-clamp-1">
                                {draftQuiz.quiz.subject || 'Test Personnalisé'}
                            </p>

                            <div className="flex items-center gap-4 mb-5 text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FileCheck className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] font-bold">{draftQuiz.quiz.questions.length} Ques.</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <Target className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] font-bold">{Math.round(((draftQuiz.currentIndex) / draftQuiz.quiz.questions.length) * 100)}% complété</span>
                                </div>
                            </div>

                             <button 
                                onClick={handleResumeDraft}
                                className="w-full py-3 rounded-lg bg-[#F8FAFC] group-hover:bg-[#1B6B3A] text-[#1B6B3A] group-hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#1B6B3A]/5 group-hover:border-[#1B6B3A] transition-colors"
                            >
                                Reprendre le test
                                <Play className="w-2.5 h-2.5 group-hover:fill-current" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {currentQuizzes.map((quiz) => (
                    <motion.div
                        key={quiz.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg border border-gray-200 hover:border-emerald-500/40  shadow-gray-200/40 p-1 overflow-hidden group  duration-300"
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${getDifficultyColor(quiz.difficulty)}`}>
                                    {quiz.difficulty}
                                </div>
                                {quiz.score !== null && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#E8F5EE] rounded-full text-[#1B6B3A] text-[9px] font-black ring-4 ring-[#E8F5EE]/30">
                                        <ShieldCheck className="w-3 h-3" />
                                        {quiz.score}%
                                    </div>
                                )}
                            </div>

                            <h3 className="text-base font-extrabold text-[#0F2D1E] mb-1 leading-tight group-hover:text-[#1B6B3A] transition-colors">
                                {quiz.title}
                            </h3>
                            <p className="text-[9px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
                                {quiz.subject}
                            </p>

                            <div className="flex items-center gap-4 mb-5 text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FileCheck className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] font-bold">{quiz.questions} Ques.</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] font-bold">{quiz.duration}</span>
                                </div>
                            </div>

                            <button className="w-full py-3 rounded-lg bg-[#F8FAFC] group-hover:bg-[#1B6B3A] text-[#1B6B3A] group-hover:text-white font-black text-[10px] uppercase tracking-widest  flex items-center justify-center gap-2 border-2 border-[#1B6B3A]/5 group-hover:border-[#1B6B3A] group-hover: group-hover:shadow-[#1B6B3A]/30">
                                {quiz.score !== null ? 'Revoir le test' : 'Commencer'}
                                <Play className="w-2.5 h-2.5 group-hover:fill-current" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal de Création de Quiz */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-gray-900">Générer un Quiz avec l'IA</h2>
                                    <p className="text-[10px] text-gray-500 font-medium">Test sur-mesure adapté à votre niveau</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Input: Matière */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                    <BookOpen className="w-4 h-4 text-emerald-500" />
                                    Matière
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Mathématiques, Physique..."
                                    value={newQuizData.subject}
                                    onChange={(e) => setNewQuizData({...newQuizData, subject: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Input: Chapitre */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                    <Layers className="w-4 h-4 text-emerald-500" />
                                    Chapitre
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Les Nombres Complexes"
                                    value={newQuizData.chapter}
                                    onChange={(e) => setNewQuizData({...newQuizData, chapter: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Input: Leçon / Compétence */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                    <Target className="w-4 h-4 text-emerald-500" />
                                    Leçon ou Compétence visée (Optionnel)
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Forme algébrique et trigonométrique"
                                    value={newQuizData.lesson}
                                    onChange={(e) => setNewQuizData({...newQuizData, lesson: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium"
                                />
                            </div>

                            {/* Input: Niveau de Difficulté */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-3">
                                    <Trophy className="w-4 h-4 text-emerald-500" />
                                    Niveau de Difficulté
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Facile', 'Moyen', 'Difficile', 'Expert'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setNewQuizData({...newQuizData, difficulty: level})}
                                            className={`py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${
                                                newQuizData.difficulty === level 
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' 
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                        >
                                            {newQuizData.difficulty === level && <CheckCircle2 className="w-3 h-3" />}
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center gap-3">
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-5 py-2.5 rounded-lg font-semibold text-[13px] text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleCreateQuiz}
                                disabled={isGenerating || !newQuizData.subject || !newQuizData.chapter}
                                className="bg-[#1B6B3A] text-white px-8 py-3 rounded-lg font-bold text-[13px] uppercase tracking-widest shadow-lg hover:shadow-emerald-500/30 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Génération...
                                    </>
                                ) : (
                                    'Démarrer la création'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

