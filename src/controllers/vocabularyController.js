const lessonsM = require('../models/lessonModel');
const questionModel = require('../models/questionModel');


const getVocabulary = async (req, res) => {

    if (req.session && req.session.user) {

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

    if (req.session && req.session.user) {

        const lessonId = req.params.lessonId;

        // Logic to handle the lesson based on the lessonId
        try {
            const lesson = await lessonsM.getLessonById(lessonId);
            const questions = await questionModel.getQuestionsByLessonId(lessonId);
            if (lesson) {
                res.render("vocabularyLesson", { lesson, questions });
            } else {
                res.status(404).send('Lesson not found');
            }
        } catch (error) {
            console.error('Error fetching lesson:', error);
            res.status(500).send('Internal server error');
        }
    }
    else {
        res.redirect("/signin");
    }
};

module.exports = {
    getVocabulary,
    getVocabularyLesson
};