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
    Cell,
    ComposedChart,
    Bar
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

const MOCK_LINE_DATA = [
    { name: 'Lun', current: 52, future: null },
    { name: 'Mar', current: 68, future: null },
    { name: 'Mer', current: 45, future: null },
    { name: 'Jeu', current: 61, future: null },
    { name: 'Ven', current: 72, future: null },
    { name: 'Sam', current: 58, future: 58 },
    { name: 'Dim', current: null, future: 65 },
];

const COLORS = ['#1B6B3A', '#27AE60', '#F1C40F', '#E67E22', '#E74C3C'];

export const ProgressionView = ({ profile }: { profile: any }) => {
    const rawLevel = profile?.subLevel || profile?.schoolLevel || 'Terminale SM';
    
    // Calculate real subject mastery from quizResults
    const subjectData = useMemo(() => {
        const results = profile?.studentProfile?.quizResults || [];
        if (results.length === 0) {
            // Default empty state or helpful placeholders
            return [
                { name: 'Aucun Test', value: 0 }
            ];
        }

        // Group by subject and calculate average
        const subjects: Record<string, { total: number, count: number }> = {};
        results.forEach((res: any) => {
            if (!subjects[res.subject]) subjects[res.subject] = { total: 0, count: 0 };
            subjects[res.subject].total += res.score;
            subjects[res.subject].count += 1;
        });

        return Object.keys(subjects).map(name => ({
            name,
            value: Math.round(subjects[name].total / subjects[name].count)
        }));
    }, [profile]);

    const realGlobalScore = useMemo(() => {
        if (subjectData.length === 0 || (subjectData.length === 1 && subjectData[0].name === 'Aucun Test')) return 0;
        const sum = subjectData.reduce((acc, curr) => acc + curr.value, 0);
        return Math.round(sum / subjectData.length);
    }, [subjectData]);

    const stats = [
        { label: 'Score Global', val: `${realGlobalScore}%`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', chartColor: '#2563EB' },
        { label: 'Assiduité', val: `${profile?.attendanceDays || 0} Jours`, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50', chartColor: '#EA580C' },
        { label: 'Quiz Finis', val: profile?.completedQuizzes || 0, icon: Award, color: 'text-[#1B6B3A]', bg: 'bg-[#E8F5EE]', chartColor: '#1B6B3A' },
        { label: 'Temps Étude', val: profile?.studyHours || "0h", icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', chartColor: '#7C3AED' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Top Cards - Essential Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between hover:border-[#1B6B3A]/20 group relative overflow-hidden transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex shrink-0 items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">{stat.label}</p>
                                <p className="text-2xl font-black text-[#0F2D1E] leading-none">{stat.val}</p>
                            </div>
                        </div>

                        {/* Brain Network Graph Decoration */}
                        <div className="absolute top-0 right-0 h-full w-28 opacity-[0.12] group-hover:opacity-25 transition-opacity duration-500 pointer-events-none">
                            <svg viewBox="0 0 100 100" className="h-full w-full">
                                <circle cx="20" cy="30" r="2" fill={stat.chartColor} />
                                <circle cx="50" cy="20" r="2" fill={stat.chartColor} />
                                <circle cx="80" cy="40" r="2" fill={stat.chartColor} />
                                <circle cx="40" cy="50" r="2" fill={stat.chartColor} />
                                <circle cx="70" cy="70" r="2" fill={stat.chartColor} />
                                <circle cx="30" cy="80" r="2" fill={stat.chartColor} />
                                
                                <path d="M20 30 L50 20 L80 40 L40 50 L20 30" stroke={stat.chartColor} strokeWidth="1" fill="none" />
                                <path d="M50 20 L40 50 L70 70 L30 80 L40 50" stroke={stat.chartColor} strokeWidth="1" fill="none" />
                                <path d="M80 40 L70 70" stroke={stat.chartColor} strokeWidth="1" fill="none" />
                                
                                <motion.circle 
                                    cx="50" cy="20" r="3" 
                                    fill={stat.chartColor} 
                                    animate={{ r: [3, 5, 3], opacity: [0.6, 1, 0.6] }} 
                                    transition={{ duration: 3, repeat: Infinity }} 
                                />
                                <motion.circle 
                                    cx="70" cy="70" r="3" 
                                    fill={stat.chartColor} 
                                    animate={{ r: [3, 5, 3], opacity: [0.6, 1, 0.6] }} 
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }} 
                                />
                                <motion.circle 
                                    cx="20" cy="30" r="3" 
                                    fill={stat.chartColor} 
                                    animate={{ r: [2, 4, 2], opacity: [0.4, 0.8, 0.4] }} 
                                    transition={{ duration: 5, repeat: Infinity, delay: 2 }} 
                                />
                            </svg>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-lg border border-gray-200  shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-[#0F2D1E]">Activité Hebdomadaire</h3>
                            <p className="text-sm font-bold text-gray-400">Suivi haute précision de votre progression</p>
                        </div>
                        <button className="p-3 bg-gray-50 rounded-lg text-gray-400 hover:text-[#1B6B3A] transition-colors">
                            <Activity className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={MOCK_LINE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B6B3A" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#1B6B3A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="name"
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    domain={[30, 80]}
                                    tickCount={6}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `${Math.round(v)}%`}
                                />
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
                                <Bar 
                                    dataKey="current" 
                                    fill="#1B6B3A" 
                                    opacity={0.1} 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={30}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="current" 
                                    stroke="#1B6B3A" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorScore)" 
                                    connectNulls={true}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="future" 
                                    stroke="#CBD5E1" 
                                    strokeWidth={2}
                                    fill="transparent"
                                    connectNulls={true}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Mastery Donut */}
                <div className="bg-white p-8 rounded-lg border border-gray-200  shadow-gray-200/50 flex flex-col h-full">
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
                                <p className="text-3xl font-black text-[#1B6B3A]">{realGlobalScore}%</p>
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
            <div id="achievements" className="bg-white p-10 rounded-lg border border-gray-200  shadow-gray-200/50">
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
                        <div key={i} className="p-4 rounded-lg bg-gray-50/50 border border-gray-200 flex items-center gap-4 group hover:bg-white hover: ">
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
