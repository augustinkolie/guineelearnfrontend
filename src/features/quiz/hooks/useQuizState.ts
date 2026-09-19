'use client';

import { useState, useRef, useEffect } from 'react';
import { BASE_URL, logActivity } from '@/utils/api';

export function useQuizState(profile: any) {
    const rawLevel = profile?.subLevel || profile?.schoolLevel || 'Terminale SM';
    const displayedLevel = rawLevel === 'Primaire' ? '1ère année' : rawLevel;

    const completedQuizzes = profile?.completedQuizzes || 0;
    const globalScore = profile?.globalScore || 0;
    const averageScore = completedQuizzes > 0 ? Math.round(globalScore / completedQuizzes) : 0;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newQuizData, setNewQuizData] = useState({
        subject: '', chapter: '', lesson: '', difficulty: 'Moyen'
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const [activeQuiz, setActiveQuiz] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [draftQuiz, setDraftQuiz] = useState<any>(null);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [showCorrection, setShowCorrection] = useState(false);

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

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

    useEffect(() => {
        if (activeQuiz && !isQuizFinished) {
            setElapsedSeconds(0);
        }
    }, [activeQuiz]);

    useEffect(() => {
        const saved = localStorage.getItem('guineelearn_quiz_draft');
        if (saved) {
            try { setDraftQuiz(JSON.parse(saved)); } catch(e) {}
        } else {
            setDraftQuiz(null);
        }
    }, [activeQuiz]);

    useEffect(() => {
        if (activeQuiz && !isQuizFinished) {
            const draft = {
                quiz: activeQuiz,
                currentIndex: currentQuestionIndex,
                score,
                userAnswers
            };
            localStorage.setItem('guineelearn_quiz_draft', JSON.stringify(draft));
        }
    }, [activeQuiz, currentQuestionIndex, score, isQuizFinished, userAnswers]);

    const handleSaveDraft = () => {
        alert("Progression sauvegardée ! Vous pourrez reprendre ce quiz plus tard.");
        setActiveQuiz(null);
    };

    const handleResumeDraft = () => {
        if (draftQuiz) {
            setActiveQuiz(draftQuiz.quiz);
            setCurrentQuestionIndex(draftQuiz.currentIndex);
            setScore(draftQuiz.score);
            setUserAnswers(draftQuiz.userAnswers || []);
            setSelectedOption(null);
            setShowExplanation(false);
            setIsQuizFinished(false);
            setShowCorrection(false);
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
                    average: percentScore
                })
            });

            await logActivity({
                subject: activeQuiz.subject || 'Quiz',
                lesson: activeQuiz.title || 'Evaluation IA',
                status: 'Terminé',
                progress: percentScore
            });

            localStorage.removeItem('guineelearn_quiz_draft');
            setDraftQuiz(null);
            setActiveQuiz(null);
            window.location.reload();
        } catch (err) {
            console.error("Error saving quiz result:", err);
            localStorage.removeItem('guineelearn_quiz_draft');
            setDraftQuiz(null);
            setActiveQuiz(null);
        }
    };

    const handleCreateQuiz = async () => {
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrlClean = BASE_URL && BASE_URL !== 'undefined' ? (BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL) : 'http://localhost:5000';
            const response = await fetch(`${baseUrlClean}/api/quiz/generate`, {
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
            
            const draft = { quiz, currentIndex: 0, score: 0, userAnswers: [] };
            localStorage.setItem('guineelearn_quiz_draft', JSON.stringify(draft));
        } catch (err: any) {
            console.error(err);
            alert(`Erreur lors de la génération du quiz : ${err.message}`);
            setIsGenerating(false);
        }
    };

    return {
        displayedLevel, completedQuizzes, averageScore,
        isCreateModalOpen, setIsCreateModalOpen,
        newQuizData, setNewQuizData, isGenerating,
        activeQuiz, setActiveQuiz, currentQuestionIndex, setCurrentQuestionIndex,
        selectedOption, setSelectedOption, score, setScore,
        isQuizFinished, setIsQuizFinished, showExplanation, setShowExplanation,
        draftQuiz, userAnswers, setUserAnswers, showCorrection, setShowCorrection,
        elapsedSeconds, formatTime,
        handleSaveDraft, handleResumeDraft, handleDeleteDraft, handleFinishQuiz, handleCreateQuiz
    };
}
