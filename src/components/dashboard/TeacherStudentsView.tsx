'use client';

import React, { useState, useMemo } from 'react';
import { 
    Users, 
    Search, 
    Mail, 
    MoreVertical,
    TrendingUp,
    TrendingDown,
    Award,
    Clock,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';

const classStudents = [
    {
        id: '1',
        fullName: 'Abdoulaye Diallo',
        email: 'a.diallo@student.gn',
        level: 'Terminale SM',
        average: 16.5,
        progress: '+1.2',
        status: 'top',
        avatar: null
    },
    {
        id: '2',
        fullName: 'Mariama Sylla',
        email: 'm.sylla@student.gn',
        level: 'Terminale SM',
        average: 14.2,
        progress: '-0.5',
        status: 'stable',
        avatar: null
    },
    {
        id: '3',
        fullName: 'Moussa Camara',
        email: 'm.camara@student.gn',
        level: 'Terminale SM',
        average: 11.8,
        progress: '+2.1',
        status: 'rising',
        avatar: null
    },
    {
        id: '4',
        fullName: 'Fatoumata Barry',
        email: 'f.barry@student.gn',
        level: '12ème SE',
        average: 15.1,
        progress: '+0.8',
        status: 'top',
        avatar: null
    },
    {
        id: '5',
        fullName: 'Amadou Bah',
        email: 'a.bah@student.gn',
        level: 'Terminale SE',
        average: 13.5,
        progress: '+0.5',
        status: 'stable',
        avatar: null
    },
    {
        id: '6',
        fullName: 'Kadiatou Sow',
        email: 'k.sow@student.gn',
        level: '11ème Année',
        average: 9.8,
        progress: '-1.2',
        status: 'falling',
        avatar: null
    },
    {
        id: '7',
        fullName: 'Ibrahima Kourouma',
        email: 'i.kourouma@student.gn',
        level: 'Terminale SM',
        average: 15.8,
        progress: '+1.5',
        status: 'rising',
        avatar: null
    },
    {
        id: '8',
        fullName: 'Aissatou Diallo',
        email: 'ai.diallo@student.gn',
        level: '12ème SE',
        average: 12.0,
        progress: '0.0',
        status: 'stable',
        avatar: null
    }
];

export const TeacherStudentsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('Toutes les classes');
    const [sortOption, setSortOption] = useState('Meilleures moyennes');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Filtering & Sorting Logic
    const filteredAndSortedStudents = useMemo(() => {
        let result = [...classStudents].filter(student => {
            const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  student.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesClass = filterClass === 'Toutes les classes' || student.level === filterClass;
            return matchesSearch && matchesClass;
        });

        if (sortOption === 'Meilleures moyennes') {
            result.sort((a, b) => b.average - a.average);
        } else if (sortOption === 'En progression') {
            result.sort((a, b) => parseFloat(b.progress) - parseFloat(a.progress));
        } else if (sortOption === 'En difficulté') {
            result.sort((a, b) => a.average - b.average);
        }

        return result;
    }, [searchTerm, filterClass, sortOption]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
    const paginatedStudents = filteredAndSortedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Export Logic
    const handleExportCSV = () => {
        const headers = ['Nom', 'Email', 'Classe', 'Moyenne', 'Progression'];
        const csvContent = [
            headers.join(','),
            ...filteredAndSortedStudents.map(s => `"${s.fullName}","${s.email}","${s.level}","${s.average}","${s.progress}"`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "suivi_eleves.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAction = (message: string) => {
        // En vrai, on utiliserait un Toast ici.
        alert(message);
    };
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E]">Suivi des Élèves</h2>
                    <p className="text-gray-500 font-medium text-sm mt-1">Analysez la progression de vos élèves et identifiez ceux qui ont besoin d'aide.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-white text-[#0F2D1E] border border-gray-200 px-6 py-3.5 rounded-lg font-bold text-sm  hover:bg-gray-50 "
                    >
                        Exporter (CSV)
                    </button>
                    <button 
                        onClick={() => handleAction("Ouverture de la fenêtre de messagerie groupée...")}
                        className="flex items-center gap-2 bg-[#1B6B3A] text-white px-6 py-3 rounded-lg font-bold text-sm  shadow-[#1B6B3A]/20  active:scale-[0.98] "
                    >
                        Contacter la classe
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un élève..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-[#1B6B3A]/40 outline-none text-sm  font-medium"
                    />
                </div>
                <select 
                    value={filterClass}
                    onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1); }}
                    className="w-full md:w-48 px-4 py-3 rounded-lg bg-white border border-gray-200 text-sm font-bold text-[#0F2D1E] outline-none cursor-pointer"
                >
                    <option>Toutes les classes</option>
                    <option>Terminale SM</option>
                    <option>Terminale SE</option>
                    <option>12ème SE</option>
                    <option>11ème Année</option>
                </select>
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full md:w-48 px-4 py-3 rounded-lg bg-white border border-gray-200 text-sm font-bold text-[#0F2D1E] outline-none cursor-pointer"
                >
                    <option>Meilleures moyennes</option>
                    <option>En progression</option>
                    <option>En difficulté</option>
                </select>
            </div>

            {/* Students Grid/Table */}
            <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Élève</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classe</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Moyenne</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Progression</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 pb-24">
                            {paginatedStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        Aucun élève trouvé correspondant à vos critères.
                                    </td>
                                </tr>
                            ) : paginatedStudents.map((student, index) => (
                                <motion.tr 
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-emerald-50/10 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#E8F5EE] border-2 border-white  flex items-center justify-center text-[#1B6B3A]">
                                                {student.avatar ? (
                                                    <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#0F2D1E]">{student.fullName}</p>
                                                <p className="text-[11px] font-medium text-gray-400">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-500">{student.level}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-lg font-black ${
                                                    student.average >= 15 ? 'text-emerald-600' : student.average >= 12 ? 'text-blue-600' : 'text-orange-500'
                                                }`}>
                                                    {student.average}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">/20</span>
                                            </div>
                                            {student.average >= 15 && (
                                                <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-tighter">
                                                    <Award className="w-2.5 h-2.5" />
                                                    Excellent
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${
                                            student.progress.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {student.progress.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {student.progress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 relative">
                                            <a 
                                                href={`mailto:${student.email}`}
                                                className="p-2 text-gray-400 hover:text-[#1B6B3A] hover:bg-[#E8F5EE] rounded-lg " 
                                                title="Contacter par email"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                            <button 
                                                onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                                                className={`p-2 rounded-lg  ${
                                                    activeDropdown === student.id ? 'text-[#0F2D1E] bg-gray-100' : 'text-gray-400 hover:text-[#0F2D1E] hover:bg-gray-100'
                                                }`}
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {/* Dropdown actions */}
                                            {activeDropdown === student.id && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg  py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                    <button onClick={() => { handleAction(`Voir le profil de ${student.fullName}`); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B6B3A] transition-colors">Voir le profil complet</button>
                                                    <button onClick={() => { handleAction(`Envoyer un rapport à ${student.fullName}`); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1B6B3A] transition-colors">Envoyer un bulletin</button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-gray-400">
                        Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedStudents.length)} à {Math.min(currentPage * itemsPerPage, filteredAndSortedStudents.length)} sur {filteredAndSortedStudents.length} élèves
                    </p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-black text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent "
                        >
                            Précédent
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-4 py-2 rounded-lg bg-[#1B6B3A] text-white text-xs font-black  shadow-[#1B6B3A]/20 disabled:scale-100 disabled:opacity-50  active:scale-[0.98] "
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>

            {/* Help Card */}
            <div className="bg-[#0F2D1E] rounded-lg p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-black">Besoin d'aide pour vos élèves ?</h3>
                        <p className="text-white/60 text-sm font-medium">Consultez nos ressources sur la remédiation pédagogique pour accompagner les élèves en difficulté.</p>
                    </div>
                    <button 
                        onClick={() => handleAction("Redirection vers la base de connaissances pédagogiques...")}
                        className="px-8 py-4 bg-emerald-500 text-white rounded-lg font-black text-sm uppercase tracking-widest hover:bg-emerald-400   shadow-emerald-500/20"
                    >
                        Voir les ressources
                    </button>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl -ml-24 -mb-24" />
            </div>
        </div>
    );
};
