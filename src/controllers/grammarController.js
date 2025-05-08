const lessonModel = require('../models/lessonModel');

const getGrammar = async (req, res) => {

    if (req.session && req.session.user) {
        
        const programId = req.params.programId; // Get the program ID from the request parameters

        try {
            // Fetch lessons for the specified program ID
            const lessons = await lessonModel.getLessonsByType("grammer");
            
            if (lessons.length > 0) {
                res.render("grammar", { user: req.session.user, lessons });
            } else {
                res.status(404).json({ message: 'No grammar lessons found.' });
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    } else {
            res.redirect("/signin");
    }

};

// Controller function to launch a specific lesson by its ID
const getGrammarLesson = async (req, res) => {
    const lessonId = req.params.lessonId;

    // Logic to handle the lesson based on the lessonId
    try {
        const lesson = await lessonModel.getLessonById(lessonId);
        if (lesson) {
            res.render("grammarLesson", { lesson });
        } else {
            res.status(404).send('Lesson not found');
        }
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {getGrammar, getGrammarLesson}; ;