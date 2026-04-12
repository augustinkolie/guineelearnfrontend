'use client';

import React, { useState, useEffect } from 'react';
import { 
    Settings, 
    Globe, 
    Shield, 
    Bell, 
    Save, 
    RefreshCcw,
    Monitor,
    Mail,
    Phone,
    Share2,
    Lock,
    Eye,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { apiCall } from '@/utils/api';

export const AdminSettingsView = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    const [isToggling, setIsToggling] = useState<string | null>(null);

    const fetchConfig = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const data = await apiCall('/admin/settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setConfig(data);
        } catch (err) {
            setNotification({ msg: 'Erreur lors du chargement de la configuration', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    // Toast Timer
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const updated = await apiCall('/admin/settings', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(config)
            });
            setConfig(updated);
            setNotification({ msg: 'Configuration enregistrée avec succès', type: 'success' });
        } catch (err) {
            setNotification({ msg: 'Erreur lors de la sauvegarde', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (field: string, label: string) => {
        setIsToggling(field);
        try {
            const token = localStorage.getItem('token');
            const newValue = !config[field];
            const updated = await apiCall('/admin/settings', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ [field]: newValue })
            });
            setConfig(updated);
            setNotification({ 
                msg: `${label} : ${newValue ? 'Activé' : 'Désactivé'}`, 
                type: 'success' 
            });
        } catch (err) {
            setNotification({ msg: `Erreur lors du basculement de ${label}`, type: 'error' });
        } finally {
            setIsToggling(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-[#1B6B3A] animate-spin" />
                <p className="text-gray-500 font-bold tracking-tight">Chargement de la configuration...</p>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Notifications */}
            {notification && (
                <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-full duration-300 ${
                    notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{notification.msg}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-[#0F2D1E] tracking-tight">Configuration Système</h2>
                    <p className="text-gray-500 font-medium text-xs mt-1">Gérez les paramètres globaux et l'état de la plateforme.</p>
                </div>
                <button 
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#1B6B3A]/20 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Enregistrer
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - General Settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Site Identity */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                            <Monitor className="w-4 h-4 text-[#1B6B3A]" />
                            <h2 className="text-lg font-bold text-[#0F2D1E]">Identité de la Plateforme</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nom de la Plateforme</label>
                                <input 
                                    type="text" 
                                    value={config.platformName}
                                    onChange={(e) => setConfig({...config, platformName: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1B6B3A]/20 transition-all font-bold text-sm text-[#0F2D1E] outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Slogan (Tagline)</label>
                                <input 
                                    type="text" 
                                    value={config.slogan}
                                    onChange={(e) => setConfig({...config, slogan: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1B6B3A]/20 transition-all font-bold text-sm text-[#0F2D1E] outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description Meta (SEO)</label>
                            <textarea 
                                rows={3}
                                value={config.metaDescription || ''}
                                onChange={(e) => setConfig({...config, metaDescription: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1B6B3A]/20 transition-all font-bold text-sm text-[#0F2D1E] resize-none outline-none"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                            <Mail className="w-4 h-4 text-[#1B6B3A]" />
                            <h2 className="text-lg font-bold text-[#0F2D1E]">Informations de Contact</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email de Support</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        value={config.supportEmail || ''}
                                        onChange={(e) => setConfig({...config, supportEmail: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1B6B3A]/20 transition-all font-bold text-sm text-[#0F2D1E] outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Téléphone Officiel</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={config.officialPhone || ''}
                                        onChange={(e) => setConfig({...config, officialPhone: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1B6B3A]/20 transition-all font-bold text-sm text-[#0F2D1E] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Toggles */}
                <div className="space-y-8">
                    {/* Security & Access */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                            <Shield className="w-4 h-4 text-[#1B6B3A]" />
                            <h2 className="text-sm font-black uppercase tracking-tight text-[#0F2D1E]">Accès & Sécurité</h2>
                        </div>

                        {/* Maintenance Mode */}
                        <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${config.maintenanceMode ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.maintenanceMode ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-gray-200 text-gray-500'}`}>
                                    {isToggling === 'maintenanceMode' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#0F2D1E]">Mode Maintenance</p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${config.maintenanceMode ? 'text-amber-600' : 'text-gray-400'}`}>{config.maintenanceMode ? 'Activé' : 'Désactivé'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggle('maintenanceMode', 'Mode Maintenance')}
                                disabled={isToggling !== null}
                                className={`w-10 h-5 rounded-full relative p-0.5 transition-all flex items-center ${config.maintenanceMode ? 'bg-amber-500' : 'bg-gray-300'} ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${config.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* Registrations Open */}
                        <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${config.registrationsOpen ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-100 hover:bg-rose-50/50'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.registrationsOpen ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-200 text-rose-500'}`}>
                                    {isToggling === 'registrationsOpen' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#0F2D1E]">Inscriptions Ouvertes</p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${config.registrationsOpen ? 'text-emerald-600' : 'text-rose-500'}`}>{config.registrationsOpen ? 'Ouvert' : 'Fermé'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggle('registrationsOpen', 'Inscriptions')}
                                disabled={isToggling !== null}
                                className={`w-10 h-5 rounded-full relative p-0.5 transition-all flex items-center ${config.registrationsOpen ? 'bg-emerald-500' : 'bg-gray-300'} ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${config.registrationsOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Info Box */}
                    <div className="bg-[#E8F5EE] p-6 rounded-2xl border border-[#1B6B3A]/10 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#1B6B3A] text-white flex items-center justify-center font-black text-[10px]">i</div>
                            <h3 className="text-xs font-black text-[#0F2D1E] uppercase tracking-wider">Aide Système</h3>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                            Les modifications effectuées ici impactent l'expérience de tous les utilisateurs. Assurez-vous de valider les changements avant d'enregistrer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
