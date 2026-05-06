'use client';

import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    Globe, 
    Users, 
    Database,
    Clock,
    Server,
    ArrowUpRight,
    ArrowDownRight,
    Radio
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

interface RealtimeDataPoint {
    time: string;
    users: number;
    requests: number;
    latency: number;
}

export const AdminRealtimeView = ({ user }: { user: any }) => {
    const [data, setData] = useState<RealtimeDataPoint[]>([]);
    const [currentStats, setCurrentStats] = useState({
        users: 1430,
        usersTrend: 1,
        requests: 450,
        requestsTrend: 1,
        latency: 42,
        latencyTrend: -1,
    });

    // Initialize data
    useEffect(() => {
        const initialData = [];
        const now = new Date();
        for (let i = 20; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 1500);
            initialData.push({
                time: time.toLocaleTimeString('fr-FR', { second: '2-digit', minute: '2-digit', hour: '2-digit' }),
                users: Math.floor(1400 + Math.random() * 100),
                requests: Math.floor(400 + Math.random() * 100),
                latency: Math.floor(35 + Math.random() * 20),
            });
        }
        setData(initialData);

        const interval = setInterval(() => {
            setData(currentData => {
                const lastPoint = currentData[currentData.length - 1];
                
                // Random walk logic for "stock market" feel
                const userDelta = Math.floor((Math.random() - 0.45) * 50);
                const reqDelta = Math.floor((Math.random() - 0.5) * 80);
                const latDelta = Math.floor((Math.random() - 0.5) * 10);
                
                let nextUsers = Math.max(800, lastPoint.users + userDelta);
                let nextReqs = Math.max(100, lastPoint.requests + reqDelta);
                let nextLat = Math.max(10, Math.min(200, lastPoint.latency + latDelta));
                
                const now = new Date();
                const newPoint = {
                    time: now.toLocaleTimeString('fr-FR', { second: '2-digit', minute: '2-digit', hour: '2-digit' }),
                    users: nextUsers,
                    requests: nextReqs,
                    latency: nextLat,
                };

                setCurrentStats({
                    users: nextUsers,
                    usersTrend: userDelta >= 0 ? 1 : -1,
                    requests: nextReqs,
                    requestsTrend: reqDelta >= 0 ? 1 : -1,
                    latency: nextLat,
                    latencyTrend: latDelta >= 0 ? 1 : -1,
                });

                const newData = [...currentData.slice(1), newPoint];
                return newData;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0A1A11]/90 backdrop-blur-md p-4 rounded-lg border border-white/10 ">
                    <p className="text-xs font-black text-gray-400 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }} />
                            <p className="text-sm font-bold text-white uppercase tracking-wider">{entry.value} {entry.name}</p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-black min-h-[calc(100vh-5rem)] p-4 md:p-8 lg:p-10 font-mono text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <Radio className="w-8 h-8 text-emerald-500" />
                            Monitoring Live
                        </h1>
                    </div>
                    <p className="text-gray-400 font-medium">Analyse en temps réel du trafic et des ressources.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-sm text-gray-300">Réseau Guinéen Actif</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#1B6B3A]/20 border border-[#1B6B3A]/30 rounded-lg text-emerald-400">
                        <Activity className="w-4 h-4" />
                        <span className="font-bold text-sm">Système Nominal</span>
                    </div>
                </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Users Live */}
                <div className="bg-gradient-to-br from-[#0F2D1E] to-[#0A1A11] p-6 rounded-lg border border-white/5  relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Users className="w-24 h-24" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Visiteurs Actifs</p>
                    <div className="flex items-end gap-3">
                        <h2 className="text-5xl font-black text-white">{currentStats.users.toLocaleString()}</h2>
                        <div className={`flex items-center gap-1 ${currentStats.usersTrend > 0 ? 'text-emerald-400' : 'text-rose-400'} mb-2`}>
                            {currentStats.usersTrend > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                            <span className="text-sm font-bold animate-pulse">LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Requests */}
                <div className="bg-gradient-to-br from-[#1A1F2C] to-[#0F1420] p-6 rounded-lg border border-white/5  relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity className="w-24 h-24 text-blue-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Requêtes / min</p>
                    <div className="flex items-end gap-3">
                        <h2 className="text-5xl font-black text-blue-400">{currentStats.requests}</h2>
                        <div className={`flex items-center gap-1 ${currentStats.requestsTrend > 0 ? 'text-blue-300' : 'text-blue-500'} mb-2`}>
                            {currentStats.requestsTrend > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                    </div>
                </div>

                {/* Latency */}
                <div className="bg-gradient-to-br from-[#1A1F2C] to-[#0F1420] p-6 rounded-lg border border-white/5  relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock className="w-24 h-24 text-purple-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Latence Moyenne</p>
                    <div className="flex items-end gap-3">
                        <h2 className={`text-5xl font-black ${currentStats.latency > 100 ? 'text-rose-400' : 'text-purple-400'}`}>{currentStats.latency}</h2>
                        <span className="text-lg font-bold text-gray-500 mb-1">ms</span>
                    </div>
                </div>
            </div>

            {/* Trading Style Live Graph */}
            <div className="bg-[#0A1A11] p-6 border border-white/5 rounded-lg ">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">Trafic Global Continu</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]"></span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Utilisateurs</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#F97316] shadow-[0_0_10px_#F97316]"></span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Requêtes</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.15)" />
                            <XAxis 
                                dataKey="time" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 11, fontWeight: 'bold', fill: '#6B7280' }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 11, fill: '#6B7280' }} 
                                dx={-10} 
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <Line 
                                type="linear" 
                                dataKey="users" 
                                name="Utilisateurs"
                                stroke="#8B5CF6" 
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: "#8B5CF6", stroke: "#000", strokeWidth: 2 }}
                                isAnimationActive={false}
                            />
                            <Line 
                                type="linear" 
                                dataKey="requests" 
                                name="Requêtes"
                                stroke="#F97316" 
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: "#F97316", stroke: "#000", strokeWidth: 2 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Server Status Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { node: "Node-GNB-01", status: "Online", load: "42%" },
                    { node: "Node-GNB-02", status: "Online", load: "38%" },
                    { node: "DB-Primary", status: "Syncing", load: "65%" },
                    { node: "Cache-Redis", status: "Online", load: "12%" },
                ].map((server, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-1">{server.node}</p>
                            <p className="text-sm font-black text-white">{server.load}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${server.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-amber-500 shadow-[0_0_8px_#F59E0B] animate-pulse'}`} title={server.status} />
                    </div>
                ))}
            </div>
        </div>
    );
};
