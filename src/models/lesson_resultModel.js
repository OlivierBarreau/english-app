const pool = require('./db_connexion'); // Import database connection

// Function to get lesson result by ID
async function getLessonResultById(resultId) {
    try {
        //console.log(`Fetching lesson result with ID: ${resultId}`);
        const result = await pool.query('SELECT * FROM lesson_result WHERE id = $1', [resultId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching lesson result:', error);
        throw error;
    }
}

// Function to add a new lesson result
async function addLessonResult(userId, lessonId, completion, rightAnswer) {
    try {
        //console.log('Adding new lesson result...');
        const result = await pool.query(
            'INSERT INTO lesson_result (user_id, lesson_id, lesson_completion, lesson_right_answer) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, lessonId, completion, rightAnswer]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding lesson result:', error);
        throw error;
    }
}

// Function to update lesson result by ID
async function updateLessonResultById(resultId, updates) {
    try {
        //console.log(`Updating lesson result with ID: ${resultId}`);
        const { lessonCompletion, lessonRightAnswer} = updates;
        const result = await pool.query(
            'UPDATE lesson_result SET lesson_completion = COALESCE($1, lesson_completion), lesson_right_answer = COALESCE($2, lesson_right_answer) WHERE id = $3 RETURNING *',
            [lessonCompletion, lessonRightAnswer, resultId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating lesson result:', error);
        throw error;
    }
}

// Function to delete lesson result by ID
async function deleteLessonResultById(resultId) {
    try {
        //console.log(`Deleting lesson result with ID: ${resultId}`);
        const result = await pool.query('DELETE FROM lesson_result WHERE id = $1 RETURNING *', [resultId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error deleting lesson result:', error);
        throw error;
    }
}

// Export functions
module.exports = { 
    getLessonResultById, addLessonResult, updateLessonResultById, deleteLessonResultById
};
