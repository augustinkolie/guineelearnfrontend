'use client';

import React, { useState } from 'react';
import { getMockChapters } from '@/features/courses/data/mockChapters';
import { ChapterSidebar } from '@/features/courses/components/ChapterSidebar';
import { Sparkles, Trophy, BookOpen, FileText, CheckSquare } from 'lucide-react';

interface CourseDetailsProps {
    courseId: string;
    courseTitle: string;
    courseLevel: string;
    profile: any;
}

/**
 * CourseDetailsView (Conteneur ultra-léger < 90 lignes)
 * SRP, modularité et découpage propre du code.
 */
export const CourseDetailsView: React.FC<CourseDetailsProps> = ({
    courseId,
    courseTitle,
    courseLevel,
    profile,
}) => {
    const chaptersData = getMockChapters(courseTitle, courseLevel);
    const [activeChapterId, setActiveChapterId] = useState(chaptersData[0]?.id || 'c1');
    const activeChapter = chaptersData.find((c) => c.id === activeChapterId) || chaptersData[0];

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
            {/* 1. Barre latérale des chapitres */}
            <ChapterSidebar
                chapters={chaptersData}
                activeChapterId={activeChapterId}
                onSelectChapter={setActiveChapterId}
            />

            {/* 2. Contenu principal du chapitre */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                            {courseLevel}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-amber-500" /> {activeChapter.pointsPossible} points à gagner
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {activeChapter.title}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        {activeChapter.description}
                    </p>

                    {/* Liste des leçons et exercices */}
                    <div className="space-y-4">
                        {activeChapter.lessons?.map((lesson: any) => (
                            <div
                                key={lesson.id}
                                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800"
                            >
                                <h3 className="font-bold text-slate-800 dark:text-white text-base mb-3">
                                    {lesson.title}
                                </h3>

                                <div className="space-y-2">
                                    {lesson.learnings?.map((lr: any) => (
                                        <div
                                            key={lr.id}
                                            className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-lg text-sm"
                                        >
                                            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <FileText className="w-4 h-4 text-emerald-500" />
                                                {lr.title}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                {lr.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
