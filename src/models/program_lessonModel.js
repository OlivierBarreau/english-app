const pool = require('./db_connexion');

// 1. Ajouter une leçon à un programme
async function addLessonToProgram(programId, lessonId, order) {
    try {
        const result = await pool.query(
            'INSERT INTO program_lessons (program_id, lesson_id, lesson_order) VALUES ($1, $2, $3) RETURNING *',
            [programId, lessonId, order]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding lesson to program:', error);
        throw error;
    }
}

// 2. Récupérer toutes les leçons associées à un programme, triées par ordre
async function getLessonsForProgram(programId) {
    try {
        const result = await pool.query(
            `SELECT l.*
             FROM program_lessons pl
             JOIN lesson l ON pl.lesson_id = l.id
             WHERE pl.program_id = $1
             ORDER BY pl.lesson_order ASC`,
            [programId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching lessons for program:', error);
        throw error;
    }
}

// 3. Modifier l'ordre d'une leçon dans un programme
async function updateLessonOrder(programId, lessonId, newOrder) {
    try {
        const result = await pool.query(
            'UPDATE program_lessons SET lesson_order = $1 WHERE program_id = $2 AND lesson_id = $3 RETURNING *',
            [newOrder, programId, lessonId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error updating lesson order:', error);
        throw error;
    }
}

// 4. Supprimer une leçon d’un programme
async function removeLessonFromProgram(programId, lessonId) {
    try {
        const result = await pool.query(
            'DELETE FROM program_lessons WHERE program_id = $1 AND lesson_id = $2 RETURNING *',
            [programId, lessonId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error removing lesson from program:', error);
        throw error;
    }
}

async function getLessonsWithResultsForUser(programId, userId) {

    try {
        const query = `
        SELECT 
            lesson.id, 
            lesson.lesson_title, 
            lesson.lesson_content, 
            lesson_result.lesson_completion, 
            lesson_result.lesson_right_answer
        FROM lesson
        JOIN lesson_result ON lesson.id = lesson_result.lesson_id
        JOIN program_lessons ON program_lessons.lesson_id = lesson.id
        WHERE program_lessons.program_id = $1 AND lesson_result.user_id = $2
      `;  
    
        const result = await pool.query(query, [programId, userId]);
        return result.rows;
    } catch (error) {
        console.error('Error with getLessonsWithResultsForUser:', error);
        throw error;
    }
}



module.exports = {
    addLessonToProgram,
    getLessonsForProgram,
    updateLessonOrder,
    removeLessonFromProgram,
    getLessonsWithResultsForUser
};
