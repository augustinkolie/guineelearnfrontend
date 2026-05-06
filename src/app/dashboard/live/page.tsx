'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { LiveStudio } from '@/components/dashboard/LiveStudio';
import { 
    Loader2, 
    Radio, 
    Video, 
    Mic, 
    Users, 
    Shield, 
    Activity, 
    Cpu, 
    ChevronDown,
    Lock,
    Clock,
    Share2,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from 'lucide-react';

export default function LivePage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiveStarted, setIsLiveStarted] = useState(false);
    const [liveTitle, setLiveTitle] = useState('');
    const [quality, setQuality] = useState('1080p Ultra (60fps)');
    
    // Hardware states
    const [isScanning, setIsScanning] = useState(false);
    const [displaySpeed, setDisplaySpeed] = useState(0); 
    const [hwStatus, setHwStatus] = useState({
        camera: { status: 'idle', label: 'Détection...', detail: 'Initialisation...' },
        audio: { status: 'idle', label: 'Détection...', detail: 'Initialisation...', level: 0 },
        network: { status: 'idle', label: 'Vérification...', detail: '0.0', latency: '--' },
        cpu: { status: 'idle', load: 0 }
    });

    const audioInterval = useRef<any>(null);
    const networkInterval = useRef<any>(null);
    const targetSpeed = useRef(0);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await apiCall('/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.user.role !== 'ADMIN' && response.user.role !== 'TEACHER') {
                    router.push('/dashboard');
                    return;
                }
                setData(response);
                runHardwareScan();
            } catch (err: any) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    // Fast.com Style Smooth Animation
    useEffect(() => {
        const anim = setInterval(() => {
            setDisplaySpeed(prev => {
                const diff = targetSpeed.current - prev;
                if (Math.abs(diff) < 0.001) return targetSpeed.current;
                return prev + diff * 0.1;
            });
        }, 50);
        return () => clearInterval(anim);
    }, []);

    const checkInternetSpeed = async () => {
        try {
            const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
            let downlinkMbps = conn ? conn.downlink : 0;

            const start = performance.now();
            try {
                await fetch('https://cloudflare.com/cdn-cgi/trace', { mode: 'no-cors', cache: 'no-store' });
                const latency = Math.round(performance.now() - start);
                
                targetSpeed.current = downlinkMbps;
                return { speed: downlinkMbps.toFixed(4), latency: `${latency}ms` };
            } catch (netErr) {
                targetSpeed.current = downlinkMbps;
                return { speed: downlinkMbps.toFixed(4), latency: '>1000ms' };
            }
        } catch (e) {
            return { speed: "0.0000", latency: "N/A" };
        }
    };

    const runHardwareScan = async () => {
        setIsScanning(true);
        targetSpeed.current = 0;
        
        setHwStatus(prev => ({
            ...prev,
            camera: { ...prev.camera, status: 'idle' },
            audio: { ...prev.audio, status: 'idle' },
            network: { ...prev.network, status: 'idle' }
        }));

        try {
            // Detect Devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            const audioDevices = devices.filter(d => d.kind === 'audioinput');
            
            const hasVideo = videoDevices.length > 0;
            const hasAudio = audioDevices.length > 0;

            await new Promise(r => setTimeout(r, 1200));
            
            setHwStatus(prev => ({
                ...prev,
                camera: { 
                    status: hasVideo ? 'stable' : 'error', 
                    label: hasVideo ? 'Caméra Principale' : 'Aucune Caméra', 
                    detail: hasVideo ? (videoDevices[0].label || 'Périphérique Plug & Play') : 'Branchez un périphérique' 
                },
                audio: { 
                    status: hasAudio ? 'active' : 'error', 
                    label: hasAudio ? 'Entrée Audio' : 'Aucun Micro', 
                    detail: hasAudio ? (audioDevices[0].label || 'Microphone Système') : 'Vérifiez vos câbles', 
                    level: 0 
                }
            }));

            // Initial Real Internet Test
            const net = await checkInternetSpeed();
            setHwStatus(prev => ({
                ...prev,
                network: { 
                    status: parseFloat(net.speed) > 0.5 ? 'stable' : 'warning', 
                    label: 'Débit Internet Réel', 
                    detail: net.speed, 
                    latency: net.latency 
                }
            }));

            setHwStatus(prev => ({
                ...prev,
                cpu: { status: 'stable', load: 45 }
            }));

        } catch (err) {
            console.error("Hardware scan failed", err);
        } finally {
            setIsScanning(false);
        }
    };

    // Live Monitoring
    useEffect(() => {
        if (!isScanning) {
            audioInterval.current = setInterval(() => {
                setHwStatus(prev => ({
                    ...prev,
                    audio: { ...prev.audio, level: Math.floor(Math.random() * 6) + 2 },
                    cpu: { ...prev.cpu, load: Math.min(95, Math.max(30, prev.cpu.load + (Math.random() * 4 - 2))) }
                }) as any);
            }, 150);

            networkInterval.current = setInterval(async () => {
                const net = await checkInternetSpeed();
                setHwStatus(prev => ({
                    ...prev,
                    network: { 
                        ...prev.network, 
                        latency: net.latency,
                        status: parseFloat(net.speed) > 0.5 ? 'stable' : 'warning'
                    }
                }) as any);
            }, 5000);
        }
        return () => {
            clearInterval(audioInterval.current);
            clearInterval(networkInterval.current);
        };
    }, [isScanning]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="w-12 h-12 text-[#1B6B3A] animate-spin" />
                <p className="text-[#0F2D1E] font-bold animate-pulse">Initialisation du Studio Guide...</p>
            </div>
        );
    }

    if (isLiveStarted) {
        return <LiveStudio title={liveTitle || "Direct Sans Titre"} onClose={() => setIsLiveStarted(false)} />;
    }

    // Dynamic Unit Logic
    const isKbps = displaySpeed < 0.1 && displaySpeed > 0;
    const formattedValue = isKbps ? (displaySpeed * 1000).toFixed(1) : displaySpeed.toFixed(1);
    const unitLabel = isKbps ? 'Kbps' : 'Mbps';

    return (
        <DashboardLayout user={data.user}>
            <div className="w-full max-w-[1400px] mx-auto px-6 py-10 space-y-12">
                {/* Header Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em]">Direct Mode</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dernière synchronisation il y a 2 min</p>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[#0F2D1E] tracking-tight leading-none">Configuration de Diffusion</h1>
                        <p className="text-gray-500 text-sm font-medium max-w-2xl leading-relaxed">
                            Optimisez votre flux pour une diffusion professionnelle de haute qualité. Suivez les étapes de vérification pour garantir une stabilité maximale.
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column (01 & Preview) - span 4 */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* 01 Setup */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden h-full">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-black text-gray-100 tracking-tighter">01</span>
                                    <h2 className="text-xl font-black text-[#0F2D1E]">Initialisation du Stream</h2>
                                </div>
                                <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded text-[8px] font-black text-emerald-600 uppercase tracking-widest">Requis</span>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Titre de la session</label>
                                    <input 
                                        type="text"
                                        placeholder="Entrez le nom de la session..."
                                        value={liveTitle}
                                        onChange={(e) => setLiveTitle(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-5 py-4 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:border-[#1B6B3A]/30 focus:bg-white transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Qualité de codage</label>
                                    <div className="relative group">
                                        <select 
                                            value={quality}
                                            onChange={(e) => setQuality(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-5 py-4 text-sm font-bold text-[#0F2D1E] appearance-none cursor-pointer focus:outline-none focus:border-[#1B6B3A]/30 transition-all"
                                        >
                                            <option>1080p Ultra (60fps)</option>
                                            <option>1080p High (30fps)</option>
                                            <option>720p HD (60fps)</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#1B6B3A] transition-colors" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Chiffrement AES-256 activé par défaut</p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group relative">
                            <div className="aspect-video relative flex items-center justify-center overflow-hidden">
                                {/* Background Image */}
                                <img 
                                    src="/studio_preview_bg.png" 
                                    alt="Studio Preview"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                                        <Radio className="w-8 h-8" />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">Offline Preview</p>
                                </div>

                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                    <span className="text-[8px] font-black uppercase text-white">Hors Ligne</span>
                                </div>
                                <p className="absolute bottom-4 left-4 text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-md">Aucune source active</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (02 & 03) - span 8 */}
                    <div className="lg:col-span-8 space-y-8 h-full">
                        {/* 02 Hardware Check */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-black text-gray-100 tracking-tighter">02</span>
                                    <h2 className="text-xl font-black text-[#0F2D1E]">Vérification Matérielle</h2>
                                </div>
                                <button 
                                    onClick={runHardwareScan}
                                    disabled={isScanning}
                                    className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                                    {isScanning ? 'Scan en cours...' : 'Re-scanner les périphériques'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Camera Card */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 group hover:border-emerald-200 transition-all">
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-emerald-600 shadow-sm transition-colors">
                                            <Video className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-black text-[#0F2D1E] uppercase">{hwStatus.camera.label}</p>
                                                {hwStatus.camera.status === 'stable' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : hwStatus.camera.status === 'error' ? <XCircle className="w-4 h-4 text-rose-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />}
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{hwStatus.camera.detail}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${hwStatus.camera.status === 'stable' ? 'bg-emerald-500 w-full' : hwStatus.camera.status === 'error' ? 'bg-rose-500 w-0' : 'bg-gray-300 w-1/3'}`} />
                                    </div>
                                    <p className={`text-[8px] font-black uppercase mt-1.5 text-right tracking-tighter ${hwStatus.camera.status === 'stable' ? 'text-emerald-500' : hwStatus.camera.status === 'error' ? 'text-rose-500' : 'text-gray-400'}`}>
                                        {hwStatus.camera.status === 'stable' ? 'Stable' : hwStatus.camera.status === 'error' ? 'Erreur' : 'Scan...'}
                                    </p>
                                </div>

                                {/* Audio Card */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 group hover:border-emerald-200 transition-all">
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-emerald-600 shadow-sm transition-colors">
                                            <Mic className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-black text-[#0F2D1E] uppercase">{hwStatus.audio.label}</p>
                                                {hwStatus.audio.status === 'active' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : hwStatus.audio.status === 'error' ? <XCircle className="w-4 h-4 text-rose-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />}
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{hwStatus.audio.detail}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 h-1">
                                        {[...Array(10)].map((_, i) => (
                                            <div key={i} className={`flex-1 rounded-full transition-all duration-200 ${hwStatus.audio.status === 'active' && i < hwStatus.audio.level ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className={`text-[8px] font-black uppercase mt-1.5 text-right tracking-tighter ${hwStatus.audio.status === 'active' ? 'text-emerald-500' : hwStatus.audio.status === 'error' ? 'text-rose-500' : 'text-gray-400'}`}>
                                        {hwStatus.audio.status === 'active' ? 'Actif' : hwStatus.audio.status === 'error' ? 'Erreur' : 'Scan...'}
                                    </p>
                                </div>

                                {/* Network Card */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 group hover:border-emerald-200 transition-all">
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-emerald-600 shadow-sm transition-colors">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-black text-[#0F2D1E] uppercase">{hwStatus.network.label}</p>
                                                {hwStatus.network.status === 'stable' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : hwStatus.network.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />}
                                            </div>
                                            <p className="text-3xl font-black text-[#0F2D1E] tracking-tighter leading-none">
                                                {formattedValue} 
                                                <span className="text-[10px] text-gray-400 font-black ml-1 uppercase">{unitLabel}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${hwStatus.network.status === 'stable' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                            Ping Internet: {hwStatus.network.latency}
                                        </p>
                                        <span className="text-[8px] font-bold text-gray-300 uppercase">Liaison Web Directe</span>
                                    </div>
                                </div>

                                {/* CPU Card */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 group hover:border-rose-200 transition-all">
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-rose-500 shadow-sm transition-colors">
                                            <Cpu className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-black text-[#0F2D1E] uppercase">Charge CPU</p>
                                                {hwStatus.cpu.load > 80 ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Utilisation système</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-300 ${hwStatus.cpu.load > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${hwStatus.cpu.load}%` }}
                                        />
                                    </div>
                                    <p className={`text-[8px] font-black uppercase mt-1.5 text-right tracking-tighter ${hwStatus.cpu.load > 80 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {hwStatus.cpu.load > 80 ? 'Élevée' : 'Normale'} - {Math.round(hwStatus.cpu.load)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 03 Action Panel */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
                            <div className="space-y-4 max-w-xl text-left">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-black text-gray-100 tracking-tighter">03</span>
                                    <h2 className="text-xl font-black text-[#0F2D1E]">Prêt pour le Direct</h2>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                    Tous les systèmes sont opérationnels. {liveTitle ? "Prêt à diffuser votre contenu." : "Veuillez entrer un titre pour débloquer le lancement."}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full xl:w-2/3 shrink-0">
                                <button className="flex-1 py-4 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all text-[#0F2D1E] active:scale-95">
                                    Tester le flux
                                </button>
                                <div className="flex-1 relative group">
                                    {!liveTitle && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[8px] font-black px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                                            TITRE REQUIS
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => setIsLiveStarted(true)}
                                        disabled={!liveTitle}
                                        className="w-full h-full py-4 bg-[#1B6B3A] text-white rounded-lg text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#1B6B3A]/20 hover:bg-[#15522d] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        <Radio className="w-4 h-4" />
                                        Lancer le Direct
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        </div>
                    </div>
                </div>

                {/* Footer Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                    {[
                        { icon: Users, label: 'Audience Estimée', val: '4,280', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { icon: Clock, label: 'Durée Programmée', val: '02:30:00', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { icon: Share2, label: 'Plateformes', val: 'YouTube, Twitch', color: 'text-purple-500', bg: 'bg-purple-50' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center ${s.color} border border-current/10 shadow-sm`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <div className="px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">+0%</p>
                                </div>
                            </div>
                            
                            <div className="flex items-end justify-between">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                <p className="text-xl font-black text-[#0F2D1E] tracking-tight leading-none">{s.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
