import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
    return (
        <footer className="bg-[#0F2D1E] text-gray-300 py-12 px-4 md:px-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Column 1: Logo & Tagline */}
                    <div className="space-y-6">
                        <Logo scrolled={false} className="-ml-4" height="h-12" />
                        <p className="text-gray-400 leading-relaxed max-w-xs">
                            La plateforme éducative de référence en Guinée. Cours, quiz, suivi et orientation pour tous les niveaux.
                        </p>
                    </div>

                    {/* Column 2: Liens rapides */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5">Liens rapides</h4>
                        <ul className="space-y-3">
                            <li><Link href="#features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                            <li><Link href="#who" className="hover:text-white transition-colors">Pour qui ?</Link></li>
                            <li><Link href="#pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                            <li><Link href="#testimonials" className="hover:text-white transition-colors">Témoignages</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Ressources */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5">Ressources</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="hover:text-white transition-colors">Espace Élève</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Espace Parent</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Espace Enseignant</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5">Contact</h4>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#27AE60]" />
                                <span>contact@guineelearn.gn</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#27AE60]" />
                                <span>+224 610 85 00 29</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-[#27AE60]" />
                                <span>Conakry, Guinée</span>
                            </li>
                        </ul>
                        <div className="flex gap-4">
                            <Link href="#" className="bg-white/10 p-2.5 rounded-lg hover:bg-white/20 transition-all hover:-translate-y-1">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="bg-white/10 p-2.5 rounded-lg hover:bg-white/20 transition-all hover:-translate-y-1">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="bg-white/10 p-2.5 rounded-lg hover:bg-white/20 transition-all hover:-translate-y-1">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© 2024 GuinéeLearn. Tous droits réservés.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
                        <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                        <Link href="#" className="hover:text-white transition-colors">Powered by Readdy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
