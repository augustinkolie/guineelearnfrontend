'use client';

import React from 'react';
import { User, GraduationCap, Pencil, ShieldCheck, Camera } from 'lucide-react';

interface ProfileHeaderCardProps {
    user: any;
    profile: any;
    onEditIntro: () => void;
    onOpenObjectives: () => void;
    onOpenSkills: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
    user,
    profile,
    onEditIntro,
    onOpenObjectives,
    onOpenSkills,
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <div className="h-40 bg-gradient-to-r from-emerald-600 to-teal-800 relative">
                <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white transition">
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-start">
                    <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 -mt-14 mb-4 flex items-center justify-center shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-slate-400" />
                        )}
                    </div>

                    <button
                        onClick={onEditIntro}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition mt-2 text-slate-500"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName || 'Utilisateur'}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {profile?.schoolLevel || 'Niveau non défini'} • {profile?.schoolName || 'Établissement non défini'}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={onOpenObjectives}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs transition"
                    >
                        Mes objectifs
                    </button>
                    <button
                        onClick={onOpenSkills}
                        className="px-4 py-1.5 border border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                    >
                        Ajouter une compétence
                    </button>
                </div>
            </div>
        </div>
    );
};
