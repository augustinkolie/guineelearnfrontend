'use client';

import React from 'react';
import { BookOpen, CheckSquare, Flame } from 'lucide-react';

interface ChapterSidebarProps {
    chapters: any[];
    activeChapterId: string;
    onSelectChapter: (id: string) => void;
}

export const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
    chapters,
    activeChapterId,
    onSelectChapter,
}) => {
    return (
        <aside className="w-full lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-3 overflow-y-auto shrink-0">
            <h3 className="font-bold text-slate-800 dark:text-white text-base px-2 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" /> Chapitres du Cours
            </h3>
            {chapters.map((chap, idx) => {
                const isActive = chap.id === activeChapterId;
                return (
                    <button
                        key={chap.id}
                        onClick={() => onSelectChapter(chap.id)}
                        className={`w-full text-left p-3.5 rounded-xl transition flex flex-col gap-1 border ${
                            isActive
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-semibold'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex items-center justify-between text-xs text-slate-500 font-normal">
                            <span>Chapitre {idx + 1}</span>
                            <span className="flex items-center gap-1 text-amber-500">
                                <Flame className="w-3.5 h-3.5" /> {chap.pointsPossible} pts
                            </span>
                        </div>
                        <span className="text-sm line-clamp-1">{chap.title}</span>
                    </button>
                );
            })}
        </aside>
    );
};
