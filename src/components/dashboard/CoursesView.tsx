'use client';

import React from 'react';
import { 
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const COURSES_BY_LEVEL: Record<string, any[]> = {
    '1ère année': [
        { id: 1, title: 'Calcul écrit', fiches: 49, exos: '13 / 2', videos: 25, apps: 1, thumbnail: '/images/math_course_thumbnail_1775610573519.png' },
        { id: 2, title: 'Ecriture', fiches: 16, exos: '0 / 0', videos: 0, apps: 0, thumbnail: '/images/french_course_thumbnail_1775610625465.png' },
        { id: 3, title: 'Exercices sensoriels', fiches: 26, exos: '11 / 0', videos: 19, apps: 0, thumbnail: '/images/physics_course_thumbnail_1775610601650.png' }
    ],
    '10ème année': [
        { id: 1, title: 'Mathématiques', fiches: 120, exos: '45 / 12', videos: 34, apps: 5, thumbnail: '/images/math_course_thumbnail_1775610573519.png' },
        { id: 2, title: 'Physique', fiches: 85, exos: '30 / 8', videos: 28, apps: 3, thumbnail: '/images/physics_course_thumbnail_1775610601650.png' },
        { id: 3, title: 'Français', fiches: 95, exos: '25 / 5', videos: 20, apps: 2, thumbnail: '/images/french_course_thumbnail_1775610625465.png' },
        { id: 4, title: 'Chimie', fiches: 60, exos: '20 / 4', videos: 15, apps: 1, thumbnail: '/images/physics_course_thumbnail_1775610601650.png' },
        { id: 5, title: 'Economie', fiches: 50, exos: '15 / 5', videos: 10, apps: 0, thumbnail: '/images/math_course_thumbnail_1775610573519.png' },
        { id: 6, title: 'Économie', fiches: 70, exos: '15 / 3', videos: 22, apps: 2, thumbnail: '/images/math_course_thumbnail_1775610573519.png' },
        { id: 7, title: 'Anglais', fiches: 55, exos: '18 / 6', videos: 12, apps: 1, thumbnail: '/images/french_course_thumbnail_1775610625465.png' },
        { id: 8, title: 'Histoire', fiches: 40, exos: '10 / 2', videos: 10, apps: 0, thumbnail: '/images/french_course_thumbnail_1775610625465.png' },
        { id: 9, title: 'Géographie', fiches: 45, exos: '12 / 3', videos: 8, apps: 0, thumbnail: '/images/math_course_thumbnail_1775610573519.png' },
        { id: 10, title: 'ECM', fiches: 30, exos: '8 / 1', videos: 5, apps: 0, thumbnail: '/images/physics_course_thumbnail_1775610601650.png' }
    ],
    'Terminale SM': [
        { id: 1, title: 'Mathématiques', fiches: 150, exos: '60 / 15', videos: 45, apps: 8, thumbnail: '/images/math_course_thumbnail_1775610573519.png' },
        { id: 2, title: 'Physique', fiches: 130, exos: '50 / 12', videos: 40, apps: 6, thumbnail: '/images/physics_course_thumbnail_1775610601650.png' },
        { id: 3, title: 'Chimie', fiches: 90, exos: '35 / 5', videos: 25, apps: 2, thumbnail: '/images/physics_course_thumbnail_1775610601650.png' },
        { id: 4, title: 'Français', fiches: 80, exos: '20 / 4', videos: 18, apps: 1, thumbnail: '/images/french_course_thumbnail_1775610625465.png' },
        { id: 5, title: 'Economie', fiches: 60, exos: '10 / 2', videos: 10, apps: 1, thumbnail: '/images/math_course_thumbnail_1775610573519.png' },
        { id: 6, title: 'Philosophie', fiches: 110, exos: '15 / 2', videos: 30, apps: 0, thumbnail: '/images/french_course_thumbnail_1775610625465.png' },
        { id: 7, title: 'Anglais', fiches: 75, exos: '25 / 8', videos: 15, apps: 2, thumbnail: '/images/french_course_thumbnail_1775610625465.png' }
    ]
};

export const CoursesView = ({ profile }: { profile: any }) => {
    // Determine level from profile
    const rawLevel = profile?.subLevel || profile?.schoolLevel || 'Terminale SM';
    const displayedLevel = rawLevel === 'Primaire' ? '1ère année' : rawLevel;
    
    // Get courses for this level, fallback to Terminale SM if not found
    const currentCourses = COURSES_BY_LEVEL[displayedLevel] || COURSES_BY_LEVEL['Terminale SM'];
    const router = useRouter();

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#1B6B3A] mb-2 tracking-tight">Mes Cours</h2>
                    <p className="text-gray-500 font-medium tracking-wide">
                        Classe actuelle : <span className="text-[#006037] font-black">{displayedLevel}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1B6B3A] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une matière..." 
                            className="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans"
                        />
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {currentCourses.map((course) => (
                    <motion.div 
                        key={course.id}
                        initial={{ opacity: 0.8, scale: 0.98 }}
                        whileHover={{ y: -8, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden relative flex flex-col h-full group"
                    >
                        {/* Course Image */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                            <img 
                                src={course.thumbnail} 
                                alt={course.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                onError={(e) => {
                                    (e.target as any).src = 'https://images.unsplash.com/photo-1454165833762-02c340866384?auto=format&fit=crop&q=80&w=800';
                                }}
                            />
                            {/* Price Badge */}
                            <div className="absolute bottom-4 right-4 px-4 py-2 bg-[#1B6B3A] text-white text-[11px] font-black rounded-lg shadow-xl uppercase tracking-widest">
                                9,000 GNF/MOIS
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                            <div className="space-y-1 mb-4">
                                <h3 className="text-xl font-extrabold text-[#1B6B3A] line-clamp-1 group-hover:text-[#155230] transition-colors">
                                    {course.id}. {course.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Classe :</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1B6B3A] underline decoration-green-200 decoration-2 underline-offset-2">{displayedLevel}</span>
                                </div>
                            </div>

                            {/* Dotted Line */}
                            <div className="border-t border-dashed border-gray-100 my-5" />

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Fiches</span>
                                    <span className="text-[11px] font-black text-[#1B6B3A]">{course.fiches}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Exercices</span>
                                    <span className="text-[11px] font-black text-[#1B6B3A]">{course.exos}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Vidéos</span>
                                    <span className="text-[11px] font-black text-[#1B6B3A]">{course.videos}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Pratiques</span>
                                    <span className="text-[11px] font-black text-[#1B6B3A]">{course.apps}</span>
                                </div>
                            </div>

                            {/* Access Button */}
                            <div className="mt-auto">
                                <button 
                                    onClick={() => router.push(`/dashboard/courses/${course.id}?title=${encodeURIComponent(course.title)}&level=${encodeURIComponent(displayedLevel)}`)}
                                    className="w-full py-4.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-base shadow-lg shadow-[#1B6B3A]/20 hover:shadow-xl hover:shadow-[#1B6B3A]/30 hover:bg-[#155230] transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    Accéder au cours
                                    <motion.span 
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 3 }}
                                        className="inline-block"
                                    >
                                        →
                                    </motion.span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
