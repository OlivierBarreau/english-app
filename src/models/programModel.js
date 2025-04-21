const pool = require('./db_connexion');

// ✅ Ajouter un programme
async function addProgramById(userId, programCompletion, programRightAnswer) {
    try {
        const result = await pool.query(
            'INSERT INTO program (user_id, program_completion, program_right_answer) VALUES ($1, $2, $3) RETURNING *',
            [userId, programCompletion, programRightAnswer]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding program:', error);
        throw error;
    }
}

// ✅ Récupérer un programme par son ID
async function getProgramById(programId) {
    try {
        const result = await pool.query('SELECT * FROM program WHERE id = $1', [programId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching program:', error);
        throw error;
    }
}

// ✅ Mettre à jour un programme
async function updateProgramById(programId, updates) {
    try {
        const { programCompletion, programRightAnswer } = updates;
        const result = await pool.query(
            'UPDATE program SET program_completion = COALESCE($1, program_completion), program_right_answer = COALESCE($2, program_right_answer) WHERE id = $3 RETURNING *',
            [programCompletion, programRightAnswer, programId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating program:', error);
        throw error;
    }
}

// ✅ Supprimer un programme
async function deleteProgramById(programId) {
    try {
        const result = await pool.query('DELETE FROM program WHERE id = $1 RETURNING *', [programId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error deleting program:', error);
        throw error;
    }
}

module.exports = {
    addProgramById,
    getProgramById,
    updateProgramById,
    deleteProgramById
};
