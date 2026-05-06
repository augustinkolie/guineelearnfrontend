'use client';

import React, { useState, useRef } from 'react';
import { 
    FileText, 
    Upload, 
    X, 
    Loader2, 
    Copy, 
    Download, 
    RefreshCw, 
    Sparkles, 
    BookOpen, 
    Lightbulb, 
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    GraduationCap,
    Clock,
    FileSearch,
    BrainCircuit,
    Maximize2,
    Minimize2,
    Check,
    FileJson,
    FileCode,
    File
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { BASE_URL } from '@/utils/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const SummaryView = ({ profile }: { profile: any }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    
    // Options
    const [type, setType] = useState<'short' | 'medium' | 'detailed'>('medium');
    const [mode, setMode] = useState<'summary' | 'revision' | 'notions' | 'quiz'>('summary');
    const [level, setLevel] = useState(profile?.level || 'Collège');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const pdfContentRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile: File) => {
        const allowedTypes = ['.pdf', '.docx', '.txt'];
        const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
        
        if (!allowedTypes.includes(ext)) {
            setError("Format non supporté. Utilisez PDF, Word ou TXT.");
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("Fichier trop volumineux (max 10 Mo).");
            return;
        }

        setFile(selectedFile);
        setError(null);
        setResult(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) validateAndSetFile(droppedFile);
    };

    const handleSubmit = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('level', level);
        formData.append('mode', mode);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/summary/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erreur lors du traitement");

            setResult(data.content);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadPDF = async () => {
        if (!pdfContentRef.current) return;
        setIsLoading(true);
        try {
            const canvas = await html2canvas(pdfContentRef.current, { 
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                width: 800,
                windowWidth: 800
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate total image height in mm
            const imgProps = pdf.getImageProperties(imgData);
            const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = totalImgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'png', 0, 0, pdfWidth, totalImgHeight);
            heightLeft -= pdfHeight;

            // Add additional pages with a small offset to avoid cutting lines
            while (heightLeft > 0) {
                position = heightLeft - totalImgHeight;
                pdf.addPage();
                // Add a tiny bit of white space/overlap to ensure line safety
                pdf.addImage(imgData, 'png', 0, position, pdfWidth, totalImgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`Resume_GuineeLearn_${file?.name.split('.')[0]}.pdf`);
        } catch (err) {
            console.error("Erreur PDF:", err);
            setError("Impossible de générer le PDF multi-pages. Essayez le format Word.");
        } finally {
            setIsLoading(false);
            setShowDownloadOptions(false);
        }
    };

    const downloadTXT = () => {
        if (!result) return;
        const element = document.createElement("a");
        const fileData = new Blob([result], {type: 'text/plain'});
        element.href = URL.createObjectURL(fileData);
        element.download = `Resume_GuineeLearn_${file?.name.split('.')[0]}.txt`;
        document.body.appendChild(element);
        element.click();
        setShowDownloadOptions(false);
    };

    const downloadDOCX = () => {
        if (!result) return;
        // Basic DOCX generation via HTML/CSS blobing
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export DOCX</title></head><body>";
        const footer = "</body></html>";
        const html = header + resultRef.current?.innerHTML + footer;
        const blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Resume_GuineeLearn_${file?.name.split('.')[0]}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowDownloadOptions(false);
    };

    return (
        <div className={`max-w-[98%] mx-auto space-y-8 animate-in fade-in duration-700 pb-20 ${isFullScreen ? 'relative z-[100]' : ''}`}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-[#0F2D1E] flex items-center gap-3">
                        Résumé Intelligent
                    </h1>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Transformez vos longs documents en synthèses claires, fiches de révisions ou quiz interactifs en quelques secondes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                {!isFullScreen && (
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
                            {/* File Upload Area */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Document source</label>
                                {!file ? (
                                    <div 
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                            h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
                                            ${isDragging ? 'border-[#1B6B3A] bg-emerald-50' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-[#1B6B3A]/30'}
                                        `}
                                    >
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="text-sm font-bold text-gray-700">Cliquez ou glissez ici</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PDF, Word, TXT (Max 10Mo)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-lg bg-[#1B6B3A] flex items-center justify-center text-white">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#0F2D1E] truncate">{file.name}</p>
                                            <p className="text-[11px] font-bold text-emerald-600 uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setFile(null)} className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                {/* Mode Selection */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Type de traitement</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'summary', label: 'Résumé', icon: FileSearch },
                                            { id: 'revision', label: 'Révision', icon: BookOpen },
                                            { id: 'notions', label: 'Notions', icon: Lightbulb },
                                            { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
                                        ].map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMode(m.id as any)}
                                                className={`
                                                    flex items-center gap-2 p-3 rounded-lg border text-xs font-bold transition-all
                                                    ${mode === m.id ? 'bg-[#1B6B3A] border-[#1B6B3A] text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:border-[#1B6B3A]/30'}
                                                `}
                                            >
                                                <m.icon className="w-4 h-4" />
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Complexity (only for summary) */}
                                {mode === 'summary' && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Complexité</label>
                                        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                            {[
                                                { id: 'short', label: 'Court' },
                                                { id: 'medium', label: 'Moyen' },
                                                { id: 'detailed', label: 'Détaillé' },
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setType(t.id as any)}
                                                    className={`
                                                        flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all
                                                        ${type === t.id ? 'bg-white text-[#1B6B3A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                                                    `}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education Level */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Niveau scolaire</label>
                                    <div className="relative">
                                        <select 
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="w-full appearance-none bg-white border border-gray-100 p-3 rounded-lg text-sm font-bold text-gray-700 outline-none focus:border-[#1B6B3A]/40 transition-all"
                                        >
                                            <option>Primaire</option>
                                            <option>Collège</option>
                                            <option>Lycée</option>
                                            <option>Université</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!file || isLoading}
                                className={`
                                    w-full py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3
                                    ${!file || isLoading 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#1B6B3A] text-white shadow-xl shadow-[#1B6B3A]/20 hover:scale-[1.01] active:scale-95'}
                                `}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Générer</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features Badges */}
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                Analyse Sémantique
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                Multi-formats
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Display Area */}
                <div className={isFullScreen ? 'lg:col-span-12 fixed inset-0 z-[100] bg-[#F8FAFC] p-4 md:p-8 overflow-hidden flex flex-col' : 'lg:col-span-8'}>
                    <AnimatePresence mode="popLayout">
                        {!result && !isLoading && !error && (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full min-h-[500px] border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-center p-12 space-y-6"
                            >
                                <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-200">
                                    <FileSearch className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-400">En attente de votre document</h3>
                                    <p className="text-sm text-gray-400 font-medium max-w-sm">
                                        Uploadez un fichier à gauche pour commencer l'analyse intelligente.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {isLoading && (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[500px] bg-white border border-gray-100 rounded-lg flex flex-col items-center justify-center p-12 space-y-8"
                            >
                                <div className="relative">
                                    {/* Simplified outer rings for better PDF compatibility */}
                                    <div className="w-28 h-28 border-4 border-emerald-50 border-t-[#1B6B3A] rounded-full animate-spin" />
                                    
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center"
                                        >
                                            <img 
                                                src="/images/logo_icon_pro_1775601897268.png" 
                                                className="w-10 h-10 object-contain" 
                                                alt="Logo" 
                                            />
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-[#0F2D1E]">Analyse en cours...</h3>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest animate-pulse">
                                        {mode === 'quiz' ? 'Génération des questions...' : 'Extraction sémantique du texte...'}
                                    </p>
                                </div>
                                <div className="w-full max-w-xs h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-[#1B6B3A]"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 15, ease: "linear" }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div 
                                key="error"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full min-h-[500px] bg-white border border-red-100 rounded-lg flex flex-col items-center justify-center p-12 text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                    <AlertCircle className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-red-600">Une erreur est survenue</h3>
                                    <p className="text-sm text-gray-500 font-medium max-w-xs">{error}</p>
                                </div>
                                <button onClick={() => setError(null)} className="px-6 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors">
                                    Réessayer
                                </button>
                            </motion.div>
                        )}

                        {result && !isLoading && (
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] ${isFullScreen ? 'max-w-6xl mx-auto w-full' : ''}`}
                            >
                                {/* Result Toolbar */}
                                <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#1B6B3A] shadow-sm">
                                            {mode === 'quiz' ? <BrainCircuit className="w-5 h-5" /> : <FileSearch className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Résultat généré</p>
                                            <p className="text-sm font-black text-[#0F2D1E]">
                                                {mode === 'summary' ? 'Résumé' : mode === 'revision' ? 'Fiche de révision' : mode === 'notions' ? 'Notions clés' : 'Quiz de validation'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#1B6B3A] hover:border-[#1B6B3A]/30 transition-all" title={isFullScreen ? "Réduire" : "Agrandir"}>
                                            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                        </button>
                                        <button onClick={copyToClipboard} className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#1B6B3A] hover:border-[#1B6B3A]/30 transition-all" title="Copier">
                                            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                        <div className="relative">
                                            <button 
                                                onClick={() => setShowDownloadOptions(!showDownloadOptions)} 
                                                className={`p-2.5 border rounded-lg transition-all flex items-center gap-2 ${showDownloadOptions ? 'bg-[#1B6B3A] border-[#1B6B3A] text-white' : 'bg-white border-gray-200 text-gray-500 hover:text-[#1B6B3A] hover:border-[#1B6B3A]/30'}`}
                                                title="Télécharger"
                                            >
                                                <Download className="w-5 h-5" />
                                                <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {showDownloadOptions && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-[110] overflow-hidden"
                                                    >
                                                        <button onClick={downloadPDF} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-[#1B6B3A] transition-colors border-b border-gray-50">
                                                            <FileCode className="w-4 h-4" />
                                                            Format PDF (.pdf)
                                                        </button>
                                                        <button onClick={downloadDOCX} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-[#1B6B3A] transition-colors border-b border-gray-50">
                                                            <FileText className="w-4 h-4" />
                                                            Format Word (.doc)
                                                        </button>
                                                        <button onClick={downloadTXT} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-[#1B6B3A] transition-colors">
                                                            <File className="w-4 h-4" />
                                                            Format Texte (.txt)
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <button onClick={handleSubmit} className="p-2.5 bg-[#1B6B3A] text-white rounded-lg shadow-lg shadow-[#1B6B3A]/20 hover:scale-105 active:scale-95 transition-all" title="Régénérer">
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Result Content */}
                                <div ref={resultRef} className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1 prose prose-emerald max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath, remarkGfm]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            h1: ({children}) => <h1 className="text-3xl font-black text-[#0F2D1E] mb-8 border-b-4 border-emerald-50 pb-4">{children}</h1>,
                                            h2: ({children}) => <h2 className="text-xl font-bold text-[#1B6B3A] mt-10 mb-6 flex items-center gap-3">
                                                <div className="w-1.5 h-6 bg-[#1B6B3A] rounded-full" />
                                                {children}
                                            </h2>,
                                            h3: ({children}) => <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">{children}</h3>,
                                            p: ({children}) => <p className="text-gray-600 leading-relaxed mb-6 font-medium">{children}</p>,
                                            ul: ({children}) => <ul className="space-y-4 mb-8">{children}</ul>,
                                            li: ({children}) => (
                                                <li className="flex items-start gap-4">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                    <span className="text-gray-700 font-medium">{children}</span>
                                                </li>
                                            ),
                                            strong: ({children}) => <strong className="font-black text-[#0F2D1E] bg-emerald-100 px-1 rounded">{children}</strong>
                                        }}
                                    >
                                        {result || ''}
                                    </ReactMarkdown>
                                </div>

                                {/* Hidden container for clean PDF export (High-end Manual Style) */}
                                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                                    <div ref={pdfContentRef} style={{ width: '800px', backgroundColor: '#ffffff', color: '#1e293b', fontFamily: '"Inter", sans-serif', padding: '60px' }}>
                                        {/* Header */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #1B6B3A', paddingBottom: '20px', marginBottom: '40px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '45px', height: '45px', backgroundColor: '#1B6B3A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src="/images/logo_icon_pro_1775601897268.png" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                                                </div>
                                                <div>
                                                    <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F2D1E', margin: 0 }}>GuinéeLearn</h2>
                                                    <p style={{ fontSize: '10px', color: '#64748b', margin: 0, fontWeight: '700', letterSpacing: '0.05em' }}>EXCELLENCE ÉDUCATIVE</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '12px', fontWeight: '800', color: '#1B6B3A', margin: 0 }}>{mode === 'summary' ? 'RÉSUMÉ PÉDAGOGIQUE' : 'ANALYSE DE DOCUMENT'}</p>
                                                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Généré le {new Date().toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>

                                        {/* Main Content Rendered via Markdown */}
                                        <div className="pdf-render-area">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({children}) => <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0F2D1E', marginBottom: '30px', marginTop: '0', lineHeight: '1.2', pageBreakInside: 'avoid' }}>{children}</h1>,
                                                    h2: ({children}) => <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1B6B3A', marginTop: '40px', marginBottom: '20px', borderLeft: '4px solid #1B6B3A', paddingLeft: '15px', pageBreakInside: 'avoid' }}>{children}</h2>,
                                                    h3: ({children}) => <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginTop: '30px', marginBottom: '15px', pageBreakInside: 'avoid' }}>{children}</h3>,
                                                    p: ({children}) => <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', marginBottom: '15px', textAlign: 'left', pageBreakInside: 'avoid' }}>{children}</p>,
                                                    ul: ({children}) => <ul style={{ marginBottom: '20px', paddingLeft: '20px', pageBreakInside: 'avoid' }}>{children}</ul>,
                                                    li: ({children}) => (
                                                        <li style={{ fontSize: '13px', color: '#475569', marginBottom: '8px', listStyleType: 'none', position: 'relative', paddingLeft: '20px', pageBreakInside: 'avoid' }}>
                                                            <span style={{ position: 'absolute', left: '0', color: '#1B6B3A', fontWeight: 'bold' }}>•</span>
                                                            {children}
                                                        </li>
                                                    ),
                                                    strong: ({children}) => <strong style={{ fontWeight: '800', color: '#0F2D1E', borderBottom: '1px solid #1B6B3A' }}>{children}</strong>,
                                                    blockquote: ({children}) => (
                                                        <div style={{ borderLeft: '3px solid #1B6B3A', padding: '15px', margin: '20px 0', backgroundColor: '#ffffff', pageBreakInside: 'avoid' }}>
                                                            <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#475569', margin: 0 }}>{children}</p>
                                                        </div>
                                                    )
                                                }}
                                            >
                                                {result || ''}
                                            </ReactMarkdown>
                                        </div>

                                        {/* Footer */}
                                        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontSize: '10px', color: '#94a3b8' }}>© 2026 GuinéeLearn - Plateforme d'apprentissage intelligente</p>
                                            <p style={{ fontSize: '10px', color: '#1B6B3A', fontWeight: 'bold' }}>guineelearn.com</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
);
