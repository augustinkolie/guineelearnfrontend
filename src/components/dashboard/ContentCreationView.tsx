'use client';

import React, { useState, useRef } from 'react';
import { 
    Layout, 
    X, 
    GraduationCap, 
    Info, 
    FileText, 
    FileVideo, 
    Link as LinkIcon, 
    Radio, 
    Upload,
    Check,
    CheckCircle2,
    ArrowLeft,
    ChevronRight,
    Monitor,
    Mic,
    Video,
    MessageSquare,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LiveStudio } from './LiveStudio';


interface ContentCreationViewProps {
    onClose?: () => void;
    onSuccess?: (newData: any) => void;
    teacherProfile?: any;
}

export const ContentCreationView = ({ onClose, onSuccess, teacherProfile }: ContentCreationViewProps) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [contentType, setContentType] = useState<'FILE' | 'VIDEO' | 'LINK' | 'LIVE' | null>(null);
    const [isLiveStarted, setIsLiveStarted] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Debug logging
    console.log('TeacherProfile:', teacherProfile);
    console.log('Subjects from profile:', teacherProfile?.subjects);
    
    // Générer les niveaux basés sur les matières de l'enseignant
    const getLevelsForSubject = (subjects: string) => {
        const subjectLevels: { [key: string]: string[] } = {
            'Mathématiques': ['10ème Année', '11ème SM', '12ème SM', 'Terminale SM'],
            'Physique': ['10ème Année', '11ème SM', '12ème SE', 'Terminale SM'],
            'Chimie': ['10ème Année', '11ème SM', '12ème SE', 'Terminale SM'],
            'SVT': ['10ème Année', '11ème SM', '12ème SE', 'Terminale SM'],
            'Français': ['10ème Année', '11ème L', '12ème L', 'Terminale L'],
            'Anglais': ['10ème Année', '11ème L', '12ème L', 'Terminale L'],
            'Histoire-Géographie': ['10ème Année', '11ème L', '12ème L', 'Terminale L'],
            'Philosophie': ['12ème L', 'Terminale L'],
            'Informatique': ['10ème Année', '11ème SM', '12ème SM', 'Terminale SM'],
        };
        
        console.log('Input subjects:', subjects);
        
        // Si l'enseignant a plusieurs matières, combiner les niveaux uniques
        const subjectList = subjects?.split(',').map(s => s.trim()).filter(s => s.length > 0) || [];
        console.log('Parsed subject list:', subjectList);
        
        const allLevels = new Set<string>();
        
        subjectList.forEach(subject => {
            const levels = subjectLevels[subject];
            console.log(`Subject "${subject}" levels:`, levels);
            if (levels) {
                levels.forEach(level => allLevels.add(level));
            } else {
                console.log(`Subject "${subject}" not found in subjectLevels`);
            }
        });
        
        console.log('All available levels:', Array.from(allLevels));
        
        // Si aucune matière spécifiée, retourner un tableau vide
        if (allLevels.size === 0) {
            console.log('No levels found, returning empty array');
            return [];
        }
        
        return Array.from(allLevels).sort();
    };
    
    const availableLevels = getLevelsForSubject(teacherProfile?.subjects || '');
    console.log('Final availableLevels:', availableLevels);
    
    const [createForm, setCreateForm] = useState({
        title: '',
        level: availableLevels.length > 0 ? availableLevels[0] : '',
        type: 'course',
        sourceLink: '',
        liveDate: '',
        liveTime: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step === 1) {
            setStep(2);
            return;
        }

        if (step === 3) {
            if (contentType === 'LIVE') {
                setIsLiveStarted(true);
                return;
            }

            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

            // Prepare data for the parent
            const newData = {
                id: Math.random().toString(36).substr(2, 9),
                title: createForm.title,
                type: contentType,
                subject: 'Général',
                level: createForm.level || 'Terminale SM',
                date: formattedDate,
                lastUpdate: formattedDate,
                status: 'PUBLISHED',
                students: 0,
                views: 0,
                downloads: 0,
                image: contentType === 'VIDEO' ? '/images/physics_course_thumbnail_1775610601650.png' : '/images/math_course_thumbnail_1775610573519.png'
            };

            if (onSuccess) onSuccess(newData);
            if (onClose) onClose();
            else router.push('/dashboard/teacher-courses');
        }
    };

    if (isLiveStarted) {
        return <LiveStudio title={createForm.title} onClose={() => {
            setIsLiveStarted(false);
            if (onClose) onClose();
        }} />;
    }

    return (
        <div className="flex flex-col">
            {/* Modal Header inside the view */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-[#1B6B3A]">
                        <Layout className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#0F2D1E] leading-none">Nouveau Contenu</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                            Étape {step} sur 3
                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                            {step === 1 ? 'Informations' : step === 2 ? 'Support' : 'Configuration'}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#0F2D1E]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-50 rounded-full mb-8 overflow-hidden">
                <motion.div 
                    className="h-full bg-[#1B6B3A]"
                    initial={{ width: '33.3%' }}
                    animate={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
                />
            </div>

            <div className="flex-1">
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du contenu</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Ex: Nombres Complexes"
                                            className="w-full px-4 py-4 rounded-lg bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#1B6B3A]/20 outline-none text-sm font-bold text-[#0F2D1E]  placeholder:text-gray-300"
                                            value={createForm.title}
                                            onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Niveau scolaire</label>
                                        {availableLevels.length > 0 ? (
                                            <div className="relative">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <select 
                                                    required
                                                    className="w-full pl-11 pr-4 py-4 rounded-lg bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#1B6B3A]/20 outline-none text-sm font-bold text-[#0F2D1E]  appearance-none cursor-pointer"
                                                    value={createForm.level}
                                                    onChange={(e) => setCreateForm({...createForm, level: e.target.value})}
                                                >
                                                    <option value="">Sélectionner</option>
                                                    {availableLevels.map((level) => (
                                                        <option key={level} value={level}>{level}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                <p className="text-xs font-bold text-orange-600">
                                                    Aucune matière définie dans votre profil. Veuillez contacter l'administrateur pour configurer vos matières.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de contenu</label>
                                    <div className="flex bg-gray-50 p-1.5 rounded-lg gap-1.5">
                                        <button 
                                            type="button"
                                            onClick={() => setCreateForm({...createForm, type: 'course'})}
                                            className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest  ${createForm.type === 'course' ? 'bg-white  text-[#1B6B3A]' : 'text-gray-400'}`}
                                        >
                                            Cours
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setCreateForm({...createForm, type: 'quiz'})}
                                            className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest  ${createForm.type === 'quiz' ? 'bg-white  text-[#1B6B3A]' : 'text-gray-400'}`}
                                        >
                                            Quiz
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-[#E8F5EE] p-5 rounded-lg flex gap-4 border border-[#1B6B3A]/10 mt-2">
                                    <div className="w-10 h-10 rounded-lg bg-[#1B6B3A] text-white flex items-center justify-center shrink-0">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-bold text-[#1B6B3A] leading-relaxed">
                                        Remplissez les informations de base. Vous choisirez ensuite votre support.
                                    </p>
                                </div>
                            </motion.div>
                        ) : step === 2 ? (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'FILE', label: 'Fichiers', desc: 'PDF, Doc', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
                                        { id: 'VIDEO', label: 'Vidéos', desc: 'MP4', icon: FileVideo, color: 'text-blue-500', bg: 'bg-blue-50' },
                                        { id: 'LINK', label: 'Liens', desc: 'YouTube', icon: LinkIcon, color: 'text-red-500', bg: 'bg-red-50' },
                                        { id: 'LIVE', label: 'Direct', desc: 'Classe', icon: Radio, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => { setContentType(opt.id as any); setStep(3); }}
                                            className="flex flex-col items-start p-4 rounded-lg border-2 border-transparent bg-gray-50 hover:bg-white hover:border-[#1B6B3A]/20 hover: group "
                                        >
                                            <div className={`w-10 h-10 rounded-lg ${opt.bg} ${opt.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform `}>
                                                <opt.icon className="w-5 h-5" />
                                            </div>
                                            <p className="text-[12px] font-black text-[#0F2D1E]">{opt.label}</p>
                                            <p className="text-[9px] font-bold text-gray-400 mt-0.5">{opt.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-5"
                            >
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#E8F5EE] rounded-full">
                                    {(() => {
                                        const Icon = contentType === 'FILE' ? FileText : contentType === 'VIDEO' ? FileVideo : contentType === 'LINK' ? LinkIcon : Radio;
                                        return <Icon className="w-2.5 h-2.5 text-[#1B6B3A]" />;
                                    })()}
                                    <span className="text-[8px] font-black text-[#1B6B3A] uppercase tracking-widest">{contentType}</span>
                                </div>

                                {contentType === 'FILE' || contentType === 'VIDEO' ? (
                                    <div className="space-y-4">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            accept={contentType === 'FILE' ? '.pdf,.doc,.docx,.ppt,.pptx' : 'video/*'}
                                        />
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4  cursor-pointer ${
                                                selectedFile 
                                                ? 'border-emerald-500 bg-emerald-50/30' 
                                                : 'border-gray-200 bg-gray-50/50 hover:border-[#1B6B3A]/20 hover:bg-[#E8F5EE]/10'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center  ${
                                                selectedFile ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-300'
                                            }`}>
                                                {selectedFile ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                                            </div>
                                            <div className="text-center px-4">
                                                <p className="text-[10px] font-black text-[#0F2D1E]">
                                                    {selectedFile ? selectedFile.name : 'Importer le fichier'}
                                                </p>
                                                <p className="text-[8px] font-bold text-gray-400 mt-0.5">
                                                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : (contentType === 'FILE' ? 'PDF, DOC, PPT jusqu\'à 20MB' : 'MP4, MOV jusqu\'à 100MB')}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedFile && (
                                            <button 
                                                onClick={() => setSelectedFile(null)}
                                                className="w-full py-2 text-[8px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-lg "
                                            >
                                                Supprimer le fichier
                                            </button>
                                        )}
                                    </div>
                                ) : contentType === 'LINK' ? (
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Lien de la ressource</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                            <input 
                                                required
                                                type="url" 
                                                placeholder="https://..."
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#1B6B3A]/20 outline-none text-xs font-bold text-[#0F2D1E] "
                                                value={createForm.sourceLink}
                                                onChange={(e) => setCreateForm({...createForm, sourceLink: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                ) : contentType === 'LIVE' ? (
                                    <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-100/50 flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0  shadow-emerald-500/10">
                                            <Radio className="w-5 h-5 animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#1B6B3A]">Session Direct</p>
                                            <p className="text-[10px] font-bold text-emerald-600/70 mt-0.5 leading-relaxed">
                                                Studio interne style Google Meet.
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Buttons */}
                    <div className="flex gap-3 pt-5 mt-8 border-t border-gray-50">
                        {step > 1 && (
                            <button 
                                type="button"
                                onClick={() => setStep(step === 3 ? 2 : 1)}
                                className="px-8 py-4 bg-gray-50 text-gray-400 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-gray-100 "
                            >
                                Retour
                            </button>
                        )}
                        <button 
                            type="submit"
                            className={`flex-1 py-4 bg-[#1B6B3A] text-white rounded-lg font-black text-xs uppercase tracking-widest  shadow-[#1B6B3A]/20 hover:bg-[#155230]  ${step === 2 ? 'hidden' : ''}`}
                        >
                            {step === 3 ? (contentType === 'LIVE' ? 'Lancer le Direct' : 'Publier') : 'Continuer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
