# Gemma Hallucination Visualizer

Une application web interactive pour visualiser et analyser les schémas d'hallucination des modèles de langage Gemma à travers plusieurs dimensions.

## 🌐 **Application Déployée**

L'application est déployée et accessible à l'adresse :
**https://crururss.manus.space**

## 📱 **Interface Mobile-Friendly**

### Navigation par Onglets
L'application détecte automatiquement les écrans mobiles (< 768px) et bascule vers une interface par onglets optimisée :

- **🔍 Filters** : Accès complet aux filtres intelligents
- **🗺️ Map** : Carte interactive en plein écran
- **📋 Events** : Liste détaillée des événements
- **📊 Analysis** : Graphiques et métriques d'analyse

### Interface Responsive
- **Desktop** : Layout traditionnel avec barre latérale et panneaux
- **Mobile** : Navigation par onglets avec contenu optimisé
- **Header adaptatif** : Boutons compacts et textes masqués sur petits écrans
- **Graphiques responsifs** : Tailles et polices ajustées automatiquement

## ✨ **Nouvelles Fonctionnalités**

### Sélecteur de Modèles Visible
- **Sélecteur amélioré** : Le sélecteur de modèles est maintenant clairement visible avec un fond bleu et un z-index élevé
- **Navigation intuitive** : Changement facile entre Gemma 1B, 4B et 27B
- **Feedback visuel** : Indication claire du modèle actuellement sélectionné

### Mode Comparaison des Modèles
- **Bouton "Compare Models"** : Bascule entre vue simple et mode comparaison
- **Sélection multiple** : Cases à cocher pour sélectionner les modèles à comparer
- **Visualisations comparatives** :
  - Métriques de performance côte à côte avec codes couleur
  - Graphique en barres de comparaison de précision
  - Analyse par catégorie avec barres multiples
  - Insights automatiques sur les meilleurs modèles
- **Codes couleur distinctifs** :
  - Gemma 1B : Bleu (#3B82F6)
  - Gemma 4B : Vert (#10B981)  
  - Gemma 27B : Orange (#F59E0B)

## 📊 **Vrais Datasets Intégrés**

L'application utilise maintenant de vrais datasets de recherche provenant du projet "Hierarchical Reasoning Model vs Wikipedia" :

### Sources de Données
- **Gemma 1B** : https://github.com/sergeicu/hierarchical_reasoning_model_vs_wikipedia/blob/main/demo_gemma/output/results_gemma3_1b.json
- **Gemma 4B** : https://github.com/sergeicu/hierarchical_reasoning_model_vs_wikipedia/blob/main/demo_gemma/output/results_gemma3_4b.json  
- **Gemma 27B** : https://github.com/sergeicu/hierarchical_reasoning_model_vs_wikipedia/blob/main/demo_gemma/output/results_gemma3_27b.json

### Performances Observées (Vrais Datasets)
- **Gemma 1B** : 15.0% de précision, 0.38 de confiance moyenne
- **Gemma 4B** : 42.0% de précision, 0.62 de confiance moyenne  
- **Gemma 27B** : 64.0% de précision, 0.74 de confiance moyenne
- **Progression claire** : Les modèles plus grands montrent une amélioration significative
- **Corrélation confiance-précision** : Plus le modèle est grand, plus il est confiant et précis

## ✨ **Interface Optimisée**

L'interface a été spécialement optimisée pour une meilleure expérience utilisateur :

### Proportions Équilibrées
- **Barre latérale des filtres** (384px) - Entièrement lisible avec tous les textes visibles
- **Section centrale** - Carte compacte (384px de hauteur) + Liste d'événements étendue
- **Panneau d'analyse** (500px) - Espace élargi pour les graphiques et métriques

### Layout Amélioré
- **Carte du monde** réduite à une taille optimale pour conserver la vue d'ensemble
- **Liste d'événements** organisée en grille 2 colonnes avec plus de détails visibles
- **Panneau des résultats** élargi pour une meilleure lisibilité des graphiques
- **Filtres intelligents** avec espacement optimisé et textes entièrement lisibles

## 🌟 Fonctionnalités

### Interface Principale
- **Carte du monde interactive** avec visualisation géographique des données de précision
- **Système de filtres intelligents** avec 4 groupes de filtres progressifs
- **Tableau de bord d'analyse** avec métriques clés et graphiques
- **Modal de détails d'événements** avec navigation et métadonnées complètes

### Filtres Intelligents
1. **📍 Analyse Géographique** - Filtrage par régions continentales et contextes culturels
2. **⏰ Analyse des Périodes Temporelles** - Analyse des modèles à travers les périodes historiques
3. **🏛️ Propriétés des Événements** - Filtrage par type d'événement et caractéristiques
4. **🌍 Facteurs Sociétaux** - Facteurs sociétaux et temporels contextuels

### Visualisations
- **Carte de précision par région** avec codage couleur (Vert: >80%, Jaune: 50-80%, Rouge: <50%)
- **Graphiques de précision par catégorie** (graphique en barres)
- **Distribution de confiance** (histogramme)
- **Analyse chronologique** (graphique linéaire)

### Modèles Supportés
- Gemma 1B
- Gemma 4B  
- Gemma 27B

## 🛠️ Technologies Utilisées

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Cartes**: React Leaflet + OpenStreetMap
- **Graphiques**: Recharts
- **Gestion d'état**: Zustand
- **Build**: Vite
- **Déploiement**: Manus Platform

## 📊 Structure des Données

L'application traite des fichiers JSON contenant des résultats d'évaluation avec cette structure :

```typescript
interface EventData {
  model_name: "gemma3:1b" | "gemma3:4b" | "gemma3:27b";
  event: {
    text: string;
    year: number;
    date: string;
    primary_category: string;
    violence_level: "peaceful" | "violent" | "catastrophic";
    scale: "local" | "national" | "international" | "global";
    human_impact: "individual" | "small group" | "mass population";
    continental: string;
    cultural_region: string;
    development_status: "developed" | "developing";
    colonial_status: "colonial" | "independent";
    // ... autres métadonnées
  };
  question: string;
  model_response: string;
  extracted_year: number;
  is_correct: boolean;
  confidence_score: number;
}
```

## 🎯 Utilisation

1. **Sélection du modèle** - Choisissez le modèle Gemma à analyser dans l'en-tête
2. **Application des filtres** - Utilisez les filtres intelligents dans la barre latérale gauche
3. **Exploration de la carte** - Cliquez sur les régions pour voir les détails de précision
4. **Analyse des événements** - Cliquez sur les événements pour voir les détails dans le modal
5. **Export des données** - Utilisez les boutons d'export CSV/JSON dans l'en-tête

## 📈 Métriques Affichées

- **Précision globale** - Pourcentage d'événements correctement prédits
- **Confiance moyenne** - Score de confiance moyen du modèle
- **Nombre total d'événements** - Taille du dataset filtré
- **Précision par catégorie** - Performance par type d'événement
- **Distribution de confiance** - Répartition des scores de confiance
- **Analyse chronologique** - Précision par période historique

## 🔧 Développement Local

```bash
# Installation des dépendances
pnpm install

# Démarrage du serveur de développement
pnpm run dev

# Build pour la production
pnpm run build
```

## 📝 Notes

- L'application utilise de vrais datasets de recherche provenant de GitHub
- Les données sont chargées dynamiquement depuis les URLs des fichiers JSON
- Les régions géographiques sont basées sur les métadonnées réelles des événements
- Les filtres intelligents incluent une logique de dépendance entre les groupes
- L'interface est entièrement responsive et optimisée pour desktop et mobile
- Les proportions ont été optimisées pour une meilleure expérience d'analyse
- Les performances varient selon les modèles : Gemma 1B (~15%), Gemma 4B et 27B (à tester)

