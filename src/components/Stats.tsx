"use client";

import { BookOpen, Users, GraduationCap, Star } from 'lucide-react';
import { motion, useSpring, useMotionValue, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

const stats = [
    {
        icon: <BookOpen className="w-7 h-7 text-[#1B6B3A]" />,
        value: 500,
        suffix: "+",
        label: "Cours disponibles",
    },
    {
        icon: <Users className="w-7 h-7 text-[#1B6B3A]" />,
        value: 10000,
        suffix: "+",
        label: "Élèves actifs",
    },
    {
        icon: <GraduationCap className="w-7 h-7 text-[#1B6B3A]" />,
        value: 200,
        suffix: "+",
        label: "Enseignants",
    },
    {
        icon: <Star className="w-7 h-7 text-[#1B6B3A]" />,
        value: 95,
        suffix: "%",
        label: "Taux de satisfaction",
    },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
    const ref = useRef(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                (ref.current as HTMLElement).textContent = Intl.NumberFormat("en-US").format(
                    Math.floor(latest)
                ) + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref}>0{suffix}</span>;
};

export const Stats = () => {
    return (
        <section id="stats" className="py-14 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center mb-4 border border-[#D5EAE0]">
                                {stat.icon}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1A3329] mb-1 tracking-tight">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </h3>
                            <p className="text-[#64748B] font-semibold text-xs md:text-sm uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
