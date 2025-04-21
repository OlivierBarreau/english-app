const {  getUserById, addUser, updateUserById, deleteUserById, getUserByLogin } = require('./userModel');
const { getQuestionById, addQuestion, updateQuestionById, deleteQuestionById } = require('./questionModel');
const { getLessonById, addLesson, updateLessonById, deleteLessonById, getLessonsByType } = require('./lessonModel');
const { getLessonResultById, addLessonResult, updateLessonResultById, deleteLessonResultById } = require('./lesson_resultModel');
const { addQuestionResult, getQuestionResultById, updateQuestionResultById, deleteQuestionResultById } = require('./question_resultModel');
const { addProgram, getProgramById, updateProgramById, deleteProgramById } = require('./programModel.js');
const { addLessonToProgram, getLessonsForProgram, updateLessonOrder, removeLessonFromProgram } = require('./program_lessonModel.js');
const { fillProgram } = require('./globalModels.js');
const pool = require('./db_connexion');

// Test all functions
async function test_user() {
    try {
        console.log('Adding user...');
        const newUser = await addUser('test3@example.com', 'password123', 'Test3', 'User3');
        console.log('User Added:', newUser);

        console.log('Fetching user by ID...');
        const fetchedUserId = await getUserById(newUser.id);
        console.log('Fetched User:', fetchedUserId);

        console.log('Fetching user by Login...');
        const fetchedUserLogin = await getUserByLogin(newUser.login);
        console.log('Fetched User:', fetchedUserLogin);

        console.log('Updating user...');
        const updatedUser = await updateUserById(newUser.id, { firstname: 'Updated' });
        console.log('Updated User:', updatedUser);

        console.log('Deleting user...');
        const deletedUser = await deleteUserById(newUser.id);
        console.log('Deleted User:', deletedUser);

        console.log('Trying to fetch deleted user...');
        const checkDeletedUser = await getUserById(newUser.id);
        console.log('Deleted User Exists:', checkDeletedUser);
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        pool.end(); // Close DB connection
    }
}

async function test_question() {
    try {
        console.log('Adding question...');
        const newQuestion = await addQuestion(1, 'MCQ', { question: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin'], correct_answer: 'Paris' });
        console.log('Question Added:', newQuestion);

        console.log('Fetching question by ID...');
        const fetchedQuestion = await getQuestionById(newQuestion.id);
        console.log('Fetched Question:', fetchedQuestion);

        console.log('Updating question...');
        const updatedQuestion = await updateQuestionById(newQuestion.id, { questionType: 'Updated MCQ' });
        console.log('Updated Question:', updatedQuestion);

        console.log('Deleting question...');
        const deletedQuestion = await deleteQuestionById(newQuestion.id);
        console.log('Deleted Question:', deletedQuestion);

        console.log('Trying to fetch deleted question...');
        const checkDeletedQuestion = await getQuestionById(newQuestion.id);
        console.log('Deleted Question Exists:', checkDeletedQuestion);
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        pool.end(); // Close DB connection
    }
}


async function test_lesson() {
    try {
        console.log('Adding lesson...');
        const newLesson = await addLesson('Grammar', 'Past Simple', { description: 'Lesson on past simple tense' }, 4, 'A2');
        console.log('Lesson Added:', newLesson);

        console.log('Fetching lesson by ID...');
        const fetchedLesson = await getLessonById(newLesson.id);
        console.log('Fetched Lesson:', fetchedLesson);

        console.log('Updating lesson...');
        const updatedLesson = await updateLessonById(newLesson.id, { lessonTitle: 'Updated Past Simple' });
        console.log('Updated Lesson:', updatedLesson);

        console.log('Deleting lesson...');
        const deletedLesson = await deleteLessonById(newLesson.id);
        console.log('Deleted Lesson:', deletedLesson);

        console.log('Trying to fetch deleted lesson...');
        const checkDeletedLesson = await getLessonById(newLesson.id);
        console.log('Deleted Lesson Exists:', checkDeletedLesson);
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        pool.end(); // Close DB connection
    }
}


async function test_lesson_result() {
    try {
        console.log('Adding lesson result...');
        const newLessonResult = await addLessonResult(1, 1, 80, 70);
        console.log('Lesson Result Added:', JSON.stringify(newLessonResult, null, 2));

        console.log('Fetching lesson result by ID...');
        const fetchedLessonResult = await getLessonResultById(newLessonResult.id);
        console.log('Fetched Lesson Result:', JSON.stringify(fetchedLessonResult, null, 2));

        console.log('Updating lesson result...');
        const updatedLessonResult = await updateLessonResultById(newLessonResult.id, { lessonCompletion: 90 });
        console.log('Updated Lesson Result:', JSON.stringify(updatedLessonResult, null, 2));

        console.log('Deleting lesson result...');
        const deletedLessonResult = await deleteLessonResultById(newLessonResult.id);
        console.log('Deleted Lesson Result:', JSON.stringify(deletedLessonResult, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        console.log('Closing database connection...');
        pool.end(); // Close DB connection
    }
}


async function testQuestionResult() {
    try {
        console.log('Adding user...');
        const newUser = await addUser('test4@example.com', 'password123', 'Test', 'User');
        console.log('User Added:', newUser);

        console.log('Adding lesson...');
        const newLesson = await addLesson('Grammar', 'Past Simple', { description: 'Lesson on past simple tense' }, 4, 'A2');
        console.log('Lesson Added:', newLesson);

        console.log('Adding lesson result...');
        const newLessonResult = await addLessonResult(newUser.id, newLesson.id, 80, 70);
        console.log('Lesson Result Added:', JSON.stringify(newLessonResult, null, 2));

        console.log('Adding question...');
        const newQuestion = await addQuestion(newLesson.id, 'MCQ', { question: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin'], correct_answer: 'Paris' });
        console.log('Question Added:', newQuestion);

        console.log('Adding question result...');
        const newQuestionResult = await addQuestionResult(newLessonResult.id, newQuestion.id, true, "Paris"); // Example data
        console.log('Question Result Added:', JSON.stringify(newQuestionResult, null, 2));

        console.log('Fetching question result by ID...');
        const fetchedQuestionResult = await getQuestionResultById(newQuestionResult.id);
        console.log('Fetched Question Result:', JSON.stringify(fetchedQuestionResult, null, 2));

        console.log('Updating question result...');
        const updatedQuestionResult = await updateQuestionResultById(newQuestionResult.id, { is_answer_correct: false });
        console.log('Updated Question Result:', JSON.stringify(updatedQuestionResult, null, 2));

        console.log('Deleting question result...');
        const deletedQuestionResult = await deleteQuestionResultById(newQuestionResult.id);
        console.log('Deleted Question Result:', JSON.stringify(deletedQuestionResult, null, 2));

        console.log('Verifying deletion...');
        const checkDeleted = await getQuestionResultById(newQuestionResult.id);
        console.log('Exists after deletion:', checkDeleted ? 'YES' : 'NO');

        const deletedQuestion = await deleteQuestionById(newQuestion.id);
        const deletedLessonResult = await deleteLessonResultById(newLessonResult.id);
        const checkDeletedLesson = await deleteLessonById(newLesson.id);
        const deletedUser = await deleteUserById(newUser.id);



    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        console.log('Closing database connection...');
        pool.end(); // Close DB connection
    }
}


async function testcreateProgramWithTwoLessons(userId) {
    try {
        // 1. Create Lesson 1
        console.log('Creating lesson 1...');
        const lesson1 = await addLesson(
            'Grammar',
            'Present Simple',
            { description: 'Basics of present simple' },
            3,
            'A1'
        );
        console.log('Lesson 1 created:', lesson1);

        // 2. Create Lesson 2
        console.log('Creating lesson 2...');
        const lesson2 = await addLesson(
            'Vocabulary',
            'Common Phrases',
            { description: 'Learn common everyday phrases' },
            2,
            'A1'
        );
        console.log('Lesson 2 created:', lesson2);

        // 3. Create Program 
        console.log('Creating program...');
        const program = await addProgram(userId, 50, 80); // Initial completion and correct answer rates = 0
        console.log('Program created:', program);

        // 4. Link lessons to the program
        console.log('Linking lessons to program...');
        await addLessonToProgram(program.id, lesson1.id, 1); // order 1
        await addLessonToProgram(program.id, lesson2.id, 2); // order 2
        console.log('Lessons linked to program');

        // 5. Fetch and display lessons in program
        console.log('Fetching lessons in program...');
        const lessonsInProgram = await getLessonsForProgram(program.id);
        console.log('Lessons in program:', JSON.stringify(lessonsInProgram, null, 2));

    } catch (error) {
        console.error('Error creating program with lessons:', error);
    } finally {
        pool.end(); // Always close DB connection
    }
}

async function testGetLessonsByType() {
    // console.log('Creating Vocabulary Lesson 2...');
    // const lesson2 = await addLesson(
    //     'Vocabulary',
    //     'Business Vocabulary Basics',
    //     {
    //         description: 'This lesson introduces key business vocabulary used in meetings and emails.',
    //         examples: [
    //             { term: 'Touch base', meaning: 'To make contact or update someone briefly.' },
    //             { term: 'Circle back', meaning: 'To revisit a topic or conversation later.' },
    //             { term: 'Low-hanging fruit', meaning: 'Tasks or goals that are easily achievable.' }
    //         ]
    //     },
    //     4,
    //     'B2'
    // );
    // console.log('Vocabulary Lesson 2 Created:', lesson2);

    const lessons = await getLessonsByType("Vocabulary");
    console.log('list of lessons for requested type =',lessons);
}


async function testFillProgram() {
    try {
        console.log('Creating first lesson...');
        const lesson1 = await addLesson(
            'Vocabulary',
            'Common English Idioms',
            {
                description: 'This lesson covers common English idioms and their meanings.',
                examples: [
                    { idiom: 'Break the ice', meaning: 'To start a conversation in a social setting.' },
                    { idiom: 'Piece of cake', meaning: 'Something that is very easy to do.' },
                    { idiom: 'Under the weather', meaning: 'Feeling unwell or sick.' }
                ]
            },
            5,
            'B1'
        );
        console.log('Lesson 1 created:', lesson1);

        console.log('Creating second lesson...');
        const lesson2 = await addLesson(
            'Vocabulary',
            'Business Vocabulary Basics',
            {
                description: 'This lesson introduces key business vocabulary used in meetings and emails.',
                examples: [
                    { word: 'Synergy', meaning: 'Combined effort greater than individual parts' },
                    { word: 'Stakeholder', meaning: 'Someone affected by business decisions' },
                    { word: 'Leverage', meaning: 'Use something to maximum advantage' }
                ]
            },
            4,
            'B2'
        );
        console.log('Lesson 2 created:', lesson2);

        console.log('Creating a new program for user ID 1...');
        const newProgram = await addProgram(1, 0, 0); // completion = 0, right_answer = 0
        console.log('Program created:', newProgram);

        console.log('Filling program with lessons...');
        await fillProgram(newProgram.id, [lesson1.id, lesson2.id]);

        const lessons = await getLessonsForProgram(newProgram.id)
        console.log('Getting all lessons from program :', lessons);

        console.log('Test complete.');
    } catch (error) {
        console.error('Error in testFillProgram:', error);
    }
}

// Example usage
//testcreateProgramWithTwoLessons(1); // Replace 1 with an actual user_id in your DB


//testQuestionResult();

//test_lesson_result();
//test_lesson();
//test_user();
//test_question();
//testGetLessonsByType();
testFillProgram();