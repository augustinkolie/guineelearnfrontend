'use client';

import React, { useEffect, useState } from 'react';
import { 
    FileText, 
    Video, 
    Download, 
    Search, 
    Filter,
    Folder,
    MoreVertical,
    CheckCircle2,
    Clock,
    X,
    ExternalLink,
    Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiCall } from '@/utils/api';

const categories = ['Tous', 'Mathématiques', 'Physique', 'Chimie', 'Economie', 'Philosophie', 'Français', 'Anglais'];
const types = ['Tous', 'VIDEO', 'PDF', 'COURSE'];

export const ResourcesView = () => {
    const [resources, setResources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [selectedType, setSelectedType] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResource, setSelectedResource] = useState<any>(null);

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let url = '/resources';
                const params = new URLSearchParams();
                if (selectedCategory !== 'Tous') params.append('subject', selectedCategory);
                if (selectedType !== 'Tous') params.append('type', selectedType);
                
                const queryString = params.toString();
                if (queryString) url += `?${queryString}`;

                console.log('Fetching resources from:', url);
                
                const token = localStorage.getItem('token');
                const data = await apiCall(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setResources(data);
            } catch (error: any) {
                console.error('Error fetching resources:', error);
                setError(error.message || "Erreur lors du chargement des ressources.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, [selectedCategory, selectedType]);

    const filteredResources = resources.filter(res => 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return Video;
            case 'PDF': return FileText;
            case 'COURSE': return Folder;
            default: return FileText;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'VIDEO': return 'text-blue-500';
            case 'PDF': return 'text-red-500';
            case 'COURSE': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Mes Ressources</h2>
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
                            className="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl w-fit overflow-x-auto max-w-full">
                    {categories.map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                selectedCategory === cat 
                                ? 'bg-white text-[#1B6B3A] shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl w-fit">
                    {types.map((t) => (
                        <button 
                            key={t}
                            onClick={() => setSelectedType(t)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedType === t 
                                ? 'bg-white text-[#1B6B3A] shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resources List Container */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-gray-400" />
                        <h3 className="text-sm font-black text-[#0F2D1E] uppercase tracking-widest">Documents disponibles</h3>
                    </div>
                    <div className="text-xs font-bold text-gray-400">{filteredResources.length} fichiers trouvés</div>
                </div>

                {isLoading ? (
                    <div className="p-20 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B6B3A]"></div>
                    </div>
                ) : error ? (
                    <div className="p-20 text-center">
                        <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 max-w-md mx-auto">
                            <h4 className="font-black uppercase tracking-widest text-sm mb-2">Erreur</h4>
                            <p className="font-medium text-sm">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all"
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom du fichier</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Matière</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Format</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Filière</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredResources.map((item, index) => {
                                    const Icon = getIcon(item.type);
                                    return (
                                        <motion.tr 
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-[#E8F5EE]/30 transition-colors"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 bg-white rounded-xl shadow-sm border border-gray-50 group-hover:border-[#1B6B3A]/20 transition-all ${getColor(item.type)}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#0F2D1E] line-clamp-1">{item.title}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">{item.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                                    {item.subject}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-gray-400">{item.type}</td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-medium text-gray-400 capitalize">
                                                    {item.track === 'SM' ? 'Sciences Mathématiques' : 
                                                     item.track === 'SE' ? 'Sciences Expérimentales' : 
                                                     item.track === 'SS' ? 'Sciences Sociales' : 
                                                     item.track === 'GENERAL' ? 'Tronc Commun' : item.track || 'Général'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.type === 'PDF' && (
                                                        <a 
                                                            href={item.url} 
                                                            download
                                                            className="p-2 text-gray-400 hover:text-[#1B6B3A] hover:bg-[#E8F5EE] rounded-lg transition-all"
                                                            title="Télécharger"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <button 
                                                        onClick={() => setSelectedResource(item)}
                                                        className="px-4 py-2 bg-[#1B6B3A] text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#155230] transition-all flex items-center gap-2"
                                                    >
                                                        {item.type === 'VIDEO' ? <Play className="w-3 h-3 fill-current" /> : item.type === 'PDF' ? <FileText className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                                                        {item.type === 'PDF' ? 'Consulter' : 'Ouvrir'}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Resource Viewer Modal */}
            <AnimatePresence>
                {selectedResource && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedResource(null)}
                            className="absolute inset-0 bg-[#0F2D1E]/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-[#0F2D1E] tracking-tight">{selectedResource.title}</h3>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">{selectedResource.subject} • {selectedResource.type}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedResource(null)}
                                    className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-gray-400"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                                {selectedResource.type === 'VIDEO' ? (
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
                                        <iframe 
                                            src={selectedResource.url} 
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : selectedResource.type === 'PDF' ? (
                                    <div className="flex flex-col h-full space-y-4">
                                        <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative min-h-[500px]">
                                            <iframe 
                                                src={`${selectedResource.url}#toolbar=0`} 
                                                className="w-full h-full border-none"
                                                title="Lecteur PDF"
                                            ></iframe>
                                            {/* Overlay d'aide si l'iframe est bloqué */}
                                            <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-sm text-center">
                                                <p className="text-gray-600 font-bold">Si le document n'apparaît pas, utilisez le bouton de téléchargement ci-dessous.</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center pb-4">
                                            <a 
                                                href={selectedResource.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                download
                                                className="px-8 py-3 bg-[#1B6B3A] text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-3"
                                            >
                                                <Download className="w-5 h-5" />
                                                Télécharger le Livre Complet (PDF)
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm max-w-4xl mx-auto mb-10">
                                        <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed" 
                                             dangerouslySetInnerHTML={{ __html: selectedResource.content || '' }} 
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
