'use client';

import React, { useState } from 'react';
import { 
    Activity, 
    TrendingUp, 
    Users, 
    BookOpen, 
    ChevronDown, 
    Download,
    Calendar,
    Target,
    Users2,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart, 
    Pie, 
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

interface AdminStatsViewProps {
    user: any;
}

const detailedActivityData = [
    { month: 'Jan', students: 4000, teachers: 240, active: 3400 },
    { month: 'Fév', students: 3000, teachers: 139, active: 2210 },
    { month: 'Mar', students: 2000, teachers: 980, active: 2290 },
    { month: 'Avr', students: 2780, teachers: 390, active: 2000 },
    { month: 'Mai', students: 1890, teachers: 480, active: 2181 },
    { month: 'Juin', students: 2390, teachers: 380, active: 2500 },
    { month: 'Juil', students: 3490, teachers: 430, active: 3100 },
];

const userDistribution = [
    { name: 'Élèves', value: 2400, color: '#F97316' },
    { name: 'Professeurs', value: 300, color: '#EF4444' },
    { name: 'Parents', value: 142, color: '#8B5CF6' },
];

const subjectPopularity = [
    { name: 'Maths', count: 95 },
    { name: 'Physique', count: 82 },
    { name: 'Chimie', count: 74 },
    { name: 'Philo', count: 65 },
    { name: 'Anglais', count: 58 },
    { name: 'Français', count: 88 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg  border border-gray-200 animate-in zoom-in-95 duration-200">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                                <span className="text-xs font-bold text-gray-500">{entry.name}</span>
                            </div>
                            <span className="text-xs font-black text-[#0F2D1E]">{entry.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const StatOverviewCard = ({ title, value, icon: Icon, trend, trendColor }: any) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200  flex items-center justify-between group hover:border-[#1B6B3A]/20 ">
        <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#E8F5EE] group-hover:text-[#1B6B3A] transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 text-[11px] font-bold ${trendColor}`}>
                {trend} <TrendingUp className="w-3 h-3" />
            </div>
            <p className="text-xl font-black text-[#0F2D1E] -mt-0.5">{value}</p>
        </div>
    </div>
);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor="middle" 
            dominantBaseline="central"
            className="text-[10px] font-black"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const AdminStatsView = ({ user }: AdminStatsViewProps) => {
    const [timeRange, setTimeRange] = useState('12m');

    const exportToPDF = () => {
        window.print();
    };

    // Fake multipliers to show dynamic updates when changing time range
    const multipliers: Record<string, number> = {
        '7d': 0.05,
        '30d': 0.15,
        '12m': 1,
        'ytd': 0.8
    };
    const m = multipliers[timeRange] || 1;

    const currentStats = {
        visits: Math.floor(124592 * m).toLocaleString('en-US'),
        visitsTrend: timeRange === '7d' ? '+2.4%' : timeRange === '30d' ? '+12.1%' : '+24.5%',
        retention: (68.2 + (m * 2 - 1)).toFixed(1) + '%',
        retentionTrend: timeRange === '7d' ? '+0.4%' : '+4.1%',
        quizzes: Math.floor(1492 * m).toLocaleString('en-US'),
        resources: Math.floor(3204 * m).toLocaleString('en-US'),
    };

    return (
        <>
            {/* --- LAYOUT D'IMPRESSION (NATIVE PDF) --- */}
            <div className="hidden print:block w-[185mm] mx-auto bg-white font-sans text-black py-8 pr-4">
                <div className=" border-[#1B6B3A] pb-6 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-[#0F2D1E] tracking-tight uppercase">Rapport de performance</h1>
                        <h2 className="text-xl font-bold text-[#1B6B3A] mt-2">PLATEFORME GUINÉELEARN</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Date d'édition</p>
                        <p className="text-lg font-bold text-[#0F2D1E]">{new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-3">Interprétation des Données</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <p className="text-[#0F2D1E] leading-relaxed text-lg font-medium">
                            L'analyse approfondie des statistiques récentes démontre une excellente acquisition. 
                            Avec <strong className="text-[#1B6B3A] font-black">{currentStats.visits} visites</strong> globales enregistrées, le niveau d'engagement sur GuinéeLearn révèle une adhésion forte de l'écosystème éducatif. 
                            De surcroît, la plateforme affiche un solide taux de rétention de <strong className="text-emerald-700 font-black">{currentStats.retention}</strong> qui confirme l'utilité directe des 
                            <strong className="text-[#1B6B3A] font-black"> {currentStats.resources} cours </strong> et <strong className="text-[#1B6B3A] font-black">{currentStats.quizzes} quiz</strong> déployés. 
                            L'observation démographique confirme l'intérêt majoritaire du groupe "Élèves", particulièrement assidus sur les matières fondamentales telles que Mathématiques et Physique.
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    <div>
                        <h3 className="text-lg font-black text-[#0F2D1E] mb-6 border-l-4 border-[#1B6B3A] pl-4 uppercase">1. Courbe d'Engagement Global (Élèves & Professeurs)</h3>
                        <div className="w-[650px] mx-auto">
                            <ResponsiveContainer width={650} height={350}>
                                <AreaChart data={detailedActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStudentsPrint" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1B6B3A" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#1B6B3A" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorTeachersPrint" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 'bold', fill: '#4B5563' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280' }} dx={-10} />
                                    <Area type="monotone" dataKey="students" stroke="#1B6B3A" strokeWidth={4} fillOpacity={1} fill="url(#colorStudentsPrint)" />
                                    <Area type="monotone" dataKey="teachers" stroke="#9CA3AF" strokeWidth={3} fillOpacity={1} fill="url(#colorTeachersPrint)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="pt-4 page-break-before">
                        <h3 className="text-lg font-black text-[#0F2D1E] mb-6 border-l-4 border-emerald-500 pl-4 uppercase">2. Répartition et Popularité par Matières (Top 6)</h3>
                        <div className="w-[650px] mx-auto">
                            <ResponsiveContainer width={650} height={350}>
                                <BarChart data={subjectPopularity} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 'bold', fill: '#4B5563' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280' }} dx={-10} />
                                    <Bar dataKey="count" fill="#1B6B3A" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DASHBOARD NORMAL (MASQUÉ À L'IMPRESSION) --- */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#FAFAFA] md:bg-transparent pb-6 print:hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Statistiques Détail</h1>
                    <p className="text-gray-500 font-medium text-xs">Analyse approfondie de la performance de la plateforme.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative bg-white border border-gray-200 rounded-lg flex items-center  hover:bg-gray-50  focus-within:border-[#1B6B3A]/30 focus-within:ring-2 focus-within:ring-[#1B6B3A]/10 overflow-hidden group">
                        <Calendar className="w-4 h-4 text-[#1B6B3A] ml-4 pointer-events-none absolute left-0" />
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none bg-transparent py-2.5 pl-10 pr-10 font-bold text-sm text-gray-600 outline-none cursor-pointer w-full h-full"
                        >
                            <option value="7d">7 derniers jours</option>
                            <option value="30d">30 derniers jours</option>
                            <option value="ytd">Cette année</option>
                            <option value="12m">Derniers 12 mois</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none group-hover:text-[#1B6B3A] transition-colors" />
                    </div>
                    <button 
                        onClick={exportToPDF}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm  active:scale-[0.98]   shadow-[#1B6B3A]/20 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" /> Rapport complet
                    </button>
                </div>
            </div>

            {/* Overviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatOverviewCard title="Visites Uniques" value={currentStats.visits} icon={Target} trend={currentStats.visitsTrend} trendColor="text-emerald-500" />
                <StatOverviewCard title="Taux de Rétention" value={currentStats.retention} icon={Activity} trend={currentStats.retentionTrend} trendColor="text-emerald-500" />
                <StatOverviewCard title="Nouveaux Quiz" value={currentStats.quizzes} icon={CheckCircle2} trend="+12.3%" trendColor="text-emerald-500" />
                <StatOverviewCard title="Supports Créés" value={currentStats.resources} icon={BookOpen} trend="+8.5%" trendColor="text-emerald-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Engagement Area Chart */}
                <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-lg border border-gray-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg md:text-xl font-bold text-[#0F2D1E]">Engagement par Segment</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1B6B3A]" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Élèves</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global</span></div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={detailedActivityData}>
                                <defs>
                                    <linearGradient id="statsActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B6B3A" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#1B6B3A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="active" name="Activité Globale" stroke="#E5E7EB" strokeWidth={3} fill="transparent" />
                                <Area type="monotone" dataKey="students" name="Activité Élèves" stroke="#1B6B3A" strokeWidth={4} fillOpacity={1} fill="url(#statsActive)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-8 rounded-lg border border-gray-200 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg md:text-xl font-bold text-[#0F2D1E]">Démographie</h3>
                        <Users2 className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-4">
                        <div className="h-64 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userDistribution}
                                        startAngle={210}
                                        endAngle={-30}
                                        innerRadius={95}
                                        outerRadius={125}
                                        paddingAngle={10}
                                        cornerRadius={12}
                                        dataKey="value"
                                        stroke="none"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                    >
                                        {userDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none">
                                <span className="text-5xl font-black text-[#0F2D1E] tracking-tighter">2.8k</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Actifs</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 pt-2">
                            {userDistribution.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 group cursor-default">
                                    <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: item.color }} />
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.name}</span>
                                        <span className="text-sm font-black text-[#0F2D1E] group-hover:text-[#1B6B3A]">{Math.round((item.value / 2842) * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Subjects Bar Chart */}
            <div className="bg-white p-5 md:p-8 rounded-lg border border-gray-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg md:text-xl font-bold text-[#0F2D1E]">Popularité des Matières</h3>
                    <div className="text-[10px] md:text-xs font-black text-[#1B6B3A] uppercase tracking-widest bg-[#E8F5EE] px-3 py-1 rounded-lg w-fit">Performance Top 6</div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectPopularity}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} interval={0} angle={-45} textAnchor="end" height={60} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="count" name="Engagement" radius={[6, 6, 0, 0]} barSize={40}>
                                {subjectPopularity.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1B6B3A' : '#27AE60'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            </div>
        </>
    );
};
