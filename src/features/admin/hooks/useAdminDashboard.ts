'use client';

import { useState, useRef, useEffect } from 'react';
import { apiCall } from '@/utils/api';

export const weeklyActivityData = [
    { name: 'Lun', value: 12 }, { name: 'Mar', value: 15 }, { name: 'Mer', value: 8 },
    { name: 'Jeu', value: 20 }, { name: 'Ven', value: 17 }, { name: 'Sam', value: 14 }, { name: 'Dim', value: 16 },
];
export const monthlyActivityData = [
    { name: 'Sem 1', value: 45 }, { name: 'Sem 2', value: 52 }, { name: 'Sem 3', value: 38 }, { name: 'Sem 4', value: 65 },
];
export const enrollmentStatusData = [
    { name: 'Validés', value: 45, color: '#10B981' }, { name: 'En Attente', value: 25, color: '#F59E0B' },
    { name: 'Certificats', value: 20, color: '#8B5CF6' }, { name: 'À Finaliser', value: 10, color: '#6B7280' },
];
export const dailyComparisonData = [
    { day: 'Lun', inscriptions: 12, completions: 10 }, { day: 'Mar', inscriptions: 15, completions: 12 },
    { day: 'Mer', inscriptions: 8, completions: 6 }, { day: 'Jeu', inscriptions: 20, completions: 16 },
    { day: 'Ven', inscriptions: 18, completions: 14 }, { day: 'Sam', inscriptions: 14, completions: 11 }, { day: 'Dim', inscriptions: 16, completions: 13 },
];

export function useAdminDashboard() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [adminForm, setAdminForm] = useState({ fullName: '', email: '', password: '' });
    const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
    const [isToggleActive, setIsToggleActive] = useState(true);

    const fetchDashboardStats = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const data = await apiCall('/admin/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } });
            setDashboardData(data);
        } catch (err) {
            setNotification({ msg: 'Erreur lors du chargement des statistiques', type: 'error' });
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchDashboardStats(); }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const diffInHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1) return "À l'instant";
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInHours < 48) return "Hier";
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const statsData = [
        { label: 'Utilisateurs Totaux', value: dashboardData?.stats?.totalUsers || '0', change: '+0%', icon: 'Users', color: 'text-blue-600 bg-blue-50' },
        { label: 'Enseignants Actifs', value: dashboardData?.stats?.activeTeachers || '0', change: '+0%', icon: 'ShieldCheck', color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Cours Publiés', value: dashboardData?.stats?.publishedCourses || '0', change: '+0%', icon: 'BookOpen', color: 'text-purple-600 bg-purple-50' },
        { label: 'Activité Globale', value: `${dashboardData?.stats?.activityRate || 0}%`, change: '+0%', icon: 'Activity', color: 'text-orange-600 bg-orange-50' },
    ];

    const exportToPDF = async () => {
        if (!exportRef.current) return;
        try {
            setIsExporting(true);
            const domtoimage = (await import('dom-to-image-more')).default;
            const { jsPDF } = await import('jspdf');
            const node = exportRef.current;
            const imgData = await domtoimage.toJpeg(node, { quality: 0.95, bgcolor: '#ffffff' });
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [node.offsetWidth, node.offsetHeight] });
            pdf.addImage(imgData, 'JPEG', 0, 0, node.offsetWidth, node.offsetHeight);
            pdf.save('Rapport_Admin_GuineeLearn.pdf');
            setNotification({ msg: 'Rapport exporté avec succès en PDF !', type: 'success' });
        } catch {
            setNotification({ msg: "Erreur lors de l'export", type: 'error' });
        } finally { setIsExporting(false); }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const newAdmin = await apiCall('/admin/users', {
                method: 'POST', headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...adminForm, role: 'ADMIN' })
            });
            setNotification({ msg: `Administrateur "${newAdmin.fullName}" créé !`, type: 'success' });
            setIsNewAdminModalOpen(false);
            setAdminForm({ fullName: '', email: '', password: '' });
        } catch (err: any) {
            setNotification({ msg: err.message || 'Erreur lors de la création', type: 'error' });
        } finally { setIsSubmitting(false); }
    };

    return {
        dashboardData, isLoading, isNewAdminModalOpen, setIsNewAdminModalOpen,
        isSubmitting, isExporting, exportRef, notification,
        searchTerm, setSearchTerm, adminForm, setAdminForm,
        chartPeriod, setChartPeriod, isToggleActive, setIsToggleActive,
        statsData, exportToPDF, handleCreateAdmin, formatDate
    };
}
