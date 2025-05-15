const express = require('express');
const router = express.Router();
const {getHome, getProgramLesson} = require('../controllers/homeController'); // Import the controller
const {getGrammar, getGrammarLesson} = require('../controllers/grammarController'); // Import the controller
const {getVocabulary, getVocabularyLesson} = require('../controllers/vocabularyController'); // Import the controller
const {getQuiz, submitQuiz} = require('../controllers/quizController'); // Import the quiz controller
// const getExpressions = require('../controllers/expressionsController'); // Import the controller
const { getToeicIntro, startToeicTest, getListeningTest, submitListeningTest, getReadingTest, submitReadingTest, getTestResults, getToeicHistory, getWritingTest, getFullToeicTest } = require('../controllers/toeicController'); // Import the TOEIC controller

router.get('/', getHome); // Route to handle GET request for the home page
router.get('/grammar', getGrammar); // Route to handle GET request for the grammar page
router.get('/grammar/lessons/:lessonId', getGrammarLesson); // Route to handle GET request for a specific grammar lesson
router.get('/vocabulary', getVocabulary); // Route to handle GET request for the vocabulary page
router.get('/vocabulary/lessons/:lessonId', getVocabularyLesson); // Route to handle GET request for a specific vocabulary lesson
router.get('/program/:programId/lessons/:lessonId', getProgramLesson); // Route to handle GET request for a specific program lesson

// Quiz routes
router.get('/quiz/:lessonId', getQuiz); // Route to display the quiz for a specific lesson
router.post('/quiz/:lessonId/submit', submitQuiz); // Route to handle quiz submissions

// TOEIC test routes
router.get('/toeic', getToeicIntro);
router.post('/toeic/start', startToeicTest);
router.get('/toeic/listening', getListeningTest);
router.post('/toeic/listening/submit', submitListeningTest);
router.get('/toeic/reading', getReadingTest);
router.post('/toeic/reading/submit', submitReadingTest);
router.get('/toeic/results/:resultId', getTestResults);
router.get('/toeic/history', getToeicHistory);
router.get('/toeic/writing', getWritingTest);
router.get('/toeic/full-test', getFullToeicTest);

module.exports = router;