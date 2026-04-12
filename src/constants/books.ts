export interface Book {
    id: string;
    slug: string;
    title: string;
    author: string;
    category: string;
    isPremium: boolean;
    description?: string;
    publicationDate?: string;
    rating?: number;
    reviewsCount?: number;
}

export const allBooks: Book[] = [
    { 
        id: '1',
        slug: 'letranger',
        title: "L'Étranger", 
        author: "Albert Camus", 
        category: "Littérature", 
        isPremium: false,
        publicationDate: "Sept 2023",
        rating: 4.8,
        reviewsCount: 2400,
        description: "Un ouvrage de référence essentiel pour les étudiants de section Littéraire. Ce manuel couvre l'intégralité du programme national guinéen avec des exercices d'application, des fiches de révision et des conseils méthodologiques."
    },
    { 
        id: '2',
        slug: 'algebre-lineaire',
        title: "Algèbre Linéaire", 
        author: "Dr. Kourouma", 
        category: "Mathématiques", 
        isPremium: false,
        publicationDate: "Jan 2024",
        rating: 4.6,
        reviewsCount: 1200,
        description: "Guide complet sur l'algèbre linéaire, des vecteurs aux transformations complexes. Indispensable pour les terminales sciences mathématiques."
    },
    { 
        id: '3',
        slug: 'physique-tome1',
        title: "Physique Tome 1", 
        author: "Pr. Sylla", 
        category: "Sciences", 
        isPremium: false,
        publicationDate: "Oct 2023",
        rating: 4.7,
        reviewsCount: 1850,
        description: "Mécanique et optique expliquées simplement avec des schémas détaillés conformes au nouveau programme scolaire."
    },
    { 
        id: '4',
        slug: 'guide-examen',
        title: "Guide de l'Examen", 
        author: "MENA", 
        category: "Orientation", 
        isPremium: false,
        publicationDate: "Mars 2024",
        rating: 4.9,
        reviewsCount: 5000,
        description: "Le guide officiel pour préparer le baccalauréat et le brevet en Guinée. Inclus les annales des 5 dernières années."
    },
    { 
        id: '5',
        slug: 'macbeth',
        title: "Macbeth", 
        author: "Shakespeare", 
        category: "Anglais", 
        isPremium: true,
        publicationDate: "Nov 2023",
        rating: 4.5,
        reviewsCount: 800,
        description: "L'œuvre classique de Shakespeare avec annotations en français pour une meilleure compréhension du texte original."
    },
    { 
        id: '6',
        slug: 'chimie-organique',
        title: "Chimie Organique", 
        author: "Dr. Diallo", 
        category: "Sciences", 
        isPremium: true,
        publicationDate: "Dec 2023",
        rating: 4.4,
        reviewsCount: 650,
        description: "Étude approfondie de la chimie du carbone pour les futurs bacheliers et étudiants en médecine."
    },
];
