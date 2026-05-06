'use client';

import React, { useState } from 'react';
import { 
    User, 
    Image as ImageIcon, 
    Video, 
    Calendar, 
    Newspaper, 
    Users, 
    Bookmark, 
    Hash, 
    Gamepad2, 
    MoreHorizontal,
    ThumbsUp,
    MessageCircle,
    Share2,
    Send,
    Plus,
    Award,
    Briefcase,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Smile,
    MapPin,
    ExternalLink,
    ChevronDown,
    Camera,
    Pencil,
    ShieldCheck,
    Globe,
    Link2,
    ArrowLeft,
    X,
    Check,
    BookOpen,
    GraduationCap,
    Trophy,
    Clock,
    FileText,
    Heart,
    MessageSquare,
    Save,
    School,
    MapPinned,
    LayoutGrid,
    History,
    SearchIcon,
    FileCode,
    FileImage,
    FileVideo,
    Download,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiCall } from '@/utils/api';

interface ProfileViewProps {
    user: any;
    profile: any;
}

export const ProfileView = ({ user, profile }: ProfileViewProps) => {
    const [followedUsers, setFollowedUsers] = useState<string[]>([]);
    const [classmates, setClassmates] = useState<any[]>([]);
    const [isLoadingClassmates, setIsLoadingClassmates] = useState(false);
    const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
    const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
    
    // Auto-dismiss notification
    React.useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Fetch classmates
    React.useEffect(() => {
        const fetchClassmates = async () => {
            setIsLoadingClassmates(true);
            try {
                const token = localStorage.getItem('token');
                const response = await apiCall('/user/classmates', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setClassmates(response);
            } catch (err) {
                console.error("Failed to fetch classmates:", err);
            } finally {
                setIsLoadingClassmates(false);
            }
        };
        fetchClassmates();
    }, []);
    
    const [objectives, setObjectives] = useState(profile?.bio || "Obtenir la mention 'Très Bien' au Baccalauréat 2026. Maîtriser les dérivées et intégrales avant la fin du trimestre.");
    
    // Skills State
    const [skills, setSkills] = useState(profile?.skills || ["Mathématiques", "Physique", "Chimie", "Informatique"]);
    const [newSkill, setNewSkill] = useState("");

    // Intro state
    const [introData, setIntroData] = useState({
        fullName: user?.fullName || "",
        headline: `${profile?.schoolLevel || 'Niveau non défini'} à ${profile?.schoolName || 'Établissement non défini'}`,
        school: profile?.schoolName || "",
        location: profile?.city || ""
    });

    const [stats, setStats] = useState({
        courses: profile?.courseCount || 0,
        exams: profile?.examCount || 0,
        studyTime: profile?.studyHours || 0
    });

    const saveProfileChanges = async (updatedData: any) => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall('/user/profile', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });
            setNotification({ msg: "Profil mis à jour avec succès !", type: 'success' });
        } catch (err: any) {
            console.error("Erreur lors de la sauvegarde du profil:", err);
            setNotification({ msg: err.message || "Erreur lors de la sauvegarde.", type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveIntro = async () => {
        await saveProfileChanges({
            fullName: introData.fullName,
            schoolName: introData.school,
            city: introData.location
        });
        setIsIntroModalOpen(false);
    };

    const handleSaveObjectives = async () => {
        await saveProfileChanges({ objectives: objectives });
        setIsObjectiveModalOpen(false);
    };

    const handleAddSkill = async () => {
        if (newSkill && !skills.includes(newSkill)) {
            const updatedSkills = [...skills, newSkill];
            setSkills(updatedSkills);
            setNewSkill("");
            await saveProfileChanges({ skills: updatedSkills });
        }
    };

    const handleRemoveSkill = async (skillToRemove: string) => {
        const updatedSkills = skills.filter(s => s !== skillToRemove);
        setSkills(updatedSkills);
        await saveProfileChanges({ skills: updatedSkills });
    };

    const toggleFollow = (userName: string) => {
        setFollowedUsers(prev => 
            prev.includes(userName) ? prev.filter(u => u !== userName) : [...prev, userName]
        );
    };

    return (
        <div className="min-h-screen bg-[#F3F2EF] -m-6 p-6 font-sans antialiased text-[#191919] relative">
            {/* Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-24 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-lg  border ${
                            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="font-bold text-sm">{notification.msg}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="max-w-[1128px] mx-auto">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* --- MAIN PROFILE CONTENT (col-span-8) --- */}
                    <div className="md:col-span-8 space-y-2">
                        {/* Full Profile Header Card */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden  relative">
                            {/* Banner */}
                            <div className="h-48 bg-gradient-to-r from-[#1B6B3A]/20 to-[#0F2D1E]/10 relative group">
                                <button className="absolute top-4 right-4 p-2 bg-white rounded-full  text-[#1B6B3A] hover:bg-gray-50 transition-colors">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Avatar & Content */}
                            <div className="px-4 md:px-6 pb-6 relative">
                                <div className="flex justify-between items-start">
                                    {/* Avatar */}
                                    <div className="relative w-28 h-28 md:w-40 md:h-40 -mt-16 md:-mt-24 mb-4 flex-shrink-0">
                                        <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-white ">
                                            {user?.avatar ? (
                                                <img src={user.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <User className="w-10 h-10 md:w-16 md:h-16 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-2 md:mt-4">
                                        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-900 hover:text-[#1B6B3A] cursor-pointer group/school">
                                            <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 bg-[#E8F5EE] rounded flex items-center justify-center text-[#1B6B3A] group-hover/school:bg-[#1B6B3A] group-hover/school:text-white transition-colors">
                                                <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                            <span className="truncate max-w-[100px] sm:max-w-[150px] group-hover/school:underline">{introData.school}</span>
                                        </div>
                                        <button 
                                            onClick={() => setIsIntroModalOpen(true)}
                                            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors ml-1 md:ml-4"
                                        >
                                            <Pencil className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-3">
                                        <h2 className="text-xl md:text-2xl font-bold truncate">{introData.fullName}</h2>
                                        <button className="flex w-fit items-center gap-1.5 px-3 py-1.5 md:py-1 rounded-full border border-[#1B6B3A] text-[#1B6B3A] text-xs md:text-sm font-bold hover:bg-[#E8F5EE] transition-colors">
                                            <ShieldCheck className="w-4 h-4 shrink-0" /> Certifier mon parcours
                                        </button>
                                    </div>
                                    <p className="text-sm md:text-base text-gray-800 mt-2 sm:mt-1">{introData.headline}</p>
                                    <div className="flex flex-wrap items-center gap-1 text-xs md:text-sm text-gray-500 mt-1">
                                        <span>{introData.location}</span>
                                        <span className="mx-1 hidden sm:inline">•</span>
                                        <button className="text-[#1B6B3A] font-bold hover:underline w-full sm:w-auto text-left">Contact scolaire</button>
                                    </div>
                                    <button className="text-[#1B6B3A] text-xs md:text-sm font-bold mt-2 hover:underline block">21 camarades d'études</button>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <button 
                                            onClick={() => setIsObjectiveModalOpen(true)}
                                            className="px-4 py-2 md:py-1.5 bg-[#1B6B3A] text-white rounded-full font-bold text-xs md:text-[14px] hover:bg-[#0F2D1E] transition-colors  shadow-[#1B6B3A]/20"
                                        >
                                            Mes objectifs
                                        </button>
                                        <button 
                                            onClick={() => setIsSkillsModalOpen(true)}
                                            className="px-4 py-2 md:py-1.5 border border-[#1B6B3A] text-[#1B6B3A] rounded-full font-bold text-xs md:text-[14px] hover:bg-[#E8F5EE] transition-colors"
                                        >
                                            Ajouter une compétence
                                        </button>
                                        <button 
                                            onClick={() => setIsAcademicModalOpen(true)}
                                            className="px-4 py-2 md:py-1.5 border border-gray-500 text-gray-500 rounded-full font-bold text-xs md:text-[14px] hover:bg-gray-50 transition-colors"
                                        >
                                            Parcours académique
                                        </button>
                                        <button 
                                            onClick={() => setIsLibraryModalOpen(true)}
                                            className="px-4 py-2 md:py-1.5 border border-gray-500 text-gray-500 rounded-full font-bold text-xs md:text-[14px] hover:bg-gray-50 transition-colors"
                                        >
                                            Bibliothèque
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Educational Status Cards */}
                            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 relative group cursor-pointer hover:bg-emerald-100 transition-colors">
                                    <button className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <h4 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-[#1B6B3A]" /> Préparation aux Examens / Concours
                                    </h4>
                                    <p className="text-[12px] text-gray-700 mt-1">Sujets : Mathématiques, Physique, Chimie</p>
                                    <button className="text-[#1B6B3A] text-[12px] font-bold mt-1 hover:underline">Voir mes fiches</button>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 relative group cursor-pointer hover:bg-blue-100 transition-colors">
                                    <button className="absolute top-2 right-2 p-1 text-gray-400">
                                        <X className="w-4 h-4" />
                                    </button>
                                    <h4 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-600" /> Tutorat & Entraide
                                    </h4>
                                    <p className="text-[12px] text-gray-700 mt-1">Disponible pour aider les élèves de 10ème année.</p>
                                    <button className="text-blue-600 text-[12px] font-bold mt-2 hover:underline">Commencer</button>
                                </div>
                            </div>
                        </div>

                        {/* Academic Progress Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 ">
                            <h3 className="text-lg font-bold mb-1">Progression Académique</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><Users className="w-4 h-4" /> Privé pour vous</p>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-1 font-bold text-lg text-[#1B6B3A]">
                                        <BookOpen className="w-5 h-5" /> {stats.courses}
                                    </div>
                                    <p className="text-sm text-gray-700">Cours terminés</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-1 font-bold text-lg text-emerald-600">
                                        <Trophy className="w-5 h-5" /> {stats.exams}
                                    </div>
                                    <p className="text-sm text-gray-700">Examens réussis</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-1 font-bold text-lg text-orange-500">
                                        <Clock className="w-5 h-5" /> {stats.studyTime}h
                                    </div>
                                    <p className="text-sm text-gray-700">Temps d'étude</p>
                                </div>
                            </div>
                        </div>

                        {/* Skills Display */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 ">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Compétences</h3>
                                <button onClick={() => setIsSkillsModalOpen(true)} className="p-1 hover:bg-gray-100 rounded-full"><Plus className="w-5 h-5 text-[#1B6B3A]" /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-[#F3F2EF] rounded-full text-sm font-bold text-gray-700 border border-gray-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT SIDEBAR --- */}
                    <aside className="md:col-span-4 space-y-2">
                        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 ">
                            <div className="p-4 flex items-start justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex-1">
                                    <h4 className="text-base font-bold">Langue d'apprentissage</h4>
                                    <p className="text-sm text-gray-500 mt-1">Français (Principal)</p>
                                </div>
                                <Pencil className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="p-4 flex items-start justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex-1">
                                    <h4 className="text-base font-bold">Portefeuille de Diplômes</h4>
                                    <p className="text-[12px] text-gray-500 mt-1 truncate">Accès aux certificats GuinéeLearn</p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>

                        {/* People You May Know */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden ">
                            <div className="p-4">
                                <h4 className="text-base font-bold mb-4">Élèves de votre option</h4>
                                <div className="space-y-6">
                                    {isLoadingClassmates ? (
                                        <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-[#1B6B3A]" /></div>
                                    ) : classmates.length > 0 ? (
                                        classmates.map((person, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                                    {person.avatar ? (
                                                        <img src={person.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#1B6B3A] font-bold text-lg">
                                                            {person.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[14px] font-bold truncate leading-tight">{person.name}</h5>
                                                    <p className="text-[12px] text-gray-500 line-clamp-2 mt-0.5 leading-tight">{person.desc}</p>
                                                    <button 
                                                        onClick={() => toggleFollow(person.name)}
                                                        className={`mt-2 px-4 py-1 rounded-full border  flex items-center gap-1 text-sm font-bold ${
                                                            followedUsers.includes(person.name) 
                                                                ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' 
                                                                : 'border-[#1B6B3A] text-[#1B6B3A] hover:bg-[#E8F5EE]'
                                                        }`}
                                                    >
                                                        {followedUsers.includes(person.name) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                        {followedUsers.includes(person.name) ? 'Suivi' : 'Étudier ensemble'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">Aucun camarade trouvé dans votre option.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* --- ALL MODALS --- */}
                <AnimatePresence>
                    {/* Objectives Modal */}
                    {isObjectiveModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsObjectiveModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg  w-full max-w-lg overflow-hidden relative z-10">
                                <div className="p-6 border-b flex items-center justify-between">
                                    <h3 className="text-xl font-bold">Mes objectifs de réussite</h3>
                                    <button onClick={() => setIsObjectiveModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
                                </div>
                                <div className="p-6"><textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} rows={5} className="w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-[#1B6B3A] outline-none" placeholder="Ex: Obtenir mon Bac avec mention..." /></div>
                                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                                    <button onClick={() => setIsObjectiveModalOpen(false)} className="px-6 py-2 font-bold text-gray-500">Annuler</button>
                                    <button 
                                        onClick={handleSaveObjectives} 
                                        disabled={isSaving}
                                        className="px-8 py-2 bg-[#1B6B3A] text-white rounded-full font-bold  shadow-[#1B6B3A]/20 flex items-center gap-2"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Enregistrer
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Edit Intro Modal */}
                    {isIntroModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsIntroModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-lg  w-full max-w-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col">
                                <div className="p-4 border-b flex items-center justify-between"><h3 className="text-xl font-bold">Modifier l'introduction</h3><button onClick={() => setIsIntroModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button></div>
                                <div className="p-6 overflow-y-auto space-y-6">
                                    <div className="space-y-4">
                                        <div><label className="block text-sm text-gray-500 mb-1">Prénom / Nom*</label><input type="text" value={introData.fullName} onChange={(e) => setIntroData({...introData, fullName: e.target.value})} className="w-full border border-gray-400 rounded p-2 text-sm focus:ring-2 focus:ring-[#1B6B3A] outline-none" /></div>
                                        <div><label className="block text-sm text-gray-500 mb-1">Slogan*</label><textarea value={introData.headline} onChange={(e) => setIntroData({...introData, headline: e.target.value})} rows={2} className="w-full border border-gray-400 rounded p-2 text-sm focus:ring-2 focus:ring-[#1B6B3A] outline-none resize-none" /></div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t"><h4 className="font-bold text-gray-900">Éducation</h4><div><label className="block text-sm text-gray-500 mb-1">École actuelle*</label><input type="text" value={introData.school} onChange={(e) => setIntroData({...introData, school: e.target.value})} className="w-full border border-gray-400 rounded p-2 text-sm focus:ring-2 focus:ring-[#1B6B3A] outline-none" /></div></div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                                    <button 
                                        onClick={handleSaveIntro} 
                                        disabled={isSaving}
                                        className="px-8 py-2 bg-[#1B6B3A] text-white rounded-full font-bold  shadow-[#1B6B3A]/20 hover:bg-[#0F2D1E]  flex items-center gap-2"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Enregistrer
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Skills Modal */}
                    {isSkillsModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSkillsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg  w-full max-w-lg overflow-hidden relative z-10">
                                <div className="p-6 border-b flex items-center justify-between"><h3 className="text-xl font-bold">Ajouter des compétences</h3><button onClick={() => setIsSkillsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button></div>
                                <div className="p-6 space-y-4">
                                    <div className="flex gap-2">
                                        <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Ex: Algèbre, Anglais, Python..." className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B6B3A]" onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()} />
                                        <button onClick={handleAddSkill} className="px-4 py-2 bg-[#1B6B3A] text-white rounded-lg font-bold">Ajouter</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {skills.map((skill, i) => (
                                            <div key={i} className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-[#1B6B3A] rounded-full text-xs font-bold border border-emerald-100">
                                                {skill} <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Academic History Modal (Timeline) */}
                    {isAcademicModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAcademicModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg  w-full max-w-lg overflow-hidden relative z-10">
                                <div className="p-6 border-b flex items-center justify-between"><h3 className="text-xl font-bold">Parcours académique</h3><button onClick={() => setIsAcademicModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button></div>
                                <div className="p-6 space-y-8 relative before:absolute before:left-9 before:top-10 before:bottom-10 before:w-0.5 before:bg-gray-100">
                                    {[
                                        { year: "2024 - Présent", level: "Terminale SM", school: "Glc", status: "En cours", color: "bg-[#1B6B3A]" },
                                        { year: "2023 - 2024", level: "1ère Année SM", school: "Glc", status: "Terminé", color: "bg-emerald-400" },
                                        { year: "2022 - 2023", level: "10ème Année", school: "Collège Labé", status: "Brevet Obtenu", color: "bg-blue-400" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 relative z-10">
                                            <div className={`w-6 h-6 rounded-full ${item.color} border-4 border-white  flex-shrink-0 mt-1`} />
                                            <div>
                                                <p className="text-xs font-bold text-gray-400">{item.year}</p>
                                                <h4 className="font-bold text-gray-900">{item.level}</h4>
                                                <p className="text-sm text-gray-600">{item.school}</p>
                                                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 font-bold">{item.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Library Modal (Grid) */}
                    {isLibraryModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLibraryModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-white rounded-lg  w-full max-w-4xl overflow-hidden relative z-10 max-h-[85vh] flex flex-col">
                                <div className="p-6 border-b flex items-center justify-between"><h3 className="text-xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6 text-[#1B6B3A]" /> Bibliothèque personnelle</h3><button onClick={() => setIsLibraryModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button></div>
                                <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {profile?.documents?.length > 0 ? (
                                        profile.documents.map((file: any, i: number) => {
                                            const isVideo = file.type?.toLowerCase().includes('video') || file.url?.endsWith('.mp4');
                                            const isImg = file.type?.toLowerCase().includes('image') || file.url?.match(/\.(jpg|jpeg|png|webp)$/i);
                                            const Icon = isVideo ? FileVideo : isImg ? FileImage : FileText;
                                            const color = isVideo ? "text-blue-500" : isImg ? "text-emerald-500" : "text-red-500";

                                            return (
                                                <div key={i} className="p-4 border rounded-lg hover:  group cursor-pointer border-gray-200 bg-gray-50/50">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <Icon className={`w-10 h-10 ${color}`} />
                                                        <a 
                                                            href={file.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-full  text-gray-500 hover:text-[#1B6B3A]"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                    <h4 className="font-bold text-sm text-gray-900 truncate mb-1">{file.name}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{file.type || 'DOCUMENT'} • {file.size}</p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                                            <Bookmark className="w-12 h-12 text-gray-200 mb-3" />
                                            <p className="text-sm font-bold text-gray-400">Votre bibliothèque est vide.</p>
                                            <p className="text-xs text-gray-300">Générez des cours ou téléchargez des ressources pour les retrouver ici.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
