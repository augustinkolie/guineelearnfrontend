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
    BookOpen,
    Target,
    Award,
    Calendar,
    Zap
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
    Line,
    ComposedChart,
    ReferenceLine,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentViewProps {
    user: any;
    profile: any;
}

// Smoother progression data generation for a more professional look
const generateProgressionData = () => {
    const data = [];
    let prev = 65;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (30 - i));
        const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        
        const change = (Math.random() - 0.35) * 4; // Slight upward trend
        const value = Math.max(30, Math.min(100, prev + change));
        data.push({
            date: dateStr,
            value: Math.round(value * 10) / 10,
            activeValue: i <= 24 ? value : null,
            forecastValue: i >= 24 ? value : null
        });
        prev = value;
    }
    return data;
};

const progressionData = generateProgressionData();

const topicData = [
    { name: 'Sciences (Maths/Phys/Chim)', value: 60, color: '#0F2D1E' },
    { name: 'Général (Philo/Fr/Ang)', value: 25, color: '#1B6B3A' },
    { name: 'Économie', value: 15, color: '#27AE60' },
];

// Les données de quiz sont maintenant dynamiques et passées via le profil

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg  border border-gray-200 animate-in zoom-in-95 duration-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs font-bold text-gray-500">{entry.name}</span>
                            </div>
                            <span className="text-sm font-black text-[#0F2D1E]">
                                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                                {entry.name === 'Progression' ? '%' : ''}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const sparklineData = [
    { value: 45 }, { value: 52 }, { value: 48 }, { value: 70 }, { value: 65 }, { value: 85 }, { value: 78 }
];

const StatCard = ({ icon: Icon, label, value, color, chartColor }: any) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between group hover:border-[#1B6B3A]/30 relative overflow-hidden transition-all duration-300">
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-[#0F2D1E]">{value}</p>
            </div>
        </div>
        
        {/* Brain Network Graph Decoration - More visible and animated */}
        <div className="absolute top-0 right-0 h-full w-28 opacity-[0.12] group-hover:opacity-25 transition-opacity duration-500 pointer-events-none">
            <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="20" cy="30" r="2" fill={chartColor} />
                <circle cx="50" cy="20" r="2" fill={chartColor} />
                <circle cx="80" cy="40" r="2" fill={chartColor} />
                <circle cx="40" cy="50" r="2" fill={chartColor} />
                <circle cx="70" cy="70" r="2" fill={chartColor} />
                <circle cx="30" cy="80" r="2" fill={chartColor} />
                
                <path d="M20 30 L50 20 L80 40 L40 50 L20 30" stroke={chartColor} strokeWidth="1" fill="none" />
                <path d="M50 20 L40 50 L70 70 L30 80 L40 50" stroke={chartColor} strokeWidth="1" fill="none" />
                <path d="M80 40 L70 70" stroke={chartColor} strokeWidth="1" fill="none" />
                
                <motion.circle 
                    cx="50" cy="20" r="3" 
                    fill={chartColor} 
                    animate={{ r: [3, 5, 3], opacity: [0.6, 1, 0.6] }} 
                    transition={{ duration: 3, repeat: Infinity }} 
                />
                <motion.circle 
                    cx="70" cy="70" r="3" 
                    fill={chartColor} 
                    animate={{ r: [3, 5, 3], opacity: [0.6, 1, 0.6] }} 
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }} 
                />
                <motion.circle 
                    cx="20" cy="30" r="3" 
                    fill={chartColor} 
                    animate={{ r: [2, 4, 2], opacity: [0.4, 0.8, 0.4] }} 
                    transition={{ duration: 5, repeat: Infinity, delay: 2 }} 
                />
            </svg>
        </div>
    </div>
);

export const StudentView = ({ user, profile }: StudentViewProps) => {
    const [dueLessons, setDueLessons] = React.useState<any[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = React.useState(true);

    React.useEffect(() => {
        const fetchDueLessons = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const data = await apiCall(`/lesson-progress/due/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDueLessons(data);
            } catch (err) {
                console.error("Error fetching due lessons", err);
            } finally {
                setIsLoadingReviews(false);
            }
        };
        fetchDueLessons();
    }, [user.id]);

    const quizData = profile?.quizResults?.length > 0 ? profile.quizResults : [
        { subject: 'Maths', score: 85, average: 65 },
        { subject: 'Physique', score: 72, average: 68 },
        { subject: 'Chimie', score: 92, average: 70 },
        { subject: 'Économie', score: 78, average: 62 },
        { subject: 'Français', score: 90, average: 75 },
        { subject: 'Anglais', score: 65, average: 70 },
        { subject: 'Philo', score: 82, average: 64 },
    ];

    // Transformation et filtrage des données pour assurer la cohérence
    const isSM = profile?.subLevel?.includes('SM') || profile?.subLevel === 'TSM';
    
    const transformedQuizData = quizData.map((item: any) => {
        let name = item.subject;
        // Harmonisation des noms pour le graphique
        if (name === 'Maths') name = 'Mathématiques';
        if (name === 'Philo') name = 'Philosophie';
        if (name === 'SVT') name = 'Biologie'; // Clearer name for filtering
        
        return { ...item, subject: name };
    });

    const filteredQuizData = transformedQuizData.filter((item: any) => {
        if (isSM && (item.subject === 'Biologie' || item.subject === 'Géologie' || item.subject === 'SVT')) return false;
        return true;
    });

    const filteredTopicData = topicData.filter(item => {
        if (isSM && (item.name.toLowerCase().includes('bio') || item.name.toLowerCase().includes('géo'))) return false;
        return true;
    });

    const resources = [
        { id: 1, title: 'Mathématiques : Algèbre Supérieure', type: 'PDF', class: profile?.subLevel || '10ème', date: 'Il y a 2 jours' },
        { id: 2, title: 'Physique : Optique Géométrique', type: 'Vidéo', class: profile?.subLevel || '10ème', date: 'Il y a 3 jours' },
        { id: 3, title: 'Français : Analyse de texte', type: 'Quiz', class: profile?.subLevel || '10ème', date: 'Il y a 5 jours' },
    ];

    const hasActivities = profile?.activities?.length > 0;
    const revisedHistory = hasActivities ? profile.activities.map((act: any) => {
        // Map subjects to colors for consistency
        const subjectColors: Record<string, string> = {
            'Mathématiques': 'text-blue-600 bg-blue-50',
            'Physique': 'text-purple-600 bg-purple-50',
            'Chimie': 'text-emerald-600 bg-emerald-50',
            'Français': 'text-rose-600 bg-rose-50',
            'Anglais': 'text-amber-600 bg-amber-50',
            'SVT': 'text-green-600 bg-green-50',
            'Philosophie': 'text-indigo-600 bg-indigo-50',
            'Histoire': 'text-orange-600 bg-orange-50',
            'Géographie': 'text-cyan-600 bg-cyan-50'
        };

        const dateObj = new Date(act.createdAt);
        const diffDays = Math.floor((new Date().getTime() - dateObj.getTime()) / (1000 * 3600 * 24));
        const dateLabel = diffDays === 0 ? "Aujourd'hui" : 
                         diffDays === 1 ? "Hier" : 
                         `Il y a ${diffDays} jours`;

        return {
            ...act,
            date: dateLabel,
            time: act.timeSpent,
            color: subjectColors[act.subject] || 'text-gray-600 bg-gray-50'
        };
    }) : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Spaced Repetition Section */}
            {dueLessons.length > 0 && (
                <div className="bg-[#1B6B3A] px-8 py-10 rounded-md relative overflow-hidden group">
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">À revoir aujourd'hui</h3>
                                <p className="text-xs text-white/60 font-medium">Ne laissez pas vos connaissances s'échapper !</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dueLessons.slice(0, 3).map((item) => (
                                <div key={item.id} className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/20 transition-all group/item">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                            <BookOpen className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-white truncate">{item.resource?.title}</p>
                                            <p className="text-[10px] font-medium text-emerald-300 uppercase tracking-wider">{item.resource?.subject}</p>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/dashboard/review?id=${item.lessonId}`}
                                        className="p-2 bg-[#1B6B3A] text-white rounded-lg hover:bg-[#10B981] transition-all group-hover/item:translate-x-1"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                            {dueLessons.length > 3 && (
                                <Link 
                                    href="/dashboard/review"
                                    className="bg-white/5 border border-dashed border-white/20 p-4 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all group/more"
                                >
                                    <span className="text-sm font-bold text-white/80 mr-2">+{dueLessons.length - 3} autres</span>
                                    <ArrowRight className="w-4 h-4 text-white/40 group-hover/more:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Target} label="Score Global" value={`${profile?.globalScore || 0}%`} color="bg-blue-50 text-blue-600" chartColor="#2563EB" />
                <StatCard icon={Activity} label="Assiduité" value={`${profile?.attendanceDays || 0} Jours`} color="bg-orange-50 text-orange-600" chartColor="#EA580C" />
                <StatCard icon={Award} label="Quiz Finis" value={profile?.examCount || 0} color="bg-emerald-50 text-emerald-600" chartColor="#059669" />
                <StatCard icon={Calendar} label="Temps Étude" value={`${profile?.studyHours || 0}h`} color="bg-purple-50 text-purple-600" chartColor="#7C3AED" />
            </div>

            {/* Progression Area Chart (Extended Full Width) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#0F2D1E]">Ma Progression Globale</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">
                        <Activity className="w-3.5 h-3.5" />
                        <span>En direct</span>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressionData}>
                                <defs>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B6B3A" stopOpacity={0.08}/>
                                        <stop offset="100%" stopColor="#1B6B3A" stopOpacity={0}/>
                                    </linearGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="8 8" opacity={0.4} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 500}}
                                    interval={5}
                                    dy={12}
                                />
                                <YAxis 
                                    hide 
                                    domain={['dataMin - 5', 'dataMax + 5']}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                
                                {/* Épuré : Suppression des lignes de référence distrayantes */}

                                {/* Prevision Data (Thin Gray) */}
                                <Area 
                                    type="monotone" 
                                    dataKey="forecastValue" 
                                    stroke="#E2E8F0" 
                                    strokeWidth={1.5}
                                    strokeDasharray="4 4"
                                    fill="transparent"
                                    connectNulls={true}
                                />

                                {/* Active Data (Signature Thick Green with Glow) */}
                                <Area 
                                    type="monotone" 
                                    dataKey="activeValue" 
                                    name="Progression"
                                    stroke="#1B6B3A" 
                                    strokeWidth={3.5}
                                    fillOpacity={1} 
                                    fill="url(#colorActive)" 
                                    filter="url(#glow)"
                                    animationDuration={2800}
                                    connectNulls={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-gray-50">
                        <div className="flex gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-400 uppercase tracking-widest text-[10px]">Session Précédente</span>
                                <span className="text-[#0F2D1E] text-sm">Clôt préc : 14.5</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-400 uppercase tracking-widest text-[10px]">Tendance</span>
                                <span className="text-emerald-500 text-sm font-black">+12.4%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[#10B981]" />
                                <span className="text-gray-400">Actuel</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-gray-200" />
                                <span className="text-gray-400">Prévision</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Performance */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6 overflow-hidden h-full">
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
                            <div className="h-[340px] min-w-[600px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={filteredQuizData} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="subject" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}}
                                            dy={5}
                                        />
                                        <YAxis hide domain={[0, 20]} />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                        <Bar name="Mon Score" dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={12} />
                                        <Bar name="Classe" dataKey="average" fill="#FBBF24" radius={[4, 4, 0, 0]} barSize={12} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="#3B82F6" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="average" 
                                            stroke="#FBBF24" 
                                            strokeWidth={2} 
                                            strokeDasharray="5 5"
                                            dot={{ r: 3, fill: '#FBBF24', strokeWidth: 1, stroke: '#fff' }}
                                            activeDot={{ r: 5, strokeWidth: 0 }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Repartition & Todo */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-lg border border-gray-200  h-full flex flex-col">
                        <div className="flex items-center justify-between group cursor-pointer mb-6">
                            <h4 className="text-lg font-bold text-[#0F2D1E]">Répartition</h4>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#10B981] " />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="h-64 w-full relative mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredQuizData}>
                                        <PolarGrid stroke="#F1F5F9" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} />
                                        <Radar
                                            name="Mes Compétences"
                                            dataKey="score"
                                            stroke="#1B6B3A"
                                            fill="#1B6B3A"
                                            fillOpacity={0.5}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-50">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">À faire bientôt</h4>
                                <div className="flex gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-transparent hover:border-[#10B981]/20  cursor-pointer group">
                                    <div className="w-12 h-12 rounded-lg bg-white flex flex-col items-center justify-center  group-hover:scale-105 transition-transform">
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Avr</span>
                                        <span className="text-lg font-black text-[#0F2D1E] leading-none">12</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">Examen Blanc Maths</p>
                                        <p className="text-[11px] font-semibold text-gray-400">09:00 - 12:00 • Salle B2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Digital Library Section */}
            <StudentLibraryView user={user} profile={profile} />

            {/* Course Revision History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A]">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#0F2D1E]">Historique des cours révisés</h3>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vos sessions d'apprentissage récentes</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 ">
                        Exporter l'historique
                    </button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden min-h-[120px] flex items-center">
                    {hasActivities ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-50 w-full">
                            {revisedHistory.map((item: any) => (
                                <div key={item.id} className="p-6 hover:bg-gray-50/50 group cursor-pointer transition-colors">
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
                                                    className={`h-full duration-1000 ${
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
                    ) : (
                        <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mb-4 text-[#1B6B3A]">
                                <BookOpen className="w-8 h-8 opacity-40" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-700 mb-1">Aucune révision récente</h4>
                            <p className="text-xs text-gray-400 max-w-[280px]">
                                Commencez à apprendre une leçon ou à passer un quiz pour voir votre progression ici.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

