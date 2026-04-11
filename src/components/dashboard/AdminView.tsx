'use client';

import React, { useState, useRef } from 'react';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';
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
} from 'recharts';
import { apiCall } from '@/utils/api';

interface AdminViewProps {
    user: any;
    profile: any;
}

const statsData = [
    { label: 'Utilisateurs Totaux', value: '2,840', change: '+12%', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Enseignants Actifs', value: '142', change: '+5%', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Cours Publiés', value: '486', change: '+24%', icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
    { label: 'Activité Globale', value: '94%', change: '+2%', icon: Activity, color: 'text-orange-600 bg-orange-50' },
];

const chartData = [
    { name: 'Lun', users: 400, activity: 240 },
    { name: 'Mar', users: 300, activity: 139 },
    { name: 'Mer', users: 200, activity: 980 },
    { name: 'Jeu', users: 278, activity: 390 },
    { name: 'Ven', users: 189, activity: 480 },
    { name: 'Sam', users: 239, activity: 380 },
    { name: 'Dim', users: 349, activity: 430 },
];

const recentUsers = [
    { id: 1, name: 'Mamadou Diallo', email: 'm.diallo@email.com', role: 'STUDENT', status: 'Actif', joined: 'Il y a 2h' },
    { id: 2, name: 'Aissatou Barry', email: 'a.barry@email.com', role: 'TEACHER', status: 'Actif', joined: 'Il y a 4h' },
    { id: 3, name: 'Ousmane Sylla', email: 'o.sylla@email.com', role: 'PARENT', status: 'En attente', joined: 'Il y a 6h' },
    { id: 4, name: 'Kadiatou Camara', email: 'k.camara@email.com', role: 'STUDENT', status: 'Actif', joined: 'Hier' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
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
    const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    const [adminForm, setAdminForm] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const exportToPDF = async () => {
        if (!exportRef.current) return;
        try {
            setIsExporting(true);
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

    return (
        <div ref={exportRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#FAFAFA] md:bg-transparent">

            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0F2D1E]">Administration</h1>
                    <p className="text-gray-500 font-medium">Surveillance globale de la plateforme GuinéeLearn.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportToPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-[#1B6B3A]" /> : <Download className="w-4 h-4" />} Exporter
                    </button>
                    <button 
                        onClick={() => setIsNewAdminModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#1B6B3A] text-white rounded-xl text-sm font-bold hover:bg-[#155230] transition-all shadow-lg shadow-[#1B6B3A]/20"
                    >
                        <UserPlus className="w-4 h-4" /> Nouvel Admin
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 shrink-0`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-md">
                                <TrendingUp className="w-3 h-3" /> {stat.change}
                            </span>
                        </div>
                        <div className="flex items-end justify-between gap-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
                            <p className="text-lg font-black text-[#0F2D1E] leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0F2D1E]">Croissance de la Plateforme</h3>
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            {['7J', '30J', '90J'].map((period) => (
                                <button key={period} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${period === '30J' ? 'bg-white text-[#1B6B3A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B6B3A" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#1B6B3A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="users" name="Inscriptions" stroke="#1B6B3A" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions & Status */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <h3 className="text-xl font-bold mb-6 text-[#0F2D1E]">Actions Rapides</h3>
                        <div className="grid gap-3">
                            {[
                                { label: 'Ajouter un Enseignant', icon: UserPlus, href: '/dashboard/users' },
                                { label: 'Publier une Annonce', icon: MoreVertical, href: '/dashboard/resources' },
                                { label: 'Modifier les Cours', icon: LayoutGrid, href: '/dashboard/admin-courses' },
                                { label: 'Paramètres Système', icon: ShieldCheck, href: '/dashboard/settings' },
                            ].map((action, i) => (
                                <Link href={action.href} key={i}>
                                    <button className="w-full flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] text-gray-600 rounded-xl transition-all text-sm font-bold border border-gray-100 group">
                                        <action.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        {action.label}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Statut des Serveurs</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Base de données', status: 'Optimal', color: 'bg-emerald-500' },
                                { name: 'API Services', status: 'En ligne', color: 'bg-emerald-500' },
                                { name: 'Stockage Media', status: 'Optimal', color: 'bg-emerald-500' },
                            ].map((sys, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-600">{sys.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1B6B3A]">{sys.status}</span>
                                        <div className={`w-2 h-2 rounded-full ${sys.color} animate-pulse`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-[#0F2D1E]">Dernières Inscriptions</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium outline-none focus:border-[#1B6B3A]/30 transition-all w-full md:w-64" />
                        </div>
                        <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:bg-[#E8F5EE] hover:text-[#1B6B3A] transition-all">
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
                            {recentUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/30 transition-all group">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#1B6B3A] text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#0F2D1E]">{u.name}</p>
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
                                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Actif' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className="text-[11px] font-semibold text-gray-600">{u.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-[11px] font-semibold text-gray-400">{u.joined}</td>
                                    <td className="px-6 py-3">
                                        <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#1B6B3A] transition-all">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-gray-50 bg-gray-50/20 text-center">
                    <button className="text-xs font-black text-[#1B6B3A] uppercase tracking-widest hover:underline">
                        Voir tous les utilisateurs
                    </button>
                </div>
            </div>

            {/* New Admin Modal */}
            {isNewAdminModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-black text-[#0F2D1E]">Nouvel Administrateur</h2>
                                <p className="text-gray-400 text-[11px] font-semibold mt-1">Créer un compte avec les droits d'administration complets.</p>
                            </div>
                            <button 
                                onClick={() => setIsNewAdminModalOpen(false)} 
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Warning Banner */}
                        <div className="mt-5 mb-5 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
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
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
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
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
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
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-sm text-[#0F2D1E] focus:ring-2 focus:ring-[#1B6B3A]/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
