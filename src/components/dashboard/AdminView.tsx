'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
    Users, 
    BookOpen, 
    ShieldCheck, 
    TrendingUp, 
    ArrowUpRight, 
    MoreVertical,
    Activity,
    UserPlus,
    LayoutGrid,
    Search,
    Filter,
    Download,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Eye
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
import { apiCall } from '@/utils/api';

interface AdminViewProps {
    user: any;
    profile: any;
}

// Mock data types for reference, but we will use state
const initialStats = [
    { label: 'Utilisateurs Totaux', value: '0', change: '+0%', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Enseignants Actifs', value: '0', change: '+0%', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Cours Publiés', value: '0', change: '+0%', icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
    { label: 'Activité Globale', value: '0%', change: '+0%', icon: Activity, color: 'text-orange-600 bg-orange-50' },
];

const enrollmentStatusData = [
    { name: 'Validés', value: 45, color: '#10B981' },
    { name: 'En Attente', value: 25, color: '#F59E0B' },
    { name: 'Certificats', value: 20, color: '#8B5CF6' },
    { name: 'À Finaliser', value: 10, color: '#6B7280' },
];

const dailyComparisonData = [
    { day: 'Lun', inscriptions: 12, completions: 10 },
    { day: 'Mar', inscriptions: 15, completions: 12 },
    { day: 'Mer', inscriptions: 8, completions: 6 },
    { day: 'Jeu', inscriptions: 20, completions: 16 },
    { day: 'Ven', inscriptions: 18, completions: 14 },
    { day: 'Sam', inscriptions: 14, completions: 11 },
    { day: 'Dim', inscriptions: 16, completions: 13 },
];
const weeklyActivityData = [
    { name: 'Lun', value: 12 },
    { name: 'Mar', value: 15 },
    { name: 'Mer', value: 8 },
    { name: 'Jeu', value: 20 },
    { name: 'Ven', value: 17 },
    { name: 'Sam', value: 14 },
    { name: 'Dim', value: 16 },
];

const monthlyActivityData = [
    { name: 'Sem 1', value: 45 },
    { name: 'Sem 2', value: 52 },
    { name: 'Sem 3', value: 38 },
    { name: 'Sem 4', value: 65 },
];


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg  border border-gray-200">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <p className="text-sm font-bold text-[#0F2D1E]">{entry.value} {entry.name}</p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const AdminView = ({ user, profile }: AdminViewProps) => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [adminForm, setAdminForm] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
    const [isToggleActive, setIsToggleActive] = useState(true);

    const fetchDashboardStats = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const data = await apiCall('/admin/dashboard-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDashboardData(data);
        } catch (err) {
            console.error('Fetch dashboard stats error:', err);
            setNotification({ msg: 'Erreur lors du chargement des statistiques', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "À l'instant";
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInHours < 48) return "Hier";
        
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const statsData = [
        { label: 'Utilisateurs Totaux', value: dashboardData?.stats?.totalUsers || '0', change: '+0%', icon: Users, color: 'text-blue-600 bg-blue-50' },
        { label: 'Enseignants Actifs', value: dashboardData?.stats?.activeTeachers || '0', change: '+0%', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Cours Publiés', value: dashboardData?.stats?.publishedCourses || '0', change: '+0%', icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
        { label: 'Activité Globale', value: `${dashboardData?.stats?.activityRate || 0}%`, change: '+0%', icon: Activity, color: 'text-orange-600 bg-orange-50' },
    ];

    const exportToPDF = async () => {
        if (!exportRef.current) return;
        try {
            setIsExporting(true);
            
            // Dynamic imports to prevent SSR errors
            const domtoimage = (await import('dom-to-image-more')).default;
            const { jsPDF } = await import('jspdf');

            const node = exportRef.current;
            const imgData = await domtoimage.toJpeg(node, { 
                quality: 0.95, 
                bgcolor: '#ffffff' 
            });
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [node.offsetWidth, node.offsetHeight]
            });
            
            pdf.addImage(imgData, 'JPEG', 0, 0, node.offsetWidth, node.offsetHeight);
            pdf.save('Rapport_Admin_GuineeLearn.pdf');
            setNotification({ msg: 'Rapport exporté avec succès en PDF !', type: 'success' });
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            setNotification({ msg: 'Erreur lors de l\'export', type: 'error' });
        } finally {
            setIsExporting(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const newAdmin = await apiCall('/admin/users', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...adminForm, role: 'ADMIN' })
            });
            setNotification({ msg: `Administrateur "${newAdmin.fullName}" créé avec succès !`, type: 'success' });
            setIsNewAdminModalOpen(false);
            setAdminForm({ fullName: '', email: '', password: '' });
            setTimeout(() => setNotification(null), 4000);
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
            setTimeout(() => setNotification(null), 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && !dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#1B6B3A]" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={exportRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#FAFAFA] md:bg-transparent">

            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg  border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Administration</h1>
                    <p className="text-gray-500 font-medium text-xs">Surveillance globale de la plateforme GuinéeLearn.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportToPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50   disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-[#1B6B3A]" /> : <Download className="w-4 h-4" />} Exporter
                    </button>
                    <button 
                        onClick={() => setIsNewAdminModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#1B6B3A] text-white rounded-lg text-sm font-bold hover:bg-[#155230]   shadow-[#1B6B3A]/20"
                    >
                        <UserPlus className="w-4 h-4" /> Nouvel Admin
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 shrink-0`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-md">
                                    <TrendingUp className="w-3 h-3" /> {stat.change}
                                </span>
                            </div>
                            <div className="flex items-end justify-between gap-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
                                <p className="text-2xl font-black text-[#0F2D1E] leading-none">{stat.value}</p>
                            </div>
                        </div>

                        {/* Sparkline */}
                        <div className="absolute bottom-0 right-0 w-24 h-12 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none translate-y-2 translate-x-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    {v: 40}, {v: 60}, {v: 45}, {v: 90}, {v: 75}, {v: 95}, {v: 85}
                                ]}>
                                    <Area 
                                        type="monotone" 
                                        dataKey="v" 
                                        stroke={stat.color.includes('emerald') ? '#10B981' : stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('amber') ? '#F59E0B' : '#1B6B3A'} 
                                        strokeWidth={2} 
                                        fill={stat.color.includes('emerald') ? '#10B981' : stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('amber') ? '#F59E0B' : '#1B6B3A'} 
                                        fillOpacity={0.1}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity Chart */}
            <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-[#0F2D1E]">Activité des Utilisateurs</h3>
                            <span className="text-emerald-500 font-bold">15 utilisateurs</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black">
                            <TrendingUp className="w-3.5 h-3.5" />
                            HAUSSE 8%
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsToggleActive(!isToggleActive)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isToggleActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isToggleActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setChartPeriod('week')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold  ${chartPeriod === 'week' ? 'bg-[#1B6B3A] text-white  shadow-[#1B6B3A]/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        Semaine
                    </button>
                    <button 
                        onClick={() => setChartPeriod('month')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold  ${chartPeriod === 'month' ? 'bg-[#1B6B3A] text-white  shadow-[#1B6B3A]/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        Mois
                    </button>
                </div>

                <div className="h-80 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartPeriod === 'week' ? weeklyActivityData : monthlyActivityData}>
                            <defs>
                                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} 
                                domain={[8, 20]}
                                ticks={[8, 10, 12, 14, 16, 18, 20]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8B5CF6" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorActivity)"
                                activeDot={{ r: 6, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
                                dot={(props: any) => {
                                    const { cx, cy, payload, index } = props;
                                    const dataLength = chartPeriod === 'week' ? weeklyActivityData.length : monthlyActivityData.length;
                                    if (index === dataLength - 1) {
                                        return (
                                            <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#10B981" stroke="white" strokeWidth={2} />
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>


            {/* New Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Donut Chart: Statut des Inscriptions */}
                <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0F2D1E]">Statut des Inscriptions</h3>
                            <p className="text-xs font-medium text-gray-400 mt-1">Inscriptions traitées par le système</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 ">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 ">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="h-64 w-64 relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={enrollmentStatusData}
                                        innerRadius={75}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {enrollmentStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                            {enrollmentStatusData.map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-bold text-[#0F2D1E]">{item.name}</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 ml-5">{item.value} inscriptions</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar Chart: Inscriptions vs Certifications */}
                <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[#0F2D1E]">Inscriptions vs Complétions</h3>
                            <p className="text-xs font-medium text-gray-400 mt-1">Comparaison quotidienne des activités</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 ">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 ">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyComparisonData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                                <Bar dataKey="inscriptions" name="Inscriptions" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="completions" name="Complétions" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-[#8B5CF6]" />
                            <span className="text-xs font-bold text-gray-500">Inscriptions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-[#10B981]" />
                            <span className="text-xs font-bold text-gray-500">Complétions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-[#0F2D1E]">Dernières Inscriptions</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                placeholder="Rechercher..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none focus:border-[#1B6B3A]/30  w-full md:w-64" 
                            />
                        </div>
                        <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] ">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(dashboardData?.recentUsers || [])
                                .filter((u: any) => 
                                    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    u.email.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((u: any) => (
                                <tr key={u.id} className="hover:bg-gray-50/30  group">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#1B6B3A] text-xs">
                                                {u.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#0F2D1E]">{u.fullName}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                                            u.role === 'ADMIN' ? 'bg-red-50 text-red-600' :
                                            u.role === 'TEACHER' ? 'bg-emerald-50 text-emerald-600' :
                                            u.role === 'PARENT' ? 'bg-purple-50 text-purple-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <span className="text-[11px] font-semibold text-gray-600">
                                                {u.status === 'ACTIVE' ? 'Actif' : 'Suspendu'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-[11px] font-semibold text-gray-400">{formatDate(u.createdAt)}</td>
                                    <td className="px-6 py-3">
                                        <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#1B6B3A] ">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-gray-50 bg-gray-50/20 text-center">
                    <Link href="/dashboard/users">
                        <button className="text-xs font-black text-[#1B6B3A] uppercase tracking-widest hover:underline">
                            Voir tous les utilisateurs
                        </button>
                    </Link>
                </div>
            </div>

            {/* New Admin Modal */}
            {isNewAdminModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4  animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-black text-[#0F2D1E]">Nouvel Administrateur</h2>
                                <p className="text-gray-400 text-[11px] font-semibold mt-1">Créer un compte avec les droits d'administration complets.</p>
                            </div>
                            <button 
                                onClick={() => setIsNewAdminModalOpen(false)} 
                                className="p-2 hover:bg-gray-100 rounded-lg "
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Warning Banner */}
                        <div className="mt-5 mb-5 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                                Un administrateur a accès à toutes les données. Créez ce compte uniquement pour des personnes de confiance.
                            </p>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nom complet *</label>
                                <input 
                                    type="text" 
                                    required
                                    value={adminForm.fullName}
                                    onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                                    placeholder="Ex: Ibrahima Kouyaté"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none  placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse Email *</label>
                                <input 
                                    type="email" 
                                    required
                                    value={adminForm.email}
                                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                    placeholder="Ex: admin@guineelearn.com"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none  placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mot de passe temporaire *</label>
                                <input 
                                    type="password" 
                                    required 
                                    minLength={8}
                                    value={adminForm.password}
                                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                                    placeholder="Minimum 8 caractères"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none  placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm  shadow-[#1B6B3A]/20  active:scale-[0.98]  flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting 
                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                    : <><UserPlus className="w-5 h-5" /> Créer l'administrateur</>
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
