'use client';

import React, { useState, useEffect } from 'react';
import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    ArrowUpCircle, 
    ArrowDownCircle, 
    Filter,
    Download,
    Calendar,
    ChevronDown,
    Search,
    Banknote,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const financeData = [
    { day: '01 Avr', in: 450000, out: 120000, balance: 330000 },
    { day: '05 Avr', in: 680000, out: 250000, balance: 760000 },
    { day: '10 Avr', in: 320000, out: 480000, balance: 600000 },
    { day: '15 Avr', in: 950000, out: 300000, balance: 1250000 },
    { day: '20 Avr', in: 540000, out: 150000, balance: 1640000 },
    { day: '25 Avr', in: 710000, out: 220000, balance: 2130000 },
    { day: '30 Avr', in: 1200000, out: 400000, balance: 2930000 },
];

const transactions = [
    { id: 1, label: 'Inscription Premium - M. Diallo', amount: '+ 250,000 GNF', type: 'IN', category: 'Abonnement', date: 'Aujourd\'hui, 14:20', status: 'Complété' },
    { id: 2, label: 'Hébergement Serveur AWS', amount: '- 850,000 GNF', type: 'OUT', category: 'Infrastructure', date: 'Hier, 09:15', status: 'Complété' },
    { id: 3, label: 'Vente Pack Quiz Terminale', amount: '+ 120,000 GNF', type: 'IN', category: 'Vente directe', date: '10 Avr, 18:45', status: 'Complété' },
    { id: 4, label: 'Salaire Modérateur - S. Barry', amount: '- 1,500,000 GNF', type: 'OUT', category: 'Salaires', date: '05 Avr, 10:00', status: 'En attente' },
    { id: 5, label: 'Publicité Facebook Ads', amount: '- 450,000 GNF', type: 'OUT', category: 'Marketing', date: '02 Avr, 15:30', status: 'Complété' },
];

export const AdminFinanceView = ({ user }: { user: any }) => {
    const [timeRange, setTimeRange] = useState('30j');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Transactions State
    const [transactionList, setTransactionList] = useState([
        { id: 1, label: 'Inscription Premium - M. Diallo', amount: 250000, type: 'IN', category: 'Abonnement', date: 'Aujourd\'hui, 14:20', status: 'Complété' },
        { id: 2, label: 'Hébergement Serveur AWS', amount: 850000, type: 'OUT', category: 'Infrastructure', date: 'Hier, 09:15', status: 'Complété' },
        { id: 3, label: 'Vente Pack Quiz Terminale', amount: 120000, type: 'IN', category: 'Vente directe', date: '10 Avr, 18:45', status: 'Complété' },
        { id: 4, label: 'Salaire Modérateur - S. Barry', amount: 1500000, type: 'OUT', category: 'Salaires', date: '05 Avr, 10:00', status: 'En attente' },
        { id: 5, label: 'Publicité Facebook Ads', amount: 450000, type: 'OUT', category: 'Marketing', date: '02 Avr, 15:30', status: 'Complété' },
    ]);

    // Form State
    const [newOp, setNewOp] = useState({
        label: '',
        amount: '',
        type: 'IN',
        category: 'Abonnement'
    });

    // Calculated Stats
    const totalIn = transactionList.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.amount, 0);
    const totalOut = transactionList.filter(t => t.type === 'OUT').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIn - totalOut;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('fr-FR').format(val) + ' GNF';
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOp.label || !newOp.amount) return;

        const transaction = {
            id: Date.now(),
            label: newOp.label,
            amount: parseFloat(newOp.amount),
            type: newOp.type as 'IN' | 'OUT',
            category: newOp.category,
            date: "A l'instant",
            status: 'Complété'
        };

        setTransactionList([transaction, ...transactionList]);
        setNewOp({ label: '', amount: '', type: 'IN', category: 'Abonnement' });
        setIsModalOpen(false);
    };

    const filteredTransactions = transactionList.filter(t => 
        t.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 relative">
            {/* --- MODAL NOUVELLE OPÉRATION --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F2D1E]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-md rounded-lg  relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-[#0F2D1E] p-6 text-white text-center relative overflow-hidden">
                            {/* Unique Pattern Overlay */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1B6B3A 1.5px, transparent 1px)', backgroundSize: '12px 12px' }} />
                            
                            <div className="relative z-10">
                                <h3 className="text-xl font-black">Nouvelle Opération</h3>
                                <p className="text-sm text-white/80">Enregistrez un flux de trésorerie entrant ou sortant.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleAddTransaction} className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Libellé</label>
                                <input 
                                    autoFocus
                                    required
                                    type="text" 
                                    placeholder="ex: Inscription Premium" 
                                    value={newOp.label}
                                    onChange={e => setNewOp({...newOp, label: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1B6B3A]/30 focus:ring-4 focus:ring-[#1B6B3A]/5  font-bold text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Montant (GNF)</label>
                                    <input 
                                        required
                                        type="number" 
                                        placeholder="120000" 
                                        value={newOp.amount}
                                        onChange={e => setNewOp({...newOp, amount: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1B6B3A]/30 focus:ring-4 focus:ring-[#1B6B3A]/5  font-black text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Type</label>
                                    <select 
                                        value={newOp.type}
                                        onChange={e => setNewOp({...newOp, type: e.target.value as 'IN' | 'OUT'})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1B6B3A]/30 focus:ring-4 focus:ring-[#1B6B3A]/5  font-bold text-sm"
                                    >
                                        <option value="IN">Entrée (Recette)</option>
                                        <option value="OUT">Sortie (Dépense)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Catégorie</label>
                                <select 
                                    value={newOp.category}
                                    onChange={e => setNewOp({...newOp, category: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1B6B3A]/30 focus:ring-4 focus:ring-[#1B6B3A]/5  font-bold text-sm"
                                >
                                    <option value="Abonnement">Abonnement</option>
                                    <option value="Vente directe">Vente directe</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Salaires">Salaires</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-lg font-bold hover:bg-gray-200  text-sm"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-2 py-3 bg-[#1B6B3A] text-white rounded-lg font-black hover:bg-[#155230]   shadow-[#1B6B3A]/20 text-sm"
                                >
                                    Enregistrer l'opération
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- HEADER & ACTIONS --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-[#E8F5EE] text-[#1B6B3A] rounded-lg">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-black text-[#0F2D1E]">Gestion Financière</h1>
                    </div>
                    <p className="text-gray-500 font-medium text-xs">Suivi des flux de trésorerie et performance économique.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative bg-white border border-gray-200 rounded-lg flex items-center  hover:bg-gray-50  group overflow-hidden">
                        <Calendar className="w-4 h-4 text-[#1B6B3A] ml-4 absolute left-0 pointer-events-none" />
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none bg-transparent py-2.5 pl-10 pr-10 font-bold text-sm text-gray-600 outline-none cursor-pointer"
                        >
                            <option value="7j">7 Derniers jours</option>
                            <option value="30j">30 Derniers jours</option>
                            <option value="ytd">Année en cours</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none group-hover:text-[#1B6B3A] transition-colors" />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1B6B3A] text-white rounded-lg font-bold text-sm  active:scale-[0.98]   shadow-[#1B6B3A]/20 disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" /> Nouvelle Opération
                    </button>
                </div>
            </div>

            {/* --- FINANCE TICKER / KPI CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Balance Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200  relative  hover: group">
                    <div className="flex items-start justify-between mb-6">
                        <div className="w-11 h-11 rounded-lg bg-blue-50/50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white  duration-300">
                            <Wallet className="w-5 h-5" />
                        </div>
                        {/* Signal Bars */}
                        <div className="flex items-end gap-1.5 h-10 px-1">
                            {[0.4, 0.7, 0.5, 0.9].map((h, idx) => (
                                <div 
                                    key={idx}
                                    className="w-1.5 rounded-full bg-blue-500 transition-all duration-500 group-hover:scale-y-110"
                                    style={{ height: `${h * 100}%`, opacity: 0.2 + (idx * 0.25), transitionDelay: `${idx * 50}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Solde Total Actuel</p>
                        <h2 className="text-xl font-black text-[#0F2D1E] tracking-tight leading-none">{formatCurrency(balance)}</h2>
                    </div>
                </div>

                {/* Income Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200  relative  hover: group">
                    <div className="flex items-start justify-between mb-6">
                        <div className="w-11 h-11 rounded-lg bg-emerald-50/50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white  duration-300">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        {/* Signal Bars */}
                        <div className="flex items-end gap-1.5 h-10 px-1">
                            {[0.3, 0.6, 0.8, 1.0].map((h, idx) => (
                                <div 
                                    key={idx}
                                    className="w-1.5 rounded-full bg-emerald-500 transition-all duration-500 group-hover:scale-y-110"
                                    style={{ height: `${h * 100}%`, opacity: 0.2 + (idx * 0.25), transitionDelay: `${idx * 50}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entrées (Ce mois)</p>
                        </div>
                        <h2 className="text-xl font-black text-[#0F2D1E] tracking-tight leading-none">{formatCurrency(totalIn)}</h2>
                    </div>
                </div>

                {/* Expense Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200  relative  hover: group">
                    <div className="flex items-start justify-between mb-6">
                        <div className="w-11 h-11 rounded-lg bg-rose-50/50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white  duration-300">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        {/* Signal Bars */}
                        <div className="flex items-end gap-1.5 h-10 px-1">
                            {[0.8, 0.4, 0.6, 0.5].map((h, idx) => (
                                <div 
                                    key={idx}
                                    className="w-1.5 rounded-full bg-rose-500 transition-all duration-500 group-hover:scale-y-110"
                                    style={{ height: `${h * 100}%`, opacity: 0.2 + (idx * 0.25), transitionDelay: `${idx * 50}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sorties (Ce mois)</p>
                        </div>
                        <h2 className="text-xl font-black text-[#0F2D1E] tracking-tight leading-none">{formatCurrency(totalOut)}</h2>
                    </div>
                </div>
            </div>

            {/* --- MAIN CHART: GROWTH TREND --- */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 ">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-[#0F2D1E]">Analyse des Tendances</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Comparatif Entrées (Vert) vs Sorties (Rouge)</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recettes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dépenses</span>
                        </div>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94A3B8' }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 11, fill: '#94A3B8' }} 
                                dx={-10}
                                tickFormatter={(val) => `${val/1000}k`}
                            />
                            <Tooltip 
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-4 rounded-lg  border border-gray-200">
                                                <p className="text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">{label}</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between gap-6">
                                                        <span className="text-xs font-bold text-gray-500 italic">Recettes</span>
                                                        <span className="text-sm font-black text-emerald-600">+{Number(payload[0]?.value || 0).toLocaleString()} GNF</span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-6">
                                                        <span className="text-xs font-bold text-gray-500 italic">Dépenses</span>
                                                        <span className="text-sm font-black text-rose-600">-{Number(payload[1]?.value || 0).toLocaleString()} GNF</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area type="monotone" dataKey="in" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                            <Area type="monotone" dataKey="out" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- TRANSACTION HISTORY --- */}
            <div className="bg-white rounded-lg border border-gray-200  overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-[#0F2D1E]">Dernières Transactions</h3>
                    <div className="relative w-full md:w-80 group">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#1B6B3A] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une transaction..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-[#1B6B3A]/20 "
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                                <th className="px-6 py-4">Opération / Label</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Date & Heure</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${tx.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {tx.type === 'IN' ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                                            </div>
                                            <p className="text-sm font-bold text-[#0F2D1E] whitespace-nowrap">{tx.label}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100/50 px-2 py-1 rounded-md">{tx.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`text-sm font-black ${tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {tx.type === 'IN' ? '+ ' : '- '}
                                            {formatCurrency(tx.amount)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500 whitespace-nowrap">{tx.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Complété' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className={`text-[11px] font-black ${tx.status === 'Complété' ? 'text-emerald-600' : 'text-amber-600'}`}>{tx.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
                    <button className="text-sm font-bold text-[#1B6B3A] hover:underline ">Voir tout l'historique financier</button>
                </div>
            </div>
        </div>
    );
};
