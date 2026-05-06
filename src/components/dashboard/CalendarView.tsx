'use client';

import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    MapPin, 
    Calendar as CalendarIcon,
    Plus,
    MoreHorizontal,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiCall } from '@/utils/api';

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

const PRESET_COLORS = [
    { name: 'Vert', value: 'bg-[#1B6B3A]' },
    { name: 'Bleu', value: 'bg-sky-700' },
    { name: 'Rouge', value: 'bg-rose-700' },
    { name: 'Ambre', value: 'bg-amber-600' },
    { name: 'Indigo', value: 'bg-indigo-600' },
];

export const CalendarView = () => {
    const [baseDate, setBaseDate] = useState(new Date()); 
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch events from backend
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await apiCall('/calendar', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEvents(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Date Utilities
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const formatWeekRange = (date: Date) => {
        const start = getStartOfWeek(date);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        const formatDay = (d: Date) => d.getDate().toString().padStart(2, '0');
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        
        return `${formatDay(start)} - ${formatDay(end)} ${months[end.getMonth()]} ${end.getFullYear()}`;
    };

    const getDayDate = (date: Date, index: number) => {
        const start = getStartOfWeek(date);
        const d = new Date(start);
        d.setDate(start.getDate() + index);
        return d;
    };

    const handlePrevWeek = () => {
        const newDate = new Date(baseDate);
        newDate.setDate(baseDate.getDate() - 7);
        setBaseDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(baseDate);
        newDate.setDate(baseDate.getDate() + 7);
        setBaseDate(newDate);
    };

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [newTime, setNewTime] = useState('08:00');
    const [newRoom, setNewRoom] = useState('');
    const [newColor, setNewColor] = useState('bg-[#1B6B3A]');

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newDate || !newTime) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall('/calendar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newTitle,
                    date: newDate,
                    time: newTime,
                    color: newColor,
                    room: newRoom || 'TBD',
                    type: 'RAPPEL'
                })
            });
            
            await fetchEvents();
            setIsModalOpen(false);
            setNewTitle('');
            setNewRoom('');
        } catch (error) {
            console.error("Erreur lors de l'ajout", error);
            alert("Erreur lors de la création du rappel.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to find an event for a specific grid cell
    const getEventForCell = (dayIndex: number, timeStr: string) => {
        const cellDate = getDayDate(baseDate, dayIndex);
        
        return events.find(e => {
            const eventDate = new Date(e.date);
            return eventDate.getDate() === cellDate.getDate() &&
                   eventDate.getMonth() === cellDate.getMonth() &&
                   eventDate.getFullYear() === cellDate.getFullYear() &&
                   e.time === timeStr;
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-[#1B6B3A] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0F2D1E] mb-2 tracking-tight">Mon Calendrier</h2>
                    <p className="text-gray-500 font-medium tracking-wide">Suivez votre emploi du temps et vos échéances importantes.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 ">
                    <button 
                        onClick={handlePrevWeek}
                        className="p-2 hover:bg-gray-50 rounded-lg  text-gray-400"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#1B6B3A]" />
                        <span className="text-sm font-black text-[#0F2D1E] whitespace-nowrap">{formatWeekRange(baseDate)}</span>
                    </div>
                    <button 
                        onClick={handleNextWeek}
                        className="p-2 hover:bg-gray-50 rounded-lg  text-gray-400"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-[#0F2D1E] text-white rounded-lg text-xs font-black uppercase tracking-widest  shadow-[#0F2D1E]/20 ">
                        Semaine
                    </button>
                    <button className="px-5 py-2.5 bg-white text-gray-400 rounded-lg text-xs font-black uppercase tracking-widest hover:text-gray-600 ">
                        Mois
                    </button>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1B6B3A] text-white rounded-lg font-bold  shadow-[#1B6B3A]/20  "
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un rappel</span>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                <div className="grid grid-cols-8 border-b border-gray-50">
                    <div className="p-6 border-r border-gray-50 invisible md:visible" />
                    {weekDays.map((day, index) => (
                        <div key={day} className="p-6 text-center border-r border-gray-50 last:border-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{day}</p>
                            <p className={`text-lg font-black ${new Date().getDate() === getDayDate(baseDate, index).getDate() ? 'text-[#1B6B3A]' : 'text-[#0F2D1E]'}`}>
                                {getDayDate(baseDate, index).getDate()}
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
                            {weekDays.map((_, dayIndex) => {
                                const event = getEventForCell(dayIndex, time);
                                
                                return (
                                <div key={`${dayIndex}-${time}`} className="relative p-2 border-r border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-colors">
                                    {event && (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={`absolute inset-2 ${event.color} rounded-lg p-3  cursor-pointer hover:brightness-110  z-10`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-white text-[10px] font-black uppercase tracking-tighter truncate">
                                                    {event.title}
                                                </p>
                                                <MoreHorizontal className="w-3 h-3 text-white/60" />
                                            </div>
                                            <div className="mt-2 flex items-center gap-1 text-white/90">
                                                <MapPin className="w-3 h-3" />
                                                <span className="text-[9px] font-bold truncate">{event.room || 'Sans lieu'}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                );
                            })}
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
                            className="relative w-full max-w-lg bg-white rounded-lg  overflow-hidden p-8"
                        >
                            <h3 className="text-2xl font-black text-[#0F2D1E] mb-6 tracking-tight">Ajouter un rappel</h3>
                            
                            <form onSubmit={handleAddEvent} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matière / Titre *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Ex: Chimie"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 "
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date *</label>
                                        <input 
                                            type="date"
                                            required
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40  appearance-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Heure *</label>
                                        <input 
                                            type="time"
                                            required
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 "
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Salle (Optionnel)</label>
                                    <input 
                                        type="text" 
                                        value={newRoom}
                                        onChange={(e) => setNewRoom(e.target.value)}
                                        placeholder="Ex: Labo 2"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]/10 focus:border-[#1B6B3A]/40 "
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
                                                className={`w-10 h-10 rounded-full ${c.value}   ${newColor === c.value ? 'ring-4 ring-gray-100 scale-110' : 'opacity-80 hover:opacity-100'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 "
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-[#1B6B3A] text-white rounded-lg font-black text-[11px] uppercase tracking-widest  shadow-[#1B6B3A]/20 hover:bg-[#155230]  disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
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
