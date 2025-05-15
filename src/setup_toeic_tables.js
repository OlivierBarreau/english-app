const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
};

async function setupToeicTables() {
    const pool = new Pool(dbConfig);
    
    try {
        console.log('Connected to the database');
        
        // Read the SQL file
        const sqlFile = path.join(__dirname, '../db_files/toeic_tables.sql');
        const sqlScript = fs.readFileSync(sqlFile, 'utf8');
        
        console.log('Executing SQL script...');
        
        // Execute the SQL script
        await pool.query(sqlScript);
        
        console.log('TOEIC tables created successfully');
        
        // Close the connection
        await pool.end();
        
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error setting up TOEIC tables:', error);
        if (error.stack) console.error(error.stack);
    } finally {
        if (pool) {
            try {
                await pool.end();
            } catch (err) {
                console.error('Error closing pool:', err);
            }
        }
    }
}

// Run the setup function
setupToeicTables();
