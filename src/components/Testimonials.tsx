"use client";

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        name: "Fatoumata Diallo",
        role: "Élève en Terminale S",
        location: "Conakry",
        text: "Grâce à GuinéeLearn, j'ai pu réviser tous mes cours et réussir mon BAC avec mention. Les quiz m'ont beaucoup aidée à identifier mes faiblesses.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
    },
    {
        name: "Mamadou Camara",
        role: "Parent d'élève",
        location: "Kindia",
        text: "Je peux maintenant suivre la progression de mes enfants même quand je suis au travail. Les alertes m'aident à intervenir rapidement quand il y a des difficultés.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    },
    {
        name: "Aissatou Bah",
        role: "Enseignante de Mathématiques",
        location: "Labé",
        text: "Cette plateforme m'a permis de mieux organiser mes cours et de suivre mes élèves individuellement. Les statistiques sont très utiles pour adapter mon enseignement.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop",
    },
    {
        name: "Ibrahima Sow",
        role: "Élève en 3ème",
        location: "Kankan",
        text: "Les cours sont faciles à comprendre et je peux apprendre même avec ma connexion lente. J'ai amélioré mes notes en sciences grâce aux exercices.",
        rating: 5,
        image: "/assets/images/img1.jpg",
    },
    {
        name: "Mariama Sylla",
        role: "Parent d'élève",
        location: "Nzérékoré",
        text: "Mes trois enfants utilisent GuinéeLearn. Le plan famille est très économique et ils progressent tous. Je recommande vivement cette plateforme.",
        rating: 5,
        image: "/assets/images/img2.jpg",
    },
    {
        name: "Abdoulaye Diakité",
        role: "Enseignant d'Histoire",
        location: "Boké",
        text: "Enfin une plateforme adaptée au programme guinéen ! Je peux créer mes propres quiz et partager des ressources avec mes collègues.",
        rating: 5,
        image: "/assets/images/img3.jpg",
    },
];

export const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isPaused, currentIndex]); // depend on currentIndex to reset timer on manual change if needed, though mostly isPaused is key

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="bg-white py-12 px-4 md:px-12 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-[2rem] font-extrabold text-[#1A3329] mb-2"
                    >
                        Ce qu'ils disent de nous
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-base text-gray-600 max-w-2xl mx-auto"
                    >
                        Des milliers d'élèves, parents et enseignants nous font confiance
                    </motion.p>
                </div>

                <div
                    className="relative max-w-[1600px] mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Main Content Area - Split Layout */}
                    <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">

                        {/* Left Side - Large Image */}
                        <div className="w-full md:w-1/2 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`img-${currentIndex}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative aspect-square overflow-hidden shadow-2xl rounded-lg"
                                >
                                    <img
                                        src={testimonials[currentIndex].image}
                                        alt={testimonials[currentIndex].name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    {/* Decorative gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0F2D1E]/20 to-transparent" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Decorative element behind image */}
                            <div className="absolute -z-10 top-10 -left-10 w-full h-full border-2 border-[#1A3329]/5 translate-x-4 translate-y-4" />
                        </div>

                        {/* Right Side - Content */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center relative">
                            <Quote className="w-12 h-12 text-gray-100 rotate-180 mb-6" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`content-${currentIndex}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative z-10"
                                >
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-[#F2B600] text-[#F2B600]" />
                                        ))}
                                    </div>

                                    <blockquote className="text-lg md:text-xl lg:text-2xl text-[#1A3329] font-medium leading-relaxed mb-8 italic">
                                        "{testimonials[currentIndex].text}"
                                    </blockquote>

                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold text-[#1A3329] mb-1.5">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        <p className="text-[#1B6B3A] font-semibold text-base md:text-lg mb-1">
                                            {testimonials[currentIndex].role}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {testimonials[currentIndex].location}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 mt-16 md:mt-24">
                        <button
                            onClick={prevSlide}
                            className="p-2.5 bg-white border border-gray-200 rounded-full text-[#1A3329] hover:bg-[#1B6B3A] hover:text-white transition-all shadow-lg hover:shadow-xl active:scale-95 group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        <div className="flex gap-3">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "w-8 bg-[#1B6B3A]"
                                        : "w-3 bg-gray-300 hover:bg-[#1B6B3A]/50"
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="p-2.5 bg-white border border-gray-200 rounded-full text-[#1A3329] hover:bg-[#1B6B3A] hover:text-white transition-all shadow-lg hover:shadow-xl active:scale-95 group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
