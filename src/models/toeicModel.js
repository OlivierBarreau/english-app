const pool = require('./db_connexion');

// Get all TOEIC tests
async function getAllToeicTests() {
    try {
        const result = await pool.query(`
            SELECT * FROM toeic_tests
            ORDER BY test_date DESC
        `);
        return result.rows;
    } catch (error) {
        console.error('Error getting TOEIC tests:', error);
        throw error;
    }
}

// Get TOEIC test by ID
async function getToeicTestById(testId) {
    try {
        const result = await pool.query(
            'SELECT * FROM toeic_tests WHERE id = $1',
            [testId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting TOEIC test by ID:', error);
        throw error;
    }
};

// Create a new TOEIC test session
async function createToeicTest() {
    try {
        const result = await pool.query(
            'INSERT INTO toeic_tests (test_date) VALUES (NOW()) RETURNING id'
        );
        return { id: result.rows[0].id };
    } catch (error) {
        console.error('Error creating TOEIC test:', error);
        throw error;
    }
};

// Get TOEIC questions by section (listening or reading)
async function getToeicQuestionsBySection(section) {
    try {
        const result = await pool.query(
            'SELECT * FROM toeic_questions WHERE section = $1 ORDER BY question_order',
            [section]
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting TOEIC questions by section:', error);
        throw error;
    }
};

// Get TOEIC question by ID
async function getToeicQuestionById(questionId) {
    try {
        const result = await pool.query(
            'SELECT * FROM toeic_questions WHERE id = $1',
            [questionId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting TOEIC question by ID:', error);
        throw error;
    }
};

// Save user results for a TOEIC test
async function saveToeicResult(userId, testId, listeningScore, readingScore, totalScore) {
    try {
        const result = await pool.query(
            `INSERT INTO toeic_results 
            (user_id, test_id, listening_score, reading_score, total_score, completion_date) 
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING id`,
            [userId, testId, listeningScore, readingScore, totalScore]
        );
        return { id: result.rows[0].id };
    } catch (error) {
        console.error('Error saving TOEIC result:', error);
        throw error;
    }
};

// Save user answers for TOEIC questions
async function saveToeicAnswers(resultId, questionId, userAnswer, isCorrect) {
    try {
        const result = await pool.query(
            `INSERT INTO toeic_answers 
            (result_id, question_id, user_answer, is_correct) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id`,
            [resultId, questionId, userAnswer, isCorrect]
        );
        return { id: result.rows[0].id };
    } catch (error) {
        console.error('Error saving TOEIC answer:', error);
        throw error;
    }
};

// Get test history for a user
async function getUserToeicHistory(userId) {
    try {
        const result = await pool.query(
            `SELECT tr.*, tt.test_date
            FROM toeic_results tr
            JOIN toeic_tests tt ON tr.test_id = tt.id
            WHERE tr.user_id = $1
            ORDER BY tr.completion_date DESC`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting user TOEIC history:', error);
        throw error;
    }
};

// Get details of a specific test result
async function getToeicResultDetails(resultId) {
    try {
        const result = await pool.query(
            `SELECT tr.*, tt.test_date, u.login
            FROM toeic_results tr
            JOIN toeic_tests tt ON tr.test_id = tt.id
            JOIN users u ON tr.user_id = u.id
            WHERE tr.id = $1`,
            [resultId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting TOEIC result details:', error);
        throw error;
    }
};

// Get answers for a specific test result
async function getToeicResultAnswers(resultId) {
    try {
        const result = await pool.query(
            `SELECT ta.*, tq.section, tq.question_content
            FROM toeic_answers ta
            JOIN toeic_questions tq ON ta.question_id = tq.id
            WHERE ta.result_id = $1
            ORDER BY tq.section, tq.question_order`,
            [resultId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting TOEIC result answers:', error);
        throw error;
    }
};

module.exports = {
    getAllToeicTests,
    getToeicTestById,
    createToeicTest,
    getToeicQuestionsBySection,
    getToeicQuestionById,
    saveToeicResult,
    saveToeicAnswers,
    getUserToeicHistory,
    getToeicResultDetails,
    getToeicResultAnswers
};
