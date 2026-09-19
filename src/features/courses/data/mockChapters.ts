'use client';

// Dynamic Mock Data generator based on Course Title & Level
export const getMockChapters = (title: string, level: string) => {
    let chapters = [];
    const tLower = title.toLowerCase();

    if (tLower.includes('math')) {
        chapters = [
            { id: 'm1', title: "Les nombres complexes: Notation exponentielle", pointsPossible: 1000, description: "Notions avancées sur la notation exponentielle des nombres complexes." },
            { id: 'm2', title: "Les suites", pointsPossible: 1500, description: "Étude générale des suites numériques." },
            { id: 'm3', title: "Analyse combinatoire", pointsPossible: 2000, description: "Dénombrements, arrangements, permutations et combinaisons." },
            { id: 'm4', title: "Les limites", pointsPossible: 2500, description: "Calcul et opérations sur les limites de fonctions." },
            { id: 'm5', title: "Etude de fonctions", pointsPossible: 3000, description: "Variations, domaine de définition et représentation graphique." },
            { id: 'm6', title: "Les primitives", pointsPossible: 2000, description: "Détermination des fonctions primitives usuelles." },
            { id: 'm7', title: "Les intégrales", pointsPossible: 3500, description: "Calcul d'aires et de volumes par intégration." }
        ];
    } else if (tLower.includes('physique')) {
        chapters = [
            { id: 'p1', title: "Notion de cinématique", pointsPossible: 1000, description: "Concepts fondamentaux des mouvements." },
            { id: 'p2', title: "Mouvement d'un projectile", pointsPossible: 1500, description: "Étude des tirs et trajectoires paraboliques." },
            { id: 'p3', title: "Lois de Newton", pointsPossible: 2000, description: "Principes fondateurs de la mécanique classique." },
            { id: 'p4', title: "Satellites et planètes - Lois de Kepler", pointsPossible: 1800, description: "Orbites et mouvements planétaires." }
        ];
    } else if (tLower.includes('chimie')) {
        chapters = [
            { id: 'ch1', title: "Acides carboxyliques et dérivées", pointsPossible: 2000, description: "Nomenclature et réactions des acides carboxyliques." },
            { id: 'ch2', title: "Acides aminés aux protéines", pointsPossible: 2500, description: "Structure et liaisons peptidiques." },
            { id: 'ch3', title: "Acides forts et bases fortes", pointsPossible: 1500, description: "Calcul de pH des acides et bases forts." }
        ];
    } else {
        chapters = [
            { id: 'c1', title: 'Introduction', pointsPossible: 2000, description: `Introduction aux concepts de base de ${title}.` },
            { id: 'c2', title: 'Théories fondamentales', pointsPossible: 3000, description: "Principes majeurs et règles à retenir." },
            { id: 'c3', title: 'Applications pratiques', pointsPossible: 2500, description: "Cas d'usage et exercices typiques." }
        ];
    }

    return chapters.map((chap) => ({
        ...chap,
        lessons: [
            {
                id: `l1_${chap.id}`,
                title: `Sujets clés : ${chap.title}`,
                learnings: [
                    { id: 'lr1', title: "Approche théorique", type: 'article', status: 'completed' },
                    { id: 'lr2', title: "Explications en vidéo", type: 'video', status: 'active' }
                ],
                practices: [
                    { id: 'p1', title: "Exercices de validation", subtitle: 'QCM de 5 questions', status: 'Not started', active: true }
                ]
            }
        ]
    }));
};
