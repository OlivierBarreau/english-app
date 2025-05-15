const lessonModel = require('../models/lessonModel');
const questionModel = require('../models/questionModel');
const lessonResultModel = require('../models/lesson_resultModel');
const questionResultModel = require('../models/question_resultModel');

// Controller function to display the quiz page
const getQuiz = async (req, res) => {
    if (req.session && req.session.user) {
        const lessonId = req.params.lessonId;

        try {
            // Fetch lesson and question data
            const lesson = await lessonModel.getLessonById(lessonId);
            const questions = await questionModel.getQuestionsByLessonId(lessonId);
            
            if (lesson && questions && questions.length > 0) {
                res.render("quiz", { user: req.session.user, lesson, questions });
            } else {
                res.status(404).send('Quiz not found or no questions available');
            }
        } catch (error) {
            console.error('Error fetching quiz:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        res.redirect("/signin");
    }
};

// Controller function to handle quiz submissions
const submitQuiz = async (req, res) => {
    if (req.session && req.session.user) {
        const lessonId = req.params.lessonId;
        const answers = req.body.answers || {};
        
        try {
            // Fetch questions for validation
            const questions = await questionModel.getQuestionsByLessonId(lessonId);
            if (!questions || questions.length === 0) {
                return res.status(404).json({ success: false, message: 'No questions found for this lesson' });
            }
            
            // Calculate quiz results
            const results = {};
            let correctAnswers = 0;
            
            for (const question of questions) {
                const userAnswer = answers[`q${question.id}`];
                const isCorrect = userAnswer === question.question_content.correctAnswer;
                
                results[`q${question.id}`] = {
                    correct: isCorrect,
                    userAnswer: userAnswer,
                    correctAnswer: question.question_content.correctAnswer
                };
                
                if (isCorrect) {
                    correctAnswers++;
                }
            }
            
            // Calculate score as percentage
            const score = Math.round((correctAnswers / questions.length) * 100);
            
            // Save results to database
            const lessonResult = await lessonResultModel.addLessonResult(
                req.session.user.id, 
                lessonId, 
                100, // 100% completion
                score // Percentage of correct answers
            );
            
            // Save individual question results
            for (const question of questions) {
                const result = results[`q${question.id}`];
                if (result) {
                    await questionResultModel.addQuestionResult(
                        lessonResult.id,
                        question.id,
                        result.correct,
                        result.userAnswer || ''
                    );
                }
            }
            
            // Find the next lesson (if available)
            // This is a simplified approach - you may want to fetch the next lesson from the program
            const allLessons = await lessonModel.getLessonsByType(questions[0].question_type);
            let nextLessonId = null;
            
            if (allLessons && allLessons.length > 0) {
                // Find current lesson index
                const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
                
                // If we found the current lesson and it's not the last one
                if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
                    nextLessonId = allLessons[currentIndex + 1].id;
                }
            }

            // Current Program ID
            let programID =  req.session.user.current_program_id;
            
            // Return results to client
            res.json({
                success: true,
                score,
                results,
                programID,
                nextLessonId
            });
            
        } catch (error) {
            console.error('Error processing quiz submission:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

module.exports = {
    getQuiz,
    submitQuiz
};
