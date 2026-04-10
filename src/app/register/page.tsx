'use client';

import { User, Users, BookOpen, Eye, EyeOff, Github, Facebook, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { apiCall } from '@/utils/api';

type RoleType = 'student' | 'teacher' | 'parent' | null;

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<RoleType>('student');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isNotRobot, setIsNotRobot] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        schoolLevel: '',
        subLevel: '',
        faculty: '',
        department: '',
        schoolName: '',
        city: '',
        subjects: '',
        experienceYears: '',
        currentSchool: '',
        numberOfChildren: '',
    });

    const schoolLevelsMapping = {
        "Primaire": ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année", "6ème année"],
        "Collège": ["7ème année", "8ème année", "9ème année", "10ème année"],
        "Lycée": [
            "11ème SM", "11ème SE", "11ème SS", 
            "12ème SM", "12ème SE", "12ème SS", 
            "Terminale SM", "Terminale SE", "Terminale SS"
        ]
    };

    const universityData: Record<string, string[]> = {
        "Faculté des Sciences et Techniques de la Santé": ["Médecine", "Pharmacie", "Odontostomatologie"],
        "Faculté des Sciences et Techniques (FSET)": ["Mathématiques", "Physique", "Chimie", "Biologie", "MIAGE", "Informatique"],
        "Faculté des Sciences Économiques et de Gestion (FSEG)": ["Économie", "Gestion", "Banque & Finance"],
        "Faculté des Sciences Juridiques et Politiques (FSJP)": ["Droit Public", "Droit Privé", "Sciences Politiques"],
        "Faculté des Lettres et Sciences Humaines (FLSH)": ["Lettres Modernes", "Philosophie", "Sociologie", "Géographie", "Histoire"],
        "Faculté des Sciences Sociales (FSS)": ["Communication", "Journalisme", "Administration Publique"],
        "Faculté d'Agronomie et de Médecine Vétérinaire": ["Agronomie", "Eaux et Forêts", "Médecine Vétérinaire"],
        "Institut Polytechnique (Génie)": ["Génie Civil", "Génie Électrique", "Génie Mécanique", "Génie Informatique", "Télécommunications"]
    };

    const roles = [
        { id: 'student' as RoleType, icon: User, title: 'Élève', desc: 'Apprenant' },
        { id: 'teacher' as RoleType, icon: BookOpen, title: 'Enseignant', desc: 'Formateur' },
        { id: 'parent' as RoleType, icon: Users, title: 'Parent', desc: 'Tuteur' }
    ];

    const updateFormData = (field: string, value: string) => {
        let finalValue = value;
        
        // Auto-prefix Guinean phone numbers
        if (field === 'phone' && /^[6][0-9]{8}$/.test(value)) {
            finalValue = `+224 ${value}`;
        }
        
        setFormData(prev => ({ ...prev, [field]: finalValue }));
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        setError('');
        setCurrentStep(2);
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isNotRobot || isVerifying || !acceptTerms) return;

        setIsLoading(true);
        setError('');

        try {
            let profileData = {};
            if (selectedRole === 'student') {
                profileData = {
                    schoolLevel: formData.schoolLevel,
                    subLevel: formData.subLevel,
                    faculty: formData.faculty,
                    department: formData.department,
                    schoolName: formData.schoolName,
                    city: formData.city
                };
            } else if (selectedRole === 'teacher') {
                profileData = {
                    subjects: formData.subjects,
                    experienceYears: formData.experienceYears,
                    currentSchool: formData.currentSchool
                };
            } else if (selectedRole === 'parent') {
                profileData = {
                    numberOfChildren: formData.numberOfChildren,
                    city: formData.city
                };
            }

            const data = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: selectedRole?.toUpperCase(),
                    profileData
                }),
            });

            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || "Échec de l'inscription");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex bg-white overflow-hidden font-sans">
            {/* Left Side - Marketing with Background Image */}
            <div className="hidden lg:flex w-[60%] relative overflow-hidden">
                <img
                    src="/assets/images/register-bg.png"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-[#0F2D1E]/75" />

                <div className="relative z-10 w-full h-full flex flex-col p-16 justify-between text-white">
                    <div className="flex items-center gap-4">
                        <Logo scrolled={false} height="h-[42px]" />
                    </div>

                    <div className="max-w-xl">
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            Propulsez votre avenir <br /> académique.
                        </h1>
                        <p className="text-xl opacity-90 leading-relaxed font-light">
                            Rejoignez des milliers d'élèves et d'enseignants qui transforment l'éducation en Guinée.
                        </p>
                    </div>

                    <div className="flex gap-16 items-end">
                        <div className="space-y-1">
                            <span className="text-3xl font-bold block">12k +</span>
                            <span className="text-[10px] tracking-widest uppercase opacity-60 font-bold">Inscrits</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-3xl font-bold block">850 +</span>
                            <span className="text-[10px] tracking-widest uppercase opacity-60 font-bold">Ressources</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-3xl font-bold block">100%</span>
                            <span className="text-[10px] tracking-widest uppercase opacity-60 font-bold">Gratuit</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-[40%] h-full flex flex-col overflow-y-auto">
                <div className="flex-1 flex items-start justify-center p-6 lg:p-12 lg:pt-12">
                    <div className="w-full max-w-[480px] py-1">
                        <div className="mb-4">
                            <h2 className="text-3xl font-extrabold text-[#1A3329] mb-2">Inscription</h2>
                            <p className="text-[#64748B] font-medium">
                                {currentStep === 1 ? 'Créer votre compte personnel' : 'Détails de votre profil'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        {currentStep === 1 ? (
                            <form className="space-y-5" onSubmit={handleContinue}>
                                {/* Role Selector */}
                                <div className="space-y-2.5">

                                    <div className="flex gap-3">
                                        {roles.map((role) => {
                                            const Icon = role.icon;
                                            const isSelected = selectedRole === role.id;
                                            return (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => setSelectedRole(role.id)}
                                                    className={`flex-1 py-3 px-2 rounded-xl border transition-all flex flex-col items-center text-center gap-1.5 relative group ${isSelected
                                                        ? 'border-[#1B6B3A] bg-[#F0FFF4]'
                                                        : 'border-[#E8F5EE] bg-white hover:border-[#E2E8F0]'
                                                        }`}
                                                >
                                                    <div className={`transition-all ${isSelected 
                                                        ? 'text-[#1B6B3A] scale-110' 
                                                        : 'text-[#94A3B8] group-hover:text-[#64748B]'
                                                    }`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    
                                                    <div className="flex flex-col">
                                                        <span className={`font-black text-[10px] uppercase tracking-widest leading-none mb-0.5 ${isSelected ? 'text-[#1B6B3A]' : 'text-[#1A3329]'}`}>
                                                            {role.title}
                                                        </span>
                                                        <span className="text-[8.5px] text-[#94A3B8] font-bold uppercase tracking-tight opacity-70">
                                                            {role.desc}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="block text-sm font-bold text-[#1E293B]">Nom complet</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => updateFormData('fullName', e.target.value)}
                                        placeholder="Votre nom complet"
                                        required
                                        className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="block text-sm font-bold text-[#1E293B]">Adresse e-mail</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateFormData('email', e.target.value)}
                                        placeholder="exemple@email.com"
                                        required
                                        className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="block text-sm font-bold text-[#1E293B]">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateFormData('phone', e.target.value)}
                                        placeholder="+224 XXX XXX XXX"
                                        required
                                        className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="block text-sm font-bold text-[#1E293B]">Mot de passe</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => updateFormData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="block text-sm font-bold text-[#1E293B]">Confirmer mot de passe</label>
                                    <div className="relative group">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-xl bg-[#1B6B3A] text-white font-black text-sm uppercase tracking-widest hover:bg-[#155230] transition-all shadow-lg active:scale-[0.98]"
                                    >
                                        Continuer
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form className="space-y-5" onSubmit={handleFinalSubmit}>
                                {selectedRole === 'student' && (
                                    <>
                                        <div className="space-y-2.5">
                                            <label className="block text-sm font-bold text-[#1E293B]">Niveau scolaire</label>
                                            <select
                                                value={formData.schoolLevel}
                                                onChange={(e) => {
                                                    updateFormData('schoolLevel', e.target.value);
                                                    updateFormData('subLevel', '');
                                                    updateFormData('faculty', '');
                                                    updateFormData('department', '');
                                                }}
                                                required
                                                className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium"
                                            >
                                                <option value="">Sélectionnez votre niveau</option>
                                                <option value="Primaire">Primaire</option>
                                                <option value="Collège">Collège</option>
                                                <option value="Lycée">Lycée</option>
                                                <option value="Université">Université</option>
                                            </select>
                                        </div>

                                        {formData.schoolLevel && formData.schoolLevel !== 'Université' && (
                                            <div className="space-y-2.5">
                                                <label className="block text-sm font-bold text-[#1E293B]">Classe</label>
                                                <select
                                                    value={formData.subLevel}
                                                    onChange={(e) => updateFormData('subLevel', e.target.value)}
                                                    required
                                                className="w-full px-5 py-4 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium shadow-sm"
                                                >
                                                    <option value="">Sélectionnez votre classe</option>
                                                    {schoolLevelsMapping[formData.schoolLevel as keyof typeof schoolLevelsMapping]?.map(className => (
                                                        <option key={className} value={className}>{className}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {formData.schoolLevel === 'Université' && (
                                            <>
                                                <div className="space-y-2.5">
                                                    <label className="block text-sm font-bold text-[#1E293B]">Faculté</label>
                                                    <select
                                                        value={formData.faculty}
                                                        onChange={(e) => {
                                                            updateFormData('faculty', e.target.value);
                                                            updateFormData('department', '');
                                                        }}
                                                        required
                                                    className="w-full px-5 py-4 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium shadow-sm"
                                                    >
                                                        <option value="">Sélectionnez votre faculté</option>
                                                        {Object.keys(universityData).map(faculty => (
                                                            <option key={faculty} value={faculty}>{faculty}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {formData.faculty && (
                                                    <div className="space-y-2.5">
                                                        <label className="block text-sm font-bold text-[#1E293B]">Département</label>
                                                        <select
                                                            value={formData.department}
                                                            onChange={(e) => updateFormData('department', e.target.value)}
                                                            required
                                                        className="w-full px-5 py-4 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium shadow-sm"
                                                        >
                                                            <option value="">Sélectionnez votre département</option>
                                                            {universityData[formData.faculty]?.map(dept => (
                                                                <option key={dept} value={dept}>{dept}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                <div className="space-y-2.5">
                                                    <label className="block text-sm font-bold text-[#1E293B]">Année de Licence</label>
                                                    <select
                                                        value={formData.subLevel}
                                                        onChange={(e) => updateFormData('subLevel', e.target.value)}
                                                        required
                                                    className="w-full px-5 py-4 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium shadow-sm"
                                                    >
                                                        <option value="">Sélectionnez votre année</option>
                                                        <option value="Licence 1">Licence 1</option>
                                                        <option value="Licence 2">Licence 2</option>
                                                        <option value="Licence 3">Licence 3</option>
                                                        <option value="Licence 4">Licence 4</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        <div className="space-y-2.5">
                                            <label className="block text-sm font-bold text-[#1E293B]">Établissement</label>
                                            <input
                                                type="text"
                                                value={formData.schoolName}
                                                onChange={(e) => updateFormData('schoolName', e.target.value)}
                                                placeholder="Nom de votre école / université"
                                                className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedRole === 'teacher' && (
                                    <>
                                        <div className="space-y-2.5">
                                            <label className="block text-sm font-bold text-[#1E293B]">Matière principale</label>
                                            <select
                                                value={formData.subjects}
                                                onChange={(e) => updateFormData('subjects', e.target.value)}
                                                required
                                                className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium"
                                            >
                                                <option value="">Sélectionnez une matière</option>
                                                <option value="Mathématiques">Mathématiques</option>
                                                <option value="Français">Français</option>
                                                <option value="Sciences">Sciences</option>
                                                <option value="Histoire">Histoire</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="block text-sm font-bold text-[#1E293B]">Établissement actuel</label>
                                            <input
                                                type="text"
                                                value={formData.currentSchool}
                                                onChange={(e) => updateFormData('currentSchool', e.target.value)}
                                                placeholder="Établissement"
                                                className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedRole === 'parent' && (
                                    <>
                                        <div className="space-y-2.5">
                                            <label className="block text-sm font-bold text-[#1E293B]">Nombre d'enfants</label>
                                            <select
                                                value={formData.numberOfChildren}
                                                onChange={(e) => updateFormData('numberOfChildren', e.target.value)}
                                                required
                                                className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium"
                                            >
                                                <option value="">Nombre d'enfants</option>
                                                <option value="1">1 enfant</option>
                                                <option value="2">2 enfants</option>
                                                <option value="3+">3 ou plus</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2.5">
                                    <label className="block text-sm font-bold text-[#1E293B]">Ville de résidence</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => updateFormData('city', e.target.value)}
                                        placeholder="Entrez votre ville"
                                    className="w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium"
                                    />
                                </div>

                                <div className="space-y-4 pt-2">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => setAcceptTerms(e.target.checked)}
                                            className="h-5 w-5 rounded border-2 border-[#CBD5E1] text-[#1B6B3A] mt-0.5"
                                        />
                                        <span className="text-xs font-bold text-[#64748B] group-hover:text-[#1E293B]">
                                            J'accepte les conditions d'utilisation et la politique de confidentialité.
                                        </span>
                                    </label>

                                    <div
                                        onClick={() => {
                                            if (!isNotRobot && !isVerifying) {
                                                setIsVerifying(true);
                                                setTimeout(() => {
                                                    setIsVerifying(false);
                                                    setIsNotRobot(true);
                                                }, 1500);
                                            }
                                        }}
                                        className="w-full h-[74px] bg-[#f9f9f9] border border-[#d3d3d3] rounded-[3px] flex items-center justify-between px-3 py-2 shadow-[0_0_4px_rgba(0,0,0,0.05)] cursor-pointer group hover:border-[#b3b3b3] transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-[28px] h-[28px] rounded-[2px] border-2 flex items-center justify-center transition-all bg-white ${isNotRobot 
                                                ? 'border-transparent' 
                                                : isVerifying ? 'border-transparent' : 'border-[#c1c1c1] group-hover:border-[#b3b3b3]'}`}
                                            >
                                                {isVerifying ? (
                                                    <div className="w-[24px] h-[24px] border-[3px] border-[#4285f4] border-t-transparent rounded-full animate-spin" />
                                                ) : isNotRobot ? (
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        <svg className="w-10 h-10 text-[#00a35c] absolute -top-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                ) : null}
                                            </div>
                                            <span className="text-[14px] font-normal text-[#1E293B]">
                                                Je ne suis pas un robot
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-0">
                                            <div className="relative w-8 h-8 flex items-center justify-center">
                                                {/* Official reCAPTCHA Logo SVG Recreation */}
                                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 4.5V2l-3.5 3.5L12 9V6.5c3.04 0 5.5 2.46 5.5 5.5s-2.46 5.5-5.5 5.5-5.5-2.46-5.5-5.5H4.5c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5z" fill="#4285F4" />
                                                    <path d="M12 6.5c-1.44 0-2.74.56-3.71 1.47l-1.42-1.42C8.24 5.31 10.02 4.5 12 4.5v2z" fill="#4285F4" />
                                                    <path d="M8.29 7.97A5.48 5.48 0 0 0 6.5 12h-2c0-2.07.84-3.95 2.21-5.32l1.58 1.29z" fill="#777777" />
                                                    <path d="M12 17.5V20c-4.14 0-7.5-3.36-7.5-7.5h2c0 3.04 2.46 5.5 5.5 5.5z" fill="#777777" opacity="0.5" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#777777] tracking-tighter" style={{ fontFamily: 'sans-serif' }}>reCAPTCHA</span>
                                            <div className="flex gap-1 text-[7px] text-[#777777] whitespace-nowrap mt-0.5">
                                                <span>Confidentialité</span>
                                                <span>-</span>
                                                <span>Conditions</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 py-4 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-2 py-4 rounded-xl bg-[#1B6B3A] text-white font-black text-sm uppercase tracking-widest hover:bg-[#155230] transition-all shadow-lg active:scale-[0.98]"
                                    >
                                        {isLoading ? '...' : "S'inscrire"}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="text-center pt-8">
                            <p className="text-[#64748B] font-bold">
                                Déjà membre ?{' '}
                                <Link href="/login" className="text-[#64748B] font-medium hover:text-[#1E293B] hover:underline underline-offset-4 transition-colors">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
