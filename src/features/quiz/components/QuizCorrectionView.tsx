'use client';

import React from 'react';
import { ArrowRight, Trophy, CheckCircle2, X, Sparkles, FileCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

interface QuizCorrectionViewProps {
    activeQuiz: any;
    score: number;
    userAnswers: number[];
    onBackToFinished: () => void;
    onFinishQuiz: () => void;
}

export const QuizCorrectionView: React.FC<QuizCorrectionViewProps> = ({
    activeQuiz, score, userAnswers, onBackToFinished, onFinishQuiz
}) => {
    return (
        <div className="bg-[#F8FAFC] min-h-full pb-20 animate-in fade-in duration-300">
            <div className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBackToFinished} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                        <h3 className="font-black text-[#0F2D1E] text-lg">Correction Détaillée</h3>
                        <p className="text-xs font-bold text-[#1B6B3A] uppercase tracking-widest">{activeQuiz.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-[#E8F5EE] rounded-lg border border-emerald-100">
                    <Trophy className="w-4 h-4 text-[#1B6B3A]" />
                    <span className="text-[#1B6B3A] font-black text-sm">Score final : {score}/{activeQuiz.questions.length}</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
                {activeQuiz.questions.map((q: any, idx: number) => {
                    const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
                    return (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-black text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-base font-bold text-[#0F2D1E] leading-relaxed mb-4">
                                            <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                                                {q.question}
                                            </ReactMarkdown>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                            {q.options.map((opt: string, optIdx: number) => {
                                                let style = "border-gray-100 text-gray-500 opacity-60";
                                                let icon = null;
                                                
                                                if (optIdx === q.correctAnswerIndex) {
                                                    style = "border-emerald-500 bg-emerald-50 text-emerald-700 opacity-100 font-bold ring-1 ring-emerald-500/20";
                                                    icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
                                                } else if (optIdx === userAnswers[idx] && !isCorrect) {
                                                    style = "border-rose-400 bg-rose-50 text-rose-600 opacity-100 font-bold";
                                                    icon = <X className="w-4 h-4 text-rose-500" />;
                                                }

                                                return (
                                                    <div key={optIdx} className={`p-4 rounded-lg border flex items-center justify-between gap-3 text-xs md:text-sm ${style}`}>
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-6 h-6 shrink-0 bg-white/50 rounded flex items-center justify-center font-black text-[10px]">{String.fromCharCode(65 + optIdx)}</span>
                                                            <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                                                                {opt}
                                                            </ReactMarkdown>
                                                        </div>
                                                        {icon}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className={`p-5 rounded-lg border ${isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className={`w-3.5 h-3.5 ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>Explication</span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700 leading-relaxed italic">
                                                <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                                                    {q.explanation}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] z-30 flex justify-center">
                <button onClick={onFinishQuiz} className="px-10 py-3 bg-[#1B6B3A] text-white rounded-lg font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-[#14532D] transition-all flex items-center gap-3 uppercase tracking-widest">
                    Enregistrer & Quitter
                    <FileCheck className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
