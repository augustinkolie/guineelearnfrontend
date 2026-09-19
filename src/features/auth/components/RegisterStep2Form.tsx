'use client';

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { RoleType, schoolLevelsMapping, universityData, RECAPTCHA_SITE_KEY } from '../hooks/useRegisterForm';

interface RegisterStep2FormProps {
    selectedRole: RoleType;
    formData: any;
    acceptTerms: boolean;
    isLoading: boolean;
    captchaToken: string | null;
    recaptchaRef: React.RefObject<ReCAPTCHA | null>;
    onUpdateField: (field: string, value: string) => void;
    onAcceptTermsChange: (accepted: boolean) => void;
    onCaptchaChange: (token: string | null) => void;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const selectCls = "w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all text-[#1E293B] font-medium";
const inputCls = "w-full px-5 py-3 rounded-xl bg-[#E8F5EE] border-2 border-transparent focus:bg-white focus:border-[#1B6B3A] outline-none transition-all placeholder:text-[#94A3B8] text-[#1E293B] font-medium";

export const RegisterStep2Form: React.FC<RegisterStep2FormProps> = ({
    selectedRole, formData, acceptTerms, isLoading, captchaToken, recaptchaRef,
    onUpdateField, onAcceptTermsChange, onCaptchaChange, onBack, onSubmit
}) => (
    <form className="space-y-5" onSubmit={onSubmit}>
        {selectedRole === 'student' && (
            <>
                <div className="space-y-2.5">
                    <label className="block text-sm font-bold text-[#1E293B]">Niveau scolaire</label>
                    <select value={formData.schoolLevel} onChange={(e) => {
                        onUpdateField('schoolLevel', e.target.value);
                        onUpdateField('subLevel', ''); onUpdateField('faculty', ''); onUpdateField('department', '');
                    }} required className={selectCls}>
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
                        <select value={formData.subLevel} onChange={(e) => onUpdateField('subLevel', e.target.value)} required className={selectCls}>
                            <option value="">Sélectionnez votre classe</option>
                            {schoolLevelsMapping[formData.schoolLevel as keyof typeof schoolLevelsMapping]?.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                )}

                {formData.schoolLevel === 'Université' && (
                    <>
                        <div className="space-y-2.5">
                            <label className="block text-sm font-bold text-[#1E293B]">Faculté</label>
                            <select value={formData.faculty} onChange={(e) => { onUpdateField('faculty', e.target.value); onUpdateField('department', ''); }} required className={selectCls}>
                                <option value="">Sélectionnez votre faculté</option>
                                {Object.keys(universityData).map(fac => <option key={fac} value={fac}>{fac}</option>)}
                            </select>
                        </div>
                        {formData.faculty && (
                            <div className="space-y-2.5">
                                <label className="block text-sm font-bold text-[#1E293B]">Département</label>
                                <select value={formData.department} onChange={(e) => onUpdateField('department', e.target.value)} required className={selectCls}>
                                    <option value="">Sélectionnez votre département</option>
                                    {universityData[formData.faculty]?.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="space-y-2.5">
                            <label className="block text-sm font-bold text-[#1E293B]">Année de Licence</label>
                            <select value={formData.subLevel} onChange={(e) => onUpdateField('subLevel', e.target.value)} required className={selectCls}>
                                <option value="">Sélectionnez votre année</option>
                                {['Licence 1', 'Licence 2', 'Licence 3', 'Master', 'Doctorat'].map(yr => <option key={yr} value={yr}>{yr}</option>)}
                            </select>
                        </div>
                    </>
                )}

                <div className="space-y-2.5">
                    <label className="block text-sm font-bold text-[#1E293B]">Établissement</label>
                    <input type="text" value={formData.schoolName} onChange={(e) => onUpdateField('schoolName', e.target.value)} placeholder="Nom de votre école / université" className={inputCls} />
                </div>
            </>
        )}

        {selectedRole === 'teacher' && (
            <>
                <div className="space-y-2.5">
                    <label className="block text-sm font-bold text-[#1E293B]">Matière principale</label>
                    <select value={formData.subjects} onChange={(e) => onUpdateField('subjects', e.target.value)} required className={selectCls}>
                        <option value="">Sélectionnez une matière</option>
                        {['Mathématiques', 'Français', 'Sciences', 'Histoire'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="space-y-2.5">
                    <label className="block text-sm font-bold text-[#1E293B]">Établissement actuel</label>
                    <input type="text" value={formData.currentSchool} onChange={(e) => onUpdateField('currentSchool', e.target.value)} placeholder="Établissement" className={inputCls} />
                </div>
            </>
        )}

        {selectedRole === 'parent' && (
            <div className="space-y-2.5">
                <label className="block text-sm font-bold text-[#1E293B]">Nombre d&apos;enfants</label>
                <select value={formData.numberOfChildren} onChange={(e) => onUpdateField('numberOfChildren', e.target.value)} required className={selectCls}>
                    <option value="">Nombre d&apos;enfants</option>
                    <option value="1">1 enfant</option>
                    <option value="2">2 enfants</option>
                    <option value="3+">3 ou plus</option>
                </select>
            </div>
        )}

        <div className="space-y-2.5">
            <label className="block text-sm font-bold text-[#1E293B]">Ville de résidence</label>
            <input type="text" value={formData.city} onChange={(e) => onUpdateField('city', e.target.value)} placeholder="Entrez votre ville" className={inputCls} />
        </div>

        <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => onAcceptTermsChange(e.target.checked)} className="h-5 w-5 rounded border-2 border-[#CBD5E1] text-[#1B6B3A] mt-0.5" />
                <span className="text-xs font-bold text-[#64748B] group-hover:text-[#1E293B]">
                    J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.
                </span>
            </label>

            <div className="flex justify-center py-2">
                <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} onExpired={() => onCaptchaChange(null)} />
            </div>
        </div>

        <div className="flex gap-4 pt-4">
            <button type="button" onClick={onBack} className="flex-1 py-4 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all">
                Retour
            </button>
            <button type="submit" disabled={isLoading || !captchaToken || !acceptTerms} className="flex-2 py-4 rounded-xl bg-[#1B6B3A] text-white font-black text-sm uppercase tracking-widest hover:bg-[#155230] transition-all shadow-lg active:scale-[0.98] disabled:opacity-60">
                {isLoading ? '...' : "S'inscrire"}
            </button>
        </div>
    </form>
);
