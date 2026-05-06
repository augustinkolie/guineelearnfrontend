'use client';

import React from 'react';
import { 
    BookOpen, 
    Plus, 
    Users, 
    MoreVertical, 
    Clock,
    CheckCircle2,
    FileText,
    ArrowUpRight,
    X,
    Layout,
    GraduationCap,
    Info,
    FileVideo,
    Link,
    Radio,
    Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentCreationView } from './ContentCreationView';

const INITIAL_COURSES = [
    {
        id: '1',
        title: 'Mathématiques : Nombres Complexes',
        level: 'Terminale SM',
        students: 124,
        lastUpdate: '12/04/2024',
        image: '/images/math_course_thumbnail_1775610573519.png',
        status: 'PUBLISHED'
    },
    {
        id: '2',
        title: 'Physique : Mécanique Newtonienne',
        level: '12ème SM',
        students: 89,
        lastUpdate: '10/04/2024',
        image: '/images/physics_course_thumbnail_1775610601650.png',
        status: 'PUBLISHED'
    },
    {
        id: '3',
        title: 'Français : La Dissertation',
        level: '11ème SM',
        students: 56,
        lastUpdate: '08/04/2024',
        image: '/images/french_course_thumbnail_1775610625465.png',
        status: 'DRAFT'
    }
];

export const TeacherCoursesView = ({ profile }: { profile?: any }) => {
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [courses, setCourses] = useState(INITIAL_COURSES);
    
    console.log('TeacherCoursesView - Profile received:', profile);

    const handleCourseCreated = (newData: any) => {
        setCourses([newData, ...courses]);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E]">Mes Cours & Quiz</h2>
                    <p className="text-gray-500 font-medium text-sm mt-1">Gérez vos contenus pédagogiques et suivez l'engagement de vos élèves.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-[#1B6B3A] text-white px-6 py-3 rounded-lg font-bold  shadow-[#1B6B3A]/20  active:scale-[0.98]  group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Nouveau contenu
                </button>
            </div>

            {/* Premium Creation Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-lg  overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 md:p-8">
                                <ContentCreationView 
                                    onClose={() => setIsCreateModalOpen(false)} 
                                    onSuccess={handleCourseCreated}
                                    teacherProfile={profile}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200  flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cours Actifs</p>
                    </div>
                    <p className="text-2xl font-black text-[#0F2D1E]">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200  flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Élèves</p>
                    </div>
                    <p className="text-2xl font-black text-[#0F2D1E]">842</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200  flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quiz Complétés</p>
                    </div>
                    <p className="text-2xl font-black text-[#0F2D1E]">1.2k</p>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                    <motion.div 
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-lg border border-gray-200  hover: hover:border-[#1B6B3A]/20  duration-500 overflow-hidden flex flex-col"
                    >
                        {/* Course Image & Status Badge */}
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src={course.image} 
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-sans text-xs italic text-gray-400"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    course.status === 'PUBLISHED' 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-orange-500 text-white'
                                }`}>
                                    {course.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                                </span>
                            </div>
                            <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <span className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest bg-[#E8F5EE] px-2 py-1 rounded-md mb-2 inline-block">
                                    {course.level}
                                </span>
                                <h3 className="text-lg font-black text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors line-clamp-2">
                                    {course.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-6 mt-auto py-4 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500">{course.students} élèves</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500">Mise à jour le {course.lastUpdate}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <button className="py-2.5 rounded-lg border-2 border-gray-200 text-gray-500 font-bold text-xs hover:bg-gray-50  flex items-center justify-center gap-2">
                                    Modifier
                                </button>
                                <button className="py-2.5 rounded-lg bg-[#1B6B3A]/5 text-[#1B6B3A] font-bold text-xs hover:bg-[#1B6B3A] hover:text-white  flex items-center justify-center gap-2 group/btn">
                                    Voir Stats
                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

            </div>
        </div>
    );
};
