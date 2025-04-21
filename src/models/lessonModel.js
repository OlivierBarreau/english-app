const pool = require('./db_connexion'); // Import database connection

async function addLesson(lessonType, lessonTitle, lessonContent, lessonImportance, lessonLevel) {
    try {
        const result = await pool.query(
            'INSERT INTO lesson (lesson_type, lesson_title, lesson_content, lesson_importance, lesson_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [lessonType, lessonTitle, lessonContent, lessonImportance, lessonLevel]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding lesson:', error);
        throw error;
    }
}

async function getLessonById(lessonId) {
    try {
        const result = await pool.query('SELECT * FROM lesson WHERE id = $1', [lessonId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error fetching lesson:', error);
        throw error;
    }
}

async function updateLessonById(lessonId, updates) {
    try {
        const { lessonType, lessonTitle, lessonContent, lessonImportance, lessonLevel } = updates;
        const result = await pool.query(
            'UPDATE lesson SET lesson_type = COALESCE($1, lesson_type), lesson_title = COALESCE($2, lesson_title), lesson_content = COALESCE($3, lesson_content), lesson_importance = COALESCE($4, lesson_importance), lesson_level = COALESCE($5, lesson_level) WHERE id = $6 RETURNING *',
            [lessonType, lessonTitle, lessonContent, lessonImportance, lessonLevel, lessonId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating lesson:', error);
        throw error;
    }
}

async function deleteLessonById(lessonId) {
    try {
        const result = await pool.query('DELETE FROM lesson WHERE id = $1 RETURNING *', [lessonId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error deleting lesson:', error);
        throw error;
    }
}
//get all lessons of a specific type
async function getLessonsByType(type) {
    try {
        const result = await pool.query(
            'SELECT * FROM lesson WHERE lesson_type = $1',
            [type]
        );
        //console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error fetching lessons by type:', error);
        throw error;
    }
}

//get all lessons of a specific type
async function getLessonsByLesson_Title(lesson_title) {
    try {
        const result = await pool.query(
            'SELECT * FROM lesson WHERE lesson_title = $1',
            [title]
        );
        //console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error fetching lessons by type:', error);
        throw error;
    }
}


// Export functions so they can be used in other files
module.exports = { 
    addLesson, getLessonById, getLessonsByLesson_Title, updateLessonById, deleteLessonById, getLessonsByType
};
