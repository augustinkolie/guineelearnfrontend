'use client';

import React from 'react';
import { Heart, Activity, Calendar, ShieldCheck, ChevronRight, PieChart as PieIcon } from 'lucide-react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip, 
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

const attendanceData = [
    { name: 'Présent', value: 85, color: '#1B6B3A' },
    { name: 'Retard', value: 10, color: '#F59E0B' },
    { name: 'Absent', value: 5, color: '#EF4444' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg  border border-gray-200 animate-in zoom-in-95 duration-200">
                <p className="text-sm font-black text-[#0F2D1E] mb-2">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs font-bold text-gray-400">{entry.name}</span>
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

export const ParentView = ({ user, profile }: any) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-black text-[#0F2D1E]">Espace Parent ❤️</h2>
                <p className="text-gray-500 font-medium">Suivez la progression scolaire de vos enfants en temps réel.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Children Summary */}
                <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Mes Enfants</h3>
                        <span className="text-xs font-bold text-[#1B6B3A] bg-[#E8F5EE] px-3 py-1 rounded-full uppercase tracking-wider">
                            {profile?.numberOfChildren} Enfant(s) inscrit(s)
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-[#F8FAFC] border border-gray-50 flex items-center justify-between group cursor-pointer hover:border-[#1B6B3A]/20 ">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B6B3A]  font-black text-lg">
                                    M
                                </div>
                                <div>
                                    <p className="font-bold text-[#0F2D1E]">Moussa Camara</p>
                                    <p className="text-xs font-semibold text-gray-400">10ème Année • Collège</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1B6B3A] transition-colors" />
                        </div>
                    </div>
                </div>

                {/* attendance Chart */}
                <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6 text-center">
                    <div className="flex items-center justify-between text-left">
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Assiduité Globale</h3>
                        <PieIcon className="w-5 h-5 text-[#1B6B3A]" />
                    </div>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={attendanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    cornerRadius={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {attendanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Central Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-[#1B6B3A]">85%</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Présence</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 pt-2">
                        {attendanceData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                                <span className="text-xs font-bold text-gray-500">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Grades Chart (Grouped Bars) */}
                <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Notes par Matière</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enfant</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Classe</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={profile?.childGrades || [
                                { subject: 'Maths', score: 16, average: 13 },
                                { subject: 'Physiq', score: 14, average: 12 },
                                { subject: 'Franç', score: 18, average: 15 },
                                { subject: 'Angls', score: 15, average: 14 },
                            ]} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="subject" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} 
                                />
                                <YAxis domain={[0, 20]} hide />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                <Bar name="Enfant" dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar name="Classe" dataKey="average" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts / Activity */}
                <div className="bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                    <h3 className="text-xl font-bold text-[#0F2D1E]">Dernières Alertes</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#0F2D1E]">Moyenne trimestrielle disponible</p>
                                <p className="text-xs text-gray-400 mt-0.5">Il y a 2 heures • Moussa Camara</p>
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold hover:border-[#1B6B3A]/30 hover:text-[#1B6B3A]  flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Consulter le calendrier scolaire
                    </button>
                </div>
            </div>
            
            <div className="bg-[#1B6B3A] rounded-lg p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6  shadow-[#1B6B3A]/20">
                <div className="flex items-center gap-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black">Contrôle Parental Activé</h4>
                        <p className="text-green-100/70 font-medium">Vous recevrez une notification par SMS pour chaque absence signalée.</p>
                    </div>
                </div>
                <button className="bg-white text-[#1B6B3A] px-8 py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 ">
                    Paramètres
                </button>
            </div>
        </div>
    );
};
