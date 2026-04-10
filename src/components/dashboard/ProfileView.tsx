'use client';

import React, { useState } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar as CalendarIcon, 
    School, 
    GraduationCap, 
    FileText, 
    Download, 
    Printer, 
    Edit3, 
    ChevronRight,
    MessageSquare,
    Save,
    MoreVertical,
    CheckCircle2,
    Clock,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileViewProps {
    user: any;
    profile: any;
}

export const ProfileView = ({ user, profile }: ProfileViewProps) => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        city: profile?.city || 'Conakry',
        schoolName: profile?.schoolName || 'Lycée 2 Octobre',
        schoolLevel: profile?.schoolLevel || 'Terminale',
        track: profile?.track || 'SM',
        objectives: profile?.objectives || '',
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Non authentifié');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/user/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour');
            }

            setShowModal(false);
            window.location.reload();
        } catch (err: any) {
            console.error('Save error:', err);
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const userInfo = [
        { label: 'Sexe', value: user?.gender || 'Non spécifié', icon: User },
        { label: 'Date de naissance', value: 'Non spécifiée', icon: CalendarIcon },
        { label: 'Téléphone', value: user?.phone || 'Non renseigné', icon: Phone },
        { label: 'Adresse', value: 'Conakry, Guinée', icon: MapPin },
        { label: 'Ville', value: profile?.city || 'Conakry', icon: MapPin },
        { label: 'Code Postale', value: 'N/A', icon: MapPin },
        { label: 'Statut', value: `${user?.role === 'STUDENT' ? 'Élève' : 'Utilisateur'} Actif`, icon: CheckCircle2 },
        { label: 'Date d\'inscription', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A', icon: CalendarIcon },
    ];

    const documents = profile?.documents || [
        { id: 1, name: 'Bulletin_Trimestre_1.pdf', size: '125kb', type: 'PDF' },
        { id: 2, name: 'Certificat_Scolarité_2025.pdf', size: '87kb', type: 'PDF' },
        { id: 3, name: 'Fiche_Révision_Maths.pdf', size: '240kb', type: 'PDF' },
        { id: 4, name: 'Tableau_des_Éléments.pdf', size: '1.2MB', type: 'PDF' },
    ];

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Non authentifié');

            // Format size
            const sizeString = file.size > 1024 * 1024 
                ? `${(file.size / (1024 * 1024)).toFixed(1)}MB` 
                : `${Math.round(file.size / 1024)}KB`;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/user/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: file.name,
                    size: sizeString,
                    type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                    url: '#' // Simulé pour l'instant
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'envoi');
            }

            window.location.reload();
        } catch (err: any) {
            console.error('Upload error:', err);
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const timeline = [
        { 
            id: 1, 
            date: '26 Nov \'25', 
            time: '09:00 - 10:30', 
            title: 'Examen Blanc : Mathématiques', 
            teacher: 'Dr. Keita', 
            room: 'Salle 4',
            status: 'upcoming'
        },
        { 
            id: 2, 
            date: '28 Nov \'25', 
            time: '14:00 - 15:30', 
            title: 'Révision : Physique Quantique', 
            teacher: 'M. Diallo', 
            room: 'Labo 1',
            status: 'upcoming'
        }
    ];

    return (
        <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
            />
            {/* Fil d'Ariane (Sans carte) */}
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 px-2">
                <span className="hover:text-[#1B6B3A] cursor-pointer">Tableau de Bord</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0F2D1E]">Profil de {user?.fullName}</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Column: Profile Card */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center relative">
                        {/* Actions Rapides */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-[#E8F5EE] hover:text-[#1B6B3A] transition-all" title="Imprimer">
                                <Printer className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-[#E8F5EE] hover:text-[#1B6B3A] transition-all" 
                                title="Modifier"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full bg-[#E8F5EE] border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-[#1B6B3A]" />
                                )}
                            </div>
                            <div className="absolute -bottom-1 right-2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white shadow-sm" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-[#0F2D1E] tracking-tight mb-1">{user?.fullName}</h3>
                        <p className="text-[10px] font-black text-[#1B6B3A] uppercase tracking-widest opacity-70 mb-2">
                            {profile?.schoolLevel} {profile?.track}
                        </p>
                        <p className="text-sm font-bold text-gray-400 mb-6">{user?.email}</p>
                        
                        <div className="grid grid-cols-2 w-full gap-4 mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xl font-black text-[#0F2D1E]">{profile?.courseCount || 0}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cours</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xl font-black text-[#0F2D1E]">{profile?.quizResults?.length || 0}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Examens</p>
                            </div>
                        </div>
                        
                        <button className="w-full py-4 bg-[#1B6B3A] text-white rounded-xl font-bold flex items-center justify-center hover:bg-[#0F2D1E] transition-all shadow-lg shadow-[#1B6B3A]/10">
                            <span>Envoyer un message</span>
                        </button>
                    </div>

                    {/* Files Section (Adapted from image) */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h4 className="text-sm font-black text-[#0F2D1E] uppercase tracking-widest">Documents / Fichiers</h4>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-[#1B6B3A] hover:bg-[#E8F5EE] rounded-lg transition-all"
                                disabled={isSaving}
                            >
                                <Plus className="w-5 h-5 flex-shrink-0" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-[#E8F5EE] group-hover:text-[#1B6B3A] transition-all">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#0F2D1E] line-clamp-1">{doc.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{doc.size}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2 text-gray-400 hover:text-red-500">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-[#1B6B3A] bg-[#E8F5EE] rounded-lg">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Info Grid & Tabs */}
                <div className="xl:col-span-3 space-y-8">
                    {/* Details Info Grid (Center Card in image) */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 text-left">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sexe</p>
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-[#1B6B3A] opacity-30" />
                                    <p className="text-sm font-bold text-[#0F2D1E]">{user?.gender || 'Non spécifié'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-[#1B6B3A] opacity-30" />
                                    <p className="text-sm font-bold text-[#0F2D1E]">{user?.phone || 'Non renseigné'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ville</p>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-[#1B6B3A] opacity-30" />
                                    <p className="text-sm font-bold text-[#0F2D1E]">{profile?.city || 'Conakry'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">École</p>
                                <div className="flex items-center gap-3">
                                    <School className="w-4 h-4 text-[#1B6B3A] opacity-30" />
                                    <p className="text-sm font-bold text-[#0F2D1E]">{profile?.schoolName || 'Lycée 2 Octobre'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</p>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[#1B6B3A] opacity-30" />
                                    <p className="text-sm font-bold text-[#0F2D1E]">{user?.role === 'STUDENT' ? 'Élève' : 'Utilisateur'} Actif</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inscription</p>
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="w-4 h-4 text-[#1B6B3A] opacity-30" />
                                    <p className="text-sm font-bold text-[#0F2D1E]">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Notes Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Timeline / Tabs (Bottom Left) */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                            <div className="flex border-b border-gray-50 bg-gray-50/50">
                                {['upcoming', 'past', 'records'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${
                                            activeTab === tab ? 'text-[#1B6B3A]' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {tab === 'upcoming' && 'Leçons à venir'}
                                        {tab === 'past' && 'Cours terminés'}
                                        {tab === 'records' && 'Résultats Quiz'}
                                        {activeTab === tab && (
                                            <motion.div 
                                                layoutId="tab-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-[#1B6B3A]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'upcoming' && (
                                        <motion.div 
                                            key="upcoming"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            {timeline.map((item) => (
                                                <div key={item.id} className="relative pl-8 pb-8 border-l-2 border-gray-50 last:border-0 last:pb-0">
                                                    <div className="absolute -left-2 top-0 w-3.5 h-3.5 bg-white border-2 border-[#1B6B3A] rounded-full shadow-[0_0_10px_rgba(27,107,58,0.3)]" />
                                                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-[#E8F5EE]/50 transition-all border border-transparent hover:border-[#1B6B3A]/10">
                                                        <div className="flex items-center gap-8">
                                                            <div className="text-center min-w-[100px]">
                                                                <p className="text-sm font-black text-[#0F2D1E] leading-tight whitespace-nowrap">{item.date}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{item.time}</p>
                                                            </div>
                                                            <div className="h-10 w-px bg-gray-200 hidden md:block" />
                                                            <div>
                                                                <h5 className="font-bold text-[#0F2D1E] mb-1 group-hover:text-[#1B6B3A] transition-colors">{item.title}</h5>
                                                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase">
                                                                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {item.teacher}</span>
                                                                    <span className="flex items-center gap-1.5"><School className="w-3 h-3" /> {item.room}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#1B6B3A] rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
                                                            <FileText className="w-3.5 h-3.5" />
                                                            <span>Détails</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                    {activeTab !== 'upcoming' && (
                                        <motion.div 
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-gray-400 py-20"
                                        >
                                            <Clock className="w-12 h-12 mb-4 opacity-10" />
                                            <p className="font-bold">Aucune donnée disponible pour le moment.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Notes Section (Top Right / Bottom Right in image) */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col h-full min-h-[400px]">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-sm font-black text-[#0F2D1E] uppercase tracking-widest whitespace-nowrap">Notes & Objectifs</h4>
                                </div>
                                
                                <div className="flex-1 bg-gray-50/50 rounded-xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#1B6B3A]/5 rounded-bl-full pointer-events-none" />
                                    <div className="space-y-4 text-sm font-medium text-gray-600 leading-relaxed">
                                        {profile?.objectives ? (
                                            <div className="whitespace-pre-line">{profile.objectives}</div>
                                        ) : (
                                            <>
                                                <p>• Objectif principal : Obtenir la mention "Très bien" au Baccalauréat SM 2026.</p>
                                                <p>• Points d'attention : Renforcement nécessaire en Cinétique Chimique.</p>
                                                <p>• Livres à lire : "Le Cercle des Tropiques" (Alioum Fantouré).</p>
                                                <p>• Participation active : Toujours poser des questions lors des séances de Physique.</p>
                                            </>
                                        )}
                                    </div>

                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                                            <User className="w-4 h-4 text-[#1B6B3A]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#0F2D1E]">M. Diallo</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Professeur de Physique</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">20 Nov 25</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal de Modification */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-[#0F2D1E]/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10"
                        >
                            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-[#0F2D1E]">Modifier mon Profil</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Édition des informations</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                    >
                                        <Plus className="w-6 h-6 text-gray-400 rotate-45" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {/* Section Personnelle */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-[#1B6B3A] uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3" /> Informations Personnelles
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Nom Complet</label>
                                            <input 
                                                type="text" 
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all font-sans"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Téléphone</label>
                                            <input 
                                                type="text" 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Sexe</label>
                                            <select 
                                                value={formData.gender}
                                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all appearance-none cursor-pointer font-sans"
                                            >
                                                <option value="">Non spécifié</option>
                                                <option value="Masculin">Masculin</option>
                                                <option value="Féminin">Féminin</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Ville</label>
                                            <input 
                                                type="text" 
                                                value={formData.city}
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all font-sans"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Scolaire */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-[#1B6B3A] uppercase tracking-widest flex items-center gap-2">
                                        <School className="w-3 h-3" /> Informations Scolaires
                                    </h4>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Établissement</label>
                                        <input 
                                            type="text" 
                                            value={formData.schoolName}
                                            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all font-sans"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Niveau</label>
                                            <select 
                                                value={formData.schoolLevel}
                                                onChange={(e) => setFormData({...formData, schoolLevel: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all appearance-none cursor-pointer font-sans"
                                            >
                                                <option value="11ème">11ème</option>
                                                <option value="12ème">12ème</option>
                                                <option value="Terminale">Terminale</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Option</label>
                                            <select 
                                                value={formData.track}
                                                onChange={(e) => setFormData({...formData, track: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all appearance-none cursor-pointer font-sans"
                                            >
                                                <option value="SM">SM</option>
                                                <option value="SE">SE</option>
                                                <option value="SS">SS</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Mes Objectifs</label>
                                        <textarea 
                                            value={formData.objectives}
                                            onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                                            placeholder="Ex: Obtenir la mention Très Bien au Bac..."
                                            rows={4}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0F2D1E] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 transition-all font-sans resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-end gap-3">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all"
                                    disabled={isSaving}
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-[#1B6B3A] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#0F2D1E] transition-all shadow-lg shadow-[#1B6B3A]/20 flex items-center gap-3"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Clock className="w-4 h-4 animate-spin" />
                                            <span>Enregistrement...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Enregistrer</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
