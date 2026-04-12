'use client';

import React from 'react';
import Link from 'next/link';
import { 
    Book, 
    Video, 
    FileText, 
    Trophy, 
    Clock, 
    ArrowRight,
    PlayCircle,
    Activity,
    Library,
    Lock,
    Search,
    BookOpen
} from 'lucide-react';
import { StudentLibraryView } from './StudentLibraryView';
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
    ReferenceLine
} from 'recharts';

interface StudentViewProps {
    user: any;
    profile: any;
}

// Highly granular stock-like data generation
const generateGranularData = () => {
    const data = [];
    let prev = 70;
    for (let i = 0; i < 100; i++) {
        const change = (Math.random() - 0.45) * 5; // Slight upward bias
        const value = Math.max(30, Math.min(95, prev + change));
        data.push({
            time: i,
            value: value,
            // Splitting data: first 70 points are "active", last 30 are "forecast"
            activeValue: i <= 70 ? value : null,
            forecastValue: i >= 70 ? value : null
        });
        prev = value;
    }
    return data;
};

const granularData = generateGranularData();

const topicData = [
    { name: 'Sciences (Maths/Phys/Chim)', value: 60, color: '#0F2D1E' },
    { name: 'Général (Philo/Fr/Ang)', value: 25, color: '#1B6B3A' },
    { name: 'Économie', value: 15, color: '#27AE60' },
];

// Les données de quiz sont maintenant dynamiques et passées via le profil

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                <p className="text-sm font-black text-[#0F2D1E] mb-2">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs font-bold text-gray-500">{entry.name}</span>
                            </div>
                            <span className="text-xs font-black text-[#0F2D1E]">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 group hover:border-[#1B6B3A]/30 transition-all shadow-sm">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-[#0F2D1E]">{value}</p>
        </div>
    </div>
);

export const StudentView = ({ user, profile }: StudentViewProps) => {
    const quizData = profile?.quizResults?.length > 0 ? profile.quizResults : [
        { subject: 'Maths', score: 85, average: 65 },
        { subject: 'Physique', score: 72, average: 68 },
        { subject: 'Chimie', score: 92, average: 70 },
        { subject: 'Économie', score: 78, average: 62 },
        { subject: 'Français', score: 90, average: 75 },
        { subject: 'Anglais', score: 65, average: 70 },
        { subject: 'Philo', score: 82, average: 64 },
    ];

    // Transformation des données pour assurer la cohérence (SVT -> Économie)
    const transformedQuizData = quizData.map((item: any) => {
        let name = item.subject;
        if (name.toUpperCase() === 'SVT' || name.toLowerCase().includes('biologie')) {
            name = 'Économie';
        }
        // Harmonisation des noms pour le graphique
        if (name === 'Maths') name = 'Mathématiques';
        if (name === 'Philo') name = 'Philosophie';
        
        return { ...item, subject: name };
    });

    const resources = [
        { id: 1, title: 'Mathématiques : Algèbre Supérieure', type: 'PDF', class: profile?.subLevel || '10ème', date: 'Il y a 2 jours' },
        { id: 2, title: 'Physique : Optique Géométrique', type: 'Vidéo', class: profile?.subLevel || '10ème', date: 'Il y a 3 jours' },
        { id: 3, title: 'Français : Analyse de texte', type: 'Quiz', class: profile?.subLevel || '10ème', date: 'Il y a 5 jours' },
    ];

    const revisedHistory = [
        { 
            id: 1, 
            subject: 'Mathématiques', 
            lesson: 'Fonctions Exponentielles', 
            date: 'Aujourd\'hui', 
            time: '45 min', 
            progress: 100,
            status: 'Terminé',
            color: 'text-blue-600 bg-blue-50'
        },
        { 
            id: 2, 
            subject: 'Physique', 
            lesson: 'Électromagnétisme', 
            date: 'Hier', 
            time: '1h 20 min', 
            progress: 65,
            status: 'En cours',
            color: 'text-purple-600 bg-purple-50'
        },
        { 
            id: 3, 
            subject: 'Chimie', 
            lesson: 'Cinétique Chimique', 
            date: 'Il y a 2 jours', 
            time: '30 min', 
            progress: 100,
            status: 'Terminé',
            color: 'text-orange-600 bg-orange-50'
        },
        { 
            id: 4, 
            subject: 'Français', 
            lesson: 'littérature africaine contemporaine', 
            date: 'Il y a 3 jours', 
            time: '55 min', 
            progress: 40,
            status: 'En cours',
            color: 'text-pink-600 bg-pink-50'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Book} label="Cours Actifs" value={profile?.courseCount || 0} color="bg-blue-50 text-blue-600" />
                <StatCard icon={Clock} label="Heures d'Étude" value={profile?.studyHours || "0h"} color="bg-purple-50 text-purple-600" />
                <StatCard icon={FileText} label="Ressources" value={profile?.resourceCount || 0} color="bg-orange-50 text-orange-600" />
                <StatCard icon={Trophy} label="Certificats" value={profile?.certificateCount || 0} color="bg-green-50 text-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Ressources pour {profile?.subLevel || 'ma classe'}</h3>
                        <Link href="/dashboard/resources" className="text-sm font-bold text-[#1B6B3A] hover:underline flex items-center gap-1 group">
                            Voir tout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {resources.map((item) => (
                            <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-[#1B6B3A]/20 transition-all shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#E8F5EE] group-hover:text-[#1B6B3A] transition-colors">
                                        {item.type === 'Vidéo' ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">{item.title}</h4>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.type} • {item.date}</p>
                                    </div>
                                </div>
                                <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-[#1B6B3A] hover:text-white transition-all">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Performance Bar Chart (Grouped Bars) - Scrollable */}
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-bold text-[#0F2D1E]">Performance par Quiz</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mon Score</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Classe</span>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto pb-4 custom-scrollbar">
                            <div className="h-64 min-w-[600px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={transformedQuizData} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="subject" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}}
                                            dy={5}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                        <Bar name="Mon Score" dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={12} />
                                        <Bar name="Classe" dataKey="average" fill="#FBBF24" radius={[4, 4, 0, 0]} barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progression Area Chart (Stock Style) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Ma Progression</h3>
                        <Activity className="w-5 h-5 text-[#10B981]" />
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={granularData}>
                                    <defs>
                                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis 
                                        dataKey="time" 
                                        hide
                                    />
                                    <YAxis 
                                        hide 
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    
                                    {/* Basline Reference Line */}
                                    <ReferenceLine y={70} stroke="#94A3B8" strokeDasharray="3 3" />
                                    <ReferenceLine x={70} stroke="#94A3B8" strokeDasharray="3 3" />

                                    {/* Forecast / Previous Data (Gray) */}
                                    <Area 
                                        type="monotone" 
                                        dataKey="forecastValue" 
                                        stroke="#cbd5e1" 
                                        strokeWidth={2}
                                        fill="transparent"
                                        animationDuration={1000}
                                        connectNulls={true}
                                    />

                                    {/* Active Data (Green) */}
                                    <Area 
                                        type="monotone" 
                                        dataKey="activeValue" 
                                        name="Progression"
                                        stroke="#10B981" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorActive)" 
                                        animationDuration={2000}
                                        connectNulls={true}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-gray-400">SESSION PRÉCÉDENTE</span>
                                <span className="text-[#0F2D1E]">Clôt préc : 14.5</span>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Répartition</h4>
                                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-[#10B981] transition-colors" />
                            </div>
                            <div className="h-48 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topicData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {topicData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Central Label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-[#0F2D1E]">7</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matières</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">À faire bientôt</h4>
                            <div className="flex gap-4 p-3 rounded-xl bg-[#F8FAFC] border border-transparent hover:border-[#10B981]/20 transition-all cursor-pointer">
                                <div className="w-10 h-10 rounded-lg bg-white flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-[10px] font-bold text-red-500 uppercase">Avr</span>
                                    <span className="text-sm font-black text-[#0F2D1E]">12</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#0F2D1E]">Examen Blanc Maths</p>
                                    <p className="text-[10px] font-semibold text-gray-400">09:00 - 12:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Digital Library Section */}
            <StudentLibraryView user={user} />

            {/* Course Revision History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A]">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#0F2D1E]">Historique des cours révisés</h3>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vos sessions d'apprentissage récentes</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        Exporter l'historique
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-50">
                        {revisedHistory.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-all group cursor-pointer">
                                <div className="flex flex-col h-full space-y-4">
                                    <div className="flex items-start justify-between">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.color}`}>
                                            {item.subject}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {item.date}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors mb-1 line-clamp-1">
                                            {item.lesson}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                                            <Clock className="w-3 h-3" />
                                            {item.time} passés
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-gray-400">Progression</span>
                                            <span className={item.progress === 100 ? "text-[#10B981]" : "text-blue-500"}>
                                                {item.progress}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${
                                                    item.progress === 100 ? "bg-[#10B981]" : "bg-blue-500"
                                                }`} 
                                                style={{ width: `${item.progress}%` }} 
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            item.status === 'Terminé' ? 'text-[#10B981]' : 'text-blue-500'
                                        }`}>
                                            {item.status}
                                        </span>
                                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-[#1B6B3A] group-hover:text-white transition-all">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

