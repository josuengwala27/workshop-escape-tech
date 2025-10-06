# 🚀 Guide de Démarrage Rapide - Vaccine Crisis

## ⚡ Installation et Lancement (5 minutes)

### 1. Installation des dépendances

```bash
npm run install-all
```

Cette commande installe tout ce dont vous avez besoin automatiquement.

### 2. Lancer l'application

```bash
npm run dev
```

**C'est tout !** 🎉

- Le **client** sera accessible sur : `http://localhost:3000`
- Le **serveur** tournera sur : `http://localhost:3001`

---

## 🎮 Tester le Jeu (3 appareils requis)

### Option 1 : 3 ordinateurs différents

1. Sur chaque ordinateur, ouvrez `http://localhost:3000` (remplacez `localhost` par l'IP de la machine qui héberge le serveur)
2. Entrez un nom différent
3. Utilisez le **même code de partie** (ex: `TEST01`)
4. Cliquez sur "Rejoindre la mission"

### Option 2 : 1 ordinateur + 2 smartphones

1. Trouvez votre IP locale :
   ```bash
   # macOS/Linux
   ifconfig | grep inet
   
   # Vous cherchez quelque chose comme : 192.168.x.x
   ```

2. Sur l'ordinateur : `http://localhost:3000`
3. Sur les smartphones : `http://192.168.x.x:3000` (remplacez par votre IP)

### Option 3 : Tester seul (mode dev)

Pour tester rapidement les 3 rôles :
1. Ouvrez 3 onglets/fenêtres de navigateur
2. Utilisez le mode navigation privée pour 2 d'entre eux
3. Connectez-vous avec 3 noms différents

---

## 📋 Checklist Avant la Soutenance

### Technique
- [ ] L'application se lance sans erreur
- [ ] Les 3 joueurs peuvent rejoindre une partie
- [ ] Le timer fonctionne (5 minutes)
- [ ] Chaque rôle fonctionne correctement
- [ ] Le code COOP final est validé
- [ ] L'écran de résultats s'affiche

### Démonstration
- [ ] Préparer 3 appareils (ordinateurs/tablettes/smartphones)
- [ ] Tester la démo complète au moins 1 fois
- [ ] Préparer un code de partie simple (ex: `DEMO01`)
- [ ] Noter les codes COOP à l'avance si besoin

### Livrables
- [ ] README.md complété
- [ ] DOCUMENTATION_TECHNIQUE.md remplie (groupe, campus, noms)
- [ ] Poster scientifique A3 créé (voir GUIDE_POSTER.md)
- [ ] Présentation PowerPoint prête
- [ ] Présentation de l'équipe en anglais préparée

---

## 🎯 Déroulement d'une Partie Type

### Phase 1 : Lobby (30s - 1min)
- 3 joueurs se connectent
- Chacun clique sur "Je suis prêt"
- Le timer démarre automatiquement

### Phase 2 : Jeu (5 minutes)
Chaque joueur a son propre écran :

**Joueur 1 - Biostat' (📊)** :
- Voit 3 onglets (Lot A, B, C)
- Clique sur chaque onglet pour voir la courbe
- Clique sur "Analyser" pour chaque lot
- Lit le résultat (OK ou À REJETER)
- Note son code COOP (2 chiffres)

**Joueur 2 - Logistique (🚚)** :
- Voit des cartes de lieux
- Clique sur les routes pour construire son itinéraire
- Vérifie que le temps total ≤ 15 min
- Clique sur "Confirmer la livraison"
- Note son code COOP (2 chiffres)

**Joueur 3 - Infirmier·e (🧤)** :
- Voit des cartes de gestes d'hygiène mélangées
- Clique sur les cartes pour les ordonner
- Vérifie l'ordre (friction → gants → désinfection → préparation → vérification)
- Clique sur "Valider le protocole"
- Note son code COOP (2 chiffres)

### Phase 3 : Code COOP (1-2 minutes)
- Chaque joueur **partage vocalement** son code
- Un joueur entre le code à 6 chiffres : `[Bio][Log][Hyg]`
- Exemple : `09` + `47` + `23` = `094723`
- Clique sur "Valider le code"

### Phase 4 : Résultats (30s - 1min)
- Victoire ou défaite affichée
- Récapitulatif des performances
- Débriefing éducatif
- Bouton "Nouvelle partie" pour rejouer

---

## 💡 Astuces pour la Soutenance

### Démonstration Live

**Option 1 : Démo complète (recommandée)**
- 3 membres de l'équipe jouent en direct
- Montre la collaboration réelle
- Plus impressionnant pour le jury

**Option 2 : Démo préenregistrée + walkthrough**
- Vidéo de 2-3 minutes montrant une partie
- Puis walkthrough du code en direct
- Plus sûr (pas de risque technique)

**Option 3 : Démo hybride**
- Montrer le lobby en live (connexion des joueurs)
- Montrer chaque rôle individuellement (démo rapide)
- Montrer l'écran de résultats

### Points à Mettre en Avant

1. **Multijoueur temps réel** : "Les 3 joueurs voient les updates en direct"
2. **Design moderne** : "Interface responsive, fonctionne sur tous les appareils"
3. **Pédagogique** : "Débriefing éducatif à la fin avec les apprentissages"
4. **Coopération forcée** : "Impossible de gagner sans communiquer - chaque joueur a 2 chiffres du code"
5. **Tension** : "Timer de 5 minutes avec changements de couleur"

### Phrases Clés pour l'Oral

- *"Nous avons créé une **expérience de jeu asymétrique** où chaque joueur a un rôle unique"*
- *"L'utilisation de **Socket.IO** garantit une **synchronisation temps réel** entre les joueurs"*
- *"Le jeu est **entièrement responsive** et fonctionne sur ordinateur, tablette et smartphone"*
- *"Chaque partie génère des **énigmes aléatoires**, garantissant une **rejouabilité** infinie"*
- *"Nous avons intégré un **débriefing pédagogique** pour ancrer les apprentissages"*

---

## 🐛 Problèmes Courants et Solutions

### Le serveur ne démarre pas

**Erreur : "Port 3001 already in use"**
```bash
# Trouver le processus qui utilise le port
lsof -i :3001

# Tuer le processus
kill -9 [PID]

# Ou changer le port dans server/server.js
const PORT = 3002; // Au lieu de 3001
```

### Le client ne se connecte pas au serveur

**Vérifier :**
1. Le serveur est bien lancé (`http://localhost:3001` doit répondre)
2. Ouvrir la console du navigateur (F12) et chercher les erreurs
3. Vérifier que le port 3000 est libre

**Solution :** Relancer avec `npm run dev`

### Les graphiques ne s'affichent pas

```bash
cd client
npm install recharts --save
```

### Les styles sont cassés

```bash
cd client
npm install
npm run dev
```

---

## 📱 Utiliser son Smartphone pour Tester

### Étape 1 : Trouver votre IP locale

**macOS/Linux :**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows :**
```bash
ipconfig | findstr IPv4
```

Vous cherchez une IP du type : `192.168.1.xxx` ou `10.0.0.xxx`

### Étape 2 : Configurer le client

Modifier `client/src/App.jsx` ligne 6 :

```javascript
// Avant
const socket = io('http://localhost:3001', {

// Après (remplacez par votre IP)
const socket = io('http://192.168.1.xxx:3001', {
```

### Étape 3 : Configurer le serveur

Modifier `server/server.js` ligne 12 :

```javascript
cors: {
  origin: "*", // Permet toutes les origines
  methods: ["GET", "POST"]
}
```

### Étape 4 : Accès depuis le smartphone

Sur votre smartphone, connectez-vous au **même réseau WiFi** puis ouvrez :
```
http://192.168.1.xxx:3000
```

---

## 🎥 Enregistrer une Vidéo Démo

### Avec OBS Studio (gratuit)

1. Télécharger : https://obsproject.com/
2. Ajouter une source "Capture d'écran"
3. Cliquer sur "Démarrer l'enregistrement"
4. Jouer une partie complète
5. Cliquer sur "Arrêter l'enregistrement"

### Avec Loom (facile)

1. Installer l'extension Chrome : https://www.loom.com/
2. Cliquer sur l'icône Loom
3. Sélectionner "Screen + Camera"
4. Démarrer l'enregistrement

---

## 📊 Statistiques à Préparer pour la Soutenance

- **Nombre de lignes de code** :
  ```bash
  find . -name "*.js" -o -name "*.jsx" -o -name "*.css" | xargs wc -l
  ```

- **Nombre de composants React** :
  ```bash
  find client/src/components -name "*.jsx" | wc -l
  ```

- **Temps de développement** : [X heures]
- **Technologies utilisées** : 7 (React, Node.js, Express, Socket.IO, Recharts, Vite, CSS3)

---

## 🎤 Présentation de l'Équipe (Exemple en Anglais)

> *"Hello, we are team number [X] from [Campus].*
> 
> *I'm [Name], and I was responsible for the **backend development** using Node.js and Socket.IO.*
> 
> *This is [Name], who developed the **frontend interfaces** with React and created the **UI/UX design**.*
> 
> *And finally, [Name], who implemented the **game logic** and the **real-time synchronization** between players.*
> 
> *Together, we created Vaccine Crisis, a **cooperative multiplayer escape game** that teaches about **vaccine cold chain management**, **medical logistics**, and **hygiene protocols**."*

---

## ✅ Checklist Finale (Jour J)

### 2 heures avant
- [ ] Tester l'application une dernière fois
- [ ] Charger les 3 appareils à 100%
- [ ] Préparer un point d'accès WiFi (hotspot) si besoin
- [ ] Imprimer le poster A3
- [ ] Répéter la présentation

### 30 minutes avant
- [ ] Lancer les serveurs
- [ ] Se connecter avec les 3 appareils
- [ ] Vérifier que tout fonctionne
- [ ] Préparer le code de partie (ex: `JURY01`)

### Pendant la soutenance
- [ ] Présenter l'équipe en anglais
- [ ] Expliquer le contexte et les objectifs
- [ ] Faire la démo live ou montrer la vidéo
- [ ] Expliquer l'architecture technique
- [ ] Montrer le code (si demandé)
- [ ] Conclure sur l'apport pédagogique

---

**Bon courage pour la soutenance ! 🚀💉**

