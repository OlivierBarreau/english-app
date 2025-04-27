const pool = require('./db_connexion'); // Import database connection

// Function to get user by ID
async function getUserById(userId) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        return result.rows[0] || null; // Return user data or null if not found
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}
// Function to get user by Login
async function getUserByLogin(userLogin) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE login = $1', [userLogin]);
        return result.rows[0] || null; // Return user data or null if not found
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}


// Function to add a new user
async function addUser(login, password, firstname, lastname) {
    try {
        const result = await pool.query(
            'INSERT INTO users (login, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *',
            [login, password, firstname, lastname]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

// Function to update user by ID
async function updateUserById(userId, updates) {
    try {
        const { login, password, firstname, lastname } = updates;
        const result = await pool.query(
            'UPDATE users SET login = COALESCE($1, login), password = COALESCE($2, password), firstname = COALESCE($3, firstname), lastname = COALESCE($4, lastname) WHERE id = $5 RETURNING *',
            [login, password, firstname, lastname, userId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function updateUserPassword (userId, newPassword) {
    try {
        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
            [newPassword, userId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
    }
};

// Function to delete user by ID
async function deleteUserById(userId) {
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// Export functions so they can be used in other files
module.exports = { 
    getUserById, getUserByLogin, addUser, updateUserById, updateUserPassword, deleteUserById 
};
