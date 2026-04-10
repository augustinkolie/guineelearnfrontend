"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi';

const slides = [
    {
        image: '/hero-bg.png',
        title: "L'éducation de qualité <br /> pour tous les Guinéens",
        description: "Une plateforme éducative complète adaptée au programme guinéen. Cours, quiz, suivi de progression et orientation scolaire."
    },
    {
        image: '/assets/images/students_with_phones.png',
        title: "Apprenez partout, <br /> à tout moment",
        description: "Accédez à vos cours et suivez votre progression depuis votre smartphone. Une expérience d'apprentissage moderne et interactive."
    },
    {
        image: '/assets/images/student_and_father_progress.png',
        title: "Le succès de vos enfants <br /> à portée de main",
        description: "Suivez en temps réel les performances académiques de vos enfants et accompagnez-les vers l'excellence."
    }
];

export const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const scrollToStats = () => {
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url("${slides[currentSlide].image}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 flex flex-col items-center text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
                            {slides[currentSlide].title.split('<br />').map((line, i) => (
                                <span key={i}>{line}{i < slides[currentSlide].title.split('<br />').length - 1 && <br />}</span>
                            ))}
                        </h1>

                        <p className="text-base md:text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                            {slides[currentSlide].description}
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
                            <button className="bg-[#1B6B3A] hover:bg-[#155230] text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-[#1B6B3A]/40 w-full md:w-auto tracking-wide">
                                Commencer gratuitement
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-105 active:scale-95 w-full md:w-auto tracking-wide">
                                Découvrir la plateforme
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition-all transform hover:scale-110 active:scale-90 border border-white/20"
                aria-label="Previous slide"
            >
                <FiChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition-all transform hover:scale-110 active:scale-90 border border-white/20"
                aria-label="Next slide"
            >
                <FiChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full ${currentSlide === index ? 'w-8 h-2.5 bg-[#27AE60]' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator Arrow */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                onClick={scrollToStats}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 hidden md:block cursor-pointer group text-white/50 hover:text-white transition-colors"
                aria-label="Scroll down"
            >
                <FiChevronDown size={32} />
            </motion.div>
        </div>
    );
};
