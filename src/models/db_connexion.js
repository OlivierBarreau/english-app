require('dotenv').config(); // Load .env variables
const { Pool } = require('pg');

// Configuration de la connexion
const pool = new Pool({
    user: process.env.DB_USER,          // Remplacez par votre utilisateur PostgreSQL
    host: process.env.DB_HOST,          // Adresse du serveur PostgreSQL
    database: process.env.DB_NAME,      // Nom de la base de données
    password: process.env.DB_PASSWORD,  // Mot de passe PostgreSQL
    port: process.env.DB_PORT           // Port par défaut de PostgreSQL
});

module.exports = pool;

// Connexion à la base de données
// client.connect()
//     .then(() => console.log('Connexion réussie à PostgreSQL'))
//     .catch(err => console.error('Erreur de connexion', err))
//     .finally(() => client.end());
