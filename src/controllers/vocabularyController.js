const lessonsM = require('../models/lessonModel');

const getVocabulary = async (req, res) => {

    if (req.session && req.session.user) {
        
        const programId = req.params.programId; // Get the program ID from the request parameters

        try {
            // Fetch lessons for the specified program ID
            const lessons = await lessonsM.getLessonsByType("Vocabulary");
            
            if (lessons.length > 0) {
                res.render("Vocabulary", { user: req.session.user, lessons });
            } else {
                res.status(404).json({ message: 'No Vocabulary lessons found.' });
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    } else {
            res.redirect("/signin");
    }

};

// Controller function to launch a specific vocabulary lesson by its ID
const getVocabularyLesson = async (req, res) => {
    const lessonId = req.params.lessonId;

    // Logic to handle the lesson based on the lessonId
    try {
        const lesson = await lessonsM.getLessonById(lessonId);
        if (lesson) {
            res.render("vocabularyLesson", { lesson });
        } else {
            res.status(404).send('Lesson not found');
        }
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    getVocabulary,
    getVocabularyLesson
};