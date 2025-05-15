const lessonModel = require('../models/lessonModel');
const questionModel = require('../models/questionModel');

const getGrammar = async (req, res) => {

    if (req.session && req.session.user) {
        
        try {
            // Fetch lessons for the specified program ID
            const lessons = await lessonModel.getLessonsByType("Grammar");
            
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

    if (req.session && req.session.user) {

        const lessonId = req.params.lessonId;

        // Logic to handle the lesson based on the lessonId 
        try {
            // Get the current lesson and its questions
            const lesson = await lessonModel.getLessonById(lessonId);
            const questions = await questionModel.getQuestionsByLessonId(lessonId);
            
            // Get all grammar lessons to determine previous and next lessons
            const allGrammarLessons = await lessonModel.getLessonsByType("Grammar");
            
            // Find the current lesson's index in the list
            const currentIndex = allGrammarLessons.findIndex(l => l.id === parseInt(lessonId));
            
            // Determine previous and next lessons
            let prevLesson = null;
            let nextLesson = null;
            
            if (currentIndex > 0) {
                prevLesson = allGrammarLessons[currentIndex - 1];
            }
            
            if (currentIndex !== -1 && currentIndex < allGrammarLessons.length - 1) {
                nextLesson = allGrammarLessons[currentIndex + 1];
            }
            
            if (lesson) {
                res.render("grammarLesson", { 
                    lesson, 
                    questions, 
                    prevLesson, 
                    nextLesson 
                });
            } else {
                res.status(404).send('Lesson not found');
            }
        } catch (error) {
            console.error('Error fetching lesson:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        res.redirect("/signin");
    }
};

module.exports = {getGrammar, getGrammarLesson}; ;