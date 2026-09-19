'use client';

import React from 'react';
import { Sparkles, X, BookOpen, Layers, Target, Trophy, CheckCircle2 } from 'lucide-react';

interface CreateQuizModalProps {
    isOpen: boolean;
    newQuizData: any;
    isGenerating: boolean;
    onClose: () => void;
    onUpdateData: (data: any) => void;
    onSubmit: () => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
    isOpen, newQuizData, isGenerating, onClose, onUpdateData, onSubmit
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-gray-900">Générer un Quiz avec l&apos;IA</h2>
                            <p className="text-[10px] text-gray-500 font-medium">Test sur-mesure adapté à votre niveau</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                            Matière
                        </label>
                        <input type="text" placeholder="Ex: Mathématiques, Physique..." value={newQuizData.subject}
                            onChange={(e) => onUpdateData({ ...newQuizData, subject: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium" />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                            <Layers className="w-4 h-4 text-emerald-500" />
                            Chapitre
                        </label>
                        <input type="text" placeholder="Ex: Les Nombres Complexes" value={newQuizData.chapter}
                            onChange={(e) => onUpdateData({ ...newQuizData, chapter: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium" />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                            <Target className="w-4 h-4 text-emerald-500" />
                            Leçon ou Compétence visée (Optionnel)
                        </label>
                        <input type="text" placeholder="Ex: Forme algébrique et trigonométrique" value={newQuizData.lesson}
                            onChange={(e) => onUpdateData({ ...newQuizData, lesson: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium" />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-widest mb-3">
                            <Trophy className="w-4 h-4 text-emerald-500" />
                            Niveau de Difficulté
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Facile', 'Moyen', 'Difficile', 'Expert'].map((level) => (
                                <button key={level} onClick={() => onUpdateData({ ...newQuizData, difficulty: level })}
                                    className={`py-3 rounded-lg text-[11px] font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 ${
                                        newQuizData.difficulty === level ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}>
                                    {newQuizData.difficulty === level && <CheckCircle2 className="w-3 h-3" />}
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-lg font-semibold text-[13px] text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors">
                        Annuler
                    </button>
                    <button onClick={onSubmit} disabled={isGenerating || !newQuizData.subject || !newQuizData.chapter}
                        className="bg-[#1B6B3A] text-white px-8 py-3 rounded-lg font-bold text-[13px] uppercase tracking-widest shadow-lg hover:shadow-emerald-500/30 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Génération...
                            </>
                        ) : 'Démarrer la création'}
                    </button>
                </div>
            </div>
        </div>
    );
};
