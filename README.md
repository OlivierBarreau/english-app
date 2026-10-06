# English APP

Application web d'apprentissage de l'anglais développée en Node.js / Express, avec moteur de template Nunjucks, base de données PostgreSQL et mise en forme via Tailwind CSS. L'application n'est pas complète.

## Description

English APP est une plateforme permettant à des utilisateurs de progresser en anglais :

- **Authentification** : inscription, connexion et gestion de session
- **Profil utilisateur** : consultation et modification du profil, changement de mot de passe
- **Leçons & programmes** : grammaire et vocabulaire organisés en leçons et programmes de progression 
- **Quiz & questions** : exercices avec suivi des résultats par question et par leçon
- **Préparation au TOEIC** : modules dédiés à l'entraînement (listening, reading, writing, test complet, historique des résultats)
- **Articles et expressions** : pages de contenu complémentaire

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
npm run build
```

Cette commande compile `public/css/style.css` (avec Tailwind CSS v4 et Autoprefixer) vers `public/css/tailwind.css`, le fichier chargé par les templates (`src/views/layout.njk`).

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
| `npm run build`        | Compile les styles Tailwind CSS (+ autoprefixer)     |
| `npm run tailwind:css` | Compile `public/css/style.css` en `public/css/tailwind.css` |

## Auteurs

Olivier Barreau, Lucas Grospellier

