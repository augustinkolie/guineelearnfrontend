'use client';

import React from 'react';
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
    Book
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsView = ({ user, profile }: { user: any, profile?: any }) => {
    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div>
                <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Paramètres</h2>
                <p className="text-gray-500 font-medium tracking-wide">Gérez votre compte, vos préférences et votre sécurité.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-xl bg-[#E8F5EE] border-4 border-white shadow-xl flex items-center justify-center overflow-hidden mx-auto">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-[#1B6B3A]" />
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-[#1B6B3A] text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-all">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#0F2D1E]">{user?.fullName || 'Utilisateur'}</h3>
                            <p className="text-xs font-black text-[#1B6B3A] uppercase tracking-widest opacity-70">{user?.role?.replace('_', ' ')}</p>
                        </div>
                        <div className="pt-4 flex flex-col gap-2">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <School className="w-4 h-4 text-gray-400" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Établissement</p>
                                    <p className="text-xs font-bold text-[#0F2D1E] truncate">Lycée 02 Octobre</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Book className="w-4 h-4 text-gray-400" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Classe</p>
                                    <p className="text-xs font-bold text-[#0F2D1E]">10ème Année - SM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h4 className="text-sm font-black text-[#0F2D1E] uppercase tracking-widest mb-4">Stockage Cloud</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-gray-400">Utilisation</span>
                                <span className="text-[#0F2D1E]">1.2 GB / 5 GB</span>
                            </div>
                            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1B6B3A] w-[24%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Account Settings */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h3 className="text-lg font-bold text-[#0F2D1E]">Informations personnelles</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom complet</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input type="text" defaultValue={user?.fullName} className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Adresse E-mail</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input type="email" defaultValue={user?.email} className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button className="px-8 py-3 bg-[#1B6B3A] text-white rounded-xl font-bold shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] transition-all">
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h3 className="text-lg font-bold text-[#0F2D1E]">Préférences de notification</h3>
                        </div>
                        <div className="p-8 space-y-4">
                            {[
                                { icon: Bell, title: 'Notifications App', desc: 'Alertes en direct sur le dashboard', active: true },
                                { icon: Mail, title: 'Mails de progression', desc: 'Résumé hebdomadaire de vos scores', active: true },
                                { icon: Smartphone, title: 'Notifications SMS', desc: 'Alertes importantes par téléphone', active: false },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${item.active ? 'bg-[#E8F5EE] text-[#1B6B3A]' : 'bg-gray-100 text-gray-400'}`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#0F2D1E]">{item.title}</p>
                                            <p className="text-xs font-bold text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${item.active ? 'bg-[#1B6B3A]' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-[#0F2D1E] rounded-xl p-8 flex items-center justify-between text-white shadow-xl shadow-[#0F2D1E]/20">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
                                <Shield className="w-8 h-8 text-[#1B6B3A]" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black tracking-tight">Sécurité du compte</h4>
                                <p className="text-white/60 text-sm font-medium">Authentification à deux facteurs activée.</p>
                            </div>
                        </div>
                        <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                            <Lock className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
