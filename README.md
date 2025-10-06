# 💉 VACCINE CRISIS - Escape Game Numérique

## 🎯 Description

**Vaccine Crisis** est un escape game coopératif multijoueur créé pour le Workshop EPSI/WIS 2025. Un frigo de vaccins est tombé en panne ! En **5 minutes**, votre équipe de 3 joueurs doit collaborer pour :

- 📊 **Biostat'** : Valider quels lots de vaccins sont encore utilisables via l'analyse de courbes de température
- 🚚 **Logistique** : Organiser la livraison d'un lot OK dans les temps tout en respectant la chaîne du froid  
- 🧤 **Infirmier·e** : Contrôler l'hygiène en ordonnant correctement les gestes du protocole sanitaire

À la fin, vous devez entrer un **code COOP à 6 chiffres** qui prouve que tous les rôles ont collaboré et partagé leurs informations !

## 🎓 Objectifs Pédagogiques

- **Chaîne du froid** : Comprendre l'importance de la conservation des vaccins
- **Planification logistique** : Organiser un trajet sous contraintes de temps
- **Protocole d'hygiène** : Respecter l'ordre des gestes sanitaires
- **Travail d'équipe** : Communiquer et partager des informations critiques

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Interface utilisateur
- **Vite** - Build tool moderne et rapide
- **Socket.IO Client** - Communication temps réel
- **Recharts** - Graphiques de température

### Backend
- **Node.js** - Serveur backend
- **Express** - Framework web
- **Socket.IO** - WebSocket pour le multijoueur
- **UUID** - Génération d'identifiants uniques

## 📋 Prérequis

- **Node.js** >= 16.x
- **npm** >= 7.x

## 🚀 Installation

### Installation complète (recommandée)

```bash
npm run install-all
```

Cette commande installe toutes les dépendances du projet (root, server et client).

### Installation manuelle

```bash
# Dépendances root
npm install

# Dépendances serveur
cd server && npm install

# Dépendances client
cd ../client && npm install
```

## ▶️ Lancement

### Lancement automatique (serveur + client)

```bash
npm run dev
```

Cette commande lance simultanément :
- **Serveur backend** sur `http://localhost:3001`
- **Client frontend** sur `http://localhost:3000`

### Lancement séparé

**Serveur uniquement :**
```bash
npm run server
```

**Client uniquement :**
```bash
npm run client
```

## 🎮 Comment Jouer

### 1. Créer une partie

1. Ouvrez `http://localhost:3000` dans votre navigateur
2. Entrez votre nom
3. Choisissez un code de partie (ex: `VAXCR1`)
4. Cliquez sur "Rejoindre la mission"

### 2. Inviter vos coéquipiers

- Partagez le **code de partie** avec 2 autres joueurs
- Ils doivent ouvrir l'application sur **leurs propres appareils** (ordinateurs, tablettes, smartphones)
- Chaque joueur se voit **automatiquement assigner un rôle** différent

### 3. Lancer la mission

- Attendez que les **3 joueurs** soient connectés
- Chaque joueur clique sur **"Je suis prêt !"**
- Le **timer de 5 minutes** démarre automatiquement

### 4. Accomplir votre rôle

#### 📊 Biostat' (Thermo-Scan)
- Analysez les courbes de température de 3 lots
- Un lot est **UTILISABLE** si la température est restée au-dessus de 8°C pendant **maximum 8 minutes**
- Comptez les minutes hors norme pour chaque lot
- Marquez les lots OK ou à rejeter
- Récupérez votre **code COOP (2 chiffres)**

#### 🚚 Logistique (Froid Express)  
- Choisissez un itinéraire de livraison depuis le dépôt vers un centre
- Le trajet doit durer **maximum 15 minutes** pour maintenir la chaîne du froid
- Planifiez le meilleur chemin parmi les routes disponibles
- Récupérez votre **code COOP (2 chiffres)**

#### 🧤 Infirmier·e (Hygiène)
- Ordonnez 5 gestes d'hygiène dans le bon ordre
- Exemple : friction hydro-alcoolique → gants → désinfection → préparation matériel → vérification péremption
- Le protocole doit être **parfait (0 erreur)** pour valider
- Récupérez votre **code COOP (2 chiffres)**

### 5. Partager les codes

- **Parlez-vous !** Chaque joueur possède 2 chiffres du code final
- Le code COOP final = **Code Biostat (2) + Code Logistique (2) + Code Hygiène (2)**
- Exemple : `09` + `11` + `90` = `091190`

### 6. Valider le code

- Une fois que tous les rôles sont complétés, entrez le **code COOP à 6 chiffres**
- Si tout est correct, **VICTOIRE !** 🎉

## ✅ Conditions de Victoire

Pour gagner, vous devez :
- ✅ Avoir validé **au moins 1 lot utilisable** (Biostat')
- ✅ Planifier un trajet **≤ 15 minutes** (Logistique)  
- ✅ Ordonner le protocole d'hygiène **sans erreur** (Infirmier·e)
- ✅ Entrer le **code COOP correct** à 6 chiffres

## 🏗️ Architecture du Projet

```
escape-game-vaccins/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Composants React
│   │   │   ├── roles/        # Composants spécifiques à chaque rôle
│   │   │   │   ├── BiostatRole.jsx
│   │   │   │   ├── LogisticsRole.jsx
│   │   │   │   └── HygieneRole.jsx
│   │   │   ├── Lobby.jsx     # Salle d'attente
│   │   │   ├── GameInterface.jsx  # Interface de jeu
│   │   │   ├── Timer.jsx     # Compte à rebours
│   │   │   └── Results.jsx   # Écran de résultats
│   │   ├── styles/           # Fichiers CSS
│   │   ├── App.jsx           # Composant principal
│   │   └── main.jsx          # Point d'entrée
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Backend Node.js
│   ├── server.js             # Serveur Express + Socket.IO
│   └── package.json
│
├── package.json              # Scripts root
└── README.md
```

## 🔧 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run install-all` | Installe toutes les dépendances (root, server, client) |
| `npm run dev` | Lance le serveur et le client simultanément |
| `npm run server` | Lance uniquement le serveur backend |
| `npm run client` | Lance uniquement le client frontend |
| `npm run build` | Build de production du client |

## 🎨 Fonctionnalités Principales

### ✨ Multijoueur en Temps Réel
- Communication via **WebSocket (Socket.IO)**
- Synchronisation instantanée entre les 3 joueurs
- Système de salles avec codes uniques

### ⏱️ Timer Dynamique
- Compte à rebours de **5 minutes**
- Changement de couleur selon l'urgence (vert → orange → rouge)
- Animation pulsante quand < 30 secondes

### 🎯 Rôles Asymétriques
- Chaque joueur a une **mission différente**
- Interface unique adaptée à chaque rôle
- Données générées aléatoirement à chaque partie

### 🔐 Système de Code COOP
- Chaque rôle génère **2 chiffres secrets**
- Oblige la **communication** entre joueurs
- Preuve de coopération pour la victoire

### 📊 Graphiques Interactifs
- Courbes de température avec **Recharts**
- Seuils visuels et zones critiques
- Analyse en temps réel

### 🎓 Débriefing Éducatif
- Écran de résultats détaillé
- Points d'apprentissage sur la santé publique
- Feedback personnalisé par rôle

## 🌐 Déploiement

### Build de Production

```bash
npm run build
```

Les fichiers optimisés seront dans `client/dist/`.

### Hébergement Recommandé

- **Frontend** : Vercel, Netlify, Firebase Hosting
- **Backend** : Heroku, Render, Railway
- **Variables d'environnement** : Configurez `REACT_APP_SERVER_URL` pour l'URL du serveur en production

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifiez que le port 3001 n'est pas déjà utilisé
lsof -i :3001
# Installez les dépendances du serveur
cd server && npm install
```

### Le client ne se connecte pas
```bash
# Vérifiez que le serveur tourne sur le port 3001
# Vérifiez la console du navigateur pour les erreurs WebSocket
```

### Les graphiques ne s'affichent pas
```bash
# Réinstallez recharts
cd client && npm install recharts
```

## 👥 Équipe

Projet réalisé dans le cadre du Workshop EPSI/WIS 2025.

## 📝 Licence

MIT

## 🙏 Remerciements

- **Ubisoft Strategic Innovation Lab** pour l'inspiration du concept "Escape Tech"
- **EPSI/WIS** pour l'organisation du workshop
- Les associations d'éducation populaire qui utiliseront ces outils

---

**Bon jeu et bonne collaboration ! 🎮💉**
