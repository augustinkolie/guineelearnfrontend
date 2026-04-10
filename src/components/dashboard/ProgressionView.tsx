'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { 
    Activity, 
    Target, 
    Flame, 
    Award,
    Calendar,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_LINE_DATA = Array.from({ length: 50 }, (_, i) => ({
    name: i,
    score: 40 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
    future: i > 35 ? (40 + Math.sin(i * 0.3) * 20 + Math.random() * 10) : null,
    current: i <= 35 ? (40 + Math.sin(i * 0.3) * 20 + Math.random() * 10) : null,
}));

const COLORS = ['#1B6B3A', '#27AE60', '#F1C40F', '#E67E22', '#E74C3C'];

export const ProgressionView = ({ profile }: { profile: any }) => {
    const rawLevel = profile?.subLevel || profile?.schoolLevel || 'Terminale SM';
    
    const subjectData = useMemo(() => {
        if (rawLevel.includes('Lycée') || rawLevel.includes('SM')) {
            return [
                { name: 'Maths', value: 85 },
                { name: 'Physique', value: 72 },
                { name: 'Chimie', value: 65 },
                { name: 'Philo', value: 40 },
                { name: 'Anglais', value: 55 },
            ];
        }
        return [
            { name: 'Calcul', value: 90 },
            { name: 'Lecture', value: 82 },
            { name: 'Écriture', value: 75 },
        ];
    }, [rawLevel]);

    return (
        <div className="space-y-8 pb-10">
            {/* Top Cards - Essential Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Score Global', val: `${profile?.globalScore || 0}%`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Assiduité', val: `${profile?.attendanceDays || 0} Jours`, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Quiz Finis', val: profile?.completedQuizzes || 0, icon: Award, color: 'text-[#1B6B3A]', bg: 'bg-[#E8F5EE]' },
                    { label: 'Temps Étude', val: profile?.studyHours || "0h", icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-[#1B6B3A]/20 transition-all group"
                    >
                        <div className={`w-12 h-12 rounded-lg ${stat.bg} flex shrink-0 items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">{stat.label}</p>
                            <p className="text-2xl font-black text-[#0F2D1E] leading-none">{stat.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-[#0F2D1E]">Activité Hebdomadaire</h3>
                            <p className="text-sm font-bold text-gray-400">Suivi haute précision de votre progression</p>
                        </div>
                        <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#1B6B3A] transition-colors">
                            <Activity className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_LINE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B6B3A" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#1B6B3A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" verticalFill={['#fff', '#fcfcfc']} />
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '20px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: '800'
                                    }} 
                                    labelStyle={{ display: 'none' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="current" 
                                    stroke="#1B6B3A" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorScore)" 
                                    connectNulls={true}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="future" 
                                    stroke="#CBD5E1" 
                                    strokeWidth={3}
                                    fill="transparent"
                                    connectNulls={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Mastery Donut */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col h-full">
                    <h3 className="text-xl font-black text-[#0F2D1E] mb-2 text-center">Maîtrise des Matières</h3>
                    <p className="text-sm font-bold text-gray-400 mb-8 text-center">Répartition de votre réussite</p>
                    
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subjectData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {subjectData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Global</p>
                                <p className="text-3xl font-black text-[#1B6B3A]">72%</p>
                            </div>
                        </div>

                        <div className="space-y-4 mt-8">
                            {subjectData.map((subject, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-sm font-black text-gray-600 group-hover:text-[#1B6B3A] transition-colors">{subject.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0F2D1E]">{subject.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Achievements */}
            <div id="achievements" className="bg-white p-10 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-[#0F2D1E]">Succès Récents</h3>
                    <Link href="/dashboard/progression#achievements" className="text-[#1B6B3A] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                        Voir tout <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Persévérance', desc: '10 jours consécutifs d\'étude', date: 'Hier', icon: '🔥' },
                        { title: 'Maître des Maths', desc: 'Note de 20/20 au quiz Probabilités', date: 'Il y a 2j', icon: '📐' },
                        { title: 'Rapide comme l\'éclair', desc: 'Quiz fini en moins de 10 min', date: '3 Avr', icon: '⚡' },
                    ].map((badge, i) => (
                        <div key={i} className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                            <div className="text-2xl group-hover:scale-110 transition-transform">{badge.icon}</div>
                            <div>
                                <h4 className="font-bold text-[#0F2D1E] leading-tight">{badge.title}</h4>
                                <p className="text-[11px] font-medium text-gray-500 leading-tight mt-0.5">{badge.desc}</p>
                            </div>
                            <div className="ml-auto text-[9px] font-black text-gray-300 uppercase tracking-tighter">{badge.date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
