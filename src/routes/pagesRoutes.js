const express = require('express');
const router = express.Router();
const getHome = require('../controllers/homeController'); // Import the controller
const {getGrammar, getGrammarLesson} = require('../controllers/grammarController'); // Import the controller
const {getVocabulary, getVocabularyLesson} = require('../controllers/vocabularyController'); // Import the controller
// const getExpressions = require('../controllers/expressionsController'); // Import the controller
const { getToeicIntro, startToeicTest, getListeningTest, getReadingTest, getWritingTest, getFullToeicTest } = require('../controllers/toeicController'); // Import the TOEIC controller

router.get('/', getHome); // Route to handle GET request for the home page
router.get('/grammar', getGrammar); // Route to handle GET request for the grammar page
router.get('/grammar/lessons/:lessonId', getGrammarLesson); // Route to handle GET request for a specific grammar lesson
router.get('/vocabulary', getVocabulary); // Route to handle GET request for the vocabulary page
router.get('/vocabulary/lessons/:lessonId', getVocabularyLesson); // Route to handle GET request for a specific vocabulary lesson
// router.get('/expressions', getExpressions); // Route to handle GET request for the expressions page

// Route to handle GET request for the TOEIC introduction page
router.get('/toeic', getToeicIntro);

// Route to handle POST request to start the TOEIC test
router.post('/toeic/start', startToeicTest);

// Route to handle GET request for the TOEIC Listening test
router.get('/toeic/listening', getListeningTest);

// Route to handle GET request for the TOEIC Reading test
router.get('/toeic/reading', getReadingTest);

// Route to handle GET request for the TOEIC Writing test
router.get('/toeic/writing', getWritingTest);

// Route to handle GET request for the full TOEIC test
router.get('/toeic/full-test', getFullToeicTest);

module.exports = router;