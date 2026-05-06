'use client';

import React from 'react';
import { 
    Users, 
    BookOpen, 
    FileUp, 
    GraduationCap, 
    BarChart3, 
    Clock 
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Cell,
    PieChart,
    Pie 
} from 'recharts';

const performanceData = [
    { name: '7ème', score: 12.5, target: 14 },
    { name: '8ème', score: 14.2, target: 14 },
    { name: '9ème', score: 11.8, target: 14 },
    { name: '10ème', score: 15.6, target: 14 },
    { name: '11ème', score: 13.4, target: 14 },
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

const COLORS = ['#1B6B3A', '#27AE60', '#34D399', '#059669', '#10B981'];

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between group hover:border-[#1B6B3A]/20  ">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A] transition-transform group-hover:scale-110">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-[#0F2D1E]">{value}</p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-xs font-bold text-[#1B6B3A] bg-[#E8F5EE] px-2 py-1 rounded-full">{trend}</span>
        </div>
    </div>
);

export const TeacherView = ({ user, profile }: any) => {
    const chartData = profile?.classPerformances || performanceData;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E]">Espace Enseignant</h2>
                    <p className="text-gray-500 font-medium">Gérez vos classes et vos ressources pédagogiques.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#1B6B3A] text-white px-6 py-3 rounded-lg font-bold  shadow-[#1B6B3A]/20  active:scale-[0.98] ">
                    <FileUp className="w-5 h-5" />
                    Ajouter une ressource
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Users} label="Élèves" value={profile?.studentCount || 0} trend="+0" />
                <StatCard icon={BookOpen} label="Cours" value={profile?.courseCount || 0} trend="+0" />
                <StatCard icon={BarChart3} label="Moyenne" value={profile?.averageGrade || "0.0"} trend="+0.0" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-lg border border-gray-200  space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Performance par Classe</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actuel</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Objectif</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                <Bar name="Actuel" dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar name="Objectif" dataKey="target" fill="#FBBF24" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200  space-y-4">
                        <h3 className="text-sm font-bold text-[#0F2D1E]">Soumission des Devoirs</h3>
                        <div className="h-44 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Rendu', value: 75, color: '#1B6B3A' },
                                            { name: 'En attente', value: 25, color: '#F1F5F9' },
                                        ]}
                                        innerRadius={55}
                                        outerRadius={75}
                                        cornerRadius={8}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell fill="#1B6B3A" />
                                        <Cell fill="#F1F5F9" />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Central Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-[#1B6B3A]">75%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retour</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#E8F5EE]/50 border-2 border-dashed border-[#1B6B3A]/20 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 h-auto">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#1B6B3A] ">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#0F2D1E]">Conseil Pédagogique</h3>
                            <p className="text-sm text-gray-500 font-medium mt-2">La classe de 10ème montre une progression de 15%. Pensez à partager plus de ressources en Mathématiques.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
