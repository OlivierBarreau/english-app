const {  getUserById, addUser, updateUserById, deleteUserById } = require('./userModel');
const { getQuestionById, addQuestion, updateQuestionById, deleteQuestionById } = require('./questionModel');
const { getLessonById, addLesson, updateLessonById, deleteLessonById } = require('./lessonModel');
const { getLessonResultById, addLessonResult, updateLessonResultById, deleteLessonResultById } = require('./lesson_resultModel');
const { addQuestionResult, getQuestionResultById, updateQuestionResultById, deleteQuestionResultById } = require('./question_resultModel');
const pool = require('./db_connexion');

// Test all functions
async function test_user() {
    try {
        console.log('Adding user...');
        const newUser = await addUser('test@example.com', 'password123', 'Test', 'User');
        console.log('User Added:', newUser);

        console.log('Fetching user by ID...');
        const fetchedUser = await getUserById(newUser.id);
        console.log('Fetched User:', fetchedUser);

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

testQuestionResult();

//test_lesson_result();
//test_lesson();
//test_user();
//test_question();