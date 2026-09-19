'use client';

import React from 'react';
import { BookOpen, Trophy, Clock } from 'lucide-react';

interface AcademicProgressCardProps {
    stats: {
        courses: number;
        exams: number;
        studyTime: number;
    };
}

export const AcademicProgressCard: React.FC<AcademicProgressCardProps> = ({ stats }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Progression Académique</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <div className="flex items-center justify-center gap-1 font-bold text-emerald-600">
                        <BookOpen className="w-4 h-4" /> {stats.courses}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Cours terminés</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                        <Trophy className="w-4 h-4" /> {stats.exams}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Examens réussis</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <div className="flex items-center justify-center gap-1 font-bold text-blue-500">
                        <Clock className="w-4 h-4" /> {stats.studyTime}h
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Temps d'étude</p>
                </div>
            </div>
        </div>
    );
};
