'use client';

import React, { useState } from 'react';
import { 
    FileText, 
    Upload, 
    Search, 
    Filter,
    MoreVertical,
    Eye,
    Download,
    Trash2,
    FileVideo,
    Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentCreationView } from './ContentCreationView';

const INITIAL_RESOURCES = [
    {
        id: '1',
        title: 'Guide de Révision : Mécanique',
        type: 'PDF',
        subject: 'Physique',
        downloads: 45,
        views: 120,
        date: '2026-04-10'
    },
    {
        id: '2',
        title: 'Cours Vidéo : Intégrales',
        type: 'VIDEO',
        subject: 'Mathématiques',
        downloads: 0,
        views: 312,
        date: '2026-04-12'
    },
    {
        id: '3',
        title: 'Série d\'exercices : Optique',
        type: 'PDF',
        subject: 'Physique',
        downloads: 89,
        views: 156,
        date: '2026-04-14'
    }
];

export const TeacherContentView = ({ profile }: { profile?: any }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [resources, setResources] = useState(INITIAL_RESOURCES);
    
    console.log('TeacherContentView - Profile received:', profile);

    const handleResourceCreated = (newData: any) => {
        setResources([newData, ...resources]);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E]">Contenus Pédagogiques</h2>
                    <p className="text-gray-500 font-medium text-sm mt-1">Organisez vos ressources, livres et supports de cours.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-[#1B6B3A] text-white px-6 py-3 rounded-lg font-bold text-sm  shadow-[#1B6B3A]/20  active:scale-[0.98]  group"
                >
                    <Upload className="w-5 h-5 group- transition-transform duration-300" />
                    Importer une ressource
                </button>
            </div>

            {/* Premium Creation Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-lg  overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 md:p-8">
                                <ContentCreationView 
                                    onClose={() => setIsCreateModalOpen(false)} 
                                    onSuccess={handleResourceCreated}
                                    teacherProfile={profile}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 ">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une ressource..."
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-[#1B6B3A]/40 outline-none text-sm  font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 ">
                        <Filter className="w-4 h-4" />
                        Filtres
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0F2D1E] text-white font-bold text-sm hover:bg-black ">
                        <Library className="w-4 h-4" />
                        Mes Dossiers
                    </button>
                </div>
            </div>

            {/* Resources List */}
            <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom du fichier</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Matière</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stats</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {resources.map((res, index) => (
                                <motion.tr 
                                    key={res.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                res.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                                {res.type === 'PDF' ? <FileText className="w-5 h-5" /> : <FileVideo className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors">{res.title}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">{res.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-[#1B6B3A] bg-[#E8F5EE] px-2 py-1 rounded-md">
                                            {res.subject}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="text-center">
                                                <p className="text-xs font-black text-[#0F2D1E]">{res.views}</p>
                                                <p className="text-[8px] font-black text-gray-400 uppercase">Vues</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black text-[#0F2D1E]">{res.downloads}</p>
                                                <p className="text-[8px] font-black text-gray-400 uppercase">DL</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-gray-500">{res.date}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg " title="Voir">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-[#1B6B3A] hover:bg-emerald-50 rounded-lg " title="Télécharger">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg " title="Supprimer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="h-4 w-px bg-gray-100 mx-1" />
                                            <button className="p-2 text-gray-400 hover:text-[#0F2D1E] hover:bg-gray-100 rounded-lg ">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State / Upload Area */}
                <div className="p-12 border-t border-gray-50 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-[#0F2D1E]">Déposez vos fichiers ici</p>
                        <p className="text-xs font-medium text-gray-400 mt-1">PDF, MP4, JPEG jusqu'à 50MB</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-sm font-black text-[#1B6B3A] hover:underline underline-offset-4"
                    >
                        Parcourir les fichiers
                    </button>
                </div>
            </div>
        </div>
    );
};
