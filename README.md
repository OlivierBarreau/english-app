# English APP

Application web d'apprentissage de l'anglais développée en Node.js / Express, avec moteur de template Nunjucks, base de données PostgreSQL et mise en forme via Tailwind CSS. L'application n'est pas complète.

## Description

English APP est une plateforme permettant à des utilisateurs de progresser en anglais à travers :

- **Authentification** : inscription, connexion et gestion de session (`src/routes/auth.js`).
- **Profil utilisateur** : consultation et modification du profil, changement de mot de passe (`src/routes/profileRoutes.js`).
- **Leçons & programmes** : grammaire et vocabulaire organisés en leçons et programmes de progression (`lessonModel.js`, `programModel.js`, `program_lessonModel.js`).
- **Quiz & questions** : exercices avec suivi des résultats par question et par leçon (`questionModel.js`, `question_resultModel.js`, `lesson_resultModel.js`).
- **Préparation au TOEIC** : modules dédiés à l'entraînement (listening, reading, writing, test complet, historique des résultats) accessibles via `/toeic/*`.
- **Articles et expressions** : pages de contenu complémentaire (`/articles`, `/expressions`).

## Architecture du projet

```
english-app/
├── index.js                # Point d'entrée de l'application Express
├── db_data.sql              # Jeu de données d'exemple
├── table_config.sql         # Script de création des tables principales
├── db_files/
│   ├── toeic_tables.sql     # Script de création des tables TOEIC
│   └── setup_toeic_tables.js
├── public/                  # Fichiers statiques (CSS, images, favicon)
├── src/
│   ├── routes/               # Définition des routes Express (auth, pages, profil)
│   ├── controllers/           # Logique métier associée aux routes
│   ├── models/                 # Accès à la base de données (PostgreSQL via `pg`)
│   └── views/                   # Templates Nunjucks (.njk)
├── tailwind.config.js       # Configuration Tailwind CSS
├── postcss.config.js        # Configuration PostCSS
└── package.json
```

## Stack technique

| Catégorie        | Technologie                          |
|------------------|---------------------------------------|
| Backend          | Node.js, Express                      |
| Templates        | Nunjucks (`.njk`)                     |
| Base de données  | PostgreSQL (via `pg`)                 |
| Sessions         | express-session                       |
| Sécurité         | bcrypt (hash des mots de passe)       |
| Style            | Tailwind CSS, PostCSS, Autoprefixer   |
| Dev tools        | nodemon                               |

## Démarrage rapide

### 1. Prérequis

- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- [PostgreSQL](https://www.postgresql.org/) installé et démarré

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Crée un fichier `.env` à la racine du projet (non versionné) avec les variables suivantes :

```env
DB_USER="postgres"
DB_PASSWORD="votre_mot_de_passe"
DB_NAME="englishdb"
DB_HOST="localhost"
DB_PORT="5432"
SESSION_SECRET="une_chaine_secrete_aleatoire"
```

> Le fichier `.env` est déjà listé dans `.gitignore`.

### 4. Création de la base de données

Crée la base PostgreSQL puis exécute les scripts SQL fournis pour créer les tables :

```bash
# Création de la base (si elle n'existe pas déjà)
psql -U postgres -c "CREATE DATABASE englishdb;"

# Création des tables principales
psql -U postgres -d englishdb -f table_config.sql

# Création des tables dédiées au TOEIC
psql -U postgres -d englishdb -f db_files/toeic_tables.sql

# (Optionnel) Import du jeu de données d'exemple
psql -U postgres -d englishdb -f db_data.sql
```

### 5. Génération des styles Tailwind CSS

```bash
npm run tailwind:css
```

> ⚠️ **Scripts CSS actuellement cassés** : `npm run build` référence des sous-scripts (`tailwind`, `autoprefixer`) absents de `package.json`, et `npm run tailwind:css` pointe vers un fichier `public/styles/style.css` inexistant (le fichier source réel est `public/css/style.css`) avec une configuration PostCSS/Tailwind v4 incompatible (`postcss.config.js` utilise le plugin `tailwindcss` alors que `@tailwindcss/postcss` est installé). Ces scripts sont à corriger avant de pouvoir régénérer le CSS Tailwind ; en attendant, le fichier déjà compilé `public/css/tailwind.css` reste utilisable tel quel.

### 6. Lancement de l'application

En mode développement (rechargement automatique avec `nodemon`) :

```bash
npm run dev
```

En mode production :

```bash
npm start
```

L'application est accessible sur [http://localhost:8000](http://localhost:8000).

## Scripts

| Commande              | Description                                         |
|------------------------|------------------------------------------------------|
| `npm start`            | Démarre le serveur avec Node.js                      |
| `npm run dev`          | Démarre le serveur avec rechargement automatique     |
| `npm run build`        | Référence des scripts manquants, actuellement en échec |
| `npm run tailwind:css` | Pointe vers un fichier source inexistant, actuellement en échec |

## Auteurs

Olivier Barreau, Lucas Grospellier

