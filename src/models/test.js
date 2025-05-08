const {  getUserById, addUser, updateUserById, deleteUserById, getUserByLogin } = require('./userModel');
const { getQuestionById, addQuestion, updateQuestionById, deleteQuestionById } = require('./questionModel');
const { getLessonById, addLesson, updateLessonById, deleteLessonById, getLessonsByType } = require('./lessonModel');
const { getLessonResultById, addLessonResult, updateLessonResultById, deleteLessonResultById } = require('./lesson_resultModel');
const { addQuestionResult, getQuestionResultById, updateQuestionResultById, deleteQuestionResultById } = require('./question_resultModel');
const { addProgram, getProgramById, updateProgramById, deleteProgramById } = require('./programModel.js');
const { addLessonToProgram, getLessonsForProgram, updateLessonOrder, removeLessonFromProgram, getLessonsWithResultsForUser } = require('./program_lessonModel.js');
const { fillProgram } = require('./globalModels.js');
const pool = require('./db_connexion');

// Test all functions
async function test_user() {
    try {
        console.log('Adding user...');
        const newUser = await addUser('test3@example.com', 'password123', 'Test3', 'User3', 'A2', 0);
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
        const newUser = await addUser('test4@example.com', 'password123', 'Test', 'User', 'C1', 0);
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

async function addTestData() {
    const user1 = await addUser('alice@example.com', 'password123', 'Alice', 'Licea','A1', 1);
    const user2 = await addUser('bob@example.com', 'securepass', 'Bob', 'Bob','B2', 2);
    const user3 = await addUser('carol@example.com', 'mypassword', 'Carol', 'Rolca','B2', 3);
    

    const lesson1 = await addLesson(
            'Grammar',
            'Simple Present Tense',
            { description: 'This lesson explains the simple present tense and its uses.' },
            3,
            'A1'
        );
    const lesson2 = await addLesson(
            'Grammar',
            'Articles (a, an, the)',
            { description: 'Learn how and when to use articles in English.' },
            2,
            'A1'
        );
    const lesson3 = await addLesson(
            'Vocabulary',
            'Basic Everyday Words',
            {
                description: 'This vocabulary lesson introduces basic daily life words.',
                examples: [
                    { word: 'apple', meaning: 'A kind of fruit' },
                    { word: 'chair', meaning: 'Something to sit on' }
                ]
            },
            2,
            'A1'
        );


    const lesson4 = await addLesson(
            'Grammar',
            'Reported Speech',
            { description: 'This lesson covers how to use reported speech in English.' },
            4,
            'B2'
        );
    const lesson5 = await addLesson(
            'Grammar',
            'Advanced Conditionals',
            { description: 'A look into mixed and advanced conditional forms.' },
            5,
            'B2'
        );
    const lesson6 = await addLesson(
            'Vocabulary',
            'Business Vocabulary Basics',
            {
                description: 'This lesson introduces key business vocabulary used in meetings and emails.',
                examples: [
                    { word: 'synergy', meaning: 'The interaction of two elements for greater effect' },
                    { word: 'deadline', meaning: 'A time limit for completing something' }
                ]
            },
            4,
            'B2'
        );
    const lesson7 = await addLesson(
            'Vocabulary',
            'English Slang & Expressions',
            {
                description: 'Learn common English slang and expressions used in casual conversation.',
                examples: [
                    { phrase: 'hit the books', meaning: 'to study hard' },
                    { phrase: 'no biggie', meaning: 'not a big deal' }
                ]
            },
            3,
            'B2'
        );

    // A1 Lessons
    question1 = await addQuestion(lesson1.id, 'multiple-choice', {
        question: 'What is the past tense of "go"?',
        options: ['went', 'goed', 'gone', 'goes'],
        correctAnswer: 'went'
    });
    question2 = await addQuestion(lesson1.id, 'multiple-choice', {
        question: 'Which is a correct sentence?',
        options: ['He go to school.', 'He goes to school.', 'He going school.', 'He gone school.'],
        correctAnswer: 'He goes to school.'
    });

    question3 = await addQuestion(lesson2.id, 'multiple-choice', {
        question: 'How do you form a negative in present simple?',
        options: ['He not go', 'He no go', 'He doesn’t go', 'He isn’t go'],
        correctAnswer: 'He doesn’t go'
    });
    question4 = await addQuestion(lesson2.id, 'multiple-choice', {
        question: 'Choose the correct structure:',
        options: ['Do he like?', 'Does he likes?', 'Does he like?', 'He do like?'],
        correctAnswer: 'Does he like?'
    });

    question5 = await addQuestion(lesson3.id, 'vocabulary', {
        question: 'What does "cold feet" mean?',
        options: ['Cold toes', 'Nervous before something', 'To be sick', 'Walking fast'],
        correctAnswer: 'Nervous before something'
    });
    question6 = await addQuestion(lesson3.id, 'vocabulary', {
        question: 'What does "hit the books" mean?',
        options: ['Throw books', 'Start studying', 'Read a story', 'Book fight'],
        correctAnswer: 'Start studying'
    });

    // B2 Lesson 1
    question7 = await addQuestion(lesson4.id, 'grammar', {
        question: 'What is the correct passive voice: "They build houses"?',
        options: ['Houses built', 'Houses are built', 'They are built houses', 'Built houses are'],
        correctAnswer: 'Houses are built'
    });
    question8 = await addQuestion(lesson4.id, 'grammar', {
        question: 'Pick the correct structure for reported speech:',
        options: ['He said he is happy.', 'He said he was happy.', 'He say he is happy.', 'He says he was happy.'],
        correctAnswer: 'He said he was happy.'
    });

    // B2 Lesson 2
    question9 = await addQuestion(lesson5.id, 'grammar', {
        question: 'Which sentence uses a relative clause?',
        options: ['I know the man who lives next door.', 'I know the man lives next door.', 'I know who lives next door.', 'The man he lives next door.'],
        correctAnswer: 'I know the man who lives next door.'
    });
    question10 = await addQuestion(lesson5.id, 'grammar', {
        question: 'Choose the correct conditional form: "If I had known..."',
        options: ['I will help you.', 'I would have helped you.', 'I help you.', 'I helped you.'],
        correctAnswer: 'I would have helped you.'
    });

    // B2 Lesson 3 (Vocabulary)
    question11 = await addQuestion(lesson6.id, 'vocabulary', {
        question: 'What does "cut corners" mean?',
        options: ['Take a shortcut', 'Avoid responsibility', 'Be lazy', 'Go around something'],
        correctAnswer: 'Take a shortcut'
    });
    question12 = await addQuestion(lesson6.id, 'vocabulary', {
        question: 'What does "call it a day" mean?',
        options: ['Start working', 'End the work for now', 'Have a meeting', 'Work overnight'],
        correctAnswer: 'End the work for now'
    });

    // B2 Lesson 4
    question13 = await addQuestion(lesson7.id, 'grammar', {
        question: 'Choose the correct form: "By the time he arrived..."',
        options: ['I left.', 'I have left.', 'I had left.', 'I was leave.'],
        correctAnswer: 'I had left.'
    });
    question14 = await addQuestion(lesson7.id, 'grammar', {
        question: 'Which is an example of a cleft sentence?',
        options: ['It was John who broke the vase.', 'John broke the vase.', 'The vase was broken.', 'Who broke the vase was John.'],
        correctAnswer: 'It was John who broke the vase.'
    });


    // Create programs for each user
    const program1 = await addProgram(user1.id, 0, 0); // A1 User
    const program2 = await addProgram(user2.id, 0, 0); // B2 User
    const program3 = await addProgram(user3.id, 0, 0); // B2 User

    // Add A1 lessons to program1
    await addLessonToProgram(program1.id, lesson1.id, 1);
    await addLessonToProgram(program1.id, lesson2.id, 2);
    await addLessonToProgram(program1.id, lesson3.id, 3);

    // Add B2 lessons to program2
    await addLessonToProgram(program2.id, lesson4.id, 1);
    await addLessonToProgram(program2.id, lesson5.id, 2);
    await addLessonToProgram(program2.id, lesson6.id, 3);
    await addLessonToProgram(program2.id, lesson7.id, 4);

    // Add same B2 lessons to program3 (for variety, you could assign in different order if desired)
    await addLessonToProgram(program3.id, lesson4.id, 1);
    await addLessonToProgram(program3.id, lesson5.id, 2);
    await addLessonToProgram(program3.id, lesson6.id, 3);


    // A1 User (user1) has 3 lessons
    const lessonResult1 = await addLessonResult(user1.id, lesson1.id, 100, 90); // Grammar 1
    const lessonResult2 = await addLessonResult(user1.id, lesson2.id, 100, 85); // Grammar 2
    const lessonResult3 = await addLessonResult(user1.id, lesson3.id, 100, 95); // Vocabulary

    // B2 User (user2) has 4 lessons
    const lessonResult4 = await addLessonResult(user2.id, lesson4.id, 100, 88); // Grammar 1
    const lessonResult5 = await addLessonResult(user2.id, lesson5.id, 90, 80);  // Grammar 2
    const lessonResult6 = await addLessonResult(user2.id, lesson6.id, 95, 70);  // Vocabulary
    const lessonResult7 = await addLessonResult(user2.id, lesson7.id, 100, 75); // Grammar/Vocab hybrid (if that’s the case)

    // B2 User (user3) has only 3 lessons
    const lessonResult8 = await addLessonResult(user3.id, lesson4.id, 80, 60); // Grammar 1
    const lessonResult9 = await addLessonResult(user3.id, lesson5.id, 85, 65); // Grammar 2
    const lessonResult10 = await addLessonResult(user3.id, lesson6.id, 90, 72); // Vocabulary

    //User 1 Lesson 1
    await addQuestionResult(lessonResult1.id, question1.id, true, "am");
    await addQuestionResult(lessonResult1.id, question2.id, false, "is");

    //User 1 Lesson 2
    await addQuestionResult(lessonResult2.id, question3.id, true, "walk");
    await addQuestionResult(lessonResult2.id, question4.id, false, "");

    //User 1 Lesson 3
    await addQuestionResult(lessonResult3.id, question5.id, false, "");
    await addQuestionResult(lessonResult3.id, question6.id, false, "");

    //User 2 Lesson 4
    await addQuestionResult(lessonResult4.id, question7.id, true, "had been running");
    await addQuestionResult(lessonResult4.id, question8.id, true, "had left");

    //User 2 Lesson 5
    await addQuestionResult(lessonResult5.id, question9.id, false, "");
    await addQuestionResult(lessonResult5.id, question10.id, false, "");

    //User 2 Lesson 6
    await addQuestionResult(lessonResult6.id, question11.id, false, "expanding rapidly");
    await addQuestionResult(lessonResult6.id, question12.id, false, "");

    //User 2 Lesson 7
    await addQuestionResult(lessonResult7.id, question13.id, false, "cutting corners");
    await addQuestionResult(lessonResult7.id, question14.id, true, "thinking outside the box");

    //User 3 Lesson 4
    await addQuestionResult(lessonResult8.id, question7.id, true, "had been running");
    await addQuestionResult(lessonResult8.id, question8.id, false, "");

    //User 3 Lesson 5
    await addQuestionResult(lessonResult9.id, question9.id, false, "goes");
    await addQuestionResult(lessonResult9.id, question10.id, true, "had gone");

    //User 3 Lesson 6
    await addQuestionResult(lessonResult10.id, question11.id, false, "");
    await addQuestionResult(lessonResult10.id, question12.id, false, "");
}

async function testGetLessonsWithResults() {
    const lessons = await getLessonsWithResultsForUser(1, 1);
    console.log(lessons); // Now you can see the resolved value
}




// Example usage
//testcreateProgramWithTwoLessons(1); // Replace 1 with an actual user_id in your DB


//testQuestionResult();

//test_lesson_result();
//test_lesson();
//test_user();
//test_question();
//testGetLessonsByType();
//testFillProgram();
addTestData();
//testGetLessonsWithResults()