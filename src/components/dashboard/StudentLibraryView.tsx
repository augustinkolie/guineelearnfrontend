'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from "next/navigation";
import { allBooks } from "@/constants/books";
import { 
    Library, 
    BookOpen, 
    Search, 
    Filter, 
    Star, 
    Loader2,
    Camera,
    Upload,
    X,
    ImageIcon,
    Zap,
    Plus,
    Mic,
    ChevronDown,
    Check
} from 'lucide-react';
import { apiCall, BASE_URL } from '@/utils/api';
import { PdfThumbnail } from './PdfThumbnail';

interface StudentLibraryViewProps {
    user: any;
    profile: any;
}

export const StudentLibraryView = ({ user, profile }: StudentLibraryViewProps) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [dynamicBooks, setDynamicBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
    const [imageSearchError, setImageSearchError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const recognitionRef = React.useRef<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const isPremium = user?.plan === 'PREMIUM';

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Backend handles level/track filtering automatically based on user profile
            const dbResources = await apiCall('/resources?type=BOOK', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Map DB resources to match the "Book" UI interface
            // Filter out books hidden by admin (isPublished === false)
            const visibleResources = dbResources.filter((res: any) => res.isPublished !== false);
            const mappedBooks = visibleResources.map((res: any) => ({
                id: res.id,
                slug: res.id, // We use ID as slug for dynamic books
                title: res.title,
                author: res.author || 'Inconnu',
                category: res.subject,
                isPremium: res.isPremium,
                description: res.description,
                publicationDate: new Date(res.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                rating: 4.5, // Mocked rating for consistency
                coverUrl: res.coverUrl,
                isDynamic: true // Flag to identify origin
            }));

            setDynamicBooks(mappedBooks);
        } catch (err) {
            console.error('Error fetching library books:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset everything before starting a new search
        setImageSearchError(null);
        setIsAnalyzingImage(false);
        setSelectedFile(file);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Start search immediately
        performActualSearch(file);
    };

    const performActualSearch = async (file: File) => {
        console.log('--- Nouvelle recherche lancée ---');
        setIsAnalyzingImage(true);
        setImageSearchError(null);

        try {
            const formData = new FormData();
            // On essaie avec 'file' qui est souvent le standard, 
            // n'hésitez pas à me dire si votre API attend 'image' ou 'cover'
            formData.append('file', file);

            const token = localStorage.getItem('token');
            const result = await apiCall(`/resources/search-by-image?t=${Date.now()}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`
                    // Note: On ne définit pas Content-Type pour laisser le navigateur 
                    // gérer le boundary du FormData
                },
                body: formData
            });

            console.log('Réponse du serveur:', result);

            if (result && result.title) {
                console.log(`Livre identifié : "${result.title}"`);
                setIsAnalyzingImage(false);
                setIsModalOpen(false);
                setSelectedImage(null);
                setSelectedFile(null);
                
                // Nettoyage du titre pour la barre de recherche
                // On retire "Livre complet :" pour éviter un filtrage trop restrictif
                const cleanTitle = result.title.replace(/^(Livre complet\s*:\s*|Livre complet\s*)/i, '').trim();
                setSearchQuery(cleanTitle);
            } else {
                const errorMsg = result?.message || "Le serveur n'a pas pu identifier ce livre.";
                throw new Error(errorMsg);
            }
        } catch (err: any) {
            console.error('Erreur de recherche par image:', err);
            setIsAnalyzingImage(false);
            
            // Affichage de l'erreur réelle renvoyée par le nouveau serveur
            const errorMsg = err.message || "Désolé, une erreur est survenue lors de l'analyse.";
            setImageSearchError(errorMsg);
        }
    };

    useEffect(() => {
        fetchBooks();
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch(e) {}
            }
        };
    }, []);

    const toggleVoiceSearch = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setSearchQuery(''); // Clear previous search to start fresh
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            const currentTranscript = finalTranscript || interimTranscript;
            if (currentTranscript) {
                setSearchQuery(currentTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Erreur de reconnaissance vocale:", event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert("L'accès au microphone est refusé. Veuillez l'autoriser dans votre navigateur.");
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        try {
            recognition.start();
        } catch (e) {
            console.error(e);
            setIsListening(false);
        }
    };

    // Merge static and dynamic books - PRIORITIZE Dynamic (DB) over Static
    const combinedBooks = useMemo(() => {
        const dynamicIds = new Set(dynamicBooks.map(b => b.id));
        // On ne garde que les livres statiques qui n'existent pas encore en base de données
        const uniqueStatic = allBooks.filter(sb => !dynamicIds.has(sb.id));
        return [...dynamicBooks, ...uniqueStatic];
    }, [dynamicBooks]);

    // Unique categories derivation
    const categories = useMemo(() => {
        const isSM = profile?.subLevel?.includes('SM') || profile?.subLevel === 'TSM';
        const cats = ['Tous', ...new Set(combinedBooks.map(book => book.category))];
        
        return cats.filter(cat => {
            if (isSM && (cat === 'Biologie' || cat === 'Géologie' || cat === 'SVT')) return false;
            return true;
        });
    }, [combinedBooks, profile]);

    // Filter logic
    const filteredBooks = useMemo(() => {
        const isSM = profile?.subLevel?.includes('SM') || profile?.subLevel === 'TSM';

        return combinedBooks.filter(book => {
            // 0. SM Filtering
            if (isSM && (book.category === 'Biologie' || book.category === 'Géologie' || book.category === 'SVT')) return false;

            // 1. Premium Access Check
            if (!isPremium && book.isPremium) return false;

            // 2. Category Check
            if (selectedCategory !== 'Tous' && book.category !== selectedCategory) return false;

            // 3. Search Query Check
            if (searchQuery.trim() !== '') {
                const normalize = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, ' ').toLowerCase().trim() : '';
                const queryWords = normalize(searchQuery).split(/\s+/).filter(word => word.length > 1);
                
                const titleNorm = normalize(book.title);
                const authorNorm = normalize(String(book.author));
                const categoryNorm = normalize(book.category);
                
                // Le livre correspond si TOUS les mots de la recherche sont présents dans le titre, l'auteur ou la catégorie
                const matches = queryWords.every(word => 
                    titleNorm.includes(word) || 
                    authorNorm.includes(word) || 
                    categoryNorm.includes(word)
                );
                
                if (!matches) return false;
            }

            return true;
        });
    }, [searchQuery, selectedCategory, isPremium, combinedBooks, profile]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-[#1B6B3A] animate-spin" />
                <p className="text-gray-500 font-bold">Ouverture des rayons...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#0F2D1E]">Ma Bibliothèque Digitale</h1>
                    <p className="text-gray-500 font-medium text-xs">Accédez à vos manuels scolaires et ressources de lecture.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200  flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0F2D1E]">
                            Plan {isPremium ? 'Premium' : 'Gratuit'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-2.5 pr-4 rounded-lg border border-gray-200  flex flex-col md:flex-row md:items-center gap-4  focus-within:">
                <div className={`relative flex-1 flex items-center rounded-lg border transition-all ${isListening ? 'border-red-300 bg-red-50/30' : 'border-transparent bg-gray-50 focus-within:bg-white focus-within:border-gray-200'}`}>
                    <Search className="w-4 h-4 text-gray-400 ml-4 shrink-0" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isListening ? "Écoute en cours... Parlez maintenant" : "Rechercher un auteur, un titre, une matière..."} 
                        className="flex-1 bg-transparent px-3 py-3 outline-none text-sm font-medium min-w-0"
                    />
                    
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageSearch}
                    />

                    <div className="flex items-center gap-1 pr-3 shrink-0">
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-gray-400 hover:bg-gray-200/50 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        )}
                        
                        <button 
                            onClick={toggleVoiceSearch}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all group ${
                                isListening 
                                ? 'text-red-500 bg-red-50 animate-pulse' 
                                : 'text-gray-400 bg-transparent hover:bg-gray-200/50 hover:text-emerald-600'
                            }`}
                            title={isListening ? "Arrêter l'écoute" : "Recherche vocale"}
                        >
                            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                        </button>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-gray-400 hover:bg-gray-100 hover:text-[#1B6B3A] transition-all group"
                            title="Rechercher par image"
                        >
                            <Upload className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </button>
                    </div>
                </div>

                {/* Image Search Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3 px-2">
                                    <h2 className="text-sm font-medium text-gray-700">Rechercher une image avec GuinéeLearn Lens</h2>
                                </div>
                                <button 
                                    onClick={() => {
                                        setIsModalOpen(false); 
                                        setSelectedImage(null); 
                                        setSelectedFile(null);
                                        setIsAnalyzingImage(false);
                                        setImageSearchError(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-10">
                                {!selectedImage ? (
                                    <div 
                                        className="bg-[#F8FAFB] border-2 border-dashed border-gray-200 rounded-2xl p-16 flex flex-col items-center justify-center transition-all hover:border-emerald-400 group"
                                    >
                                        <div className="mb-6 group-hover:scale-110 transition-transform">
                                            <Upload className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
                                        </div>
                                        
                                        <div className="text-center">
                                            <h3 className="font-black text-[#0F2D1E] text-xl mb-2">Importez la couverture</h3>
                                            <p className="text-gray-400 text-sm font-medium mb-4 px-10">
                                                Glissez une image ici ou cliquez sur le lien ci-dessous pour parcourir vos fichiers.
                                            </p>
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-emerald-600 font-bold text-base hover:text-emerald-700 underline underline-offset-4"
                                            >
                                                importez un fichier
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-500/20 shadow-sm group bg-white flex items-center justify-center h-[350px] p-2">
                                        <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain transition-all duration-700 rounded-lg" />
                                        
                                        {/* SCAN ANIMATION */}
                                        {isAnalyzingImage && (
                                            <div className="absolute inset-0 z-20 pointer-events-none">
                                                {/* The Laser Line */}
                                                <div 
                                                    className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10B981] z-30 animate-scan-line" 
                                                    style={{ 
                                                        animation: 'scanLine 2s ease-in-out infinite' 
                                                    }} 
                                                />
                                                {/* The Gradient Overlay */}
                                                <div 
                                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent h-20 z-20"
                                                    style={{ 
                                                        animation: 'scanOverlay 2s ease-in-out infinite' 
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                                            {!isAnalyzingImage && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedImage(null); 
                                                        setSelectedFile(null); 
                                                        setImageSearchError(null);
                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                    }}
                                                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg"
                                                >
                                                    Changer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {imageSearchError && (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col items-center animate-in slide-in-from-top-2 duration-300">
                                        <p className="text-red-600 text-xs font-bold mb-3">{imageSearchError}</p>
                                        <button 
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setSelectedFile(null);
                                                setImageSearchError(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                                fileInputRef.current?.click();
                                            }}
                                            className="text-white bg-red-500 px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-md active:scale-95"
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                )}

                                {isAnalyzingImage && (
                                    <div className="mt-8 flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs animate-pulse">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            ANALYSE DE LA COUVERTURE...
                                        </div>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full animate-progress-bar" style={{ width: '100%', animation: 'progress 3s linear' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <style>{`
                            @keyframes scanLine {
                                0% { top: 0%; }
                                50% { top: 100%; }
                                100% { top: 0%; }
                            }
                            @keyframes scanOverlay {
                                0% { transform: translateY(-100%); }
                                50% { transform: translateY(100%); }
                                100% { transform: translateY(-100%); }
                            }
                            @keyframes progress {
                                0% { width: 0%; }
                                100% { width: 100%; }
                            }
                            .animate-scan-line {
                                animation: scanLine 2s ease-in-out infinite;
                            }
                        `}</style>
                    </div>
                )}
                
                {/* Hidden Input File - Placed outside for reliability */}
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageSearch}
                />

                <div className="flex items-center gap-2 relative">
                    <div 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-lg font-bold text-xs hover:bg-gray-100 cursor-pointer border transition-all min-w-[140px] ${isFilterOpen ? 'border-gray-200 shadow-sm' : 'border-transparent'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{selectedCategory === 'Tous' ? 'Filtres' : selectedCategory}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-3 pb-2 mb-2 border-b border-gray-50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filtrer par catégorie</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto px-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors text-left ${
                                                selectedCategory === cat 
                                                ? 'bg-[#E8F5EE] text-[#1B6B3A] font-bold' 
                                                : 'text-gray-600 hover:bg-gray-50 font-medium'
                                            }`}
                                        >
                                            <span className="truncate">{cat}</span>
                                            {selectedCategory === cat && <Check className="w-4 h-4 text-[#1B6B3A] shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBooks.map((book, idx) => (
                    <div 
                        key={book.id || idx} 
                        onClick={() => router.push(`/dashboard/library/${book.slug}`)}
                        className="bg-white rounded-lg border border-gray-200 hover:border-emerald-500/40  hover:  duration-300 group overflow-hidden flex flex-col h-full cursor-pointer  active:scale-[0.98]"
                    >
                        <div className="aspect-[2/1] bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#E8F5EE] group-hover:text-[#1B6B3A]  relative overflow-hidden">
                            {book.coverUrl ? (
                                <img 
                                    src={book.coverUrl.startsWith('http') ? book.coverUrl : `${BASE_URL}${book.coverUrl.startsWith('/') ? '' : '/'}${book.coverUrl}`} 
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                />
                            ) : book.id && book.isDynamic ? (
                                <img 
                                    src={`${(BASE_URL && BASE_URL !== 'undefined') ? (BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL) : 'http://localhost:5000'}/api/resources/thumbnail/${book.id}?v=2`}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-500 relative z-10"
                                    onError={(e) => {
                                        // Cache the image directly
                                        (e.target as any).style.display = 'none';
                                        (e.target as any).classList.remove('z-10');
                                    }}
                                />
                            ) : null}

                            <div className={`card-fallback-icon absolute inset-0 flex flex-col items-center justify-center bg-[#1B6B3A] text-white p-6 text-center z-0`}>
                                <BookOpen className="w-10 h-10" />
                            </div>

                            {!book.coverUrl && (!book.id || !book.isDynamic) && (
                                <BookOpen className="w-10 h-10" />
                            )}
                            
                            <div className="absolute top-3 right-3">
                                <span className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-[#1B6B3A] shadow-xs">
                                    {book.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-extrabold text-[#0F2D1E] group-hover:text-[#1B6B3A] transition-colors line-clamp-1 text-base leading-tight mb-1">
                                {book.title}
                            </h3>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mb-4">
                                {book.author}
                            </p>
                            
                            <div className="mt-auto">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={`w-2.5 h-2.5 ${star <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-100'}`} />
                                    ))}
                                    <span className="text-[9px] font-bold text-gray-400 ml-1">{book.rating || 4.2}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredBooks.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                            <Library className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mb-1">Aucun livre trouvé</h3>
                        <p className="text-xs text-gray-500 max-w-[200px] font-medium leading-relaxed">
                            Nous n'avons rien trouvé pour "{searchQuery}". Essayez avec d'autres mots-clés.
                        </p>
                        <button 
                            onClick={() => {setSearchQuery(''); setSelectedCategory('Tous');}}
                            className="mt-6 text-[#1B6B3A] font-black text-[10px] uppercase tracking-widest hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
