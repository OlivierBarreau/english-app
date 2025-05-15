const toeicModel = require('../models/toeicModel');

// Show the TOEIC introduction page
const getToeicIntro = (req, res) => {
    if (req.session && req.session.user) {
        res.render('toeicIntro', { user: req.session.user });
    } else {
        res.redirect('/signin');
    }
};

// Start a new TOEIC test and redirect to the listening section
const startToeicTest = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            // Create a new TOEIC test session in the database
            const test = await toeicModel.createToeicTest();
            
            // Store the test ID in the session
            req.session.toeicTestId = test.id;
            
            // Redirect to the listening section
            res.redirect('/toeic/listening');
        } catch (error) {
            console.error('Error starting TOEIC test:', error);
            res.status(500).send('An error occurred while starting the test');
        }
    } else {
        res.redirect('/signin');
    }
};

// Show the listening section of the TOEIC test
const getListeningTest = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            // Check if there's an active test
            if (!req.session.toeicTestId) {
                return res.redirect('/toeic');
            }
            
            // Fetch listening questions from the database
            const questions = await toeicModel.getToeicQuestionsBySection('listening');
            
            // Set the test duration in minutes (45 minutes for listening)
            const testDuration = 45;
            
            // Get the current test ID
            const testId = req.session.toeicTestId;
            
            res.render('toeicListening', { 
                user: req.session.user, 
                questions, 
                testDuration,
                testId
            });
        } catch (error) {
            console.error('Error fetching listening test:', error);
            res.status(500).send('An error occurred while loading the listening test');
        }
    } else {
        res.redirect('/signin');
    }
};

// Process the submission of the listening section
const submitListeningTest = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            // Check if there's an active test
            if (!req.session.toeicTestId) {
                return res.redirect('/toeic');
            }
              // Get the answers from the request body
            const answers = req.body.answers || {};
            
            // Store the listening answers in the session for later scoring
            req.session.listeningAnswers = answers;
            
            // Redirect to the reading section
            res.redirect('/toeic/reading');
        } catch (error) {
            console.error('Error submitting listening test:', error);
            res.status(500).json({ success: false, message: 'An error occurred while submitting the test' });
        }
    } else {
        res.redirect('/signin');
    }
};

// Show the reading section of the TOEIC test
const getReadingTest = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            // Check if there's an active test
            if (!req.session.toeicTestId) {
                return res.redirect('/toeic');
            }
            
            // Fetch reading questions from the database
            const questions = await toeicModel.getToeicQuestionsBySection('reading');
            
            // Set the test duration in minutes (75 minutes for reading)
            const testDuration = 75;
            
            // Get the current test ID
            const testId = req.session.toeicTestId;
            
            res.render('toeicReading', { 
                user: req.session.user, 
                questions, 
                testDuration,
                testId
            });
        } catch (error) {
            console.error('Error fetching reading test:', error);
            res.status(500).send('An error occurred while loading the reading test');
        }
    } else {
        res.redirect('/signin');
    }
};

// Process the submission of the reading section and complete the test
const submitReadingTest = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            // Check if there's an active test
            if (!req.session.toeicTestId) {
                return res.status(400).json({ success: false, message: 'No active test found' });
            }
              // Get the answers from the request body
            const readingAnswers = req.body.answers || {};
            
            // Get the listening answers from the session
            const listeningAnswers = req.session.listeningAnswers || {};
            
            // Calculate scores for both sections
            let listeningScore = 0;
            let readingScore = 0;
            
            // Get all questions to check against correct answers
            const listeningQuestions = await toeicModel.getToeicQuestionsBySection('listening');
            
            const readingQuestions = await toeicModel.getToeicQuestionsBySection('reading');            // Process listening answers
            for (const question of listeningQuestions) {
                const userAnswer = listeningAnswers[`q${question.id}`] || '';
                if (userAnswer === question.correct_answer) {
                    listeningScore++;
                }
            }            // Process reading answers
            for (const question of readingQuestions) {
                const userAnswer = readingAnswers[`q${question.id}`] || '';
                if (userAnswer === question.correct_answer) {
                    readingScore++;
                }
            }
            
            // Scale scores to actual TOEIC scoring (0-495 for each section)
            const scaledListeningScore = Math.round((listeningScore / listeningQuestions.length) * 495);
            const scaledReadingScore = Math.round((readingScore / readingQuestions.length) * 495);
            const totalScore = scaledListeningScore + scaledReadingScore;
            
            // Save the results to the database
            const result = await toeicModel.saveToeicResult(
                req.session.user.id,
                req.session.toeicTestId,
                scaledListeningScore,
                scaledReadingScore,
                totalScore
            );            // Save individual listening answers
            for (const question of listeningQuestions) {
                const userAnswer = listeningAnswers[`q${question.id}`] || '';
                const isCorrect = userAnswer === question.correct_answer;
                
                await toeicModel.saveToeicAnswers(
                    result.id,
                    question.id,
                    userAnswer,
                    isCorrect
                );
            }            // Save individual reading answers
            for (const question of readingQuestions) {
                const userAnswer = readingAnswers[`q${question.id}`] || '';
                const isCorrect = userAnswer === question.correct_answer;
                
                await toeicModel.saveToeicAnswers(
                    result.id,
                    question.id,
                    userAnswer,
                    isCorrect
                );
            }
            
            // Clear the test data from the session
            delete req.session.toeicTestId;
            delete req.session.listeningAnswers;
            
            // Return the results
            res.json({
                success: true,
                resultId: result.id,
                listeningScore: scaledListeningScore,
                readingScore: scaledReadingScore,
                totalScore
            });
        } catch (error) {
            console.error('Error submitting reading test:', error);
            res.status(500).json({ success: false, message: 'An error occurred while submitting the test' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

// Display the test results page
const getTestResults = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const resultId = req.params.resultId;
            
            // Get the test result details
            const result = await toeicModel.getToeicResultDetails(resultId);
            
            if (!result || result.user_id !== req.session.user.id) {
                return res.status(404).send('Result not found or not authorized');
            }
            
            res.render('toeicResults', { user: req.session.user, result });
        } catch (error) {
            console.error('Error fetching test results:', error);
            res.status(500).send('An error occurred while loading the test results');
        }
    } else {
        res.redirect('/signin');
    }
};

// Display the user's TOEIC test history
const getToeicHistory = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            // Get the user's test history
            const history = await toeicModel.getUserToeicHistory(req.session.user.id);
            
            res.render('toeicHistory', { user: req.session.user, history });
        } catch (error) {
            console.error('Error fetching test history:', error);
            res.status(500).send('An error occurred while loading the test history');
        }
    } else {
        res.redirect('/signin');
    }
};

// Writing test (keeping this for backward compatibility)
const getWritingTest = (req, res) => {
    if (req.session && req.session.user) {
        const prompt = "Write an email to your manager explaining the benefits of implementing a new project management tool.";
        res.render('toeicWriting', { user: req.session.user, prompt });
    } else {
        res.redirect('/signin');
    }
};

// Full test (keeping this for backward compatibility)
const getFullToeicTest = (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/toeic');
    } else {
        res.redirect('/signin');
    }
};

module.exports = { 
    getToeicIntro, 
    startToeicTest, 
    getListeningTest,
    submitListeningTest,
    getReadingTest, 
    submitReadingTest,
    getTestResults,
    getToeicHistory,
    getWritingTest, 
    getFullToeicTest 
};