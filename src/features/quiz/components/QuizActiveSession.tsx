'use client';

import { Clock, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

interface QuizActiveSessionProps {
    activeQuiz: any;
    currentQuestionIndex: number;
    selectedOption: number | null;
    showExplanation: boolean;
    elapsedSeconds: number;
    formatTime: (sec: number) => string;
    onSelectOption: (idx: number) => void;
    onValidate: () => void;
    onNextQuestion: () => void;
    onQuit: () => void;
    onSaveDraft: () => void;
}

export const QuizActiveSession: React.FC<QuizActiveSessionProps> = ({
    activeQuiz, currentQuestionIndex, selectedOption, showExplanation, elapsedSeconds, formatTime,
    onSelectOption, onValidate, onNextQuestion, onQuit, onSaveDraft
}) => {
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const isLast = currentQuestionIndex === activeQuiz.questions.length - 1;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100);

    return (
        <div className="bg-[#F8FAFC] h-full flex flex-col animate-in fade-in duration-300 overflow-hidden">
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
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F5EE] rounded-md">
                        <Clock className="w-3.5 h-3.5 text-[#1B6B3A]" />
                        <span className="text-[#1B6B3A] font-black text-sm tabular-nums">{formatTime(elapsedSeconds)}</span>
                    </div>
                    <button onClick={onQuit} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">
                            PROGRESSION DU TEST
                        </p>
                        <div className="flex items-end justify-between mb-3">
                            <h2 className="text-2xl font-bold text-[#0F2D1E]">
                                Question {currentQuestionIndex + 1} <span className="text-gray-400 font-medium text-xl">SUR {activeQuiz.questions.length}</span>
                            </h2>
                            <span className="text-lg font-black text-[#0F2D1E]">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E8F5EE] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1B6B3A] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-start gap-3 sm:gap-4 mb-6">
                            <div className="w-10 h-10 shrink-0 bg-[#E8F5EE] text-[#1B6B3A] rounded-md flex items-center justify-center font-serif italic font-black text-lg shadow-sm">
                                Σ
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-base sm:text-lg md:text-xl font-bold text-[#0F2D1E] pt-1.5 leading-relaxed break-words mb-2">
                                    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                                        {currentQ.question}
                                    </ReactMarkdown>
                                </div>
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
                                    <button key={idx} onClick={() => !showExplanation && onSelectOption(idx)} disabled={showExplanation}
                                        className={`w-full p-4 rounded-md border text-left transition-all duration-200 ${optionClass} flex items-center gap-4 group`}>
                                        <div className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center font-black text-xs transition-colors ${letterClass}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <div className="flex-1 text-sm md:text-base leading-snug">
                                            <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                                                {option}
                                            </ReactMarkdown>
                                        </div>
                                        {selectedOption === idx && (
                                            <div className="w-5 h-5 rounded-full bg-[#1B6B3A] flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-3 h-3 text-[#CBE4D3]" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
                            <button onClick={onQuit} className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-sm transition-colors w-full md:w-auto">
                                <ArrowRight className="w-4 h-4 rotate-180" /> Quitter
                            </button>

                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                <button onClick={onSaveDraft} className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#E8F5EE] text-[#1B6B3A] font-bold text-sm hover:bg-[#D1E8D5] transition-colors whitespace-nowrap">
                                    Sauvegarder le brouillon
                                </button>
                                {!showExplanation ? (
                                    <button onClick={onValidate} disabled={selectedOption === null}
                                        className="w-full sm:w-auto px-8 py-2.5 rounded-md bg-[#1B6B3A] text-white font-bold text-sm hover:bg-[#14532D] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md whitespace-nowrap">
                                        Valider <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button onClick={onNextQuestion} className="w-full sm:w-auto px-8 py-2.5 rounded-md bg-[#1B6B3A] text-white font-bold text-sm hover:bg-[#14532D] transition-colors flex items-center justify-center gap-2 shadow-md whitespace-nowrap">
                                        {isLast ? 'Terminer' : 'Question Suivante'} <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {showExplanation && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                className={`mt-6 p-5 rounded-md border ${selectedOption === currentQ.correctAnswerIndex ? 'bg-[#E8F5EE] border-[#1B6B3A]/20' : 'bg-rose-50 border-rose-200'}`}>
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-1.5 ${selectedOption === currentQ.correctAnswerIndex ? 'text-[#1B6B3A]' : 'text-rose-600'}`}>
                                    {selectedOption === currentQ.correctAnswerIndex ? 'Bonne Réponse ! 🎉' : 'Incorrect...'}
                                </h4>
                                <div className="text-sm font-medium text-gray-800 leading-relaxed">
                                    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                                        {currentQ.explanation}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
