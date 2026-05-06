'use client';

import React, { useEffect, useState } from 'react';
import { 
    FileText, 
    Video, 
    Download, 
    Search, 
    Filter,
    Folder,
    BookOpen,
    MoreVertical,
    CheckCircle2,
    Clock,
    X,
    ExternalLink,
    Play,
    ChevronLeft,
    ChevronRight,
    Clock3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiCall } from '@/utils/api';
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from '@/utils/video';

const allCategories = ['Tous', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Géologie', 'Economie', 'Philosophie', 'Français', 'Anglais'];
const types = ['Tous', 'VIDEO', 'PDF', 'COURSE', 'BOOK'];

export const ResourcesView = ({ profile }: { profile?: any }) => {
    // Dynamically filter categories based on user profile
    const categories = allCategories.filter(cat => {
        const isSM = profile?.subLevel?.includes('SM') || profile?.subLevel === 'TSM';
        if (isSM && (cat === 'Biologie' || cat === 'Géologie')) return false;
        return true;
    });

    const [resources, setResources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [selectedType, setSelectedType] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [isLoadingFrame, setIsLoadingFrame] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const data = await apiCall('/resources', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setResources(data);
            } catch (err: any) {
                setError(err.message || 'Impossible de charger les ressources');
            } finally {
                setIsLoading(false);
            }
        };
        fetchResources();
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedType, searchQuery]);

    const filteredResources = resources.filter(res => {
        const isSM = profile?.subLevel?.includes('SM') || profile?.subLevel === 'TSM';
        if (isSM && (res.subject === 'Biologie' || res.subject === 'Géologie')) return false;

        const matchesCategory = selectedCategory === 'Tous' || res.subject === selectedCategory;
        const matchesType = selectedType === 'Tous' || res.type === selectedType;
        const matchesQuery = !searchQuery || 
            res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesType && matchesQuery;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return Video;
            case 'PDF': return FileText;
            case 'BOOK': return BookOpen;
            case 'COURSE': return Folder;
            default: return FileText;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'VIDEO': return 'text-blue-500';
            case 'PDF': return 'text-red-500';
            case 'BOOK': return 'text-amber-500';
            case 'COURSE': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const totalPages = Math.ceil(filteredResources.length / pageSize);
    const paginatedResources = filteredResources.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const relatedVideos = resources
        .filter(r => r.type === 'VIDEO' && r.id !== selectedResource?.id)
        .sort((a, b) => {
            // Prioriser la même matière
            if (a.subject === selectedResource?.subject && b.subject !== selectedResource?.subject) return -1;
            if (a.subject !== selectedResource?.subject && b.subject === selectedResource?.subject) return 1;
            return 0;
        });

    return (
        <div className="space-y-10 pb-10 min-h-screen">
            <AnimatePresence mode="wait">
                {!selectedResource ? (
                    <motion.div 
                        key="library"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-10"
                    >
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Ma Bibliothèque de Ressources</h2>
                                <p className="text-gray-500 font-medium tracking-wide">Accédez à tous vos supports de cours et documents de révision.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1B6B3A] transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="Rechercher un document..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium w-64  focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg w-fit overflow-x-auto max-w-full border border-gray-200">
                                {categories.map((cat) => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest  whitespace-nowrap ${
                                            selectedCategory === cat 
                                            ? 'bg-white text-[#1B6B3A] ' 
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg w-fit border border-gray-200">
                                {types.map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => setSelectedType(t)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest  ${
                                            selectedType === t 
                                            ? 'bg-white text-[#1B6B3A] ' 
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resources List Container */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-none overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                        <Folder className="w-5 h-5 text-[#1B6B3A]" />
                                    </div>
                                    <h3 className="text-sm font-black text-[#0F2D1E] uppercase tracking-widest">Explorateur de ressources</h3>
                                </div>
                                <div className="text-xs font-bold text-gray-400">{filteredResources.length} fichiers trouvés</div>
                            </div>

                            {isLoading ? (
                                <div className="p-20 flex flex-col items-center justify-center gap-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[#1B6B3A]/10 border-t-[#1B6B3A]"></div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Récupération des données...</p>
                                </div>
                            ) : error ? (
                                <div className="p-20 text-center">
                                    <div className="bg-red-50 text-red-500 p-6 rounded-lg border border-red-100 max-w-md mx-auto">
                                        <h4 className="font-black uppercase tracking-widest text-sm mb-2">Erreur</h4>
                                        <p className="font-medium text-sm">{error}</p>
                                        <button 
                                            onClick={() => window.location.reload()}
                                            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-600 "
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                </div>
                            ) : filteredResources.length === 0 ? (
                                <div className="p-20 text-center">
                                    <p className="text-gray-400 font-bold">Aucune ressource trouvée pour ces critères.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="border-b border-gray-50 bg-gray-50/30">
                                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Nom du fichier</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Matière</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Format</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Filière</th>
                                                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {paginatedResources.map((item, index) => {
                                                    const Icon = getIcon(item.type);
                                                    return (
                                                        <motion.tr 
                                                            key={item.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.03 }}
                                                            onClick={() => { setSelectedResource(item); window.scrollTo(0, 0); }}
                                                            className="group cursor-pointer hover:bg-[#1B6B3A]/[0.02] transition-colors"
                                                        >
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center gap-5">
                                                                    <div className={`w-12 h-12 rounded-lg bg-white  border border-gray-200 group-hover:border-[#1B6B3A]/20  flex items-center justify-center ${getColor(item.type)}`}>
                                                                        <Icon className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-black text-[#0F2D1E] line-clamp-1 group-hover:text-[#1B6B3A] transition-colors">{item.title}</p>
                                                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight line-clamp-1 mt-0.5">{item.description || 'Consulter la ressource'}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <span className="px-3 py-1 bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-[#1B6B3A] transition-colors rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-200">
                                                                    {item.subject}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full ${item.type === 'VIDEO' ? 'bg-blue-400' : 'bg-red-400'}`} />
                                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.type}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6 text-xs font-bold text-gray-400 capitalize whitespace-nowrap">
                                                                {item.track === 'SM' ? 'Sciences Mathématiques' : 
                                                                 item.track === 'SE' ? 'Sciences Expérimentales' : 
                                                                 item.track === 'SS' ? 'Sciences Sociales' : 
                                                                 item.track === 'GENERAL' ? 'Tronc Commun' : item.track || 'Général'}
                                                            </td>
                                                            <td className="px-8 py-6 text-right">
                                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100  translate-x-4 group-hover:translate-x-0">
                                                                    <button className="w-10 h-10 bg-[#1B6B3A] text-white rounded-lg  shadow-none/20 flex items-center justify-center transition-transform active:scale-95">
                                                                        <Play className="w-4 h-4 fill-current" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Page {currentPage} sur {totalPages}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[#1B6B3A] hover:border-[#1B6B3A]/30 disabled:opacity-30 disabled:cursor-not-allowed "
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                
                                                <div className="flex gap-1">
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(i + 1)}
                                                            className={`w-9 h-9 rounded-lg text-[10px] font-black  ${
                                                                currentPage === i + 1
                                                                ? 'bg-[#1B6B3A] text-white  shadow-none/20'
                                                                : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-200'
                                                            }`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[#1B6B3A] hover:border-[#1B6B3A]/30 disabled:opacity-30 disabled:cursor-not-allowed "
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="viewer"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, type: 'spring', damping: 25 }}
                        className="flex flex-col lg:flex-row gap-8"
                    >
                        {/* MAIN CONTENT AREA (75%) */}
                        <div className="flex-1 space-y-8">
                            {/* Back Button */}
                            <button 
                                onClick={() => setSelectedResource(null)}
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1B6B3A] font-black text-[10px] uppercase tracking-widest  group"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Retour à la liste des ressources
                            </button>

                            {/* Professional Player Layout */}
                            <div className={`relative w-full overflow-hidden shadow-none ${
                                selectedResource.type === 'VIDEO' ? 'bg-[#0B130E]' : 'bg-white'
                            } rounded-lg`}>
                                {selectedResource.type === 'VIDEO' ? (
                                    <div className="flex flex-col">
                                        <div className="relative aspect-video w-full bg-black shadow-inner">
                                            {isLoadingFrame && (
                                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950">
                                                    <div className="w-16 h-16 border-4 border-white/5 border-t-[#1B6B3A] rounded-full animate-spin mb-4" />
                                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Chargement du flux vidéo...</p>
                                                </div>
                                            )}
                                            
                                            <iframe 
                                                src={getYoutubeEmbedUrl(selectedResource.url)} 
                                                className="w-full h-full relative z-0 border-none"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                                onLoad={() => setIsLoadingFrame(false)}
                                            ></iframe>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-[3/4] md:aspect-auto md:h-[800px] w-full relative">
                                        {isLoadingFrame && (
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50">
                                                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1B6B3A] rounded-full animate-spin mb-4" />
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Préparation du document...</p>
                                            </div>
                                        )}
                                        <iframe 
                                            src={`${selectedResource.url}#view=FitH&toolbar=0`} 
                                            className="w-full h-full border-none relative z-0"
                                            title="Lecteur de ressource"
                                            onLoad={() => setIsLoadingFrame(false)}
                                        ></iframe>
                                    </div>
                                )}
                            </div>

                            {/* Resource Metadata Section */}
                            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200  space-y-4">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="px-2.5 py-1 bg-[#1B6B3A]/10 text-[#1B6B3A] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#1B6B3A]/20">
                                                {selectedResource.subject}
                                            </span>
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-200">
                                                Badge Vérifié
                                            </span>
                                            <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[9px] uppercase tracking-widest ml-1">
                                                <Clock3 className="w-3 h-3" />
                                                Durée: 15m
                                            </div>
                                        </div>
                                        <h1 className="text-xl md:text-2xl font-black text-[#0F2D1E] tracking-tight">{selectedResource.title}</h1>
                                    </div>
                                    
                                    <div className="flex items-center gap-2.5 shrink-0">
                                        <button className="flex-1 md:flex-none px-6 py-3 bg-[#1B6B3A] text-white rounded-lg font-black text-[10px] uppercase tracking-widest  shadow-none/15  active:scale-[0.98]  flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Compléter
                                        </button>
                                        {selectedResource.type === 'PDF' && (
                                            <a 
                                                href={selectedResource.url}
                                                download
                                                className="p-3 bg-gray-50 text-gray-400 hover:bg-[#1B6B3A]/10 hover:text-[#1B6B3A] rounded-lg border border-gray-200  group"
                                            >
                                                <Download className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gray-100" />

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">À propos de cette ressource</h4>
                                    <p className="text-gray-600 font-medium leading-relaxed text-sm">
                                        {selectedResource.description || "Aucune description détaillée n'est disponible pour cette ressource. Il s'agit d'un support pédagogique sélectionné par nos enseignants pour accompagner votre progression scolaire."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SIDEBAR SUGGESTIONS (25%) */}
                        <div className="w-full lg:w-[380px] shrink-0 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-black text-[#0F2D1E] uppercase tracking-widest">Vidéos Suivantes</h3>
                                <button className="text-[10px] font-black text-[#1B6B3A] uppercase tracking-widest hover:underline">Voir Tout</button>
                            </div>

                            <div className="space-y-3">
                                {relatedVideos.length > 0 ? (
                                    relatedVideos.slice(0, 10).map((item, idx) => (
                                        <motion.div 
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => { setSelectedResource(item); window.scrollTo(0, 0); }}
                                            className="flex gap-4 p-3 bg-white hover:bg-[#E8F5EE]/50 rounded-lg border border-gray-200 cursor-pointer  group active:scale-95"
                                        >
                                            <div className="w-32 aspect-video shrink-0 rounded-lg overflow-hidden  border border-gray-200 relative bg-zinc-100">
                                                {item.type === 'VIDEO' && getYoutubeThumbnail(item.url) ? (
                                                    <img 
                                                        src={getYoutubeThumbnail(item.url)!} 
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center ${getColor(item.type)}`}>
                                                        <Play className="w-6 h-6 fill-current" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100  scale-75 group-hover:scale-100">
                                                        <Play className="w-3 h-3 text-white fill-current" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 py-0.5">
                                                <h4 className="text-[13px] font-black text-[#0F2D1E] line-clamp-2 leading-tight group-hover:text-[#1B6B3A] transition-colors">
                                                    {item.title}
                                                </h4>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-[#1B6B3A] uppercase px-1.5 py-0.5 bg-green-50 rounded border border-green-100">
                                                        {item.subject}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Vidéo</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-20 px-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Video className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Aucune autre vidéo</p>
                                        <p className="text-[10px] text-gray-300 mt-2">Nous ajouterons bientôt plus de contenus pour votre niveau.</p>
                                    </div>
                                )}
                            </div>

                            {relatedVideos.length > 10 && (
                                <button className="w-full py-3 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-100  border border-dashed border-gray-200">
                                    Charger plus de suggestions
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
