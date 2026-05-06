'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Flame, 
    ChevronRight, 
    Home, 
    PlaySquare, 
    FileText, 
    CheckSquare,
    Square,
    Star,
    Award,
    Zap,
    BookOpen,
    Sparkles,
    X,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { BASE_URL, logActivity } from '@/utils/api';

interface CourseDetailsProps {
    courseId: string;
    courseTitle: string;
    courseLevel: string;
    profile: any;
}

// Dynamic Mock Data generator based on Course Title
const getMockChapters = (title: string, level: string) => {
    let chapters = [];
    
    if (title.toLowerCase().includes('math')) {
        chapters = [
            { id: 'm1', title: "Les nombres complexes: Notation exponentielle", pointsPossible: 1000, description: "Notions avancées sur la notation exponentielle des nombres complexes." },
            { id: 'm2', title: "Les suites", pointsPossible: 1500, description: "Étude générale des suites numériques." },
            { id: 'm3', title: "Analyse combinatoire", pointsPossible: 2000, description: "Dénombrements, arrangements, permutations et combinaisons." },
            { id: 'm4', title: "Les limites", pointsPossible: 2500, description: "Calcul et opérations sur les limites de fonctions." },
            { id: 'm5', title: "Etude de fonctions", pointsPossible: 3000, description: "Variations, domaine de définition et représentation graphique." },
            { id: 'm6', title: "Les primitives", pointsPossible: 2000, description: "Détermination des fonctions primitives usuelles." },
            { id: 'm7', title: "Les intégrales", pointsPossible: 3500, description: "Calcul d'aires et de volumes par intégration." },
            { id: 'm8', title: "Barycentre d'un système de points pondérés", pointsPossible: 1500, description: "Géométrie et équilibre de points pondérés." },
            { id: 'm9', title: "Les ensembles N et Z", pointsPossible: 1000, description: "Propriétés fondamentales des entiers." },
            { id: 'm10', title: "Arithmétique", pointsPossible: 2000, description: "Divisibilité, congruences, PGCD, PPCM." },
            { id: 'm11', title: "Les nombres complexes: Généralité", pointsPossible: 1200, description: "Introduction et règles de base sur le corps des complexes C." },
            { id: 'm12', title: "Nombres complexes et résolution d'équations", pointsPossible: 1800, description: "Équations polynomiales et racines n-ièmes." },
            { id: 'm13', title: "Nombres complexes et géométrie", pointsPossible: 2500, description: "Interprétation géométrique, affixes et vecteurs." },
            { id: 'm14', title: "Nombres complexes: forme trigonométrique", pointsPossible: 1500, description: "Module et argument, passage de la forme algébrique à trigonométrique." },
            { id: 'm15', title: "Dérivée d'une fonction", pointsPossible: 2000, description: "Calcul différentiel et applications tangentes." },
            { id: 'm16', title: "Fonction logarithme népérien", pointsPossible: 2200, description: "Étude complète de la fonction ln." },
            { id: 'm17', title: "Le logarithme décimal", pointsPossible: 1000, description: "Propriétés du log décimal et applications." },
            { id: 'm18', title: "Fonction exponentielle", pointsPossible: 3000, description: "La fonction exp et ses propriétés inverses du log." },
            { id: 'm19', title: "Fonctions puissance", pointsPossible: 1500, description: "Croissances comparées et fonctions de type a^x." },
            { id: 'm20', title: "Limite d'une suite", pointsPossible: 1800, description: "Convergence et théorèmes sur les limites de suites." },
            { id: 'm21', title: "Calcul de probabilités", pointsPossible: 2500, description: "Événements, probabilités conditionnelles et indépendance." },
            { id: 'm22', title: "Variables Aléatoires", pointsPossible: 3000, description: "Lois de probabilité, espérance et variance." },
            { id: 'm23', title: "Equations différentielles du premier ordre", pointsPossible: 1500, description: "Résolution des équations de type y' = ay + b." },
            { id: 'm24', title: "Equations différentielles de la forme ay'' + by' + cy = 0", pointsPossible: 2000, description: "Équations du second ordre homogènes." },
            { id: 'm25', title: "Equations différentielles de la forme ay'' + by' + cy = f(t)", pointsPossible: 2500, description: "Équations du second ordre avec second membre." },
            { id: 'm26', title: "Les lignes de niveau", pointsPossible: 1200, description: "Ensembles de points de type f(M) = k." },
            { id: 'm27', title: "Les produits vectoriel", pointsPossible: 1500, description: "Géométrie dans l'espace: produits mixte et vectoriel." },
            { id: 'm28', title: "Isométries et applications: Généralité", pointsPossible: 1200, description: "Introduction aux transformations du plan conservant les distances." },
            { id: 'm29', title: "Les isométries: Translations", pointsPossible: 1000, description: "Invariants, vecteurs et composés." },
            { id: 'm30', title: "Les isométries: Symétrie centrale", pointsPossible: 1000, description: "Propriétés des symétries par rapport à un point." },
            { id: 'm31', title: "Les isométries: Symétrie orthogonale", pointsPossible: 1200, description: "Réflexions axiales, axes de symétrie." },
            { id: 'm32', title: "Les isométries: Symétrie glissée", pointsPossible: 1500, description: "Composées d'une réflexion et d'une translation." },
            { id: 'm33', title: "Les isométries: Rotation", pointsPossible: 1200, description: "Angles orientés et centres de rotation." },
            { id: 'm34', title: "Géométrie du plan complexe", pointsPossible: 2000, description: "Outils complexes pour résoudre des problèmes géométriques." },
            { id: 'm35', title: "Homothétique", pointsPossible: 1200, description: "Agrandissements, réductions et rapports." },
            { id: 'm36', title: "Similitudes", pointsPossible: 2500, description: "Similitudes planes directes et indirectes." },
            { id: 'm37', title: "Suites arithmétiques", pointsPossible: 1000, description: "Raison, somme des termes et comportement." },
            { id: 'm38', title: "Les suites géométriques", pointsPossible: 1000, description: "Croissance géométrique et sommes." }
        ];
    } else if (title.toLowerCase().includes('physique')) {
        chapters = [
            { id: 'p1', title: "Notion de cinématique", pointsPossible: 1000, description: "Concepts fondamentaux des mouvements." },
            { id: 'p2', title: "Mouvement d'un projectile", pointsPossible: 1500, description: "Étude des tirs et trajectoires paraboliques." },
            { id: 'p3', title: "Mouvement d'une particule chargé dans un champ électrique", pointsPossible: 2000, description: "Dynamique des particules chargées." },
            { id: 'p4', title: "Lois de Newton", pointsPossible: 2000, description: "Principes fondateurs de la mécanique classique." },
            { id: 'p5', title: "Rappel de Mathématique", pointsPossible: 500, description: "Outils mathématiques nécessaires." },
            { id: 'p6', title: "Lexique de Physique", pointsPossible: 500, description: "Terminologie essentielle." },
            { id: 'p7', title: "Satellites et planètes - Lois de Kepler", pointsPossible: 1800, description: "Orbites et mouvements planétaires." },
            { id: 'p8', title: "Dynamique du solide en rotation", pointsPossible: 2500, description: "Moments d'inertie et théorèmes." },
            { id: 'p9', title: "Le champ magnétique", pointsPossible: 2000, description: "Propriétés et sources des champs magnétiques." },
            { id: 'p10', title: "Particule chargée en mouvement dans un champ magnétique", pointsPossible: 2000, description: "Force de Lorentz et applications." },
            { id: 'p11', title: "Induction électromagnétique", pointsPossible: 2500, description: "Courants induits et lois de Lenz-Faraday." },
            { id: 'p12', title: "Lois de Laplace", pointsPossible: 1500, description: "Actions sur les conducteurs." },
            { id: 'p13', title: "Auto-induction", pointsPossible: 1800, description: "Bobines et inductance." },
            { id: 'p14', title: "Oscillations électriques libres", pointsPossible: 2000, description: "Circuits LC et RLC en régime libre." },
            { id: 'p15', title: "Oscillations électriques forcées", pointsPossible: 2500, description: "Résonance électrique." },
            { id: 'p16', title: "Ondes électromagnétiques", pointsPossible: 2000, description: "Propagation et spectre." },
            { id: 'p17', title: "Mouvement et forces", pointsPossible: 1500, description: "Bilans de forces." },
            { id: 'p18', title: "La quantité de mouvement", pointsPossible: 1500, description: "Conservation et chocs." },
            { id: 'p19', title: "Physique nucléaire", pointsPossible: 3000, description: "Radioactivité et réactions nucléaires." },
            { id: 'p20', title: "Mouvement rectiligne uniforme", pointsPossible: 1000, description: "Étude du MRU." },
            { id: 'p21', title: "Mouvement rectiligne uniformément varié", pointsPossible: 1200, description: "Étude du MRUV et cinématique." },
            { id: 'p22', title: "Mouvement circulaire uniforme", pointsPossible: 1500, description: "Forces centripètes." },
            { id: 'p23', title: "Mouvement circulaire non uniforme", pointsPossible: 1800, description: "Vitesse et accélération angulaires." },
            { id: 'p24', title: "Mouvement du centre d'inertie d'un solide", pointsPossible: 1200, description: "Théorème du centre d'inertie." },
            { id: 'p25', title: "Champ gravitationnel", pointsPossible: 1500, description: "Pesanteur et interactions." },
            { id: 'p26', title: "Interaction gravitationnelle", pointsPossible: 1500, description: "Loi universelle de gravitation." },
            { id: 'p27', title: "Mouvement des planètes", pointsPossible: 1800, description: "Orbites elliptiques." },
            { id: 'p28', title: "Solide glissant sur une sphère", pointsPossible: 2500, description: "Décollage d'un solide et forces." },
            { id: 'p29', title: "Mouvement d'un projectile dans un champ de pesanteur.", pointsPossible: 1800, description: "Trajectoires." },
            { id: 'p30', title: "Mouvement d'une particule dans le champ électrostatique - les dispositifs.", pointsPossible: 2200, description: "Applications." },
            { id: 'p31', title: "Pendule conique", pointsPossible: 1500, description: "Mouvement circulaire sur cône." },
            { id: 'p32', title: "Pendule dans un véhicule.", pointsPossible: 1800, description: "Accélération du véhicule." },
            { id: 'p33', title: "Pendule simple oscillant.", pointsPossible: 1500, description: "Période et forces." },
            { id: 'p34', title: "Solide glissant sur un plan incliné", pointsPossible: 1200, description: "Cinématique et dynamique avec frottements." },
            { id: 'p35', title: "Oscillation électrique libre: décharge d'un condensateur", pointsPossible: 2000, description: "Dipôle RLC." },
            { id: 'p36', title: "Électromagnétisme: sens du courant et le champ magnétique", pointsPossible: 1500, description: "Règles pratiques." },
            { id: 'p37', title: "Action d'un champ magnétique sur un courant et un aimant: Appareil à déviation magnétique", pointsPossible: 2000, description: "Outils de mesure." },
            { id: 'p38', title: "Champ magnétique", pointsPossible: 1000, description: "Description." },
            { id: 'p39', title: "Champ magnétique terrestre", pointsPossible: 1000, description: "Composantes." },
            { id: 'p40', title: "Puissance et énergie électrique déchargé", pointsPossible: 1500, description: "Énergie emmagasinée." },
            { id: 'p41', title: "Les circuits parcourus par les courants sinusoïdaux", pointsPossible: 2000, description: "Alternatif." },
            { id: 'p42', title: "Les circuits parcourus par les courants sinusoïdaux: les caractéristique du circuit", pointsPossible: 2000, description: "Impédance." },
            { id: 'p43', title: "Courant alternatif sinusoïdal", pointsPossible: 1200, description: "Fondamentaux." },
            { id: 'p44', title: "Quelques cas particuliers des circuits", pointsPossible: 1500, description: "Application R, L, C purs." },
            { id: 'p45', title: "L'électromagnétisme", pointsPossible: 1000, description: "Vues générales." },
            { id: 'p46', title: "Appareil à déviation magnétique", pointsPossible: 1200, description: "Principe de fonctionnement." }
        ];
    } else if (title.toLowerCase().includes('chimie')) {
        chapters = [
            { id: 'ch1', title: "Acides carboxyliques et dérivées", pointsPossible: 2000, description: "Nomenclature et réactions des acides carboxyliques." },
            { id: 'ch2', title: "Acides aminés aux protéines", pointsPossible: 2500, description: "Structure et liaisons peptidiques." },
            { id: 'ch3', title: "Acides forts et bases fortes", pointsPossible: 1500, description: "Calcul de pH des acides et bases forts." },
            { id: 'ch4', title: "Dissociation de l'eau - produit ionique", pointsPossible: 1500, description: "Autoprotolyse de l'eau." },
            { id: 'ch5', title: "Couples acide-base", pointsPossible: 1800, description: "Théorie de Brønsted-Lowry." },
            { id: 'ch6', title: "Réactions acido-basique", pointsPossible: 2000, description: "Titrages et équilibre acido-basique." },
            { id: 'ch7', title: "Cinétique chimique", pointsPossible: 2500, description: "Évolution temporelle d'une réaction." },
            { id: 'ch8', title: "Vitesse moyenne et vitesse instantanée", pointsPossible: 1500, description: "Calcul et détermination graphique des vitesses." },
            { id: 'ch9', title: "Facteurs cinétiques", pointsPossible: 1500, description: "Influence de la température et de la concentration." },
            { id: 'ch10', title: "Les catalyses", pointsPossible: 1200, description: "Catalyse homogène, hétérogène et enzymatique." },
            { id: 'ch11', title: "Stéréochimie: Les édifices chimiques", pointsPossible: 2500, description: "Carbone asymétrique et chiralité." },
            { id: 'ch12', title: "La géométrie des molécules", pointsPossible: 2000, description: "Représentation de Cram et modèle VSEPR." },
            { id: 'ch13', title: "Isomérie de conformation", pointsPossible: 1800, description: "Conformations décalées et éclipsées." },
            { id: 'ch14', title: "Les alcools", pointsPossible: 2200, description: "Classes d'alcools et oxydation." },
            { id: 'ch15', title: "La saponification des esters", pointsPossible: 2000, description: "Hydrolyse basique des esters." },
            { id: 'ch16', title: "La fabrication du savon", pointsPossible: 1500, description: "Propriétés détergentes et moussantes." },
            { id: 'ch17', title: "Aldéhydes et acétones", pointsPossible: 2000, description: "Composés carbonylés et tests d'identification." }
        ];
    } else if (title.toLowerCase().includes('economie') || title.toLowerCase().includes('économie')) {
        chapters = [
            { id: 'e1', title: "Généralité sur la notion du sous développement", pointsPossible: 1000, description: "Concepts et définitions." },
            { id: 'e2', title: "L'endettement et le chômage dans les pays sous développés", pointsPossible: 1500, description: "Conséquences macroéconomiques." },
            { id: 'e3', title: "Les conditions essentielles du développement", pointsPossible: 2000, description: "Prérequis socio-économiques." },
            { id: 'e4', title: "Les caractéristiques du sous développement", pointsPossible: 2000, description: "Indicateurs et symptômes." },
            { id: 'e5', title: "Les pays en voie de développement", pointsPossible: 1500, description: "Profils et dynamiques." },
            { id: 'e6', title: "Initiative pays pauvres très endettés (PPTE)", pointsPossible: 1800, description: "Programmes d'allègement de dette." },
            { id: 'e7', title: "Le chômage en Afrique: les causes", pointsPossible: 2000, description: "Origines structurelles et conjoncturelles." },
            { id: 'e8', title: "Les nouveaux pays industrialisés (NPI)", pointsPossible: 1500, description: "Émergence et modèles de croissance." },
            { id: 'e9', title: "Les pays de l'O.P.E.P. (Organisation des pays exportateurs de pétrole)", pointsPossible: 2500, description: "Rôle sur le marché énergétique." },
            { id: 'e10', title: "Les pays à revenu intermédiaire", pointsPossible: 1500, description: "Caractéristiques économiques." },
            { id: 'e11', title: "Les pays les moins avancés", pointsPossible: 1200, description: "Défis et vulnérabilités extrêmes." },
            { id: 'e12', title: "Le chômage: Généralité", pointsPossible: 1000, description: "Théories et types de chômage." },
            { id: 'e13', title: "Le chômage en Afrique", pointsPossible: 1500, description: "Spécificités continentales." },
            { id: 'e14', title: "Le chômage en Afrique: les conséquences", pointsPossible: 1800, description: "Impacts sociaux et économiques." },
            { id: 'e15', title: "Le chômage en Afrique: des solutions possibles", pointsPossible: 2000, description: "Politiques d'emploi." },
            { id: 'e16', title: "La Banque Africaine de Développement (BAD)", pointsPossible: 2000, description: "Missions et financements." },
            { id: 'e17', title: "Le fonds monétaire international (FMI)", pointsPossible: 2500, description: "Rôle dans la stabilité financière mondiale." },
            { id: 'e18', title: "La banque mondiale (BM).", pointsPossible: 2500, description: "Aide au développement et lutte contre la pauvreté." },
            { id: 'e19', title: "Les causes actuelles du sous-développement", pointsPossible: 2000, description: "Facteurs contemporains." },
            { id: 'e20', title: "L'échange inégal dans le commerce international", pointsPossible: 2200, description: "Relations Nord-Sud." },
            { id: 'e21', title: "L'exploitation financière", pointsPossible: 1800, description: "Mécanismes de domination économique." },
            { id: 'e22', title: "Le transfert de technologie et la dépendance technique", pointsPossible: 2000, description: "Enjeux de souveraineté." },
            { id: 'e23', title: "L'instabilité politique", pointsPossible: 1500, description: "Impact sur l'investissement et la croissance." },
            { id: 'e24', title: "La mauvaise gouvernance", pointsPossible: 2000, description: "Corruption et fuite des capitaux." },
            { id: 'e25', title: "La difficile alternance au pouvoir", pointsPossible: 1500, description: "Conséquences institutionnelles." },
            { id: 'e26', title: "DEFINITION DU SOUS-DEVELOPPEMENT ET L'IDENTIFICATION DES GROUPES DE PAYS SOUS-DEVELOPPES.", pointsPossible: 2500, description: "Cadre conceptuel global." },
            { id: 'e27', title: "- La faiblesse de l'agriculture et de l'élevage.", pointsPossible: 1800, description: "Défis du secteur primaire." },
            { id: 'e28', title: "Les préalables pour un vrai développement-LA DEMOCRATIE ET LA BONNE GOUVERNANCE", pointsPossible: 2500, description: "Conditions institutionnelles de la croissance." },
            { id: 'e29', title: "- LA FAIBLESSE DE L'ELEVAGE", pointsPossible: 1200, description: "Problématiques pastorales." },
            { id: 'e30', title: "La faiblesse de l'industrie et de l'énergie.", pointsPossible: 2000, description: "Défis de l'industrialisation." },
            { id: 'e31', title: "L'hypertrophie du secteur tertiaire et la faiblesse du transport.", pointsPossible: 2000, description: "Déséquilibres sectoriels et logistiques." },
            { id: 'e32', title: "La faiblesse du revenu national", pointsPossible: 1500, description: "PIB et pouvoir d'achat." },
            { id: 'e33', title: "Les problèmes démographiques", pointsPossible: 2000, description: "Croissance de la population et pression sur les ressources." },
            { id: 'e34', title: "Les problèmes alimentaires.", pointsPossible: 2000, description: "Sécurité et souveraineté alimentaire." },
            { id: 'e35', title: "Les problèmes sanitaires.", pointsPossible: 1800, description: "Santé publique et développement." },
            { id: 'e36', title: "Les problèmes socio-culturels : Analphabétisme et l'extrême pauvreté", pointsPossible: 2500, description: "Éducation et inclusion sociale." },
            { id: 'e37', title: "La planification de l'économie nationale.", pointsPossible: 2200, description: "Stratégies d'État." },
            { id: 'e38', title: "La mobilisation et la gestion rationnelle des ressources internes.", pointsPossible: 2000, description: "Financement domestique du développement." },
            { id: 'e39', title: "La coopération économique internationale", pointsPossible: 2000, description: "Partenariats multilatéraux et bilatéraux." },
            { id: 'e40', title: "L'intégration économique.", pointsPossible: 2500, description: "Zones de libre-échange et unions douanières." },
            { id: 'e41', title: "Étude de la CEDEAO", pointsPossible: 3000, description: "Communauté Économique des États de l'Afrique de l'Ouest." }
        ];
    } else if (title.toLowerCase().includes('français') || title.toLowerCase().includes('francais')) {
        chapters = [
            { id: 'f1', title: "Résumé de texte", pointsPossible: 1500, description: "Techniques de contraction de texte." },
            { id: 'f2', title: "Exposé et débat", pointsPossible: 1000, description: "Expression orale et argumentation." },
            { id: 'f3', title: "Explication de texte", pointsPossible: 2000, description: "Lecture analytique et méthodique." },
            { id: 'f4', title: "Commentaire composé", pointsPossible: 2500, description: "Analyse littéraire structurée." },
            { id: 'f5', title: "La dissertation", pointsPossible: 3000, description: "Argumentation écrite et plan." },
            { id: 'f6', title: "La littérature africaine", pointsPossible: 1500, description: "Panorama des œuvres et auteurs." },
            { id: 'f7', title: "La littérature française", pointsPossible: 1500, description: "Grands mouvements littéraires." },
            { id: 'f8', title: "Prise de note", pointsPossible: 1000, description: "Méthodologie de synthèse rapide." },
            { id: 'f9', title: "Etude de romans : Le Cercle des Tropiques", pointsPossible: 2000, description: "Analyse de l'œuvre d'Alioum Fantouré." },
            { id: 'f10', title: "Etude de romans : Les soleils des indépendances (Amadou Kourouma)", pointsPossible: 2500, description: "Analyse de l'œuvre majeure." },
            { id: 'f11', title: "Etude de romans : Les Crapauds-brousse", pointsPossible: 2000, description: "Tierno Monénembo." },
            { id: 'f12', title: "Etude de romans : Perpétue et l'Habitude du Malheur", pointsPossible: 2000, description: "Mongo Beti." },
            { id: 'f13', title: "Etude de romans : Une saison au Congo", pointsPossible: 2500, description: "Théâtre d'Aimé Césaire." },
            { id: 'f14', title: "Etude de romans : Le devoir de l'écrivain.", pointsPossible: 1500, description: "L'engagement littéraire." },
            { id: 'f15', title: "Etude de romans : L'oppression coloniale.", pointsPossible: 2000, description: "Thématiques historiques." },
            { id: 'f16', title: "Les problèmes que traverse le XXe siècle : Le Surréalisme.", pointsPossible: 2000, description: "Mouvement poétique et artistique." },
            { id: 'f17', title: "Les problèmes que traverse le XXe siècle : L'Existentialisme.", pointsPossible: 2000, description: "Philosophie de l'engagement." },
            { id: 'f18', title: "Les grands problèmes de la littérature des indépendances :", pointsPossible: 1800, description: "Thèmes post-coloniaux." },
            { id: 'f19', title: "Littératures des indépendances :", pointsPossible: 1500, description: "Auteurs et courants." },
            { id: 'f20', title: "Introduction aux littératures des indépendances :", pointsPossible: 1500, description: "Contexte historique." },
            { id: 'f21', title: "Tradition et modernité", pointsPossible: 2000, description: "Le choc des cultures." },
            { id: 'f22', title: "La Négritude", pointsPossible: 2500, description: "Senghor, Césaire, Damas." },
            { id: 'f23', title: "La Négritude en question :", pointsPossible: 1800, description: "Critiques et évolutions." },
            { id: 'f24', title: "La littérature Africaine des Indépendances.", pointsPossible: 2000, description: "Émergence de nouvelles voix." },
            { id: 'f25', title: "Les problèmes de l'Afrique contemporaine (problème culturel).", pointsPossible: 2000, description: "Défis actuels." }
        ];
    } else if (title.toLowerCase().includes('philosophie') || title.toLowerCase().includes('philo')) {
        chapters = [
            { id: 'ph1', title: "Avantages et inconvénients de la science et de la technique", pointsPossible: 2000, description: "Bilan critique du progrès." },
            { id: 'ph2', title: "Rapport entre science et technique", pointsPossible: 1500, description: "Interdépendance épistémologique." },
            { id: 'ph3', title: "Le problème de la vérité scientifique", pointsPossible: 2500, description: "Paradigmes et réfutabilité." },
            { id: 'ph4', title: "L'Etat", pointsPossible: 2000, description: "Fondements et finalités du pouvoir central." },
            { id: 'ph5', title: "Les grandes conceptions de la vie morale", pointsPossible: 2500, description: "Éthiques et morales." },
            { id: 'ph6', title: "Les droits de l'Homme et des peuples", pointsPossible: 2000, description: "Universalité vs Relativisme." },
            { id: 'ph7', title: "Liberté", pointsPossible: 3000, description: "Déterminisme et libre arbitre." },
            { id: 'ph8', title: "Le droit", pointsPossible: 1500, description: "Justice, lois et équité." },
            { id: 'ph9', title: "La morale", pointsPossible: 2000, description: "Le devoir et la conscience." },
            { id: 'ph10', title: "Démocratie", pointsPossible: 2000, description: "Souveraineté du peuple." },
            { id: 'ph11', title: "Bonne gouvernance", pointsPossible: 1500, description: "Éthique politique et développement." }
        ];
    } else if (title.toLowerCase().includes('anglais')) {
        chapters = [
            { id: 'en1', title: "Les 12 temps des verbes en Anglais", pointsPossible: 2000, description: "Review of English tenses." },
            { id: 'en2', title: "Interrogative pronouns", pointsPossible: 1500, description: "Wh- questions and usage." },
            { id: 'en3', title: "Tags questions", pointsPossible: 1200, description: "Rules for tagging questions." },
            { id: 'en4', title: "La Voix passive – Passive Voice", pointsPossible: 2500, description: "Active to passive transformations." },
            { id: 'en5', title: "Le Discours indirect – Reported Speech", pointsPossible: 3000, description: "Direct to reported speech rules." },
            { id: 'en6', title: "Les 3 conditionnels – The 3 Conditionals", pointsPossible: 2500, description: "If clauses." },
            { id: 'en7', title: "Les Comparatifs et les superlatifs", pointsPossible: 2000, description: "Comparative and Superlative Adjectives & Adverbs." },
            { id: 'en8', title: "Expressing regret and pity", pointsPossible: 1500, description: "Functions & notions." },
            { id: 'en9', title: "Making apologies and granting forgiveness", pointsPossible: 1500, description: "Functions & notions." },
            { id: 'en10', title: "Expressing Certainty, uncertainty and opinions", pointsPossible: 1800, description: "Functions & notions." },
            { id: 'en11', title: "Describing how someone earns money", pointsPossible: 1500, description: "Vocabulary and expressions." },
            { id: 'en12', title: "REPORTING YOUR FRIEND'S INTERVIEW", pointsPossible: 2500, description: "Application of reported speech." },
            { id: 'en13', title: "EXPRESSING WISHES AND REGRETS ABOUT THE PAST", pointsPossible: 2000, description: "Using 'wish' and 'if only'." },
            { id: 'en14', title: "Les Conjonctions en Anglais", pointsPossible: 1800, description: "Linking words." }
        ];
    } else {
        // Generic fallback for any other subject
        chapters = [
            { id: 'c1', title: 'Introduction', pointsPossible: 2000, description: `Introduction aux concepts de base de ${title}.` },
            { id: 'c2', title: 'Théories fondamentales', pointsPossible: 3000, description: "Principes majeurs et règles à retenir." },
            { id: 'c3', title: 'Applications pratiques', pointsPossible: 2500, description: "Cas d'usage et exercices typiques." },
            { id: 'c4', title: 'Approfondissement', pointsPossible: 4000, description: "Sujets avancés et analyses détaillées." }
        ];
    }

    // Helper to generate contextual lessons based on chapter title
    const getContextualLessons = (chapTitle: string, chapId: string) => {
        const titleLower = chapTitle.toLowerCase();
        
        // --- MATHÉMATIQUES ---
        if (titleLower.includes("limite")) {
            return [
                {
                    id: `l1_${chapId}`, title: "Calcul des Limites",
                    learnings: [
                        { id: 'lr1', title: "Limite d'une fonction en un point (Définition)", type: 'video', status: 'completed' },
                        { id: 'lr2', title: "Limites à l'infini et asymptotes horizontales", type: 'video', status: 'completed' },
                        { id: 'lr3', title: "Limites usuelles : croissances comparées", type: 'article', status: 'completed' },
                        { id: 'lr4', title: "Théorème des gendarmes et de comparaison", type: 'video', status: 'active' },
                        { id: 'lr5', title: "Formes indéterminées et comment les lever", type: 'article', status: 'not-started' },
                    ],
                    practices: [
                        { id: 'p1', title: "Calcul direct et formes simples", subtitle: 'Réussissez 4 questions sur 5', status: 'Not started', active: true },
                        { id: 'p2', title: "Lever des formes indéterminées", subtitle: 'Réussissez 3 questions sur 4', status: 'Not started', active: false }
                    ]
                }
            ];
        } 
        if (titleLower.includes("dériv")) {
            return [{
                id: `l1_${chapId}`, title: "Nombre dérivé et Tangentes",
                learnings: [
                    { id: 'lr1', title: "Taux d'accroissement et définition", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Équation de la tangente", type: 'video', status: 'active' },
                    { id: 'lr3', title: "Opérations sur les dérivées (u*v, u/v)", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Calculer des fonctions dérivées", subtitle: 'Obtenez 80%', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("complexes")) {
            return [{
                id: `l1_${chapId}`, title: "Forme algébrique et géométrie",
                learnings: [
                    { id: 'lr1', title: "Partie réelle et imaginaire", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Conjugué et module", type: 'article', status: 'not-started' },
                    { id: 'lr3', title: "Forme trigonométrique et exponentielle", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Passage entre les différentes formes", subtitle: 'Exercices classiques', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("intégral") || titleLower.includes("primitive")) {
            return [{
                id: `l1_${chapId}`, title: "Primitives et Intégrales",
                learnings: [
                    { id: 'lr1', title: "Tableaux des primitives", type: 'article', status: 'not-started' },
                    { id: 'lr2', title: "Intégration par parties", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Calculer des aires et des volumes", subtitle: 'Questions types', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("probabilité") || titleLower.includes("aléatoire")) {
            return [{
                id: `l1_${chapId}`, title: "Lois et variables aléatoires",
                learnings: [
                    { id: 'lr1', title: "Probabilités conditionnelles et arbres", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Loi binomiale et Espérance", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Problèmes complets avec urnes et jetons", subtitle: '5 questions', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("arithmétique")) {
            return [{
                id: `l1_${chapId}`, title: "Divisibilité et Congruences",
                learnings: [
                    { id: 'lr1', title: "Division euclidienne", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Théorèmes de Bézout et Gauss", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Résolution d'équations diophantiennes", subtitle: 'Niveau expert', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("logarithme") || titleLower.includes("exponentielle") || titleLower.includes("puissance")) {
            return [{
                id: `l1_${chapId}`, title: "Fonctions Transcendantes",
                learnings: [
                    { id: 'lr1', title: "Propriétés algébriques", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Dérivées et variations", type: 'video', status: 'active' },
                    { id: 'lr3', title: "Équations et inéquations", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Résolution d'équations", subtitle: 'Trouver x', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("isométries") || titleLower.includes("similitudes") || titleLower.includes("homothétique") || titleLower.includes("géométrie")) {
            return [{
                id: `l1_${chapId}`, title: "Transformations du Plan",
                learnings: [
                    { id: 'lr1', title: "Éléments caractéristiques", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Expressions complexes", type: 'article', status: 'active' }
                ],
                practices: [{ id: 'p1', title: "Identifier la nature de la transformation", subtitle: 'Quiz', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("équations différentielles")) {
            return [{
                id: `l1_${chapId}`, title: "Équations Différentielles",
                learnings: [
                    { id: 'lr1', title: "Solution générale et solution particulière", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Équation caractéristique", type: 'article', status: 'active' }
                ],
                practices: [{ id: 'p1', title: "Résoudre des équa. diff.", subtitle: 'Exercices', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("suite")) {
            return [{
                id: `l1_${chapId}`, title: "Suites Numériques",
                learnings: [
                    { id: 'lr1', title: "Sens de variation et raison", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Calcul de la somme des termes", type: 'article', status: 'active' }
                ],
                practices: [{ id: 'p1', title: "Déterminer la limite de Un", subtitle: 'Exercices', status: 'Not started', active: true }]
            }];
        }

        // --- PHYSIQUE ---
        if (titleLower.includes("cinématique") || titleLower.includes("mouvement") || titleLower.includes("projectile") || titleLower.includes("vitesse")) {
            return [{
                id: `l1_${chapId}`, title: "Vecteurs et mouvements",
                learnings: [
                    { id: 'lr1', title: "Vecteur position, vitesse et accélération", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Étude des mouvements spécifiques", type: 'video', status: 'active' },
                    { id: 'lr3', title: "Équations horaires", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Tracer des trajectoires", subtitle: 'Réussissez 4 questions', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("dynamique") || titleLower.includes("newton") || titleLower.includes("inertie") || titleLower.includes("glissant")) {
            return [{
                id: `l1_${chapId}`, title: "Forces et Lois de Newton",
                learnings: [
                    { id: 'lr1', title: "Les trois lois de Newton", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Bilan des forces et projections", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Détermination des équations paramétriques", subtitle: 'Sujets type bac', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("oscillat") || titleLower.includes("pendule")) {
            return [{
                id: `l1_${chapId}`, title: "Modèles d'oscillateurs",
                learnings: [{ id: 'lr1', title: "Pendule simple et pendule élastique", type: 'video', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Calculer la période propre", subtitle: '3 questions', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("électro") || titleLower.includes("magnéti") || titleLower.includes("induction") || titleLower.includes("aimant")) {
            return [{
                id: `l1_${chapId}`, title: "Électromagnétisme",
                learnings: [{ id: 'lr1', title: "Champs et forces électromagnétiques", type: 'video', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Appliquer la règle de la main droite", subtitle: '2 exercices', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("nucléaire")) {
            return [{
                id: `l1_${chapId}`, title: "Réactions et radioactivité",
                learnings: [{ id: 'lr1', title: "Défaut de masse et énergie de liaison", type: 'article', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Bilan énergétique d'une réaction", subtitle: '4 exercices', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("gravit") || titleLower.includes("planète") || titleLower.includes("satellit") || titleLower.includes("kepler")) {
            return [{
                id: `l1_${chapId}`, title: "Interactions Gravitationnelles",
                learnings: [{ id: 'lr1', title: "Lois de Kepler", type: 'article', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Vitesse de satellisation", subtitle: 'Exercices types', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("circuit") || titleLower.includes("électrique") || titleLower.includes("courant") || titleLower.includes("rlc")) {
            return [{
                id: `l1_${chapId}`, title: "Circuits et Courants",
                learnings: [{ id: 'lr1', title: "Étude des composants R, L, C", type: 'video', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Calculs d'impédance et déphasage", subtitle: 'Appliquer les formules', status: 'Not started', active: false }]
            }];
        }

        // --- CHIMIE ---
        if (titleLower.includes("acide") || titleLower.includes("base") || titleLower.includes("ph") || titleLower.includes("ionique") || titleLower.includes("dissociation")) {
            return [{
                id: `l1_${chapId}`, title: "Acides et Bases",
                learnings: [{ id: 'lr1', title: "Couples acide/base et pH", type: 'video', status: 'completed' }, { id: 'lr2', title: "Titrages pH-métriques", type: 'video', status: 'active' }],
                practices: [{ id: 'p1', title: "Détermination du pKa", subtitle: 'Exercices', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("cinéti") || titleLower.includes("vitesse") || titleLower.includes("catalys")) {
            return [{
                id: `l1_${chapId}`, title: "Vitesse de réaction",
                learnings: [{ id: 'lr1', title: "Facteurs cinétiques", type: 'video', status: 'completed' }, { id: 'lr2', title: "Temps de demi-réaction", type: 'video', status: 'active' }],
                practices: [{ id: 'p1', title: "Exploitation de graphes x=f(t)", subtitle: 'Interprétation', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("stéréochimie") || titleLower.includes("géométrie") || titleLower.includes("isomérie") || titleLower.includes("conformation")) {
            return [{
                id: `l1_${chapId}`, title: "Stéréochimie",
                learnings: [{ id: 'lr1', title: "Chiralité et énantiomères", type: 'article', status: 'not-started' }, { id: 'lr2', title: "Représentations spatiales", type: 'video', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Identifier la relation d'isomérie", subtitle: 'Quiz visuels', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("alcool") || titleLower.includes("aldéhyde") || titleLower.includes("cétone")) {
            return [{
                id: `l1_${chapId}`, title: "Fonctions Organiques Oxygénées",
                learnings: [{ id: 'lr1', title: "Classes d'alcools et oxydation", type: 'video', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Tests d'identification (DNPH, Fehling)", subtitle: 'Entraînement', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("saponification") || titleLower.includes("savon") || titleLower.includes("ester")) {
            return [{
                id: `l1_${chapId}`, title: "Esters et Savons",
                learnings: [{ id: 'lr1', title: "Mécanisme d'estérification", type: 'article', status: 'not-started' }, { id: 'lr2', title: "Hydrolyse basique", type: 'video', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Calcul du rendement de saponification", subtitle: 'Exercices', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("protéine") || titleLower.includes("aminé")) {
            return [{
                id: `l1_${chapId}`, title: "Molécules Biologiques",
                learnings: [{ id: 'lr1', title: "Structure des acides alpha-aminés", type: 'video', status: 'not-started' }],
                practices: [{ id: 'p1', title: "Formation de dipeptides", subtitle: 'Exercices', status: 'Not started', active: false }]
            }];
        }

        // --- ECONOMIE ---
        if (titleLower.includes("développement") || titleLower.includes("sous-développement") || titleLower.includes("sous développement")) {
            return [{
                id: `l1_${chapId}`, title: "Théories du Sous-développement",
                learnings: [
                    { id: 'lr1', title: "Indicateurs économiques et sociaux", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Cercle vicieux de la pauvreté", type: 'article', status: 'active' }
                ],
                practices: [{ id: 'p1', title: "Analyser le PIB et l'IDH", subtitle: 'Étude de cas', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("chômage")) {
            return [{
                id: `l1_${chapId}`, title: "Le Chômage",
                learnings: [
                    { id: 'lr1', title: "Typologie du chômage", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Conséquences macroéconomiques", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Calcul du taux de chômage", subtitle: 'Application numérique', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("fmi") || titleLower.includes("banque") || titleLower.includes("fonds") || titleLower.includes("bad") || titleLower.includes("bm") || titleLower.includes("ppte")) {
            return [{
                id: `l1_${chapId}`, title: "Institutions Financières",
                learnings: [
                    { id: 'lr1', title: "Rôle des institutions de Bretton Woods", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Programmes d'ajustement structurel", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Identifier le rôle des institutions", subtitle: 'Quiz', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("commerce") || titleLower.includes("échange") || titleLower.includes("exploitation") || titleLower.includes("opep")) {
            return [{
                id: `l1_${chapId}`, title: "Commerce International",
                learnings: [
                    { id: 'lr1', title: "Théories de l'échange international", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Dégradation des termes de l'échange", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Analyse de la balance commerciale", subtitle: 'Exercice', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("agriculture") || titleLower.includes("élevage") || titleLower.includes("industrie") || titleLower.includes("secteur") || titleLower.includes("transport")) {
            return [{
                id: `l1_${chapId}`, title: "Secteurs d'activité",
                learnings: [
                    { id: 'lr1', title: "Structure sectorielle de l'économie", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Identifier les freins à l'industrialisation", subtitle: 'Entraînement', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("démographique") || titleLower.includes("alimentaire") || titleLower.includes("sanitaire") || titleLower.includes("culturel")) {
            return [{
                id: `l1_${chapId}`, title: "Démographie et Société",
                learnings: [
                    { id: 'lr1', title: "Transition démographique", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Enjeux de santé et d'éducation", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Interpréter une pyramide des âges", subtitle: 'Quiz visuel', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("coopération") || titleLower.includes("intégration") || titleLower.includes("cedeao")) {
            return [{
                id: `l1_${chapId}`, title: "Intégration Régionale",
                learnings: [
                    { id: 'lr1', title: "Les étapes de l'intégration économique", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Fonctionnement de la CEDEAO", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Avantages et inconvénients de l'intégration", subtitle: 'QCM', status: 'Not started', active: false }]
            }];
        }

        // --- FRANÇAIS ---
        if (titleLower.includes("résumé") || titleLower.includes("explication") || titleLower.includes("commentaire") || titleLower.includes("dissertation") || titleLower.includes("exposé") || titleLower.includes("prise de note") || titleLower.includes("débat")) {
            return [{
                id: `l1_${chapId}`, title: "Techniques d'Expression",
                learnings: [
                    { id: 'lr1', title: "Méthodologie de l'exercice", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Exemples commentés", type: 'article', status: 'active' }
                ],
                practices: [{ id: 'p1', title: "Rédiger une introduction", subtitle: 'Exercice guidé', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("littérature africaine") || titleLower.includes("négritude") || titleLower.includes("indépendance") || titleLower.includes("tradition et modernité") || titleLower.includes("afrique contemporaine")) {
            return [{
                id: `l1_${chapId}`, title: "Littérature Négro-Africaine",
                learnings: [
                    { id: 'lr1', title: "Histoire et thèmes majeurs", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Les auteurs incontournables", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Quiz sur les courants littéraires", subtitle: 'Tester vos connaissances', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("roman") || titleLower.includes("cercle des tropiques") || titleLower.includes("soleils") || titleLower.includes("crapauds") || titleLower.includes("perpétue") || titleLower.includes("saison au congo") || titleLower.includes("écrivain") || titleLower.includes("oppression")) {
            return [{
                id: `l1_${chapId}`, title: "Étude d'Œuvres Intégrales",
                learnings: [
                    { id: 'lr1', title: "Résumé et contexte de l'œuvre", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Étude des personnages", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Analyse d'un extrait", subtitle: 'Lecture méthodique', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("surréalisme") || titleLower.includes("existentialisme") || titleLower.includes("xxe") || titleLower.includes("littérature française")) {
            return [{
                id: `l1_${chapId}`, title: "Littérature Française du XXe Siècle",
                learnings: [
                    { id: 'lr1', title: "Les grands mouvements", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Textes fondateurs", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Relier les auteurs à leur mouvement", subtitle: 'Exercice', status: 'Not started', active: false }]
            }];
        }

        // --- PHILOSOPHIE ---
        if (titleLower.includes("science") || titleLower.includes("technique") || titleLower.includes("vérité")) {
            return [{
                id: `l1_${chapId}`, title: "Épistémologie",
                learnings: [
                    { id: 'lr1', title: "Limites et dangers de la technoscience", type: 'video', status: 'completed' },
                    { id: 'lr2', title: "Notions de vérité et de certitude", type: 'article', status: 'active' }
                ],
                practices: [{ id: 'p1', title: "Dissertation guidée", subtitle: 'Science sans conscience...', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("etat") || titleLower.includes("droit") || titleLower.includes("démocratie") || titleLower.includes("gouvernance") || titleLower.includes("liberté")) {
            return [{
                id: `l1_${chapId}`, title: "Philosophie Politique",
                learnings: [
                    { id: 'lr1', title: "Origine et nature du pouvoir de l'État", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "La séparation des pouvoirs", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Quiz : Les théories du contrat social", subtitle: 'Hobbes, Locke, Rousseau', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("morale")) {
            return [{
                id: `l1_${chapId}`, title: "Éthique et Morale",
                learnings: [
                    { id: 'lr1', title: "L'Impératif catégorique (Kant)", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Le fondement des valeurs morales", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Étude de cas moral", subtitle: 'Application', status: 'Not started', active: false }]
            }];
        }

        // --- ANGLAIS ---
        if (titleLower.includes("temps") || titleLower.includes("verb") || titleLower.includes("tenses")) {
            return [{
                id: `l1_${chapId}`, title: "Verbs and Tenses",
                learnings: [
                    { id: 'lr1', title: "Present, Past, and Future Tenses", type: 'video', status: 'completed' }
                ],
                practices: [{ id: 'p1', title: "Conjugation Practice", subtitle: 'Fill in the blanks', status: 'Not started', active: true }]
            }];
        }
        if (titleLower.includes("pronoun") || titleLower.includes("tag") || titleLower.includes("question")) {
            return [{
                id: `l1_${chapId}`, title: "Questions and Pronouns",
                learnings: [
                    { id: 'lr1', title: "Forming Wh- questions", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Tag Questions Rules", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Add the correct tag", subtitle: 'Grammar Exercise', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("passive") || titleLower.includes("voix") || titleLower.includes("voice")) {
            return [{
                id: `l1_${chapId}`, title: "Passive Voice",
                learnings: [
                    { id: 'lr1', title: "Active to Passive Transformations", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Rewrite the sentences", subtitle: 'Grammar Mastery', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("indirect") || titleLower.includes("report") || titleLower.includes("discours")) {
            return [{
                id: `l1_${chapId}`, title: "Reported Speech",
                learnings: [
                    { id: 'lr1', title: "Reporting statements and questions", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "Tense shifts in reported speech", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Report what they said", subtitle: 'Exercises', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("condition")) {
            return [{
                id: `l1_${chapId}`, title: "Conditionals",
                learnings: [
                    { id: 'lr1', title: "Type 1, 2, and 3 Conditionals", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "If clauses", subtitle: 'Complete the sentences', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("compar") || titleLower.includes("superlatif")) {
            return [{
                id: `l1_${chapId}`, title: "Comparatives & Superlatives",
                learnings: [
                    { id: 'lr1', title: "Short and long adjectives rules", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Degrees of comparison", subtitle: 'Quiz', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("regret") || titleLower.includes("pity") || titleLower.includes("wish") || titleLower.includes("apolog") || titleLower.includes("forgive")) {
            return [{
                id: `l1_${chapId}`, title: "Functions & Notions (Emotions)",
                learnings: [
                    { id: 'lr1', title: "Using 'wish' and 'if only'", type: 'video', status: 'not-started' },
                    { id: 'lr2', title: "How to apologize properly", type: 'article', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Expressing regrets", subtitle: 'Situational exercises', status: 'Not started', active: false }]
            }];
        }
        if (titleLower.includes("certainty") || titleLower.includes("opinion") || titleLower.includes("earn") || titleLower.includes("money") || titleLower.includes("conjonction") || titleLower.includes("conjunction")) {
            return [{
                id: `l1_${chapId}`, title: "Vocabulary & Communication",
                learnings: [
                    { id: 'lr1', title: "Linking words and transitions", type: 'article', status: 'not-started' },
                    { id: 'lr2', title: "Giving your opinion clearly", type: 'video', status: 'not-started' }
                ],
                practices: [{ id: 'p1', title: "Vocabulary matching", subtitle: 'Quiz', status: 'Not started', active: false }]
            }];
        }

        // --- FALLBACK POUR LE RESTE ---
        return [
            {
                id: `l1_${chapId}`,
                title: `Sujets clés : ${chapTitle}`,
                learnings: [
                    { id: 'lr1', title: "Approche théorique (Lecture approfondie)", type: 'article', status: 'not-started' },
                    { id: 'lr2', title: "Comprendre les principes fondateurs (Vidéo)", type: 'video', status: 'not-started' }
                ],
                practices: [
                    { id: 'p1', title: "Exercices de base", subtitle: 'Entraînement 1', status: 'Not started', active: false },
                    { id: 'p2', title: "Mini-projet", subtitle: 'Validation des acquis', status: 'Not started', active: false }
                ]
            }
        ];
    };

    // Add mock lessons to EVERY chapter unconditionally
    return chapters.map((chap) => {
        return {
            ...chap,
            lessons: getContextualLessons(chap.title, chap.id)
        };
    });
};

export const CourseDetailsView = ({ courseId, courseTitle, courseLevel, profile }: CourseDetailsProps) => {
    // Generate mock data dynamically
    const chaptersData = getMockChapters(courseTitle, courseLevel);
    const [activeChapterId, setActiveChapterId] = useState(chaptersData[0]?.id || 'c1');
    const activeChapter = chaptersData.find(c => c.id === activeChapterId) || chaptersData[0];

    const [isGenerating, setIsGenerating] = useState(false);
    const [aiContent, setAiContent] = useState<string | null>(null);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);

    // Load persisted content when chapter changes
    useEffect(() => {
        const cacheKey = `ai_content_${courseId}_${activeChapterId}`;
        const cachedContent = localStorage.getItem(cacheKey);
        if (cachedContent) {
            setAiContent(cachedContent);
        } else {
            setAiContent(null);
        }
    }, [activeChapterId, courseId]);

    const handleGenerateContent = async (chapterTitle: string) => {
        setIsGenerating(true);
        setIsContentModalOpen(false); 
        // We don't clear immediately to allow "re-generation" visual transition
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/quiz/generate-course`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: courseTitle,
                    chapter: chapterTitle,
                    level: courseLevel
                })
            });

            if (!response.ok) throw new Error("Erreur lors de la génération");
            const data = await response.json();
            
            // Enregistrer l'activité
            logActivity({
                subject: courseTitle,
                lesson: chapterTitle,
                status: 'En cours',
                progress: 50
            });

            // Persist the generated content
            const cacheKey = `ai_content_${courseId}_${activeChapterId}`;
            localStorage.setItem(cacheKey, data.content);
            
            setAiContent(data.content);
            // Scroll to the "About this Chapter" section where content is rendered
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
            setAiContent("Désolé, une erreur est survenue lors de la génération du cours par l'IA.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white min-h-[calc(100vh-4rem)]">
            {/* Top Banner (Streaks & Level) */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
                <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between text-sm">
                    <div className="font-bold text-gray-800">
                        Commencez à améliorer votre niveau et démarrez votre série hebdomadaire !
                    </div>
                    
                    <div className="flex items-center gap-6 mt-2 sm:mt-0">
                        {/* Streak */}
                        <div className="flex items-center gap-2 font-black text-xl text-gray-600">
                            <Flame className="w-6 h-6 text-gray-400 fill-gray-400" />
                            0
                        </div>
                        
                        {/* Level Progress */}
                        <div className="flex items-center gap-3">
                            <span className="font-bold whitespace-nowrap text-gray-700">Niveau 1</span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-[10%] h-full bg-purple-500 rounded-full" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">0 / 1 compétence</span>
                        </div>
                        
                        {/* Pass Test Button */}
                        <button className="bg-[#1B6B3A] hover:bg-[#155230] text-white font-bold py-1.5 px-4 rounded transition-colors text-sm">
                            Passez au niveau supérieur
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row relative">
                
                {/* LEFT SIDEBAR: Course Outline */}
                <div className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white h-[calc(100vh-8rem)] md:sticky md:top-[60px] overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                x<sup className="text-xs">y</sup>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-800 text-base leading-tight">{courseTitle}</h1>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">8 CHAPITRES • 112 COMPÉTENCES</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="py-2">
                        {chaptersData.map((chapter, index) => (
                            <button
                                key={chapter.id}
                                onClick={() => {
                                    setActiveChapterId(chapter.id);
                                    setIsContentModalOpen(false);
                                }}
                                className={`w-full text-left px-5 py-4 border-l-4 transition-colors ${
                                    activeChapterId === chapter.id 
                                    ? 'border-[#1B6B3A] bg-green-50/60 text-[#155230]' 
                                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    Chapitre {index + 1}
                                </div>
                                <div className={`text-sm ${activeChapterId === chapter.id ? 'font-bold' : 'font-medium'}`}>
                                    {chapter.title}
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-4 mt-4 mb-8">
                        <div className="border border-gray-200 rounded-lg p-4 bg-white  hover: transition-shadow cursor-pointer">
                            <div className="flex items-center gap-2 font-bold text-gray-800 mb-2 text-sm uppercase tracking-wider">
                                <BookOpen className="w-4 h-4" /> DÉFI DE COURS
                            </div>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                Testez vos connaissances sur les compétences de ce cours.
                            </p>
                            <span className="text-[#1B6B3A] text-sm font-bold hover:underline">
                                Commencez le défi de cours
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT AREA: Main Content */}
                <div className="flex-1 p-6 lg:p-10 bg-white md:h-[calc(100vh-8rem)] md:overflow-y-auto">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-[#1B6B3A] font-bold mb-6">
                        <Home className="w-4 h-4" />
                        <span className="text-gray-400">•</span>
                        <Link href="/dashboard/courses" className="hover:underline">Mathématiques</Link>
                        <span className="text-gray-400">•</span>
                        <span className="hover:underline cursor-pointer">{courseTitle}</span>
                    </div>

                    {/* Chapter Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Chapitre {chaptersData.findIndex(c => c.id === activeChapterId) + 1} : {activeChapter.title}
                        </h2>
                        <p className="text-gray-600 text-sm font-medium">
                            {activeChapter.pointsPossible} points de maîtrise possibles <span className="inline-block w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] text-center leading-3 italic ml-1 cursor-help">i</span>
                        </p>
                    </div>

                    {/* Mastery Legend */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4 text-xs font-bold text-gray-600">
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-[#6A5E9D] flex flex-center text-white"><Award className="w-3 h-3 m-auto" /></div> Maîtrisé</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-[#A68AE0]" /> Compétent</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded border-2 border-orange-400 bg-orange-100" /> Familier</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded border border-orange-500" /> Tenté</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded border border-gray-200" /> Pas commencé</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 flex flex-center"><Zap className="w-4 h-4 text-gray-400 fill-gray-400" /></div> Quiz</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 flex flex-center"><Star className="w-4 h-4 text-gray-400 fill-gray-400" /></div> Test</div>
                    </div>

                    {/* Mastery Box Grid (Mock) */}
                    <div className="flex flex-wrap gap-1 mb-10 pb-6 border-b border-gray-200">
                        {Array.from({length: 25}).map((_, i) => (
                            <div key={i} className="flex items-center">
                                <div className={`w-7 h-7 rounded-sm border ${i===0?'bg-[#6A5E9D] border-[#6A5E9D]': i===1?'bg-[#A68AE0] border-[#A68AE0]': i===2?'border-2 border-orange-400 bg-orange-100' : 'border-gray-200'} flex items-center justify-center`}>
                                    {i===0 && <Award className="w-4 h-4 text-white" />}
                                </div>
                                {(i===8 || i===15 || i===22) && <Zap className="w-4 h-4 text-gray-400 fill-gray-400 mx-1.5" />}
                            </div>
                        ))}
                        <div className="w-7 h-7 rounded-sm border border-gray-200 ml-1" />
                        <Star className="w-4 h-4 text-gray-400 fill-gray-400 mx-1.5 self-center" />
                    </div>

                    {/* About this Chapter */}
                    <div className="border border-gray-200 rounded-lg p-6 md:p-8 mb-8 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">À propos de ce chapitre</h3>
                            <button 
                                onClick={() => handleGenerateContent(activeChapter.title)}
                                disabled={isGenerating}
                                style={{
                                    backgroundColor: isGenerating ? '#9ca3af' : '#1B6B3A',
                                    color: '#ffffff',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    border: 'none',
                                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Génération...</span>
                                    </>
                                ) : (
                                    'Générer le cours complet'
                                )}
                            </button>
                        </div>

                        {isGenerating ? (
                             <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-20 h-20 border-4 border-gray-100 border-t-[#1B6B3A] rounded-full animate-spin"></div>
                                    <div className="absolute">
                                        <img 
                                            src="/images/logo_icon_pro_1775601897268.png" 
                                            alt="Logo" 
                                            className="w-10 h-10 object-contain animate-pulse"
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-black text-[#1B6B3A] mb-1">Préparation de votre contenu d'excellence...</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">Analyse des concepts • Structuration pédagogique</p>
                                </div>
                            </div>
                        ) : aiContent && activeChapterId ? (
                            <div className="prose prose-emerald max-w-none prose-headings:font-black prose-headings:text-[#0F2D1E] prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 border-t border-gray-100 pt-6 mt-2">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {aiContent}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 leading-relaxed max-w-4xl">
                                {activeChapter.description}
                            </p>
                        )}
                    </div>

                    {/* Lessons & Practices Block */}
                    {activeChapter.lessons.map((lesson) => (
                        <div key={lesson.id} className="border border-gray-200 rounded-lg mb-8  overflow-hidden">
                            {/* Block Header */}
                            <div className="px-6 py-5 bg-white border-b border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900">{lesson.title}</h3>
                            </div>
                            
                            {/* Two columns content */}
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white">
                                
                                {/* Left: Apprendre */}
                                <div className="flex-1 p-6">
                                    <h4 className="text-sm font-bold text-gray-500 mb-4 px-2">Apprendre</h4>
                                    <ul className="space-y-1">
                                        {lesson.learnings.map((lr) => (
                                            <li key={lr.id}>
                                                 <button 
                                                    onClick={() => handleGenerateContent(lr.title)}
                                                    className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="mt-0.5 text-[#1B6B3A] flex-shrink-0">
                                                        {lr.type === 'video' ? (
                                                            lr.status === 'completed' ? <CheckSquare className="w-5 h-5 text-[#1B6B3A]" /> : 
                                                            <PlaySquare className={`w-5 h-5 ${lr.status === 'active' ? 'text-[#1B6B3A] fill-green-50' : 'text-gray-400'}`} />
                                                        ) : (
                                                            lr.status === 'completed' ? <CheckSquare className="w-5 h-5 text-[#1B6B3A]" /> : 
                                                            <FileText className={`w-5 h-5 ${lr.status === 'active' ? 'text-[#1B6B3A] fill-green-50' : 'text-gray-400'}`} />
                                                        )}
                                                    </div>
                                                    <span className={`text-sm ${lr.status === 'active' ? 'text-[#1B6B3A] font-bold' : 'text-gray-700 font-medium group-hover:text-[#1B6B3A]'}`}>
                                                        {lr.title}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Right: S'entraîner */}
                                <div className="flex-1 p-6">
                                    <h4 className="text-sm font-bold text-gray-500 mb-4 px-2">S'entraîner</h4>
                                    <div className="space-y-4">
                                        {lesson.practices.map((p, pIdx) => (
                                            <div key={p.id} className={`flex items-center justify-between p-4 rounded-lg border ${p.active ? 'border-gray-200  bg-white' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                                                <div className="flex-1 pr-4">
                                                    {p.active && (
                                                        <div className="text-xs font-bold text-[#1B6B3A] mb-1">Prochaine étape pour vous :</div>
                                                    )}
                                                    <h5 className={`text-sm ${p.active ? 'font-bold text-gray-900' : 'font-bold text-gray-700'}`}>
                                                        {p.title}
                                                    </h5>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {p.subtitle}
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-4">
                                                        <button 
                                                            onClick={() => handleGenerateContent(p.title)}
                                                            className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${
                                                                p.active 
                                                                ? 'bg-[#1B6B3A] hover:bg-[#155230] text-white shadow-md shadow-emerald-100 hover:-translate-y-0.5' 
                                                                : 'border border-gray-200 text-[#1B6B3A] hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {p.active ? 'Démarrer le cours' : "S'entraîner"}
                                                        </button>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-tighter">
                                                            <Star className="w-2.5 h-2.5 fill-amber-500" />
                                                            {p.pointsPossible} pts
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col items-center justify-center w-20 flex-shrink-0 border-l border-gray-200 pl-4">
                                                    <div className="font-bold text-gray-500 text-xs text-center">Pas commencé</div>
                                                    {/* Fake graph or dots could go here */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                    
                    {activeChapter.lessons.length === 0 && (
                        <div className="text-center py-20 text-gray-500 font-medium">
                            Contenu en cours de préparation pour ce chapitre.
                        </div>
                    )}
                    
                </div>
            </div>

        </div>
    );
};
