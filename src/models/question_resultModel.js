const pool = require('./db_connexion'); // Import database connection

// Function to add a question result
async function addQuestionResult(lessonResultId, questionId, isAnswerCorrect, userAnswer) {
    try {
        const result = await pool.query(
            'INSERT INTO question_result (lesson_result_id, question_id, is_answer_correct, user_answer) VALUES ($1, $2, $3, $4) RETURNING *',
            [lessonResultId, questionId, isAnswerCorrect, userAnswer]
        );
        //console.log('Question Result Added:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding question result:', error);
        throw error;
    }
}

// Function to get a question result by ID
async function getQuestionResultById(id) {
    try {
        const result = await pool.query('SELECT * FROM question_result WHERE id = $1', [id]);
        //console.log('Fetched Question Result:', result.rows[0] || null);
        return result.rows[0] || null;
    } catch (error) {
        //console.error('Error fetching question result:', error);
        throw error;
    }
}

// Function to update a question result by ID
async function updateQuestionResultById(id, updates) {
    try {
        const { is_answer_correct, user_answer } = updates;
        const result = await pool.query(
            'UPDATE question_result SET is_answer_correct = COALESCE($1, is_answer_correct), user_answer = COALESCE($2, user_answer) WHERE id = $3 RETURNING *',
            [is_answer_correct, user_answer, id]
        );
        //console.log('Updated Question Result:', result.rows[0] || null);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating question result:', error);
        throw error;
    }
}

// Function to delete a question result by ID
async function deleteQuestionResultById(id) {
    try {
        const result = await pool.query('DELETE FROM question_result WHERE id = $1 RETURNING *', [id]);
        //console.log('Deleted Question Result:', result.rows[0] || null);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error deleting question result:', error);
        throw error;
    }
}

// Export functions so they can be used in other files
module.exports = { addQuestionResult, getQuestionResultById, updateQuestionResultById, deleteQuestionResultById };
