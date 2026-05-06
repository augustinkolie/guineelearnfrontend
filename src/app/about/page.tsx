'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
    ShieldCheck, 
    Smartphone, 
    CreditCard, 
    Users, 
    FileVideo, 
    FileCheck, 
    TrendingUp, 
    CloudOff
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
 
export default function AboutPage() {
    // Coordonnées de la souris avec Framer Motion pour la fluidité/inertie
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Configuration du ressort (Spring) pour l'effet de lag/flottaison
    const springConfig = { damping: 30, stiffness: 100, mass: 1 };
    const xSpring = useSpring(mouseX, springConfig);
    const ySpring = useSpring(mouseY, springConfig);

    // Calcul de la déformation basée sur la vitesse
    const velocityX = useVelocity(xSpring);
    const velocityY = useVelocity(ySpring);
    
    // On combine les vitesses pour obtenir une déformation globale (squash and stretch)
    const scale = useTransform(
        [velocityX, velocityY],
        ([vX, vY]) => {
            const speed = Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2));
            return 1 + Math.min(speed / 2000, 0.15); // Agrandissement léger au mouvement
        }
    );

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar forceOpaque />
 
            <main className="pt-14">
 
                <section 
                    onMouseMove={handleMouseMove}
                    className="group relative w-full pt-0 pb-8 overflow-hidden border-b border-gray-50 transition-colors duration-500"
                >
                    {/* Motif de fond (Dashes Multicolores Style Antigravity) */}
                    <motion.div className="absolute inset-0 z-0 opacity-[0.55]" 
                         style={{ 
                             backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%231B6B3A'/%3E%3C/svg%3E")`,
                             backgroundRepeat: 'repeat',
                             x: useTransform(xSpring, x => (x - 600) / 40),
                             y: useTransform(ySpring, y => (y - 300) / 40),
                             scale: 1.05
                         }} 
                    />

                    {/* Aura multicolore dynamique avec Lenteur/Inertie (Lag) */}
                    <motion.div 
                        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                        style={{
                            x: xSpring,
                            y: ySpring,
                            translateX: '-50%',
                            translateY: '-50%',
                            scale,
                            width: '1000px',
                            height: '1000px',
                            left: 0,
                            top: 0,
                            background: `
                                radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 60%),
                                radial-gradient(circle at center, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
                                radial-gradient(circle at 60% 40%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
                                radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
                            `
                        }}
                    />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-20">
                        {/* Texte gauche */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-6"
                        >
                            <h1 className="text-3xl lg:text-4xl font-black text-[#0F2D1E] leading-[1.1] whitespace-nowrap">
                                Qu&apos;est-ce que <span className="text-[#1B6B3A]">Guin&eacute;eLearn</span> ?
                            </h1>
                            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                                GuinéeLearn est une plateforme éducative innovante conçue pour offrir aux élèves guinéens un accès simple, rapide et sécurisé à des contenus pédagogiques de qualité, adaptés aux réalités du pays. Notre mission est de démocratiser l'éducation en Guinée grâce à la technologie.
                            </p>
                        </motion.div>

                        {/* Image circulaire droite — style référence */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex-1 flex justify-center items-end"
                        >
                            <div className="relative" style={{ width: 540, height: 600 }}>
                                {/* Grand cercle coloré en arrière-plan */}
                                <div
                                    className="absolute rounded-full bg-[#1B6B3A]/15 border-[3px] border-[#1B6B3A]/30"
                                    style={{ width: 440, height: 440, bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
                                />
                                {/* Photo clippée en cercle qui déborde au-dessus */}
                                <div
                                    className="absolute rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]"
                                    style={{ width: 460, height: 460, bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/about_hero.png"
                                        alt="Étudiant GuinéeLearn"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </section>

                {/* SECTION CTA HERO — style référence */}
                <section className="w-full bg-white border-b border-gray-100 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16 flex flex-col lg:flex-row items-center gap-12">

                        {/* Gauche : Image héro */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 flex justify-center items-end"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/about_cta_hero.png"
                                alt="Apprenante GuinéeLearn sur mobile"
                                className="w-full max-w-[520px] h-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Droite : Texte + Boutons */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-6"
                        >
                            <h2 className="text-3xl lg:text-4xl font-black text-[#0F2D1E] leading-[1.15]">
                                Apprenez et progressez avec{' '}
                                <span className="text-[#F59E0B]">GuinéeLearn</span>{' '}
                                facilement en Guinée
                            </h2>
                            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                                GuinéeLearn permet d&apos;accéder à des cours vidéos, des quiz et des examens blancs
                                via Orange Money et MTN Mobile Money. Une solution rapide, fiable et conçue
                                spécialement pour les élèves guinéens. Apprenez, progressez et obtenez vos
                                certificats en toute sécurité directement depuis votre mobile.
                            </p>

                            {/* Boutons */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                <a
                                    href="/register"
                                    className="inline-flex justify-center items-center px-8 py-3 rounded-full font-bold text-white text-base transition-all hover:bg-[#155c30] active:scale-95"
                                    style={{ backgroundColor: '#1B6B3A', boxShadow: '0 4px 20px rgba(27,107,58,0.30)' }}
                                >
                                    Commencer maintenant
                                </a>
                                <a
                                    href="https://play.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm bg-[#0F2D1E] hover:bg-[#1B6B3A] transition-colors"
                                >
                                    {/* Google Play Icon */}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.18 23.76a2 2 0 0 1-.68-.53 2 2 0 0 1-.5-1.4V2.17A2 2 0 0 1 3.5.3L14.06 12 3.18 23.76zm1.38.24L16.3 13.26l2.84 2.84-11.1 6.41a2.1 2.1 0 0 1-3.48 1.49zM20.56 10.3 17.5 8.5 14.5 12l3 3 3.06-1.8a2 2 0 0 0 0-2.9zM4.56 0 15.67 10.74 12.83 13.5l-2.85-2.84L4.56 0z"/>
                                    </svg>
                                    <span className="flex flex-col leading-tight text-left">
                                        <span className="text-[10px] font-normal opacity-80">DISPONIBLE SUR</span>
                                        <span className="text-sm font-bold">Google Play</span>
                                    </span>
                                </a>
                            </div>
                        </motion.div>

                    </div>
                </section>

                {/* SECTION 2: PLATEFORME CONÇUE POUR LA GUINÉE */}
                <section className="bg-gray-50 border-y border-gray-100 py-14">
                    <div className="max-w-7xl mx-auto px-6 lg:px-20">
                        <div className="text-center space-y-3 mb-10">
                            <h2 className="text-3xl lg:text-4xl font-black text-[#0F2D1E]">
                                Une plateforme conçue pour la <span className="text-[#1B6B3A]">Guinée</span>
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                GuinéeLearn a été créée pour répondre aux réalités locales, en offrant une solution simple, sécurisée et parfaitement adaptée aux besoins des élèves.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: CreditCard,
                                    title: "Paiements locaux intégrés",
                                    desc: "Payez vos abonnements facilement avec Orange Money et Mobile Money. Plus besoin de carte bancaire internationale.",
                                },
                                {
                                    icon: Smartphone,
                                    title: "Simple et accessible",
                                    desc: "Une interface intuitive conçue pour tous. Que vous soyez débutant ou expert, GuinéeLearn vous permet d'apprendre facilement.",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Qualité maximale",
                                    desc: "Vos contenus sont validés par les meilleurs enseignants. GuinéeLearn garantit la pertinence et la qualité de vos cours.",
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-6 rounded-lg border border-gray-200 text-center group hover:border-[#1B6B3A]/30 transition-colors"
                                >
                                    <div className="w-11 h-11 bg-[#1B6B3A] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-[#0F2D1E] mb-3">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: POURQUOI CHOISIR (DARK) */}
                <section className="bg-[#0B130E] text-white py-20">
                    {/* Contenu principal : image gauche + texte droite */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-16">
                        <div className="flex flex-col lg:flex-row items-start gap-16">
                            
                            {/* Image à gauche — même taille que la section CTA */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex-1 flex justify-center items-center"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/about_why.png"
                                    alt="Pourquoi choisir GuinéeLearn"
                                    className="w-full max-w-[520px] h-auto object-contain drop-shadow-2xl"
                                    style={{ borderRadius: 8 }}
                                />
                            </motion.div>

                            {/* Texte à droite — prend l'espace restant */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                style={{ flex: 1 }}
                                className="self-start pt-4"
                            >
                                <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-6">
                                    Pourquoi choisir <span className="text-[#1B6B3A]">GuinéeLearn</span>
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-gray-300 text-base leading-relaxed">
                                        GuinéeLearn est une solution innovante conçue pour offrir aux élèves guinéens une expérience d'apprentissage rapide, fiable et accessible. Notre mission est de démocratiser l'accès à l'éducation en Guinée en proposant une plateforme simple, sécurisée et parfaitement adaptée aux réalités locales.
                                    </p>
                                    <p className="text-gray-300 text-base leading-relaxed">
                                        Nous comprenons les défis uniques auxquels sont confrontés les apprenants aujourd'hui. C'est pourquoi nous avons intégré des fonctionnalités essentielles telles que la consultation hors-ligne des cours, des évaluations interactives sous forme de quiz, et un suivi de progression en temps réel pour vous aider à atteindre l'excellence académique à votre propre rythme.
                                    </p>
                                    <p className="text-gray-300 text-base leading-relaxed">
                                        Avec le soutien des meilleurs enseignants et des méthodes pédagogiques modernes, GuinéeLearn s'engage à transformer chaque obstacle en une opportunité de réussite. Rejoignez des milliers d'élèves qui ont déjà pris le contrôle de leur avenir.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Cartes de statistiques — pleine largeur en bas */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Préfectures supportées", value: "33+" },
                                { label: "Utilisateurs actifs", value: "10 000+" },
                                { label: "Satisfaction élèves %", value: "99" },
                                { label: "Support académique 24/7", value: "24" }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="bg-white/5 border border-white/10 rounded-lg p-8 text-center"
                                >
                                    <p className="text-4xl font-black text-[#1B6B3A] mb-2">{stat.value}</p>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 4: FONCTIONNALITÉS */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-20">
                        <div className="text-center space-y-3 mb-16">
                            <h2 className="text-3xl lg:text-4xl font-black text-[#0F2D1E]">
                                Fonctionnalités <span className="text-[#1B6B3A]">GuinéeLearn</span>
                            </h2>
                            <p className="text-gray-500">Une plateforme éducative moderne conçue pour la Guinée</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: FileVideo, title: "Cours Vidéos & PDF", desc: "Apprenez avec vos cours préférés partout." },
                                { icon: FileCheck, title: "Quiz & Examens Blancs", desc: "Testez vos connaissances en quelques secondes." },
                                { icon: ShieldCheck, title: "Qualité Maximale", desc: "Contenus vérifiés par des experts." },
                                { icon: CloudOff, title: "Mode Hors-ligne", desc: "Téléchargez pour réviser sans internet." },
                                { icon: TrendingUp, title: "Suivi de Progression", desc: "Visualisez vos progrès en temps réel." },
                                { icon: Users, title: "Support 24/7", desc: "Assistance pédagogique permanente." }
                            ].map((feat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white p-5 rounded-lg border border-gray-200 group hover:border-[#1B6B3A]/40 transition-all"
                                >
                                    <div className="w-10 h-10 bg-[#1B6B3A] text-white rounded-lg flex items-center justify-center mb-3">
                                        <feat.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-black text-[#0F2D1E] mb-1">{feat.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{feat.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
