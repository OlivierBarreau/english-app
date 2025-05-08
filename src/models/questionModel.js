const pool = require('./db_connexion'); // Import database connection

async function getQuestionById(questionId) {
    try {
        const result = await pool.query('SELECT * FROM question WHERE id = $1', [questionId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
}

// Function to add a new question
async function addQuestion(lessonId, questionType, questionContent) {
    try {
        const result = await pool.query(
            'INSERT INTO question (lesson_id, question_type, question_content) VALUES ($1, $2, $3) RETURNING *',
            [lessonId, questionType, questionContent]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding question:', error);
        throw error;
    }
}

// Function to update question by ID
async function updateQuestionById(questionId, updates) {
    try {
        const { lessonId, questionType, questionContent } = updates;
        const result = await pool.query(
            'UPDATE question SET lesson_id = COALESCE($1, lesson_id), question_type = COALESCE($2, question_type), question_content = COALESCE($3, question_content) WHERE id = $4 RETURNING *',
            [lessonId, questionType, questionContent, questionId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
}

// Function to delete question by ID
async function deleteQuestionById(questionId) {
    try {
        const result = await pool.query('DELETE FROM question WHERE id = $1 RETURNING *', [questionId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
}

// Function to get all questions by lesson ID
async function getQuestionsByLessonId(lessonId) {
    try {
        const result = await pool.query('SELECT * FROM question WHERE lesson_id = $1', [lessonId]);
        return result.rows || [];
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}

// Export functions so they can be used in other files
module.exports = { 
    getQuestionById, addQuestion, updateQuestionById, deleteQuestionById, getQuestionsByLessonId
};
