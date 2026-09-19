"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const MissionSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT: Texte */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            {/* Label */}
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#27AE60]">
              Ensemble, nous pouvons faire la différence
            </span>

            {/* Titre */}
            <h2 className="text-3xl md:text-4xl font-black text-[#0F2D1E] leading-tight">
              Chaque enfant guinéen a le droit d&apos;apprendre.
            </h2>

            {/* Paragraphe */}
            <p className="text-base text-gray-600 leading-relaxed max-w-lg">
              En Guinée, des milliers d&apos;enfants n&apos;ont pas accès à des
              ressources éducatives de qualité. GuinéeLearn est une plateforme
              accessible à tous, qui donne à chaque élève — qu&apos;il soit en
              ville ou en zone rurale — les outils pour réussir son parcours
              scolaire. Vous pouvez changer le cours de la vie d&apos;un enfant.
            </p>

            {/* CTA */}
            <div className="pt-2">
              <Link href="/register">
                <button className="px-8 py-4 bg-[#1B6B3A] hover:bg-[#155230] text-white font-bold text-base rounded-lg transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-[#1B6B3A]/25">
                  Rejoindre GuinéeLearn gratuitement
                </button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: Image avec décorations */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full lg:w-1/2 relative flex justify-center"
          >
            <div className="relative w-full">

              {/* Image avec forme parallélogramme */}
              <div
                className="relative z-10 overflow-hidden shadow-2xl w-full"
                style={{
                  clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)",
                }}
              >
                <Image
                  src="/assets/images/etudiant.png"
                  alt="Étudiant guinéen apprenant sur tablette"
                  width={1200}
                  height={1200}
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
