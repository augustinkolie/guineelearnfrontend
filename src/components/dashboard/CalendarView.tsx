'use client';

import React, { useState } from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    MapPin, 
    Calendar as CalendarIcon,
    Plus,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

const INITIAL_EVENTS = [
    { id: 1, title: 'Mathématiques', type: 'Cours', day: 'Lun', time: '08:00', duration: '2h', color: 'bg-[#1B6B3A]', room: 'Salle 102' },
    { id: 2, title: 'Physique-Chimie', type: 'Cours', day: 'Mar', time: '10:00', duration: '2h', color: 'bg-sky-700', room: 'Labo 1' },
    { id: 3, title: 'Examen Français', type: 'Examen', day: 'Mer', time: '08:00', duration: '4h', color: 'bg-rose-700', room: 'Amphi A' },
    { id: 4, title: 'Histoire-Géo', type: 'Cours', day: 'Jeu', time: '14:00', duration: '2h', color: 'bg-amber-600', room: 'Salle 204' },
    { id: 5, title: 'Anglais', type: 'Quiz', day: 'Ven', time: '11:00', duration: '1h', color: 'bg-indigo-600', room: 'Salle 105' },
];

const PRESET_COLORS = [
    { name: 'Vert', value: 'bg-[#1B6B3A]' },
    { name: 'Bleu', value: 'bg-sky-700' },
    { name: 'Rouge', value: 'bg-rose-700' },
    { name: 'Ambre', value: 'bg-amber-600' },
    { name: 'Indigo', value: 'bg-indigo-600' },
];

export const CalendarView = () => {
    const [currentWeek, setCurrentWeek] = useState('05 - 11 Avril 2026');
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newDay, setNewDay] = useState('Lun');
    const [newTime, setNewTime] = useState('08:00');
    const [newRoom, setNewRoom] = useState('');
    const [newColor, setNewColor] = useState('bg-[#1B6B3A]');

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newDay || !newTime) return;

        const newEvent = {
            id: Date.now(),
            title: newTitle,
            type: 'Cours',
            day: newDay,
            time: newTime,
            duration: '2h',
            color: newColor,
            room: newRoom || 'TBD'
        };

        setEvents([...events, newEvent]);
        setIsModalOpen(false);
        // Reset
        setNewTitle('');
        setNewRoom('');
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Mon Calendrier</h2>
                    <p className="text-gray-500 font-medium tracking-wide">Suivez votre emploi du temps et vos échéances importantes.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <button className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#1B6B3A]" />
                        <span className="text-sm font-black text-[#0F2D1E] whitespace-nowrap">{currentWeek}</span>
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-[#0F2D1E] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#0F2D1E]/20 transition-all">
                        Semaine
                    </button>
                    <button className="px-5 py-2.5 bg-white text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest hover:text-gray-600 transition-all">
                        Mois
                    </button>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1B6B3A] text-white rounded-xl font-bold shadow-lg shadow-[#1B6B3A]/20 hover:scale-[1.02] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un rappel</span>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-8 border-b border-gray-50">
                    <div className="p-6 border-r border-gray-50 invisible md:visible" />
                    {weekDays.map((day) => (
                        <div key={day} className="p-6 text-center border-r border-gray-50 last:border-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{day}</p>
                            <p className={`text-lg font-black ${day === 'Mer' ? 'text-[#1B6B3A]' : 'text-[#0F2D1E]'}`}>
                                {8 + weekDays.indexOf(day)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="relative">
                    {times.map((time) => (
                        <div key={time} className="grid grid-cols-8 border-b border-gray-50 last:border-0 min-h-[100px]">
                            <div className="p-6 border-r border-gray-50 text-right">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{time}</span>
                            </div>
                            {weekDays.map((day) => (
                                <div key={`${day}-${time}`} className="relative p-2 border-r border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-colors">
                                    {/* Render Event if exists */}
                                    {events.find(e => e.day === day && e.time === time) && (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={`absolute inset-2 ${events.find(e => e.day === day && e.time === time)?.color} rounded-xl p-3 shadow-sm cursor-pointer hover:brightness-110 transition-all z-10`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-white text-[10px] font-black uppercase tracking-tighter truncate">
                                                    {events.find(e => e.day === day && e.time === time)?.title}
                                                </p>
                                                <MoreHorizontal className="w-3 h-3 text-white/60" />
                                            </div>
                                            <div className="flex items-center gap-1.5 text-white/80">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[9px] font-bold">{events.find(e => e.day === day && e.time === time)?.duration}</span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-1 text-white/90">
                                                <MapPin className="w-3 h-3" />
                                                <span className="text-[9px] font-bold truncate">{events.find(e => e.day === day && e.time === time)?.room}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Event Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#0F2D1E]/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden p-8"
                        >
                            <h3 className="text-2xl font-black text-[#0F2D1E] mb-6 tracking-tight">Ajouter un rappel</h3>
                            
                            <form onSubmit={handleAddEvent} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matière / Titre</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Ex: Chimie"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jour</label>
                                        <select 
                                            value={newDay}
                                            onChange={(e) => setNewDay(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all appearance-none"
                                        >
                                            {weekDays.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Heure</label>
                                        <select 
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all appearance-none"
                                        >
                                            {times.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Salle (Optionnel)</label>
                                    <input 
                                        type="text" 
                                        value={newRoom}
                                        onChange={(e) => setNewRoom(e.target.value)}
                                        placeholder="Ex: Labo 2"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Couleur</label>
                                    <div className="flex gap-3">
                                        {PRESET_COLORS.map((c) => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                onClick={() => setNewColor(c.value)}
                                                className={`w-10 h-10 rounded-full ${c.value} shadow-md transition-all ${newColor === c.value ? 'ring-4 ring-gray-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 px-6 py-4 bg-[#1B6B3A] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#1B6B3A]/20 hover:bg-[#155230] transition-all"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
