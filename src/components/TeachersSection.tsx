"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const TeachersSection = () => {
  return (
    <section className="py-24 bg-[#F0F7F3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: organic image composition */}
          <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative w-[350px] sm:w-[500px] h-[350px] sm:h-[500px]">
              
              {/* Decorative: Grid Dots (Top Left) */}
              <div className="absolute top-0 left-0 -translate-x-12 -translate-y-8 opacity-20 hidden sm:block">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <path d="M5 5h2v2H5V5zm12 0h2v2h-2V5zm12 0h2v2h-2V5zm12 0h2v2h-2V5zm12 0h2v2h-2V5zm-48 12h2v2H5v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm-48 12h2v2H5v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm-48 12h2v2H5v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm-48 12h2v2H5v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2zm12 0h2v2h-2v-2z" fill="currentColor" className="text-[#1B6B3A]" />
                </svg>
              </div>

              {/* Blob 1: Green (Top) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute top-0 left-[20%] w-[60%] h-[60%] z-30"
              >
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-[#5FA07F] opacity-80" style={{ clipPath: "url(#blob1)" }}></div>
                  <div className="w-full h-full relative" style={{ clipPath: "url(#blob1)" }}>
                    <Image 
                      src="/assets/images/student-teacher-1.png" 
                      alt="Portrait élève 1"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Blob 2: Blue-grey (Bottom Left) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="absolute bottom-10 left-0 w-[50%] h-[50%] z-20"
              >
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-[#C0D1D2] opacity-90" style={{ clipPath: "url(#blob2)" }}></div>
                  <div className="w-full h-full relative" style={{ clipPath: "url(#blob2)" }}>
                    <Image 
                      src="/assets/images/etudiant.png" 
                      alt="Étudiant"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Blob 3: Orange (Bottom Right) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-5 right-10 w-[55%] h-[55%] z-20"
              >
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-[#F2825A] opacity-90" style={{ clipPath: "url(#blob3)" }}></div>
                  <div className="w-full h-full relative" style={{ clipPath: "url(#blob3)" }}>
                    <Image 
                      src="/assets/images/lyceenne.png" 
                      alt="Lycéenne"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Doodles (Exact from Khan Academy) */}
              <svg className="absolute inset-0 w-full h-full z-40 pointer-events-none" viewBox="0 0 500 500" fill="none">
                {/* Star (Middle Right) - Customized color */}
                <path 
                  d="M400,100 L410,130 L440,130 L415,150 L425,180 L400,160 L375,180 L385,150 L360,130 L390,130 Z" 
                  fill="#F2825A" 
                />

                {/* Ring (Top Right) */}
                <circle cx="450" cy="220" r="15" stroke="#C0D1D2" strokeWidth="4" />
              </svg>

              {/* Definitions for clip-paths (Exact shapes from the screenshot) */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <clipPath id="blob1" clipPathUnits="objectBoundingBox">
                    <path d="M0.5,0 C0.8,0 1,0.2 1,0.5 C1,0.8 0.8,1 0.5,1 C0.2,1 0,0.8 0,0.5 C0,0.2 0.2,0 0.5,0 Z" />
                  </clipPath>
                  <clipPath id="blob2" clipPathUnits="objectBoundingBox">
                    <path d="M0.17,0.17 C0.4,0 0.85,0.05 0.95,0.4 C1,0.7 0.8,0.95 0.5,0.98 C0.2,1 0,0.75 0.05,0.4 C0.1,0.2 0.1,0.17 0.17,0.17 Z" />
                  </clipPath>
                  <clipPath id="blob3" clipPathUnits="objectBoundingBox">
                    <path d="M0.1,0.5 C0.1,0.2 0.35,0 0.65,0.05 C0.9,0.1 1,0.4 0.95,0.7 C0.9,0.9 0.65,1 0.35,0.95 C0.1,0.9 0.1,0.7 0.1,0.5 Z" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                POUR LES ENSEIGNANTS
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0F2D1E] leading-tight">
                Faites de la différenciation dans votre classe et motivez chaque élève.
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Nous aidons les enseignants dans leur travail en classe. Déjà des centaines d'enseignants guinéens qui utilisent GuinéeLearn pour booster l'engagement et les résultats de leurs élèves.
            </p>
            <div className="pt-4">
              <button className="px-10 py-4 bg-[#1B6B3A] text-white rounded-xl font-bold text-base hover:bg-[#155230] transition-all transform hover:-translate-y-1 shadow-xl shadow-[#1B6B3A]/20 active:scale-95">
                Enseignants, commencez ici
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
