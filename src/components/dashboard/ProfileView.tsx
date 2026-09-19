'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import { createConversation } from '@/utils/messagesApi';
import {
    User,
    MapPin,
    School,
    Briefcase,
    GraduationCap,
    Users,
    Camera,
    Edit3,
    Save,
    Clock,
    X,
    Activity,
    Award,
    MessageCircle,
    Loader2,
    ShieldCheck,
    Eye,
    Mail,
    Phone,
    Calendar as CalendarIcon,
    Plus,
    Video,
    Image as ImageIcon,
    FileText,
    ChevronRight,
    UserPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileViewProps {
    user: any;
    profile: any;
}

const ROLE_LABELS: Record<string, string> = {
    STUDENT: 'Élève / Étudiant(e)',
    TEACHER: 'Enseignant(e)',
    PARENT: 'Parent',
    ADMIN: 'Administrateur',
};

export const ProfileView = ({ user, profile }: ProfileViewProps) => {
    const router = useRouter();
    const role = user?.role as string | undefined;
    const isStudent = role === 'STUDENT';
    const isTeacher = role === 'TEACHER';
    const isParent = role === 'PARENT';
    const hasRoleContent = isStudent || isTeacher || isParent;

    const [activeTab, setActiveTab] = useState<'activity' | 'results'>('activity');
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // Dynamic suggestions state
    const [dismissedSuggestions, setDismissedSuggestions] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        city: profile?.city || '',
        schoolName: profile?.schoolName || '',
        schoolLevel: profile?.schoolLevel || '',
        track: profile?.track || '',
        objectives: profile?.objectives || '',
        currentSchool: profile?.currentSchool || '',
        subjects: profile?.subjects || '',
        experienceYears: profile?.experienceYears || '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Non authentifié');

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
                    url: '#'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'envoi");
            }

            window.location.reload();
        } catch (err: any) {
            console.error('Upload error:', err);
            alert(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const initials = useMemo(() => {
        const value = (user?.fullName || 'U')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p: string) => p[0]?.toUpperCase())
            .join('');
        return value || 'U';
    }, [user?.fullName]);

    const isActive = user?.status !== 'SUSPENDED';
    const roleLabel = (role && ROLE_LABELS[role]) || 'Membre';
    const institution = isStudent ? (profile?.schoolName || 'Université / Lycée') : isTeacher ? (profile?.currentSchool || 'Établissement') : null;

    // Classmates fetching
    const [classmates, setClassmates] = useState<any[]>([]);
    const [isLoadingClassmates, setIsLoadingClassmates] = useState(false);
    const [contactingId, setContactingId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsLoadingClassmates(true);
        apiCall('/user/classmates', { headers: { Authorization: `Bearer ${token}` } })
            .then((data) => setClassmates(Array.isArray(data) ? data : []))
            .catch((err) => console.error('Classmates fetch error:', err))
            .finally(() => setIsLoadingClassmates(false));
    }, []);

    const handleContactClassmate = async (classmateId: string) => {
        setContactingId(classmateId);
        try {
            await createConversation(classmateId);
            router.push('/dashboard/messages');
        } catch (err: any) {
            console.error('Create conversation error:', err);
            alert(err.message || "Impossible de contacter ce membre pour le moment.");
        } finally {
            setContactingId(null);
        }
    };

    // Public URL generated slug
    const publicUrlSlug = `www.educationguinee.gn/in/${(user?.fullName || 'user').toLowerCase().replace(/\s+/g, '-')}-${user?.id?.slice(0, 8) || '001'}`;

    const activities = profile?.activities || [];
    const quizResults = profile?.quizResults || [];

    // Suggestions cards for "Suggestions personnalisées"
    const suggestionsList = [
        {
            id: 1,
            title: "Dans quel secteur étudiez ou travaillez-vous ?",
            desc: "Les membres qui indiquent leur domaine reçoivent 9x plus de recommandations de ressources.",
            actionText: "Ajouter un secteur / filière"
        },
        {
            id: 2,
            title: "Rédigez une synthèse pour présenter vos objectifs",
            desc: "Présentez vos compétences, projets d'études ou diplômes préparés pour vous démarquer.",
            actionText: "Ajouter un résumé"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F3F2EF] font-sans text-gray-900 pb-16 pt-0">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* CONTAINER PRINCIPAL GRID 2 COLONNES (PAGE PROFIL DETAILEE) */}
            <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* ========================================== */}
                {/* COLONNE PRINCIPALE (8 COLONNES)            */}
                {/* ========================================== */}
                <div className="lg:col-span-8 space-y-4">

                    {/* HERO CARTE PRINCIPALE PROFIL */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                        {/* Cover image header */}
                        <div className="h-36 sm:h-52 bg-[#A2B7B5] relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-800/30 via-slate-600/20 to-teal-900/40" />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow transition"
                                title="Changer la photo de couverture"
                            >
                                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 relative">
                            {/* Avatar circle overlapping banner */}
                            <div className="flex items-end justify-between -mt-14 sm:-mt-20 mb-3 sm:mb-4">
                                <div className="relative">
                                    <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-[#8D6E63] text-white flex items-center justify-center text-3xl sm:text-5xl font-bold shadow-md overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>
                                    <div
                                        className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white ${isActive ? 'bg-emerald-500' : 'bg-red-400'}`}
                                        title={isActive ? 'Compte actif' : 'Compte suspendu'}
                                    />
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                                    title="Modifier le profil"
                                >
                                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            {/* Name and headline section */}
                            <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{user?.fullName || 'Augustin Kolié'}</h1>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 border border-blue-500/40 text-blue-600 rounded-full text-[11px] sm:text-xs font-semibold hover:bg-blue-50 transition"
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Vérification en 2 minutes</span>
                                        </button>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-800 mt-1">
                                        {roleLabel} {institution ? `à ${institution}` : ''}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-medium mt-1">
                                        <span>{profile?.city || 'Conakry'}, Guinée</span>
                                        <span>·</span>
                                        <button
                                            onClick={() => setShowContactModal(true)}
                                            className="text-blue-600 font-semibold hover:underline"
                                        >
                                            Coordonnées
                                        </button>
                                    </div>
                                </div>

                                {institution && (
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2 sm:p-2.5 max-w-xs">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700">
                                            <School className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </div>
                                        <span className="text-[11px] sm:text-xs font-bold text-gray-800">{institution}</span>
                                    </div>
                                )}
                            </div>

                            {/* Pill action buttons bar */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-4 sm:mt-5">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-3.5 sm:px-4 py-1.5 bg-[#0A66C2] text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-[#004182] transition shadow-sm"
                                >
                                    {isStudent ? 'Mes objectifs' : 'Mes informations'}
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3.5 sm:px-4 py-1.5 border border-[#0A66C2] text-[#0A66C2] rounded-full text-xs sm:text-sm font-semibold hover:bg-blue-50 transition"
                                >
                                    Ajouter une section
                                </button>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-3.5 sm:px-4 py-1.5 border border-[#0A66C2] text-[#0A66C2] rounded-full text-xs sm:text-sm font-semibold hover:bg-blue-50 transition"
                                >
                                    Améliorer le profil
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/resources')}
                                    className="px-3.5 sm:px-4 py-1.5 border border-gray-400 text-gray-700 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition"
                                >
                                    Ressources
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SUGGESTIONS PERSONNALISÉES (Privé) */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Suggestions personnalisées</h3>
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Privé</span>
                                </p>
                            </div>
                        </div>

                        {/* Carousel horizontal item list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {suggestionsList.map((item) => {
                                if (dismissedSuggestions.includes(item.id)) return null;
                                return (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-gray-300 transition relative">
                                        <button
                                            onClick={() => setDismissedSuggestions((prev) => [...prev, item.id])}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                                            title="Ignorer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="pr-5">
                                            <h4 className="text-xs font-bold text-gray-900 leading-snug mb-1">{item.title}</h4>
                                            <p className="text-[11px] text-gray-500 leading-normal">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="mt-3 text-xs font-semibold text-blue-600 hover:underline text-left self-start"
                                        >
                                            {item.actionText}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION ACTIVITÉ & RESULTATS ACADÉMIQUES */}
                    {hasRoleContent && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex border-b border-gray-200 bg-gray-50/50">
                                {(['activity', 'results'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all relative ${
                                            activeTab === tab ? 'text-teal-800 border-b-2 border-teal-800 bg-white' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab === 'activity' ? 'Activité récente' : 'Résultats & Quiz'}
                                    </button>
                                ))}
                            </div>

                            <div className="p-5">
                                {activeTab === 'activity' && (
                                    <div className="space-y-3">
                                        {activities.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400 text-xs font-medium">
                                                Aucune activité récente. Commencez un cours pour voir votre progression ici.
                                            </div>
                                        ) : (
                                            activities.map((act: any) => (
                                                <div key={act.id} className="flex items-center justify-between gap-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 truncate">{act.subject} — {act.lesson}</p>
                                                        <p className="text-[10px] text-gray-500">{act.timeSpent} · {act.status}</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-teal-700">{act.progress ?? 0}%</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'results' && (
                                    <div className="space-y-3">
                                        {quizResults.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400 text-xs font-medium">
                                                Aucun résultat de quiz enregistré pour le moment.
                                            </div>
                                        ) : (
                                            quizResults.map((qr: any) => (
                                                <div key={qr.id} className="flex items-center justify-between gap-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                    <p className="text-xs font-bold text-gray-900">{qr.subject}</p>
                                                    <span className="text-xs font-bold text-gray-800">{qr.score.toFixed(1)} / 20</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ========================================== */}
                {/* COLONNE DROITE : BARRE LATÉRALE (4 COL)     */}
                {/* ========================================== */}
                <div className="lg:col-span-4 space-y-4">

                    {/* CARTE 1: LANGUE DU PROFIL */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Langue du profil</h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">Français</p>
                        </div>
                        <button
                            onClick={() => setShowLanguageModal(true)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition"
                            title="Modifier la langue"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* CARTE 2: PROFIL PUBLIC ET URL */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start justify-between">
                        <div className="pr-2 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900">Profil public et URL</h3>
                            <p className="text-[11px] text-gray-500 font-mono mt-1 break-all truncate max-w-[220px]">
                                {publicUrlSlug}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowUrlModal(true)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition flex-shrink-0"
                            title="Modifier l'URL"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* CARTE 3: PERSONNES QUE VOUS POURRIEZ CONNAÎTRE */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
                        <h3 className="text-sm font-bold text-gray-900">Personnes que vous pourriez connaître</h3>

                        {isLoadingClassmates ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 text-teal-700 animate-spin" />
                            </div>
                        ) : classmates.length === 0 ? (
                            <div className="py-4 text-center text-xs font-medium text-gray-400">
                                Aucun autre membre inscrit dans la base pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {classmates.map((mate) => (
                                    <div key={mate.id} className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5 last:border-0">
                                        <div className="flex items-start gap-2 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {mate.avatar ? (
                                                    <img src={mate.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{String(mate.name || '?')[0]}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">{mate.name}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{mate.desc || 'Membre EducationGuinée'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleContactClassmate(mate.id)}
                                            disabled={contactingId === mate.id}
                                            className="px-2.5 py-1 border border-blue-600 text-blue-600 rounded-full text-[11px] font-semibold hover:bg-blue-50 transition"
                                        >
                                            {contactingId === mate.id ? '...' : '+ Se connecter'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* MODALES ET POPUPS DE CONFIGURATION          */}
            {/* ========================================== */}

            {/* Popup Coordonnées */}
            <AnimatePresence>
                {showContactModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowContactModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
                        >
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-900">Coordonnées</h3>
                                <button onClick={() => setShowContactModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4 text-xs font-semibold text-gray-700">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-teal-700" />
                                    <div>
                                        <p className="text-[10px] text-gray-400">Email</p>
                                        <p className="text-sm font-bold text-gray-900">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-teal-700" />
                                    <div>
                                        <p className="text-[10px] text-gray-400">Téléphone</p>
                                        <p className="text-sm font-bold text-gray-900">{user?.phone || 'Non renseigné'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-teal-700" />
                                    <div>
                                        <p className="text-[10px] text-gray-400">Ville / Localisation</p>
                                        <p className="text-sm font-bold text-gray-900">{profile?.city || 'Conakry'}, Guinée</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Popup Langue */}
            <AnimatePresence>
                {showLanguageModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLanguageModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 relative z-10 space-y-4">
                            <h3 className="text-base font-bold text-gray-900">Langue du profil</h3>
                            <p className="text-xs text-gray-600">Choisissez votre langue d'affichage principale :</p>
                            <select className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold">
                                <option value="fr">Français (France)</option>
                                <option value="en">English</option>
                            </select>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setShowLanguageModal(false)} className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full">Fermer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Popup Profil Public & URL */}
            <AnimatePresence>
                {showUrlModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUrlModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 relative z-10 space-y-4">
                            <h3 className="text-base font-bold text-gray-900">Modifier l'URL de votre profil public</h3>
                            <p className="text-xs text-gray-600">Personnalisez votre adresse web unique sur EducationGuinée :</p>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-xs font-mono">
                                <span className="text-gray-400">educationguinee.gn/in/</span>
                                <input type="text" defaultValue={(user?.fullName || 'user').toLowerCase().replace(/\s+/g, '-')} className="bg-transparent font-bold text-gray-900 focus:outline-none flex-1" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setShowUrlModal(false)} className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full">Annuler</button>
                                <button onClick={() => setShowUrlModal(false)} className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700">Enregistrer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal d'édition des informations du profil */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
                        >
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Modifier les informations</h3>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nom complet</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Ville</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {isStudent && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Établissement / Université</label>
                                            <input
                                                type="text"
                                                value={formData.schoolName}
                                                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Mes objectifs &amp; synthèse</label>
                                            <textarea
                                                rows={3}
                                                value={formData.objectives}
                                                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-full"
                                    disabled={isSaving}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2 text-xs font-semibold bg-[#0A66C2] text-white rounded-full hover:bg-[#004182] transition disabled:opacity-50"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
