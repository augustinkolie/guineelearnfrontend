'use client';

import React from 'react';
import { User, BookOpen, Users, Eye, EyeOff } from 'lucide-react';
import { RoleType } from '../hooks/useRegisterForm';

const roles = [
    { id: 'student' as RoleType, icon: User, title: 'Élève', desc: 'Apprenant' },
    { id: 'teacher' as RoleType, icon: BookOpen, title: 'Enseignant', desc: 'Formateur' },
    { id: 'parent' as RoleType, icon: Users, title: 'Parent', desc: 'Tuteur' }
];

interface RegisterStep1FormProps {
    selectedRole: RoleType;
    formData: any;
    showPassword: boolean;
    showConfirmPassword: boolean;
    onSelectRole: (role: RoleType) => void;
    onUpdateField: (field: string, value: string) => void;
    onToggleShowPassword: () => void;
    onToggleShowConfirmPassword: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const inputCls = "w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium";

export const RegisterStep1Form: React.FC<RegisterStep1FormProps> = ({
    selectedRole, formData, showPassword, showConfirmPassword,
    onSelectRole, onUpdateField, onToggleShowPassword, onToggleShowConfirmPassword, onSubmit
}) => (
    <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2.5">
            <div className="flex gap-3">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                        <button key={role.id} type="button" onClick={() => onSelectRole(role.id)}
                            className={`flex-1 py-3 px-2 rounded-xl border transition-all flex flex-col items-center text-center gap-1.5 relative group ${
                                isSelected ? 'border-[#1B6B3A] bg-[#F0FFF4]' : 'border-[#E8F5EE] bg-white hover:border-[#E2E8F0]'
                            }`}>
                            <div className={`transition-all ${isSelected ? 'text-[#1B6B3A] scale-110' : 'text-[#94A3B8] group-hover:text-[#64748B]'}`}>
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
            <input type="text" value={formData.fullName} onChange={(e) => onUpdateField('fullName', e.target.value)} placeholder="Votre nom complet" required className={inputCls} />
        </div>

        <div className="space-y-2.5">
            <label className="block text-sm font-bold text-[#1E293B]">Adresse e-mail</label>
            <input type="email" value={formData.email} onChange={(e) => onUpdateField('email', e.target.value)} placeholder="exemple@email.com" required className={inputCls} />
        </div>

        <div className="space-y-2.5">
            <label className="block text-sm font-bold text-[#1E293B]">Téléphone</label>
            <input type="tel" value={formData.phone} onChange={(e) => onUpdateField('phone', e.target.value)} placeholder="+224 XXX XXX XXX" required className={inputCls} />
        </div>

        <div className="space-y-2.5">
            <label className="block text-sm font-bold text-[#1E293B]">Mot de passe</label>
            <div className="relative">
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => onUpdateField('password', e.target.value)} placeholder="••••••••" required className={inputCls} />
                <button type="button" onClick={onToggleShowPassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>

        <div className="space-y-2.5">
            <label className="block text-sm font-bold text-[#1E293B]">Confirmer mot de passe</label>
            <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => onUpdateField('confirmPassword', e.target.value)} placeholder="••••••••" required className={inputCls} />
                <button type="button" onClick={onToggleShowConfirmPassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>

        <div className="pt-4">
            <button type="submit" className="w-full py-4 rounded-xl bg-[#1B6B3A] text-white font-black text-sm uppercase tracking-widest hover:bg-[#155230] transition-all shadow-lg active:scale-[0.98]">
                Continuer
            </button>
        </div>
    </form>
);
