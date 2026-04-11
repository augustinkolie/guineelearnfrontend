'use client';

import React, { useState } from 'react';
import { 
    User, 
    Mail, 
    Lock, 
    Bell, 
    Smartphone, 
    Camera,
    Shield,
    ChevronRight,
    School,
    Book,
    MapPin,
    Hash,
    Briefcase,
    Globe,
    CreditCard,
    Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsView = ({ user, profile }: { user: any, profile?: any }) => {
    const [activeTab, setActiveTab] = useState('profil');

    const tabs = [
        { id: 'profil', label: 'Mon Profil', icon: User },
        { id: 'scolarite', label: 'Scolarité', icon: School },
        { id: 'securite', label: 'Sécurité', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div>
                <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Paramètres</h2>
                <p className="text-gray-500 font-medium tracking-wide">Personnalisez votre expérience et gérez la sécurité de votre compte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Profile Card & Tabs Menu */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Profile Summary Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-[#E8F5EE]/40 group-hover:bg-[#E8F5EE]/60 transition-colors" />
                        
                        <div className="relative pt-6 space-y-4">
                            <div className="relative inline-block">
                                <div className="w-36 h-36 rounded-3xl bg-white border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden mx-auto transition-transform group-hover:scale-105 duration-500">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#1B6B3A]/5 flex items-center justify-center">
                                            <User className="w-20 h-20 text-[#1B6B3A]" />
                                        </div>
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-3 bg-[#1B6B3A] text-white rounded-2xl shadow-xl border-4 border-white hover:scale-110 active:scale-95 transition-all">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-black text-[#0F2D1E] tracking-tight">{user?.fullName || 'Utilisateur'}</h3>
                                <p className="text-sm font-bold text-[#1B6B3A] uppercase tracking-[0.2em] opacity-80 mt-1">
                                    {user?.role === 'STUDENT' ? 'Élève Guinéen' : 'Instructeur'}
                                </p>
                            </div>
                        </div>

                        {/* Quick Info Grid */}
                        <div className="pt-8 grid grid-cols-2 gap-3">
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <Hash className="w-4 h-4 text-gray-400 mb-2 mx-auto" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID Étudiant</p>
                                <p className="text-xs font-bold text-[#0F2D1E]">GL-2024-892</p>
                            </div>
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <CreditCard className="w-4 h-4 text-gray-400 mb-2 mx-auto" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Plan</p>
                                <p className="text-xs font-bold text-[#1B6B3A]">Premium</p>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Navigation Tabs */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-3 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                                    activeTab === tab.id 
                                    ? 'bg-[#1B6B3A] text-white shadow-lg shadow-[#1B6B3A]/20' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-[#1B6B3A]'}`} />
                                    <span className="font-bold text-sm">{tab.label}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Dynamic Content Area */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden"
                        >
                            {/* Tab Content Header */}
                            <div className="p-8 md:p-10 border-b border-gray-50 bg-gray-50/30">
                                <h3 className="text-2xl font-black text-[#0F2D1E] tracking-tight">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h3>
                                <p className="text-sm font-bold text-gray-400 mt-1">
                                    Mise à jour de vos informations {activeTab === 'securite' ? 'de sécurité' : activeTab === 'scolarite' ? 'académiques' : 'personnelles'}.
                                </p>
                            </div>

                            {/* Tab Content Body */}
                            <div className="p-8 md:p-10">
                                {activeTab === 'profil' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Nom Complet</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#1B6B3A] transition-colors" />
                                                    <input type="text" defaultValue={user?.fullName} className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Adresse E-mail</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#1B6B3A] transition-colors" />
                                                    <input type="email" defaultValue={user?.email} className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Numéro de Téléphone</label>
                                                <div className="relative group">
                                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#1B6B3A] transition-colors" />
                                                    <input type="tel" placeholder="+224 62X XX XX XX" className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Genre</label>
                                                <select className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans appearance-none">
                                                    <option value="male">Masculin</option>
                                                    <option value="female">Féminin</option>
                                                    <option value="other">Autre</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Ma Bio / Objectifs</label>
                                            <textarea 
                                                rows={4} 
                                                placeholder="Partagez un peu sur vous ou vos objectifs d'études..."
                                                className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-3xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button className="px-10 py-4.5 bg-[#1B6B3A] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-95 transition-all">
                                                Sauvegarder les modifications
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'scolarite' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Établissement</label>
                                                <div className="relative group">
                                                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#1B6B3A] transition-colors" />
                                                    <input type="text" defaultValue="Lycée 02 Octobre" className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Ville / Localité</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#1B6B3A] transition-colors" />
                                                    <input type="text" defaultValue="Conakry" className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Niveau d'Études</label>
                                                <select className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans appearance-none">
                                                    <option value="10eme">10ème Année</option>
                                                    <option value="terminale">Terminale</option>
                                                    <option value="licence">Licence</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Série / Filière</label>
                                                <select className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans appearance-none">
                                                    <option value="sm">Sciences Mathématiques</option>
                                                    <option value="se">Sciences Expérimentales</option>
                                                    <option value="ss">Sciences Sociales</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button className="px-10 py-4.5 bg-[#1B6B3A] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#1B6B3A]/20 hover:scale-[1.02] active:scale-95 transition-all">
                                                Mettre à jour le statut
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'securite' && (
                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <h4 className="flex items-center gap-2 text-sm font-black text-[#0F2D1E] uppercase tracking-widest">
                                                <Lock className="w-4 h-4 text-[#1B6B3A]" />
                                                Changer le mot de passe
                                            </h4>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Mot de passe actuel</label>
                                                    <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Nouveau mot de passe</label>
                                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Confirmer le mot de passe</label>
                                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all font-sans" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button className="px-10 py-4.5 bg-[#0F2D1E] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#0F2D1E]/20 hover:scale-[1.02] active:scale-95 transition-all">
                                                    Actualiser le mot de passe
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-[#E8F5EE] border border-[#1B6B3A]/20 rounded-3xl flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 bg-white rounded-2xl shadow-sm">
                                                    <Key className="w-8 h-8 text-[#1B6B3A]" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-[#0F2D1E] tracking-tight">Double Authentification (2FA)</h4>
                                                    <p className="text-[#1B6B3A] text-sm font-bold opacity-80">Protégez votre compte avec une sécurité maximale.</p>
                                                </div>
                                            </div>
                                            <div className="w-16 h-8 bg-[#1B6B3A] rounded-full relative cursor-pointer">
                                                <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-md" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-6">
                                        {[
                                            { icon: Bell, title: 'Notifications App', desc: 'Alertes en direct sur le dashboard (notes, quiz, etc)', active: true },
                                            { icon: Mail, title: 'Mails de progression', desc: 'Résumé hebdomadaire de vos performances par matière', active: true },
                                            { icon: Smartphone, title: 'Notifications SMS', desc: 'Alertes critiques et rappels de cours par téléphone', active: false },
                                            { icon: Globe, title: 'News & Updates', desc: 'Nouveautés de la plateforme et ressources gratuites', active: true },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-6 bg-gray-50/30 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all border border-transparent hover:border-gray-50">
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-4 rounded-2xl transition-colors ${item.active ? 'bg-[#E8F5EE] text-[#1B6B3A]' : 'bg-gray-100 text-gray-400'}`}>
                                                        <item.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-black text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">{item.title}</p>
                                                        <p className="text-sm font-bold text-gray-400 mt-0.5">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${item.active ? 'bg-[#1B6B3A] shadow-inner shadow-black/10' : 'bg-gray-200'}`}>
                                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${item.active ? 'right-1' : 'left-1'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Danger Zone */}
                    <div className="mt-10 p-8 rounded-3xl border border-rose-100 bg-rose-50/30 flex items-center justify-between group hover:bg-rose-50 transition-colors">
                        <div>
                            <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest">Désactiver le compte</h4>
                            <p className="text-xs font-bold text-rose-600/70 mt-1">Ceci supprimera vos données d'apprentissage de façon permanente.</p>
                        </div>
                        <button className="px-6 py-3 bg-rose-600/10 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-all">
                            Supprimer mon compte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
