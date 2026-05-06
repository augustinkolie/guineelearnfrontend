'use client';

import React from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    BookOpen, 
    Clock,
    Target,
    Activity,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    RadialBarChart,
    RadialBar
} from 'recharts';
import { motion } from 'framer-motion';

const engagementData = [
    { day: 'Lun', users: 450 },
    { day: 'Mar', users: 520 },
    { day: 'Mer', users: 480 },
    { day: 'Jeu', users: 610 },
    { day: 'Ven', users: 550 },
    { day: 'Sam', users: 320 },
    { day: 'Dim', users: 280 },
];

const gradeDistribution = [
    { range: '0-5', count: 5, color: '#EF4444' },
    { range: '5-10', count: 15, color: '#F97316' },
    { range: '10-15', count: 45, color: '#3B82F6' },
    { range: '15-20', count: 35, color: '#1B6B3A' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg  border border-gray-50">
                <p className="text-xs font-black text-[#0F2D1E] mb-2 uppercase tracking-widest">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1B6B3A]" />
                    <span className="text-sm font-black text-[#1B6B3A]">{payload[0].value}</span>
                    <span className="text-[10px] font-bold text-gray-400">Élèves</span>
                </div>
            </div>
        );
    }
    return null;
};

const StatSummaryCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200  flex items-center justify-between group hover:  duration-300">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
            </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
            <div className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                <TrendingUp className="w-2.5 h-2.5" />
                {trend}
            </div>
            <p className="text-xl font-black text-[#0F2D1E] tracking-tight whitespace-nowrap">{value}</p>
        </div>
    </div>
);

export const TeacherStatsView = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E]">Statistiques Détaillées</h2>
                    <p className="text-gray-500 font-medium text-sm mt-1">Analysez l'impact de vos cours et l'évolution de vos classes.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200 ">
                    <button className="px-4 py-2 rounded-lg bg-[#1B6B3A] text-white text-xs font-black uppercase tracking-widest  shadow-[#1B6B3A]/20 ">
                        Mensuel
                    </button>
                    <button className="px-4 py-2 rounded-lg text-gray-400 hover:text-[#0F2D1E] text-xs font-black uppercase tracking-widest ">
                        Annuel
                    </button>
                    <div className="w-px h-6 bg-gray-100 mx-1" />
                    <button className="p-2 text-gray-400 hover:text-[#0F2D1E] ">
                        <Calendar className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatSummaryCard 
                    icon={Activity} 
                    label="Taux de complétion" 
                    value="78%" 
                    trend="+5.4%" 
                    color="bg-purple-50 text-purple-600"
                />
                <StatSummaryCard 
                    icon={Target} 
                    label="Score Moyen" 
                    value="14.8/20" 
                    trend="+0.3" 
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatSummaryCard 
                    icon={Users} 
                    label="Élèves Actifs" 
                    value="245" 
                    trend="+12" 
                    color="bg-blue-50 text-blue-600"
                />
                <StatSummaryCard 
                    icon={Clock} 
                    label="Temps Moyen/Cours" 
                    value="42 min" 
                    trend="+8%" 
                    color="bg-orange-50 text-orange-600"
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Engagement Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200  space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-[#0F2D1E]">Engagement Hebdomadaire</h3>
                            <p className="text-xs font-medium text-gray-400 mt-1">Nombre d'élèves connectés par jour</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black text-[#0F2D1E] uppercase tracking-widest hover:bg-gray-50">
                            Exporter <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B6B3A" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#1B6B3A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#1B6B3A" 
                                    strokeWidth={1.5}
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Grade Distribution */}
                <div className="bg-white p-6 rounded-lg border border-gray-200  space-y-6 relative">
                    <div>
                        <h3 className="text-xl font-black text-[#0F2D1E]">Distribution des Notes</h3>
                        <p className="text-xs font-medium text-gray-400 mt-1">Répartition des moyennes globales</p>
                    </div>
                    
                    <div className="h-48 w-full relative">
                        {/* Center stats */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                            <p className="text-3xl font-black text-[#0F2D1E]">
                                {gradeDistribution.reduce((acc, curr) => acc + curr.count, 0)}
                            </p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" 
                                cy="50%" 
                                innerRadius="30%" 
                                outerRadius="100%" 
                                barSize={12} 
                                data={gradeDistribution.map(item => ({ ...item, value: item.count, fill: item.color }))}
                                startAngle={90}
                                endAngle={450}
                            >
                                <RadialBar
                                    label={{ fill: 'transparent' }}
                                    background={{ fill: '#F8FAFC' }}
                                    dataKey="value"
                                    cornerRadius={30}
                                />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 rounded-lg  border border-gray-50">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{payload[0].payload.range}</p>
                                                    <p className="text-sm font-black" style={{ color: payload[0].payload.fill }}>
                                                        {payload[0].value} élèves
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        {[...gradeDistribution].reverse().map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-bold text-gray-500">{item.range} / 20</span>
                                </div>
                                <span className="text-xs font-black text-[#0F2D1E]">{item.count} élèves</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Performance Table */}
            <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-xl font-black text-[#0F2D1E]">Performance du Contenu</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cours / Ressource</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score Moyen</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Engagement</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Mécanique Newtonienne', score: '15.2', engagement: '88%', trend: 'up' },
                                { name: 'Nombres Complexes', score: '14.5', engagement: '92%', trend: 'up' },
                                { name: 'Optique Géométrique', score: '12.8', engagement: '75%', trend: 'down' },
                            ].map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-[#0F2D1E]">{item.name}</p>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-sm font-black text-[#1B6B3A]">{item.score}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="w-full max-w-[100px] mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#1B6B3A] rounded-full" 
                                                style={{ width: item.engagement }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-black text-[#1B6B3A] mt-1.5">{item.engagement}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                            item.trend === 'up' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                                        }`}>
                                            {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const TrendingDown = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
);
