'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { apiCall } from '@/utils/api';

export type RoleType = 'student' | 'teacher' | 'parent' | null;

export const RECAPTCHA_SITE_KEY = '6LczKrcsAAAAADbeEpmMJhSWkMGy8pRnkQuewJPd';

export const schoolLevelsMapping = {
    "Primaire": ["1ère Année", "2ème Année", "3ème Année", "4ème Année", "5ème Année", "6ème Année"],
    "Collège": ["7ème Année", "8ème Année", "9ème Année", "10ème Année"],
    "Lycée": [
        "11ème SM", "11ème SE", "11ème SS", 
        "12ème SM", "12ème SE", "12ème SS", 
        "TSM", "TSE", "TSS"
    ]
};

export const universityData: Record<string, string[]> = {
    "Faculté des Sciences et Techniques de la Santé": ["Médecine", "Pharmacie", "Odontostomatologie"],
    "Faculté des Sciences et Techniques (FSET)": ["Mathématiques", "Physique", "Chimie", "Biologie", "MIAGE", "Informatique"],
    "Faculté des Sciences Économiques et de Gestion (FSEG)": ["Économie", "Gestion", "Banque & Finance"],
    "Faculté des Sciences Juridiques et Politiques (FSJP)": ["Droit Public", "Droit Privé", "Sciences Politiques"],
    "Faculté des Lettres et Sciences Humaines (FLSH)": ["Lettres Modernes", "Philosophie", "Sociologie", "Géographie", "Histoire"],
    "Faculté des Sciences Sociales (FSS)": ["Communication", "Journalisme", "Administration Publique"],
    "Faculté d'Agronomie et de Médecine Vétérinaire": ["Agronomie", "Eaux et Forêts", "Médecine Vétérinaire"],
    "Institut Polytechnique (Génie)": ["Génie Civil", "Génie Électrique", "Génie Mécanique", "Génie Informatique", "Télécommunications"]
};

export function useRegisterForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<RoleType>('student');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);

    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', password: '', confirmPassword: '',
        schoolLevel: '', subLevel: '', faculty: '', department: '',
        schoolName: '', city: '', subjects: '', experienceYears: '',
        currentSchool: '', numberOfChildren: '',
    });

    const updateFormData = (field: string, value: string) => {
        let finalValue = value;
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

    const handleBack = () => setCurrentStep(1);

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken || !acceptTerms) return;

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
                    profileData,
                    captchaToken
                }),
            });

            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || "Échec de l'inscription");
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentStep, selectedRole, setSelectedRole, acceptTerms, setAcceptTerms,
        showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
        isLoading, error, captchaToken, setCaptchaToken, recaptchaRef, formData,
        updateFormData, handleContinue, handleBack, handleFinalSubmit,
    };
}
