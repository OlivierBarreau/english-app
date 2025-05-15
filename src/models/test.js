const {  getUserById, addUser, updateUserById, deleteUserById, getUserByLogin } = require('./userModel');
const { getQuestionById, addQuestion, updateQuestionById, deleteQuestionById, getQuestionsByLessonId, getQuestionIdsByLessonId } = require('./questionModel');
const { getLessonById, addLesson, updateLessonById, deleteLessonById, getLessonsByType, getLessonsByLevel } = require('./lessonModel');
const { getLessonResultById, addLessonResult, updateLessonResultById, deleteLessonResultById } = require('./lesson_resultModel');
const { addQuestionResult, getQuestionResultById, updateQuestionResultById, deleteQuestionResultById } = require('./question_resultModel');
const { addProgram, getProgramById, updateProgramById, deleteProgramById } = require('./programModel.js');
const { addLessonToProgram, getLessonsForProgram, updateLessonOrder, removeLessonFromProgram, getLessonsWithResultsForUser } = require('./program_lessonModel.js');
const { fillProgram, createProgramForUser } = require('./globalModels.js');
const pool = require('./db_connexion');

// Utility function to wait for a specified number of milliseconds
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

        console.log('Fetching questions by lesson ID...');
        const questionsByLesson = await getQuestionsByLessonId(16); // Replace with actual lesson ID
        console.log('Questions for Lesson ID 1:', questionsByLesson);
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
    const user1 = await addUser('alice@example.com', 'password123', 'Alice', 'Licea','B2', 1);
    const user2 = await addUser('bob@example.com', 'securepass', 'Bob', 'Bob','B2', 2);
    const user3 = await addUser('carol@example.com', 'mypassword', 'Carol', 'Rolca','B2', 3);
    

    const lesson1 = await addLesson(
            'Grammar',
            'Simple Present Tense',
            { description: 'This lesson explains the simple present tense and its uses.' },
            3,
            'A2'
        );
    const lesson2 = await addLesson(
            'Grammar',
            'Articles (a, an, the)',
            { description: 'Learn how and when to use articles in English.' },
            2,
            'A2'
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
            'A2'
        );


    const lesson4 = await addLesson(
            'Grammar',
            'Reported Speech',
            { description: 'This lesson covers how to use reported speech in English.' },
            4,
            'C2'
        );
    const lesson5 = await addLesson(
            'Grammar',
            'Advanced Conditionals',
            { description: 'A look into mixed and advanced conditional forms.' },
            5,
            'C2'
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
            'C2'
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
            'C2'
        );


    //createB2Lessons();
    //createA1Lessons();

    //createProgramForUser(1, 'B2');


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
    const lessonResult10 = await  (user3.id, lesson6.id, 90, 72); // Vocabulary

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


async function createA1Lessons() {
    try {

        // Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const nounsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">What are Nouns?</h2>
    <p class="mb-4">
        Nouns are fundamental building blocks of the English language. They are words that are used to identify or name people, places, or things. Think of them as the labels we use for everything around us and even abstract concepts.
    </p>
    <p class="mb-4">
        In a sentence, nouns play crucial roles. They can function as the <strong class="font-bold">subject</strong> (the person or thing doing the action), the <strong class="font-bold">object</strong> of a verb or preposition (the person or thing receiving the action or related by a preposition), or even follow linking verbs to rename or re-identify the subject (known as <strong class="font-bold">predicate nouns</strong>).
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Examples of Nouns:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">People:</strong> teacher, student, John, Mary</li>
        <li><strong class="font-bold">Places:</strong> city, park, London, school</li>
        <li><strong class="font-bold">Things:</strong> book, table, car, computer, dog</li>
        <li><strong class="font-bold">Ideas/Concepts (Abstract Nouns):</strong> happiness, freedom, love, information</li>
    </ul>
</div>

<div class=" p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Nouns in Sentences</h2>
    <p class="mb-4">Let's look at how nouns function within sentences:</p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">As the Subject:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>The <strong class="font-bold">dog</strong> chased its tail. (<strong class="font-bold">dog</strong> is the subject performing the action 'chased')</li>
        <li><strong class="font-bold">Mary</strong> reads a book every week. (<strong class="font-bold">Mary</strong> is the subject performing the action 'reads')</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">As Objects:</h3>
    <p class="mb-2">Nouns can be direct objects, indirect objects, or objects of prepositions.</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Direct Object:</strong> Receives the action of the verb.
            <ul class="list-disc pl-5 space-y-2">
                <li>The dog chased its <strong class="font-bold">tail</strong>. (<strong class="font-bold">tail</strong> receives the action 'chased')</li>
                <li>Mary reads a <strong class="font-bold">book</strong> every week. (<strong class="font-bold">book</strong> receives the action 'reads')</li>
            </ul>
        </li>
        <li><strong class="font-bold">Indirect Object:</strong> The person or thing who receives the direct object.
            <ul class="list-disc pl-5 space-y-2">
                <li>Please pass <strong class="font-bold">Jeremy</strong> the salt. (<strong class="font-bold">Jeremy</strong> receives the direct object 'salt')</li>
                <li>I sent the <strong class="font-bold">company</strong> an application. (<strong class="font-bold">company</strong> receives the direct object 'application')</li>
            </ul>
        </li>
        <li><strong class="font-bold">Object of a Preposition:</strong> Follows a preposition (like in, on, under, for, with).
            <ul class="list-disc pl-5 space-y-2">
                <li>Your backpack is under the <strong class="font-bold">table</strong>. (<strong class="font-bold">table</strong> follows the preposition 'under')</li>
                <li>I am looking for <strong class="font-bold">work</strong>. (<strong class="font-bold">work</strong> follows the preposition 'for')</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">As Predicate Nouns:</h3>
    <p class="mb-2">These follow linking verbs (like 'is', 'am', 'are', 'was', 'were', 'seem', 'become') and rename or identify the subject.</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Love is a <strong class="font-bold">virtue</strong>. (<strong class="font-bold">virtue</strong> renames the subject 'Love')</li>
        <li>Tommy seems like a real <strong class="font-bold">bully</strong>. (<strong class="font-bold">bully</strong> renames the subject 'Tommy')</li>
    </ul>
</div>

<div class=" p-6 rounded-md shadow-md bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Categories of Nouns</h2>
    <p class="mb-4">Nouns can be divided into different categories based on their characteristics:</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Common Nouns:</strong> General names (city, person, book).</li>
        <li><strong class="font-bold">Proper Nouns:</strong> Specific names, always capitalized (Paris, John, The Farlex Grammar Book).</li>
        <li><strong class="font-bold">Concrete Nouns:</strong> Things you can perceive with your senses (table, music, water).</li>
        <li><strong class="font-bold">Abstract Nouns:</strong> Ideas, feelings, concepts (love, happiness, information).</li>
        <li><strong class="font-bold">Countable Nouns:</strong> Can be counted, have singular/plural forms (apple/apples, book/books).</li>
        <li><strong class="font-bold">Uncountable Nouns:</strong> Cannot be counted as individual units (water, information, advice).</li>
        <li><strong class="font-bold">Collective Nouns:</strong> Refer to a group (team, family, committee).</li>
        <li><strong class="font-bold">Compound Nouns:</strong> Made up of two or more words (football, classroom, mother-in-law).</li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        (Further details on each category are covered in separate lessons.)
    </p>
</div>
`;

const lesson0 = await addLesson(
    'Grammar', // lesson_type
    'Nouns', // lesson_title
    { // lesson_content JSON
        description: 'This lesson introduces nouns, words that name people, places, things, or ideas, and explains their roles in sentences and different categories.',
        html: nounsHtml
    },
    5, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Nouns" added:');



        console.log('Creating first lesson...');
        const lesson1 = await addLesson(
            'Vocabulary',
            'Common and Proper Nouns',
            {
                description : 'This lesson covers the difference between common and proper nouns, including examples and usage.',
                html: `<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Common and Proper Nouns</h2>
    <p class="mb-4">
        Nouns can be divided into two main types: <strong class="font-bold">common nouns</strong> and <strong class="font-bold">proper nouns</strong>. Understanding the difference is important, especially for capitalization rules.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Common Nouns:</h3>
    <p class="mb-4">
        A <strong class="font-bold">common noun</strong> is a general name for a person, place, thing, or idea. They refer to a class or type of entity, not a specific individual one. Common nouns are not capitalized unless they appear at the beginning of a sentence.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Examples:</strong> city, river, person, book, car, country, language, month, day</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Proper Nouns:</h3>
    <p class="mb-4">
        A <strong class="font-bold">proper noun</strong> is a specific name for a particular person, place, organization, or sometimes a unique thing. Proper nouns are always capitalized, regardless of where they appear in a sentence.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Examples:</strong> Paris, Nile, John, Google, Monday, July, English</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Comparing Common and Proper Nouns:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>The <strong class="font-bold">girl</strong> went to the <strong class="font-bold">park</strong>. (Common nouns)</li>
        <li><strong class="font-bold">Mary</strong> went to <strong class="font-bold">Hyde Park</strong>. (Proper nouns)</li>
        <li>I read a <strong class="font-bold">book</strong>. (Common noun)</li>
        <li>I read <strong class="font-bold">The Farlex Grammar Book</strong>. (Proper noun - title of a specific book)</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Remember to always capitalize proper nouns!
     </p>
</div>`,
            },
            5,
            'B1'
        );
        console.log('Lesson 1 created:');

        // Assuming addLesson is an async function that interacts with your database
        // and the HTML content is stored in a variable or directly in the call.

        const concreteAbstractNounsHtml = `
        <div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">Concrete and Abstract Nouns</h2>
            <p class="mb-4">
                Nouns can also be classified based on whether they refer to something you can experience with your senses or something that exists as an idea.
            </p>

            <h3 class="text-xl font-semibold mb-3 text-gray-800">Concrete Nouns:</h3>
            <p class="mb-4">
                A <strong class="font-bold">concrete noun</strong> refers to a person, place, or thing that exists physically in the real world. You can perceive concrete nouns using one or more of your five senses: sight, hearing, smell, taste, or touch.
            </p>
            <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong class="font-bold">Examples:</strong> house, music, table, water, dog, flower, computer, food</li>
                <li>You can see a house, hear music, touch a table, taste water, see/hear/touch a dog, smell/see a flower, see/touch a computer, taste/smell/touch food.</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Abstract Nouns:</h3>
            <p class="mb-4">
                An <strong class="font-bold">abstract noun</strong> refers to an idea, feeling, quality, concept, or state of being that does not exist physically. You cannot perceive abstract nouns with your five senses. They exist in the mind.
            </p>
            <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong class="font-bold">Examples:</strong> love, courage, happiness, information, freedom, justice, time, beauty</li>
                <li>You cannot touch love, see happiness, smell freedom, taste justice, or hear time in a physical way.</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Examples in Sentences:</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li>I can see the <strong class="font-bold">house</strong>. (Concrete)</li>
                <li><strong class="font-bold">Happiness</strong> is important. (Abstract)</li>
                <li>He showed great <strong class="font-bold">courage</strong>. (Abstract)</li>
                <li>The <strong class="font-bold">music</strong> was loud. (Concrete)</li>
            </ul>
            <p class="mt-4 text-sm text-gray-600">
                Think about whether you can use your senses to help you identify concrete vs. abstract nouns.
            </p>
        </div>
        `;

        const lesson2 = await addLesson(
            'Grammar', // lesson_type
            'Concrete and Abstract Nouns', // lesson_title
            { // lesson_content JSON
                description: 'This lesson explains the difference between concrete nouns (physical things) and abstract nouns (ideas or concepts).',
                html: concreteAbstractNounsHtml
            },
            3, // lesson_importance (can be adjusted)
            'A1' // lesson_level
        );

        console.log('Lesson "Concrete and Abstract Nouns" added:');


        // Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const countableNounsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Countable Nouns</h2>
    <p class="mb-4">
        <strong class="font-bold">Countable nouns</strong> (also called count nouns) are nouns that represent individual items that can be counted. Because they can be counted, they have both a singular form (referring to one item) and a plural form (referring to more than one item).
    </p>
    <p class="mb-4">
        You can use numbers directly before countable nouns (one apple, two books). You can also use quantifiers that are used with countable nouns, such as "many," "few," "a few," "several," "each," and "every."
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Singular and Plural Forms:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>apple &rarr; apples</li>
        <li>book &rarr; books</li>
        <li>chair &rarr; chairs</li>
        <li>student &rarr; students</li>
        <li>city &rarr; cities</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Using Quantifiers with Countable Nouns:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>I have <strong class="font-bold">one apple</strong>.</li>
        <li>I have <strong class="font-bold">two apples</strong>.</li>
        <li>There are <strong class="font-bold">many books</strong> on the shelf.</li>
        <li>There are <strong class="font-bold">a few students</strong> in the class.</li>
        <li><strong class="font-bold">Each student</strong> has a book.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Remember, if you can put a number before a noun and it makes sense, it's likely a countable noun.
     </p>
</div>
`;

const lesson3 = await addLesson(
    'Grammar', // lesson_type
    'Countable Nouns', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains countable nouns, which can be counted and have singular and plural forms.',
        html: countableNounsHtml
    },
    4, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Countable Nouns" added:');



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const uncountableNounsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Uncountable Nouns</h2>
    <p class="mb-4">
        <strong class="font-bold">Uncountable nouns</strong> (also called non-count nouns or mass nouns) are nouns that represent individual items that cannot be counted. They refer to things that are seen as a mass or a concept rather than separate items.
    </p>
    <p class="mb-4">
        Uncountable nouns do not typically have a plural form. They are used with singular verbs.
    </p>
    <p class="mb-4">
        You cannot use numbers directly before uncountable nouns. Instead, you use quantifiers that are used with uncountable nouns, such as "much," "little," "a little," "some," "any," "a lot of," and "plenty of." You can also use phrases like "a piece of" or "a glass of" to count portions of uncountable nouns.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Categories of Uncountable Nouns:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Liquids and Gases:</strong> water, milk, coffee, air, oxygen</li>
        <li><strong class="font-bold">Materials:</strong> wood, metal, glass, paper, gold, plastic</li>
        <li><strong class="font-bold">Abstract Concepts:</strong> information, advice, happiness, knowledge, freedom, time, peace</li>
        <li><strong class="font-bold">Food Items (often):</strong> rice, pasta, bread, cheese, meat (when referring to the substance)</li>
        <li><strong class="font-bold">Collections/Groups:</strong> furniture, luggage, news, money, traffic</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Examples in Sentences:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>I need some <strong class="font-bold">water</strong>. (Not "waters")</li>
        <li>She gave me good <strong class="font-bold">advice</strong>. (Not "advices")</li>
        <li>There is <strong class="font-bold">much information</strong> available. (Not "many informations")</li>
        <li>We bought new <strong class="font-bold">furniture</strong>. (Not "furnitures")</li>
        <li>Can I have <strong class="font-bold">a glass of water</strong>? (Counting the container, not the water itself)</li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        Pay attention to which quantifiers are used with countable vs. uncountable nouns.
    </p>
</div>
`;

const lesson4 = await addLesson(
    'Grammar', // lesson_type
    'Uncountable Nouns', // lesson_title
    { // lesson_content JSON
        description: 'This lesson covers uncountable nouns, which cannot be counted and usually do not have plural forms.',
        html: uncountableNounsHtml
    },
    4, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Uncountable Nouns" added:');



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const articlesHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Articles (a, an, the)</h2>
    <p class="mb-4">
        <strong class="font-bold">Articles</strong> are a type of determiner that come before nouns to specify whether the noun is general or specific. They are very common words in English. There are three articles: <strong class="font-bold">a</strong>, <strong class="font-bold">an</strong>, and <strong class="font-bold">the</strong>.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Indefinite Articles (a, an):</h3>
    <p class="mb-4">
        The indefinite articles are <strong class="font-bold">a</strong> and <strong class="font-bold">an</strong>. They are used with singular countable nouns when you are talking about a general, non-specific item, or when you mention something for the first time.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Use <strong class="font-bold">a</strong> before singular countable nouns that start with a consonant sound.
            <ul class="list-disc pl-5 space-y-2">
                <li>a <strong class="font-bold">cat</strong></li>
                <li>a <strong class="font-bold">book</strong></li>
                <li>a <strong class="font-bold">university</strong> (starts with a 'yoo' sound, which is a consonant sound)</li>
            </ul>
        </li>
        <li>Use <strong class="font-bold">an</strong> before singular countable nouns that start with a vowel sound.
             <ul class="list-disc pl-5 space-y-2">
                <li>an <strong class="font-bold">apple</strong></li>
                <li>an <strong class="font-bold">hour</strong> (the 'h' is silent, starts with an 'ow' sound, which is a vowel sound)</li>
                <li>an <strong class="font-bold">umbrella</strong></li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Definite Article (the):</h3>
    <p class="mb-4">
        The definite article is <strong class="font-bold">the</strong>. It is used before any noun (singular, plural, countable, or uncountable) when you are talking about a specific person, place, or thing that has already been mentioned, is unique, or is understood by both the speaker and listener.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Please pass me <strong class="font-bold">the book</strong> on the table. (Specific book)</li>
        <li><strong class="font-bold">The sun</strong> is bright today. (Unique thing)</li>
        <li>I saw a dog. <strong class="font-bold">The dog</strong> was barking. (Mentioned before)</li>
        <li><strong class="font-bold">The students</strong> in this class are smart. (Specific group of students)</li>
        <li>Can you turn off <strong class="font-bold">the light</strong>? (Understood specific light)</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">When Not to Use Articles:</h3>
    <p class="mb-4">
        Sometimes, no article is used. This is called the zero article. It's often used with plural countable nouns and uncountable nouns when talking about them in a general sense.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>I like <strong class="font-bold">dogs</strong>. (Talking about dogs in general - plural countable)</li>
        <li><strong class="font-bold">Water</strong> is important for life. (Talking about water in general - uncountable)</li>
        <li>She studies <strong class="font-bold">history</strong>. (Talking about the subject in general - uncountable)</li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        Choosing the correct article depends on whether the noun is countable or uncountable, singular or plural, and whether you are referring to something general or specific.
    </p>
</div>
`;

const lesson5 = await addLesson(
    'Grammar', // lesson_type
    'Articles (a, an, the)', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the use of articles (a, an, the) before nouns to indicate if they are general or specific.',
        html: articlesHtml
    },
    5, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Articles (a, an, the)" added:');




// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const determinersHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Determiners</h2>
    <p class="mb-4">
        <strong class="font-bold">Determiners</strong> are words that come before a noun to clarify what the noun refers to. They help to specify the noun's quantity, possession, or specificity. Determiners are essential for making the meaning of a noun clear in a sentence.
    </p>
    <p class="mb-4">
        A determiner is always followed by a noun (or sometimes an adjective describing the noun). You cannot have a noun without a determiner in many cases, especially singular countable nouns.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Common Types of Determiners:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Articles:</strong> a, an, the (e.g., <strong class="font-bold">a</strong> cat, <strong class="font-bold">the</strong> sun)</li>
        <li><strong class="font-bold">Possessives:</strong> my, your, his, her, its, our, their (e.g., <strong class="font-bold">my</strong> book, <strong class="font-bold">her</strong> car)</li>
        <li><strong class="font-bold">Demonstratives:</strong> this, that, these, those (e.g., <strong class="font-bold">this</strong> house, <strong class="font-bold">those</strong> trees)</li>
        <li><strong class="font-bold">Quantifiers:</strong> some, any, many, much, few, little, all, most, several, enough, no (e.g., <strong class="font-bold">some</strong> water, <strong class="font-bold">many</strong> friends)</li>
        <li><strong class="font-bold">Numbers:</strong> one, two, three, etc. (e.g., <strong class="font-bold">two</strong> apples)</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Examples in Sentences:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">A</strong> dog is barking. (Article)</li>
        <li>Is <strong class="font-bold">this</strong> your phone? (Demonstrative)</li>
        <li>I have <strong class="font-bold">some</strong> questions. (Quantifier)</li>
        <li><strong class="font-bold">Her</strong> cat is black. (Possessive)</li>
        <li>There are <strong class="font-bold">three</strong> books on the table. (Number)</li>
        <li>I have <strong class="font-bold">enough money</strong>. (Quantifier)</li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        Determiners help to make the meaning of nouns precise.
    </p>
</div>
`;

const lesson6 = await addLesson(
    'Grammar', // lesson_type
    'Determiners', // lesson_title
    { // lesson_content JSON
        description: 'This lesson introduces determiners, words that come before nouns to specify quantity, possession, or specificity.',
        html: determinersHtml
    },
    3, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Determiners" added:');


// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const personalPronounsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Personal Pronouns</h2>
    <p class="mb-4">
        <strong class="font-bold">Personal pronouns</strong> are pronouns that refer to a specific person or thing. They are used to replace nouns, making sentences less repetitive and smoother to read and speak.
    </p>
    <p class="mb-4">
        Personal pronouns are one of the most common types of pronouns. They change their form based on several factors:
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Person:</strong> (First, Second, or Third)</li>
        <li><strong class="font-bold">Number:</strong> (Singular or Plural)</li>
        <li><strong class="font-bold">Gender:</strong> (For third person singular - he, she, it)</li>
        <li><strong class="font-bold">Case:</strong> (Subject or Object)</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Subject Pronouns:</h3>
    <p class="mb-2">
        Subject pronouns are used when the pronoun is the subject of the verb in a sentence (the one performing the action).
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Forms:</strong> I, you, he, she, it, we, they</li>
        <li><strong class="font-bold">Examples:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">I</strong> am happy. (I is the subject of 'am')</li>
                <li><strong class="font-bold">They</strong> went home. (They is the subject of 'went')</li>
                <li><strong class="font-bold">She</strong> likes pizza. (She is the subject of 'likes')</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Object Pronouns:</h3>
    <p class="mb-2">
        Object pronouns are used when the pronoun is the object of the verb or the object of a preposition (the one receiving the action or related by a preposition).
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Forms:</strong> me, you, him, her, it, us, them</li>
        <li><strong class="font-bold">Examples:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>She saw <strong class="font-bold">me</strong>. ('me' is the object of 'saw')</li>
                <li>Give the book to <strong class="font-bold">him</strong>. ('him' is the object of the preposition 'to')</li>
                <li>We invited <strong class="font-bold">them</strong> to the party. ('them' is the object of 'invited')</li>
            </ul>
        </li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        Remember to use the correct form of the personal pronoun depending on its role in the sentence.
    </p>
</div>
`;

const lesson7 = await addLesson(
    'Grammar', // lesson_type
    'Personal Pronouns', // lesson_title
    { // lesson_content JSON
        description: 'This lesson introduces personal pronouns (I, you, he, she, it, we, they) and their forms based on person, number, gender, and case.',
        html: personalPronounsHtml
    },
    5, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Personal Pronouns" added:');



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const personalPronounsNumberHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Personal Pronouns - Number (Singular and Plural)</h2>
    <p class="mb-4">
        Personal pronouns change their form depending on whether they refer to one person or thing (<strong class="font-bold">singular</strong>) or more than one person or thing (<strong class="font-bold">plural</strong>). This is called <strong class="font-bold">number</strong> agreement.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Singular Personal Pronouns:</h3>
    <p class="mb-2">
        These pronouns refer to only one person or thing.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Subject Forms:</strong> I, you, he, she, it</li>
        <li><strong class="font-bold">Object Forms:</strong> me, you, him, her, it</li>
    </ul>
    <p class="mb-4 mt-4">Examples:</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">I</strong> like pizza. (Singular subject)</li>
        <li>She saw <strong class="font-bold">me</strong>. (Singular object)</li>
        <li><strong class="font-bold">He</strong> is my friend. (Singular subject)</li>
        <li>Give the book to <strong class="font-bold">him</strong>. (Singular object)</li>
        <li><strong class="font-bold">It</strong> is raining. (Singular subject)</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Plural Personal Pronouns:</h3>
    <p class="mb-2">
        These pronouns refer to more than one person or thing.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Subject Forms:</strong> we, you, they</li>
        <li><strong class="font-bold">Object Forms:</strong> us, you, them</li>
    </ul>
    <p class="mb-4 mt-4">Examples:</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">We</strong> are going to the park. (Plural subject)</li>
        <li>Are <strong class="font-bold">you</strong> all ready? (Plural subject - 'you' can be singular or plural)</li>
        <li>They saw <strong class="font-bold">us</strong>. (Plural object)</li>
        <li>Give the books to <strong class="font-bold">them</strong>. (Plural object)</li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        The form of the verb often changes depending on whether the subject pronoun is singular or plural (e.g., I am, he is, we are, they are).
    </p>
</div>
`;

const lesson8 = await addLesson(
    'Grammar', // lesson_type
    'Personal Pronouns - Number (Singular and Plural)', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains how personal pronouns change form based on whether they are singular or plural.',
        html: personalPronounsNumberHtml
    },
    4, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Personal Pronouns - Number (Singular and Plural)" added:');



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const personalPronounsPersonHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Personal Pronouns - Person (First, Second, Third)</h2>
    <p class="mb-4">
        Personal pronouns are categorized by <strong class="font-bold">person</strong>, which indicates the relationship of the pronoun to the speaker. There are three persons: first person, second person, and third person.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">First Person:</h3>
    <p class="mb-2">
        Refers to the speaker or speakers.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Singular Subject:</strong> I</li>
        <li><strong class="font-bold">Singular Object:</strong> me</li>
        <li><strong class="font-bold">Plural Subject:</strong> we</li>
        <li><strong class="font-bold">Plural Object:</strong> us</li>
    </ul>
    <p class="mb-4 mt-4">Examples:</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">I</strong> am learning English.</li>
        <li>She is talking to <strong class="font-bold">me</strong>.</li>
        <li><strong class="font-bold">We</strong> are a team.</li>
        <li>He saw <strong class="font-bold">us</strong>.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Second Person:</h3>
    <p class="mb-2">
        Refers to the listener or listeners (the person or people being spoken to).
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Singular & Plural Subject:</strong> you</li>
        <li><strong class="font-bold">Singular & Plural Object:</strong> you</li>
    </ul>
    <p class="mb-4 mt-4">Examples:</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">You</strong> are a good student. (Singular)</li>
        <li>I am talking to <strong class="font-bold">you</strong>. (Singular)</li>
        <li><strong class="font-bold">You</strong> are all doing great! (Plural)</li>
        <li>He saw <strong class="font-bold">you</strong>. (Plural)</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Third Person:</h3>
    <p class="mb-2">
        Refers to someone or something other than the speaker or listener (the person or thing being spoken about).
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Singular Subject:</strong> he, she, it</li>
        <li><strong class="font-bold">Singular Object:</strong> him, her, it</li>
        <li><strong class="font-bold">Plural Subject:</strong> they</li>
        <li><strong class="font-bold">Plural Object:</strong> them</li>
    </ul>
    <p class="mb-4 mt-4">Examples:</p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">He</strong> is my brother.</li>
        <li>I saw <strong class="font-bold">him</strong>.</li>
        <li><strong class="font-bold">She</strong> likes cats.</li>
        <li>Give the book to <strong class="font-bold">her</strong>.</li>
        <li><strong class="font-bold">It</strong> is a sunny day.</li>
        <li>Look at <strong class="font-bold">it</strong>.</li>
        <li><strong class="font-bold">They</strong> live next door.</li>
        <li>He visited <strong class="font-bold">them</strong>.</li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        Understanding person is important for verb agreement and using the correct pronoun form.
    </p>
</div>
`;

const lesson9 = await addLesson(
    'Grammar', // lesson_type
    'Personal Pronouns - Person (First, Second, Third)', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the concept of person (first, second, and third) as it applies to personal pronouns.',
        html: personalPronounsPersonHtml
    },
    4, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Personal Pronouns - Person (First, Second, Third)" added:');




// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const personalPronounsGenderHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Personal Pronouns - Gender</h2>
    <p class="mb-4">
        In the third person singular, personal pronouns can indicate <strong class="font-bold">gender</strong>. This helps us refer to male persons, female persons, or things/animals.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Gender-Specific Pronouns (Third Person Singular):</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">He / Him:</strong> Used for a male person. 'He' is the subject form, 'him' is the object form.</li>
        <li><strong class="font-bold">She / Her:</strong> Used for a female person. 'She' is the subject form, 'her' is the object form.</li>
        <li><strong class="font-bold">It / It:</strong> Used for a thing, an animal (when the gender is unknown or not important), or sometimes a baby (when the gender is unknown). 'It' is both the subject and object form.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Examples:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>This is John. <strong class="font-bold">He</strong> is a doctor. (Subject - male)</li>
        <li>I saw John. I saw <strong class="font-bold">him</strong>. (Object - male)</li>
        <li>This is Mary. <strong class="font-bold">She</strong> is a teacher. (Subject - female)</li>
        <li>I saw Mary. I saw <strong class="font-bold">her</strong>. (Object - female)</li>
        <li>This is my dog. <strong class="font-bold">It</strong> is friendly. (Subject - animal/thing)</li>
        <li>I like my dog. I like <strong class="font-bold">it</strong>. (Object - animal/thing)</li>
        <li>Look at the baby. <strong class="font-bold">It</strong> is sleeping. (Often used for babies when gender is unknown)</li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">
        Remember to match the pronoun's gender to the noun it replaces.
    </p>
</div>
`;

const lesson10 = await addLesson(
    'Grammar', // lesson_type
    'Personal Pronouns - Gender', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains how third-person singular personal pronouns indicate gender (he, she, it).',
        html: personalPronounsGenderHtml
    },
    3, // lesson_importance (can be adjusted)
    'A1' // lesson_level
);

console.log('Lesson "Personal Pronouns - Gender" added:');



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const verbsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Verbs</h2>
    <p class="mb-4">
        <strong class="font-bold">Verbs</strong> are words that describe an action, a state of being, or an occurrence. They are arguably the most important part of a sentence because every complete sentence must contain a verb. Verbs tell us what the subject of the sentence is doing or being.
    </p>
    <p class="mb-4">
        Verbs are dynamic words that can change their form to show different tenses (when the action happens - past, present, future), persons (who is doing the action - first, second, third), and numbers (how many are doing the action - singular, plural).
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Verbs can express:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Actions:</strong> These are verbs that describe a physical or mental action.
            <ul class="list-disc pl-5 space-y-2">
                <li>run, jump, eat, write, sing, think, decide, believe</li>
                <li>Examples: Birds <strong class="font-bold">fly</strong>. I <strong class="font-bold">think</strong> about the future.</li>
            </ul>
        </li>
        <li><strong class="font-bold">States of Being:</strong> These verbs describe a condition or state rather than an action. The most common is the verb 'be'.
        `
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        pool.end(); // Close DB connection
    }
}

async function createB2Lessons(){
    try {
        wait(1000);
        // Assuming addQuestion is an async function that interacts with your database



        // Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const finiteNonfiniteVerbsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Finite and Non-finite Verbs</h2>
    <p class="mb-4">
        Verbs can be categorized based on whether they are <strong class="font-bold">finite</strong> or <strong class="font-bold">non-finite</strong>. This distinction is important for understanding how verbs function in clauses and sentences.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Finite Verbs:</h3>
    <p class="mb-4">
        A <strong class="font-bold">finite verb</strong> is a verb that has a specific tense (past, present, future), number (singular or plural), and person (first, second, or third). Finite verbs are the main verbs in a sentence or an independent clause. They agree with the subject of the sentence in number and person.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>They are limited by tense, number, and person.</li>
        <li>They can stand alone as the main verb in a sentence.</li>
        <li><strong class="font-bold">Examples:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>She <strong class="font-bold">walks</strong> every day. ('walks' is present tense, singular, third person)</li>
                <li>We <strong class="font-bold">walked</strong> yesterday. ('walked' is past tense, plural, first person)</li>
                <li>He <strong class="font-bold">is</strong> happy. ('is' is present tense, singular, third person)</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Non-finite Verbs:</h3>
    <p class="mb-4">
        A <strong class="font-bold">non-finite verb</strong> is a verb form that does NOT show a specific tense, number, or person. Non-finite verbs cannot be the main verb of an independent clause on their own. They often appear as infinitives, participles (present or past), or gerunds.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>They are not limited by tense, number, or person.</li>
        <li>They cannot stand alone as the main verb in a sentence.</li>
        <li>They often function as nouns, adjectives, or adverbs within a sentence.</li>
        <li><strong class="font-bold">Forms:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">Infinitives:</strong> to + base form (e.g., to walk, to eat)</li>
                <li><strong class="font-bold">Present Participles/Gerunds:</strong> base form + -ing (e.g., walking, eating)</li>
                <li><strong class="font-bold">Past Participles:</strong> often base form + -ed or irregular form (e.g., walked, eaten)</li>
            </ul>
        </li>
        <li><strong class="font-bold">Examples:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>I want <strong class="font-bold">to walk</strong> home. ('to walk' is an infinitive)</li>
                <li><strong class="font-bold">Walking</strong> is good exercise. ('walking' is a gerund, functioning as a noun)</li>
                <li>The <strong class="font-bold">broken</strong> chair needs fixing. ('broken' is a past participle, functioning as an adjective)</li>
                <li>They are <strong class="font-bold">walking</strong> to the park. ('walking' is a present participle used with the auxiliary 'are' to form a finite verb phrase)</li>
            </ul>
        </li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Understanding the difference helps in constructing grammatically correct sentences and clauses.
     </p>
</div>
`;

// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.
const lessonB2_1 = await addLesson(
    'Grammar', // lesson_type
    'Finite and Non-finite Verbs', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the difference between finite verbs (show tense, number, person) and non-finite verbs (infinitives, participles, gerunds).',
        html: finiteNonfiniteVerbsHtml
    },
    5, // lesson_importance (can be adjusted based on your curriculum)
    'B2' // lesson_level
);

console.log('Lesson "Finite and Non-finite Verbs" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_1 is the variable holding the result of adding the "Finite and Non-finite Verbs" lesson.

// Question 1
const questionB2_1_q1 = await addQuestion(lessonB2_1.id, 'grammar', {
    question: 'Which of the following is a finite verb?',
    options: ['to jump', 'swimming', 'is', 'gone'],
    correctAnswer: 'is' // Based on Quiz answers: 1-c
});

// Question 2
const questionB2_1_q2 = await addQuestion(lessonB2_1.id, 'grammar', {
    question: 'Identify the finite verb in the following sentence.\n“Running late, the family quickly drove to their relative\'s house.”',
    options: ['Running', 'to their', 'relative', 'drove'],
    correctAnswer: 'drove' // Based on Quiz answers: 2-d
});

// Question 3
const questionB2_1_q3 = await addQuestion(lessonB2_1.id, 'grammar', {
    question: 'Finite verbs correspond to a specific subject and ________.',
    options: ['a tense', 'an infinitive', 'a past participle', 'a present participle'],
    correctAnswer: 'a tense' // Based on Quiz answers: 3-a
});

// Question 4
const questionB2_1_q4 = await addQuestion(lessonB2_1.id, 'grammar', {
    question: 'Which of the following verbs in the sentence is not a finite verb?\n“Jumping into the ocean can be very refreshing after a long day.”',
    options: ['can', 'Jumping', 'be', 'A & B', 'B & C'],
    correctAnswer: 'B & C' // Based on Quiz answers: 4-e (Jumping and be are non-finite in this context)
});

// Question 5
const questionB2_1_q5 = await addQuestion(lessonB2_1.id, 'grammar', {
    question: 'In the past tense, finite verbs commonly end in:',
    options: ['“-ing”', '“-s”', '“-ed”', '“-er”'],
    correctAnswer: '“-ed”' // Based on Quiz answers: 5-b (assuming the options align with the provided answer 'b')
});

console.log('Provided quiz questions added for "Finite and Non-finite Verbs" lesson.');

wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const substitutingModalVerbsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Substituting Modal Verbs</h2>
    <p class="mb-4">
        Modal verbs (like can, could, will, would, shall, should, may, might, must) are auxiliary verbs that add meaning related to possibility, ability, permission, obligation, etc. However, modal verbs do not have all the forms that regular verbs do (e.g., they don't have infinitives, participles, or clear future forms directly). To express the meanings of modals in different tenses or forms, we often use <strong class="font-bold">substitute expressions</strong> (also called semi-modals or phrasal modals).
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Common Substitutes for Modal Verbs:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Can (ability/permission) &rarr; Be able to / Be allowed to:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>Present: I <strong class="font-bold">can swim</strong>. / I <strong class="font-bold">am able to swim</strong>.</li>
                <li>Past: I <strong class="font-bold">could swim</strong> when I was young. / I <strong class="font-bold">was able to swim</strong> when I was young.</li>
                <li>Future: I <strong class="font-bold">will be able to swim</strong> next year. (Cannot say 'will can swim')</li>
                <li>Present Perfect: I <strong class="font-bold">have been able to swim</strong> since I was five.</li>
            </ul>
        </li>
        <li><strong class="font-bold">Must (obligation) &rarr; Have to:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>Present: I <strong class="font-bold">must study</strong>. / I <strong class="font-bold">have to study</strong>.</li>
                <li>Past: I <strong class="font-bold">had to study</strong> yesterday. (Cannot say 'musted study')</li>
                <li>Future: I <strong class="font-bold">will have to study</strong> tomorrow.</li>
                <li>Present Perfect: I <strong class="font-bold">have had to study</strong> a lot this week.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Must not (prohibition) &rarr; Be not allowed to:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>You <strong class="font-bold">must not smoke</strong> here. / You <strong class="font-bold">are not allowed to smoke</strong> here.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Needn't (lack of necessity) &rarr; Don't have to:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>You <strong class="font-bold">needn't worry</strong>. / You <strong class="font-bold">don't have to worry</strong>.</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Why Use Substitutes?</h3>
    <p class="mb-4">
        Substitutes are used to express the meaning of modal verbs in tenses or grammatical structures where the modal verb itself cannot be used (e.g., after other modals, in infinitives, in participle clauses).
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Example: I might <strong class="font-bold">have to work</strong> late. ('have to' substitutes 'must' after the modal 'might')</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Learning these substitutes allows you to use modal meanings more flexibly across different tenses and sentence structures.
     </p>
</div>
`;

const lessonB2_2 = await addLesson(
    'Grammar', // lesson_type
    'Substituting Modal Verbs', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains how to use substitute expressions (semi-modals) to express modal meanings in different tenses and grammatical structures.',
        html: substitutingModalVerbsHtml
    },
    4, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Substituting Modal Verbs" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_2 is the variable holding the result of adding the "Substituting Modal Verbs" lesson.

// Question 1
const questionB2_2_q1 = await addQuestion(lessonB2_2.id, 'grammar', {
    question: 'Which of the following is a not a function of a modal auxiliary verb?',
    options: ['To indicate frequency', 'To indicate possibility or likelihood', 'To indicate ability', 'To indicate future intention'],
    correctAnswer: 'To indicate frequency' // Based on Quiz answers: 1-f (assuming this corresponds to option 'a')
});

// Question 2
const questionB2_2_q2 = await addQuestion(lessonB2_2.id, 'grammar', {
    question: 'Which of the following modal verbs indicates necessity?',
    options: ['may', 'can', 'would', 'must'],
    correctAnswer: 'must' // Based on Quiz answers: 2-d
});

// Question 3
const questionB2_2_q3 = await addQuestion(lessonB2_2.id, 'grammar', {
    question: 'Which of the following modal verbs is used to request permission?',
    options: ['may', 'should', 'would', 'must'],
    correctAnswer: 'may' // Based on Quiz answers: 3-c (assuming 'may' corresponds to option 'a')
});

// Question 4
const questionB2_2_q4 = await addQuestion(lessonB2_2.id, 'grammar', {
    question: 'Which of the following is something that a modal verb cannot do?',
    options: ['Indicate a future action', 'Express a possible action or outcome', 'Conjugate for the third-person singular', 'Become negative with the word not'],
    correctAnswer: 'Conjugate for the third-person singular' // Based on Quiz answers: 4-d (assuming this corresponds to option 'c')
});

// Question 5
const questionB2_2_q5 = await addQuestion(lessonB2_2.id, 'grammar', {
    question: 'When can a modal verb stand on its own?',
    options: ['When an adverb is used before the modal verb', 'When the main verb is implied elsewhere', 'When it is used in an interrogative sentence', 'Anytime', 'Never'],
    correctAnswer: 'When the main verb is implied elsewhere' // Based on Quiz answers: 5-b
});

// Question 6
const questionB2_2_q6 = await addQuestion(lessonB2_2.id, 'grammar', {
    question: 'Which of the following is not one of the “true” modal verbs?',
    options: ['must', 'need', 'will', 'should'],
    correctAnswer: 'need' // Based on Quiz answers: 6-b
});

console.log('Provided quiz questions added for "Substituting Modal Verbs" lesson.');

wait(1000);


// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const conditionalVerbsHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Conditional Verbs (Type 1, 2, 3)</h2>
    <p class="mb-4">
        <strong class="font-bold">Conditional sentences</strong> have two parts: an 'if' clause (the condition) and a main clause (the result). The verb forms used in these clauses depend on the type of conditional, which reflects how real or possible the condition is. At the B2 level, we focus on Type 1, Type 2, and Type 3 conditionals.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Type 1 Conditional (Real Conditional):</h3>
    <p class="mb-4">
        Used to talk about a real or very possible situation in the future and its result.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Structure:</strong> If + Present Simple, Will + Base Verb</li>
        <li><strong class="font-bold">Example:</strong> If it <strong class="font-bold">rains</strong>, I <strong class="font-bold">will stay</strong> home. (It might rain, and if it does, I will stay home.)</li>
        <li>You can also use other modal verbs (can, may, might) in the result clause: If it rains, I <strong class="font-bold">may stay</strong> home.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Type 2 Conditional (Unreal Conditional - Present/Future):</h3>
    <p class="mb-4">
        Used to talk about an unreal or hypothetical situation in the present or future and its result. The situation is unlikely or impossible.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Structure:</strong> If + Past Simple, Would + Base Verb</li>
        <li><strong class="font-bold">Example:</strong> If I <strong class="font-bold">won</strong> the lottery, I <strong class="font-bold">would buy</strong> a house. (It's unlikely I will win the lottery.)</li>
        <li>Use 'were' for all subjects in the 'if' clause of Type 2 conditionals with the verb 'be': If I <strong class="font-bold">were</strong> you, I <strong class="font-bold">would apologize</strong>.</li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Type 3 Conditional (Unreal Conditional - Past):</h3>
    <p class="mb-4">
        Used to talk about an unreal situation in the past and its result in the past. It's used to express regret or hypothetical outcomes that did not happen.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Structure:</strong> If + Past Perfect, Would Have + Past Participle</li>
        <li><strong class="font-bold">Example:</strong> If I <strong class="font-bold">had studied</strong> harder, I <strong class="font-bold">would have passed</strong> the exam. (I didn't study harder, so I didn't pass.)</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Mastering these three conditional types is crucial for expressing hypothetical and unreal situations in English.
     </p>
</div>
`;

const lessonB2_3 = await addLesson(
    'Grammar', // lesson_type
    'Conditional Verbs (Type 1, 2, 3)', // lesson_title
    { // lesson_content JSON
        description: 'This lesson covers the three main types of conditional sentences (Type 1, 2, and 3) used to express real and unreal situations and their results.',
        html: conditionalVerbsHtml
    },
    5, // lesson_importance (can be adjusted based on your curriculum)
    'B2' // lesson_level
);

console.log('Lesson "Conditional Verbs (Type 1, 2, 3)" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_3 is the variable holding the result of adding the "Conditional Verbs (Type 1, 2, 3)" lesson.

// Question 1
const questionB2_3_q1 = await addQuestion(lessonB2_3.id, 'grammar', {
    question: 'Which word in the following sentence is a conditional verb?\n“If clouds form on the horizon, it will likely rain.”',
    options: ['likely', 'If', 'form', 'will', 'rain', 'A, B, & C', 'C, D, & E'],
    correctAnswer: 'C, D, & E' // Based on Quiz answers: 1-g (assuming 'C, D, & E' corresponds to option 'g')
});

// Question 2
const questionB2_3_q2 = await addQuestion(lessonB2_3.id, 'grammar', {
    question: 'The conditional verbs in the following sentence are in which tense?\n“The pie will taste delicious if you make it properly.”',
    options: ['past', 'present', 'future', 'A & B', 'B & C', 'None of the above'],
    correctAnswer: 'present' // Based on Quiz answers: 2-c
});

// Question 3
const questionB2_3_q3 = await addQuestion(lessonB2_3.id, 'grammar', {
    question: 'Which set of conditional verbs is in the past tense?',
    options: ['had played', 'will run', 'is walking', 'will drive'],
    correctAnswer: 'had played' // Based on Quiz answers: 3-a
});

// Question 4
const questionB2_3_q4 = await addQuestion(lessonB2_3.id, 'grammar', {
    question: 'Which word in the following sentence is not a conditional verb?\n“The band will have played for three hours if it plays for another 20 minutes.”',
    options: ['will', 'if', 'have', 'played'],
    correctAnswer: 'have' // Based on Quiz answers: 4-b
});

// Question 5
const questionB2_3_q5 = await addQuestion(lessonB2_3.id, 'grammar', {
    question: 'Identify the conditional verbs in the following sentence.\n“If everything goes according to plan, the group will arrive on Tuesday.”',
    options: ['everything, goes, plan', 'goes, then, will', 'according, will, arrive,', 'goes, will, arrive'],
    correctAnswer: 'goes, will, arrive' // Based on Quiz answers: 5-d
});

console.log('Provided quiz questions added for "Conditional Verbs (Type 1, 2, 3)" lesson.');


wait(1000);




// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const presentPerfectContinuousHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Present Perfect Continuous Tense</h2>
    <p class="mb-4">
        The <strong class="font-bold">Present Perfect Continuous tense</strong> (also called the Present Perfect Progressive tense) is used to talk about actions that started in the past and are still continuing in the present, or have recently stopped but have a result in the present.
    </p>
    <p class="mb-4">
        It emphasizes the duration of the action.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Forming the Present Perfect Continuous:</h3>
    <p class="mb-4">
        <strong class="font-bold">Subject + have/has been + Verb (-ing)</strong>
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Use <strong class="font-bold">have been</strong> for I, you, we, they, and plural nouns.</li>
        <li>Use <strong class="font-bold">has been</strong> for he, she, it, and singular nouns.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Uses of the Present Perfect Continuous:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Actions continuing from the past until now:</strong> Often used with 'for' (duration) or 'since' (starting point).
            <ul class="list-disc pl-5 space-y-2">
                <li>I <strong class="font-bold">have been studying</strong> for three hours. (Started three hours ago and is still studying)</li>
                <li>They <strong class="font-bold">have been living</strong> here since 2010. (Started living here in 2010 and still live here)</li>
            </ul>
        </li>
        <li><strong class="font-bold">Actions that have recently stopped, but have a visible result in the present:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>Your eyes are red. <strong class="font-bold">Have you been crying</strong>? (The crying recently stopped, and the red eyes are the result)</li>
                <li>The ground is wet. It <strong class="font-bold">has been raining</strong>. (The rain recently stopped, and the wet ground is the result)</li>
            </ul>
        </li>
         <li><strong class="font-bold">Emphasizing the duration of an action:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>She <strong class="font-bold">has been talking</strong> on the phone all morning! (Emphasizes the length of time)</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Important Note:</h3>
    <p class="mb-4">
        Stative verbs (like know, believe, understand, like, love, hate, seem, be, have) are not usually used in continuous tenses. Use the Present Perfect Simple instead.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Incorrect: I have been knowing him for a year.</li>
        <li>Correct: I <strong class="font-bold">have known</strong> him for a year.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        The Present Perfect Continuous helps to show that an action is ongoing or has just finished with present relevance, often focusing on how long it has been happening.
     </p>
</div>
`;

const lessonB2_4 = await addLesson(
    'Grammar', // lesson_type
    'Present Perfect Continuous Tense', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the Present Perfect Continuous tense, used for actions starting in the past and continuing now or recently stopped with present results, emphasizing duration.',
        html: presentPerfectContinuousHtml
    },
    5, // lesson_importance (can be adjusted based on your curriculum)
    'B2' // lesson_level
);

console.log('Lesson "Present Perfect Continuous Tense" added:');


        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_4 is the variable holding the result of adding the "Present Perfect Continuous Tense" lesson.

// Question 1
const questionB2_4_q1 = await addQuestion(lessonB2_4.id, 'grammar', {
    question: 'The past participle of which auxiliary verb is used to form the present perfect continuous tense?',
    options: ['Have', 'Be', 'Can', 'Do'],
    correctAnswer: 'Be' // Based on Quiz answers: 1-b
});

// Question 2
const questionB2_4_q2 = await addQuestion(lessonB2_4.id, 'grammar', {
    question: 'The main verb of the present continuous tense is in what form?',
    options: ['Present participle', 'Past participle', 'Continuous participle', 'Future participle'],
    correctAnswer: 'Present participle' // Based on Quiz answers: 2-a
});

// Question 3
const questionB2_4_q3 = await addQuestion(lessonB2_4.id, 'grammar', {
    question: 'Which of the following is something the present perfect continuous tense can be used for? (Choose the answer that is most correct.)',
    options: ['Talking about something that is always the case.', 'Talking about something that finished sometime in the past.', 'Talking about something that began in the past and is still happening.', 'Talking about something that is happening right now.'],
    correctAnswer: 'Talking about something that began in the past and is still happening.' // Based on Quiz answers: 3-c
});

// Question 4
const questionB2_4_q4 = await addQuestion(lessonB2_4.id, 'grammar', {
    question: 'Which of the following sentences uses the present perfect continuous tense?',
    options: ['“I am writing to my sister in New England.”', '“She has spoken to her boss in the hopes of getting a raise.”', '“The train usually arrives at 3 PM, but it was late yesterday.”', '“I have been leaving earlier than usual this week.”', '“He hasn\'t seen the results of the test yet.”'],
    correctAnswer: '“I have been leaving earlier than usual this week.”' // Based on Quiz answers: 4-d
});

console.log('Provided quiz questions added for "Present Perfect Continuous Tense" lesson.');



wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const pastPerfectTenseHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Past Perfect Tense</h2>
    <p class="mb-4">
        The <strong class="font-bold">Past Perfect tense</strong> is used to talk about an action that happened <strong class="font-bold">before another action or a specific point in time in the past</strong>. It helps to clarify the order of events when talking about the past.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Forming the Past Perfect:</h3>
    <p class="mb-4">
        <strong class="font-bold">Subject + had + Past Participle</strong>
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>'Had' is used for all subjects (I, you, he, she, it, we, they, singular/plural nouns).</li>
        <li>The past participle is the third form of the verb (e.g., eaten, gone, played, studied).</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Uses of the Past Perfect:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">To show that one past action happened before another past action:</strong> Use the Past Perfect for the earlier action and the Past Simple for the later action.
            <ul class="list-disc pl-5 space-y-2">
                <li>When I arrived at the cinema, the film <strong class="font-bold">had already started</strong>. (The film started before I arrived)</li>
                <li>She <strong class="font-bold">had finished</strong> her homework before she went out. (Finishing homework happened before going out)</li>
            </ul>
        </li>
        <li><strong class="font-bold">To show that a past action happened before a specific time in the past:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>He <strong class="font-bold">had lived</strong> in London before 2015. (He lived there at some point before that year)</li>
                <li>By the time I woke up, my brother <strong class="font-bold">had already left</strong>. (Leaving happened before the time I woke up)</li>
            </ul>
        </li>
         <li><strong class="font-bold">In Type 3 Conditional sentences (as seen in the Conditional lesson):</strong> To talk about hypothetical situations in the past.
             <ul class="list-disc pl-5 space-y-2">
                <li>If I <strong class="font-bold">had studied</strong> harder, I would have passed.</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Time Expressions Used with Past Perfect:</h3>
    <p class="mb-2">
        Common time expressions include already, just, never, before, by the time, until.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>The train <strong class="font-bold">had just left</strong> when I got to the station.</li>
        <li>I <strong class="font-bold">had never seen</strong> such a beautiful place before I visited Paris.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        The Past Perfect is essential for sequencing past events clearly.
     </p>
</div>
`;

const lessonB2_5 = await addLesson(
    'Grammar', // lesson_type
    'Past Perfect Tense', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the Past Perfect tense, used to describe an action that happened before another past action or time.',
        html: pastPerfectTenseHtml
    },
    5, // lesson_importance (can be adjusted based on your curriculum)
    'B2' // lesson_level
);

console.log('Lesson "Past Perfect Tense" added:');

// Assuming addQuestion is an async function that interacts with your database
// and lessonB2_5 is the variable holding the result of adding the "Past Perfect Tense" lesson.

// Question 1
const questionB2_5_q1 = await addQuestion(lessonB2_5.id, 'grammar', {
    question: 'We use the past tense of which auxiliary verb to form the past perfect?',
    options: ['be', 'will', 'have', 'do'],
    correctAnswer: 'have' // Based on Quiz answers: 1-c
});

// Question 2
const questionB2_5_q2 = await addQuestion(lessonB2_5.id, 'grammar', {
    question: 'Which of the following is not something we use the past perfect tense to describe?',
    options: ['An action or event before a specific point in time', 'An action in the past that was happening until recently', 'An action or event before another action or event', 'A hypothetical situation in the past that might have led to a different outcome'],
    correctAnswer: 'An action in the past that was happening until recently' // Based on Quiz answers: 2-b
});

// Question 3
const questionB2_5_q3 = await addQuestion(lessonB2_5.id, 'grammar', {
    question: 'Which of the following types of sentences is more likely to be found in literary writing when it is in the past perfect tense?',
    options: ['Negative interrogative', 'Conditional', 'Positive', 'Interrogative'],
    correctAnswer: 'Conditional' // Based on Quiz answers: 3-a
});

// Question 4
const questionB2_5_q4 = await addQuestion(lessonB2_5.id, 'grammar', {
    question: 'Which of the following sentences is in the past perfect tense?',
    options: ['“I had been hitchhiking for miles before someone picked me up.”', '“I have seen some weird things out here on the road.”', '“Unfortunately, I hadn’t eaten before I left home that day.”', '“I felt awful by the time I finally got home.”'],
    correctAnswer: '“Unfortunately, I hadn’t eaten before I left home that day.”' // Based on Quiz answers: 4-c
});

// Question 5
const questionB2_5_q5 = await addQuestion(lessonB2_5.id, 'grammar', {
    question: 'Which of the following is not in the past perfect tense?',
    options: ['“Had she ever been in this bar before today?”', '“He hadn’t seen her when he first came in.”', '“Never before had he met someone so interesting.”', '“He had a strong hope that they would meet again.”'],
    correctAnswer: '“He had a strong hope that they would meet again.”' // Based on Quiz answers: 5-d
});

console.log('Provided quiz questions added for "Past Perfect Tense" lesson.');

wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const pastPerfectContinuousHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Past Perfect Continuous Tense</h2>
    <p class="mb-4">
        The <strong class="font-bold">Past Perfect Continuous tense</strong> (also known as the Past Perfect Progressive tense) is used to indicate that an action started in the past and continued up to another point in the past. It emphasizes the duration of the action before that second past point.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Forming the Past Perfect Continuous:</h3>
    <p class="mb-4">
        <strong class="font-bold">Subject + had been + Verb (-ing)</strong>
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>'Had been' is used for all subjects (I, you, he, she, it, we, they, singular/plural nouns).</li>
        <li>The main verb is in the -ing form (present participle).</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Uses of the Past Perfect Continuous:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">To show the duration of an action that continued up to a specific point or another action in the past:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>She was tired because she <strong class="font-bold">had been working</strong> all day. (The working continued up to the point she was tired)</li>
                <li>By the time he found a job, he <strong class="font-bold">had been looking</strong> for six months. (The looking continued for six months before he found a job)</li>
            </ul>
        </li>
        <li><strong class="font-bold">To show the cause of something in the past:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>The ground was wet because it <strong class="font-bold">had been raining</strong>. (The rain caused the ground to be wet at that past time)</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Time Expressions Used with Past Perfect Continuous:</h3>
    <p class="mb-2">
        Common time expressions include for, since, all day/week/year, how long.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>They <strong class="font-bold">had been waiting</strong> for an hour before the bus arrived.</li>
        <li>How long <strong class="font-bold">had you been studying</strong> before you took the test?</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        This tense helps to provide background information by showing how long an action was in progress before another past event.
     </p>
</div>
`;

const lessonB2_6 = await addLesson(
    'Grammar', // lesson_type
    'Past Perfect Continuous Tense', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the Past Perfect Continuous tense, used for actions that started in the past and continued up to another point in the past, emphasizing duration.',
        html: pastPerfectContinuousHtml
    },
    5, // lesson_importance (can be adjusted based on your curriculum)
    'B2' // lesson_level
);

console.log('Lesson "Past Perfect Continuous Tense" added:');


        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_6 is the variable holding the result of adding the "Past Perfect Continuous Tense" lesson.

// Question 1
const questionB2_6_q1 = await addQuestion(lessonB2_6.id, 'grammar', {
    question: 'What form of the main verb is used to create the past perfect continuous tense?',
    options: ['infinitive', 'base form', 'present participle', 'past participle'],
    correctAnswer: 'present participle' // Based on Quiz answers: 1-c
});

// Question 2
const questionB2_6_q2 = await addQuestion(lessonB2_6.id, 'grammar', {
    question: 'Which of the following is a function of the past perfect continuous tense?',
    options: ['To describe how long something had been happening by a specific point in the past', 'To indicate the cause of a past result', 'To indicate a continuous action that began in the past and continues into the future', 'To indicate a continuous action that finished in the present', 'A & B', 'B & C', 'C & D'],
    correctAnswer: 'A & B' // Based on Quiz answers: 2-e (assuming 'A & B' corresponds to option 'e')
});

// Question 3
const questionB2_6_q3 = await addQuestion(lessonB2_6.id, 'grammar', {
    question: 'Where does not appear in a negative sentence in the past perfect continuous tense?',
    options: ['After the subject', 'After had', 'After been', 'After the present participle of the main verb'],
    correctAnswer: 'After had' // Based on Quiz answers: 3-b
});

// Question 4
const questionB2_6_q4 = await addQuestion(lessonB2_6.id, 'grammar', {
    question: 'Which of the following uses the past perfect continuous tense to form a conditional sentence?',
    options: ['“Had you been waiting for long before your brother arrived?”', '“I hadn’t been studying for more than an hour when they closed the library.”', '“Had we been digging just a few feet from here, we would have hit a gas line.”', '“He had been living in Rome for eight years, so he spoke perfect Italian.”'],
    correctAnswer: '“Had we been digging just a few feet from here, we would have hit a gas line.”' // Based on Quiz answers: 4-c
});

// Question 5
const questionB2_6_q5 = await addQuestion(lessonB2_6.id, 'grammar', {
    question: 'Which of the following types of verbs cannot be used in the past perfect continuous tense?',
    options: ['action verbs', 'stative verbs', 'factitive verbs', 'conditional verbs', 'A & B', 'B & C', 'C & D'],
    correctAnswer: 'stative verbs' // Based on Quiz answers: 5-b
});

console.log('Provided quiz questions added for "Past Perfect Continuous Tense" lesson.');




wait(1000);


// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const futurePerfectTenseHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Future Perfect Tense</h2>
    <p class="mb-4">
        The <strong class="font-bold">Future Perfect tense</strong> is used to talk about an action that will be completed <strong class="font-bold">before a specific point in the future</strong>. It looks back at a future event from an even later point in the future.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Forming the Future Perfect:</h3>
    <p class="mb-4">
        <strong class="font-bold">Subject + will have + Past Participle</strong>
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>'Will have' is used for all subjects.</li>
        <li>The main verb is in the past participle form.</li>
        <li>You can also use 'be going to have' + Past Participle, especially in more informal contexts.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Uses of the Future Perfect:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">To indicate an action that will be finished before a certain time in the future:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>By 8 PM tonight, I <strong class="font-bold">will have finished</strong> my homework. (The homework will be done before 8 PM)</li>
                <li>She <strong class="font-bold">will have left</strong> by the time we arrive. (Her leaving will be complete before our arrival)</li>
            </ul>
        </li>
        <li><strong class="font-bold">To express a prediction or assumption about something that happened in the past (less common at B2, but possible):</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>He <strong class="font-bold">will have arrived</strong> by now. (Assuming he arrived sometime before now)</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Time Expressions Used with Future Perfect:</h3>
    <p class="mb-2">
        Common time expressions include by, by the time, before.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>We <strong class="font-bold">will have been married</strong> for 20 years next month.</li>
        <li>By the end of the year, she <strong class="font-bold">will have saved</strong> enough money for a car.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        The Future Perfect helps to project into the future and look back at actions that will be completed by a certain point.
     </p>
</div>
`;

const lessonB2_7 = await addLesson(
    'Grammar', // lesson_type
    'Future Perfect Tense', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the Future Perfect tense, used to describe an action that will be completed before a specific point in the future.',
        html: futurePerfectTenseHtml
    },
    5, // lesson_importance (can be adjusted based on your curriculum)
    'B2' // lesson_level
);

console.log('Lesson "Future Perfect Tense" added:');

// Assuming addQuestion is an async function that interacts with your database
// and lessonB2_7 is the variable holding the result of adding the "Future Perfect Tense" lesson.

// Question 1
const questionB2_7_q1 = await addQuestion(lessonB2_7.id, 'grammar', {
    question: 'Which of the following modal auxiliary verbs is used to create the future perfect tense?',
    options: ['would', 'may', 'will', 'can'],
    correctAnswer: 'will' // Based on Quiz answers: 1-c
});

// Question 2
const questionB2_7_q2 = await addQuestion(lessonB2_7.id, 'grammar', {
    question: 'Which of the following is not a function of the future perfect tense?',
    options: ['To say that something will be completed or achieved at a specific point in the future', 'To indicate how long something will have been occurring by a specific point in the future', 'To make a present prediction about something that happened in the past', 'To indicate a continuous action that began at a specific point in the future'],
    correctAnswer: 'To indicate a continuous action that began at a specific point in the future' // Based on Quiz answers: 2-d
});

// Question 3
const questionB2_7_q3 = await addQuestion(lessonB2_7.id, 'grammar', {
    question: 'How does the structure of the future perfect tense change in an interrogative sentence?',
    options: ['will inverts with the subject', 'have inverts with the subject', 'will inverts with a question word', 'have inverts with a question word'],
    correctAnswer: 'will inverts with the subject' // Based on Quiz answers: 3-a
});

// Question 4
const questionB2_7_q4 = await addQuestion(lessonB2_7.id, 'grammar', {
    question: 'For what purpose can we use shall instead of will to form the future perfect tense?',
    options: ['To make the sentence a question', 'To make the sentence more formal', 'To make a present prediction about something that happened in the past', 'To indicate an intention to do something in the future'],
    correctAnswer: 'To make the sentence more formal' // Based on Quiz answers: 4-b
});

// Question 5
const questionB2_7_q5 = await addQuestion(lessonB2_7.id, 'grammar', {
    question: 'When are we not able to use be going to instead of will to form the future perfect tense?',
    options: ['When saying that something will be completed or achieved at a specific point in the future', 'When indicating how long something will have occurred by a specific point in the future', 'When making a present prediction about something that happened in the past'],
    correctAnswer: 'When making a present prediction about something that happened in the past' // Based on Quiz answers: 5-c
});

console.log('Provided quiz questions added for "Future Perfect Tense" lesson.');



wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const futurePerfectContinuousHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Future Perfect Continuous Tense</h2>
    <p class="mb-4">
        The <strong class="font-bold">Future Perfect Continuous tense</strong> (also known as the Future Perfect Progressive tense) is used to talk about an action that will be ongoing up to a specific point in the future, emphasizing the duration of that action.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Forming the Future Perfect Continuous:</h3>
    <p class="mb-4">
        <strong class="font-bold">Subject + will have been + Verb (-ing)</strong>
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>'Will have been' is used for all subjects.</li>
        <li>The main verb is in the -ing form (present participle).</li>
        <li>You can also use 'be going to have been' + Verb (-ing), especially in more informal contexts.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Uses of the Future Perfect Continuous:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">To show the duration of an action that will continue up to a specific point in the future:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>By 5 PM, I <strong class="font-bold">will have been working</strong> for eight hours. (At 5 PM, the action of working will have been ongoing for a total of eight hours)</li>
                <li>Next month, they <strong class="font-bold">will have been living</strong> here for ten years. (At the point next month, their living here will have lasted for ten years)</li>
            </ul>
        </li>
        <li><strong class="font-bold">To show the cause of a future situation:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>He will be tired because he <strong class="font-bold">will have been exercising</strong> all morning. (The exercising will be the reason for his tiredness at that future point)</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Time Expressions Used with Future Perfect Continuous:</h3>
    <p class="mb-2">
        Common time expressions include for, by, by the time, before.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>By the end of the week, she <strong class="font-bold">will have been studying</strong> for a month.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        This tense is used to emphasize the length of time an action will have been in progress up to a future point.
     </p>
</div>
`;

const lessonB2_8 = await addLesson(
    'Grammar', // lesson_type
    'Future Perfect Continuous Tense', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the Future Perfect Continuous tense, used to describe an action that will be ongoing up to a specific point in the future, emphasizing duration.',
        html: futurePerfectContinuousHtml
    },
    5, // lesson_importance (can be adjusted based on your curriculum)
    'B2' // lesson_level
);

console.log('Lesson "Future Perfect Continuous Tense" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_8 is the variable holding the result of adding the "Future Perfect Continuous Tense" lesson.

// Question 1
const questionB2_8_q1 = await addQuestion(lessonB2_8.id, 'grammar', {
    question: 'What form of the main verb is used to create the future perfect continuous tense?',
    options: ['infinitive', 'base form', 'present participle', 'past participle'],
    correctAnswer: 'present participle' // Based on Quiz answers: 1-c
});

// Question 2
const questionB2_8_q2 = await addQuestion(lessonB2_8.id, 'grammar', {
    question: 'Which of the following is a function of the future perfect continuous tense?',
    options: ['To indicate how long something will have been occurring by a specific point in the future', 'To indicate the cause of a future result', 'To make a present prediction about something that happened in the past', 'To indicate a continuous action that began at a specific point in the future', 'A & B', 'B & C', 'C & D'],
    correctAnswer: 'A & B' // Based on Quiz answers: 2-e (assuming 'A & B' corresponds to option 'e')
});

// Question 3
const questionB2_8_q3 = await addQuestion(lessonB2_8.id, 'grammar', {
    question: 'Where does not appear in a negative sentence in the future perfect continuous tense?',
    options: ['After will', 'After have', 'After been', 'After the present participle of the main verb'],
    correctAnswer: 'After will' // Based on Quiz answers: 3-a
});

// Question 4
const questionB2_8_q4 = await addQuestion(lessonB2_8.id, 'grammar', {
    question: 'Which of the following is the most common way to form the future perfect continuous tense?',
    options: ['be going to have been + the present participle of the main verb', 'will have been + the present participle of the main verb', 'shall have been + the present participle of the main verb', 'Each is equally common'],
    correctAnswer: 'will have been + the present participle of the main verb' // Based on Quiz answers: 4-b
});

// Question 5
const questionB2_8_q5 = await addQuestion(lessonB2_8.id, 'grammar', {
    question: 'Which type of verb cannot be used in the future perfect continuous tense?',
    options: ['action verb', 'factitive verb', 'conditional verb', 'stative verb', 'A & B', 'B & C', 'C & D'],
    correctAnswer: 'stative verb' // Based on Quiz answers: 5-d
});

console.log('Provided quiz questions added for "Future Perfect Continuous Tense" lesson.');



wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const aspectHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Aspect</h2>
    <p class="mb-4">
        In grammar, <strong class="font-bold">aspect</strong> refers to how a verb's action or state is viewed in relation to time. While tense tells us *when* an action happens (past, present, future), aspect tells us about the *nature* of the action's duration, completion, or frequency. It describes the "flow" of the action.
    </p>
    <p class="mb-4">
        The two main types of aspect in English are <strong class="font-bold">perfective aspect</strong> and <strong class="font-bold">imperfective aspect</strong>.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Tense vs. Aspect:</h3>
    <p class="mb-2">
        It's important to distinguish between tense and aspect.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Tense:</strong> Location of an event in time (past, present, future).</li>
        <li><strong class="font-bold">Aspect:</strong> How the event unfolds over time (completed, ongoing, repeated).</li>
    </ul>
     <p class="mb-4 mt-4">Example:</p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>"I <strong class="font-bold">ate</strong> dinner." (Past tense, Perfective aspect - action is completed)</li>
        <li>"I <strong class="font-bold">was eating</strong> dinner." (Past tense, Imperfective aspect - action was ongoing)</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">How Aspect is Shown in English:</h3>
    <p class="mb-2">
        Aspect is often shown through the use of auxiliary verbs and verb endings.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Perfective Aspect:</strong> Uses forms of 'have' + past participle (e.g., have eaten, had finished, will have arrived).</li>
        <li><strong class="font-bold">Imperfective Aspect:</strong> Uses forms of 'be' + present participle (-ing) (e.g., am eating, was walking, will be studying). This includes continuous/progressive tenses.</li>
        <li>The simple tenses (Present Simple, Past Simple) can show either perfective or imperfective aspect depending on the context and verb type.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Understanding aspect helps you to use verb tenses more accurately to describe how actions unfold over time.
     </p>
</div>
`;

const lessonB2_9 = await addLesson(
    'Grammar', // lesson_type
    'Aspect', // lesson_title
    { // lesson_content JSON
        description: 'This lesson introduces the concept of aspect in grammar, distinguishing it from tense and explaining how it describes the duration, completion, or frequency of an action.',
        html: aspectHtml
    },
    4, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Aspect" added:');

// Assuming addQuestion is an async function that interacts with your database
// and lessonB2_9 is the variable holding the result of adding the "Aspect" lesson.

// Question 1
const questionB2_9_q1 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'In grammar, aspect is concerned with ________ .',
    options: ['when events occur on a timeline', 'how events occur on a timeline', 'why events occur on a timeline'],
    correctAnswer: 'how events occur on a timeline' // Based on Quiz answers: 1-b
});

// Question 2
const questionB2_9_q2 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'The perfective aspect is used when we view an action as ________.',
    options: ['a whole', 'a part', 'a continuous event', 'a habitual event'],
    correctAnswer: 'a whole' // Based on Quiz answers: 2-a
});

// Question 3
const questionB2_9_q3 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'The imperfective aspect is used when we view an action as ________.',
    options: ['habitual', 'in progress', 'a whole', 'A & B', 'all of the above'],
    correctAnswer: 'A & B' // Based on Quiz answers: 3-d
});

// Question 4
const questionB2_9_q4 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'Which of the following sentences conveys the continuous aspect?',
    options: ['“I went to the doctor on Tuesday.”', '“She’s going to take me on a vacation.”', '“They’ve been watching that TV all day.”', '“We haven’t seen that movie yet.”'],
    correctAnswer: '“They’ve been watching that TV all day.”' // Based on Quiz answers: 4-c
});

// Question 5
const questionB2_9_q5 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'Which of the following sentences uses the perfect aspect?”',
    options: ['“I was reading.”', '“He went home.”', '“She is eating.”', '“They have gone home.”'],
    correctAnswer: '“They have gone home.”' // Based on Quiz answers: 5-d
});

console.log('Provided quiz questions added for "Aspect" lesson.');

        


wait(1000);


// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const perfectiveImperfectiveAspectHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Perfective and Imperfective Aspect</h2>
    <p class="mb-4">
        Building on the introduction to aspect, we will now look at the two main types: <strong class="font-bold">perfective aspect</strong> and <strong class="font-bold">imperfective aspect</strong>.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Perfective Aspect:</h3>
    <p class="mb-4">
        <strong class="font-bold">Perfective aspect</strong> views an action or state as a single, completed whole, without focusing on the duration or internal structure of the event. It presents the action as finished.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Often associated with simple tenses and perfect tenses.</li>
        <li>Focuses on the completion or result of the action.</li>
        <li><strong class="font-bold">Examples:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>She <strong class="font-bold">finished</strong> her homework. (Past Simple - action completed)</li>
                <li>I <strong class="font-bold">have eaten</strong> dinner. (Present Perfect - action completed with present relevance)</li>
                <li>They <strong class="font-bold">had left</strong> before I arrived. (Past Perfect - action completed before another past action)</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Imperfective Aspect:</h3>
    <p class="mb-4">
        <strong class="font-bold">Imperfective aspect</strong> views an action or state as ongoing, in progress, habitual, or continuous, without focusing on its beginning or end. It presents the action as unfinished or viewed from within its duration.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Often associated with continuous (progressive) tenses.</li>
        <li>Focuses on the duration, repetition, or ongoing nature of the action.</li>
        <li><strong class="font-bold">Examples:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>She <strong class="font-bold">was finishing</strong> her homework when I called. (Past Continuous - action in progress)</li>
                <li>I <strong class="font-bold">am eating</strong> dinner now. (Present Continuous - action in progress)</li>
                <li>They <strong class="font-bold">have been living</strong> here for years. (Present Perfect Continuous - action continuing)</li>
            </ul>
        </li>
         <li>Simple tenses can also show imperfective aspect for habitual actions: She <strong class="font-bold">eats</strong> breakfast every day. (Present Simple - habitual action)</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Distinguishing between perfective and imperfective aspect helps you choose the correct verb tense to accurately describe how actions unfold in time.
     </p>
</div>
`;

const lessonB2_10 = await addLesson(
    'Grammar', // lesson_type
    'Perfective and Imperfective Aspect', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the two main types of aspect: perfective (completed action) and imperfective (ongoing or habitual action).',
        html: perfectiveImperfectiveAspectHtml
    },
    4, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Perfective and Imperfective Aspect" added:');

// Assuming addQuestion is an async function that interacts with your database
// and lessonB2_9 is the variable holding the result of adding the "Aspect" lesson.

// Question 1
const questionB2_10_q1 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'Which of the following sentences conveys the perfective aspect?',
    options: ['“I have eaten breakfast already.”', '“I’ve been eating breakfast.”', '“I was eating breakfast.”', '“I used to eat breakfast in the late morning.”'],
    correctAnswer: '“I have eaten breakfast already.”' // Based on Quiz answers: 1-b (assuming '“I have eaten breakfast already.”' corresponds to option 'a')
});

// Question 2
const questionB2_10_q2 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'Which of the following sentences conveys the imperfective aspect?',
    options: ['“He finished his homework.”', '“He had already finished his homework.”', '“He will finish his homework later.”', '“He’s finishing his homework.”'],
    correctAnswer: '“He’s finishing his homework.”' // Based on Quiz answers: 2-a (assuming '“He’s finishing his homework.”' corresponds to option 'd')
});

// Question 3
const questionB2_10_q3 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'Which of the following sentences conveys the habitual aspect?',
    options: ['“I attended a ballet lesson.”', '“I want to attend ballet lessons.”', '“I used to attend ballet lessons.”', '“I will attend a ballet lesson.”'],
    correctAnswer: '“I used to attend ballet lessons.”' // Based on Quiz answers: 3-d (assuming '“I used to attend ballet lessons.”' corresponds to option 'c')
});

// Question 4
const questionB2_10_q4 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'Which of the following sentences uses the continuous aspect?',
    options: ['“I used to watch a lot of TV.”', '“I watched a lot of TV yesterday.”', '“I will watch TV later.”', '“I’ve been watching a lot of TV.”'],
    correctAnswer: '“I’ve been watching a lot of TV.”' // Based on Quiz answers: 4-c
});

// Question 5
const questionB2_10_q5 = await addQuestion(lessonB2_9.id, 'grammar', {
    question: 'Which of the following sentences is incorrect?',
    options: ['“I used to like sweets when I was little, but now I don’t.”', '“I liked sweets when I was little, but now I don’t.”', '“I would like sweets when I was little, but now I don’t.”', 'A & C'],
    correctAnswer: 'A & C' // Based on Quiz answers: 5-d (assuming 'A & C' corresponds to option 'd')
});

console.log('Provided quiz questions added for "Aspect" lesson.');



wait(1000);




// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const moodIntroductionHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Mood (Introduction)</h2>
    <p class="mb-4">
        In grammar, <strong class="font-bold">mood</strong> refers to the form of a verb that indicates the speaker's attitude toward what is being said (e.g., whether it is a statement of fact, a command, a wish, or a hypothetical situation). Mood is different from tense and aspect.
    </p>
    <p class="mb-4">
        The three main moods in English are the <strong class="font-bold">indicative mood</strong>, the <strong class="font-bold">imperative mood</strong>, and the <strong class="font-bold">subjunctive mood</strong>. At the B2 level, we will focus primarily on the indicative mood and introduce the concept of mood.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">The Function of Mood:</h3>
    <p class="mb-4">
        Mood helps to convey the purpose or function of a clause or sentence.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Indicative Mood:</strong> Used for statements of fact or questions about facts. (Most common mood)</li>
        <li><strong class="font-bold">Imperative Mood:</strong> Used for commands or requests.</li>
        <li><strong class="font-bold">Subjunctive Mood:</strong> Used for hypothetical situations, wishes, suggestions, or demands (less common in modern English, especially at lower levels).</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Examples of Different Moods:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Indicative:</strong> The sun <strong class="font-bold">is</strong> shining. <strong class="font-bold">Is</strong> the sun shining?</li>
        <li><strong class="font-bold">Imperative:</strong> <strong class="font-bold">Close</strong> the door. <strong class="font-bold">Please sit</strong> down.</li>
        <li><strong class="font-bold">Subjunctive:</strong> I wish I <strong class="font-bold">were</strong> taller. (Used 'were' instead of 'was' for a hypothetical wish)</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Understanding mood helps you to express your attitude or intention more precisely in your sentences.
     </p>
</div>
`;

const lessonB2_11 = await addLesson(
    'Grammar', // lesson_type
    'Mood (Introduction)', // lesson_title
    { // lesson_content JSON
        description: 'This lesson introduces the concept of mood in grammar and the three main moods: indicative, imperative, and subjunctive.',
        html: moodIntroductionHtml
    },
    4, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Mood (Introduction)" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_11 is the variable holding the result of adding the "Mood (Introduction)" lesson.

// Question 1
const questionB2_11_q1 = await addQuestion(lessonB2_11.id, 'grammar', {
    question: 'Which of the following moods is used to describe what is true or real?',
    options: ['Indicative mood', 'Subjunctive mood', 'Imperative mood', 'A & C', 'B & C'],
    correctAnswer: 'Indicative mood' // Based on Quiz answers: 1-a
});

// Question 2
const questionB2_11_q2 = await addQuestion(lessonB2_11.id, 'grammar', {
    question: 'Which of the following moods is used to describe what is unreal, hypothetical, or desired?',
    options: ['Indicative mood', 'Subjunctive mood', 'Imperative mood', 'A & C', 'B & C'],
    correctAnswer: 'Subjunctive mood' // Based on Quiz answers: 2-e (assuming this corresponds to option 'b')
});

// Question 3
const questionB2_11_q3 = await addQuestion(lessonB2_11.id, 'grammar', {
    question: 'Which of the following kinds of sentences can be made using the indicative mood?',
    options: ['Declarative sentences', 'Conditional sentences', 'Interrogative sentences', 'Imperative sentences', 'A & C', 'B & D'],
    correctAnswer: 'A & C' // Based on Quiz answers: 3-e (assuming 'A & C' corresponds to option 'e')
});

// Question 4
const questionB2_11_q4 = await addQuestion(lessonB2_11.id, 'grammar', {
    question: 'Identify the grammatical mood used in the following sentence:\n“I wish I were in Spain right now, instead of at home.”',
    options: ['Indicative mood', 'Subjunctive mood', 'Imperative mood', 'Emphatic mood'],
    correctAnswer: 'Subjunctive mood' // Based on Quiz answers: 4-b
});

// Question 5
const questionB2_11_q5 = await addQuestion(lessonB2_11.id, 'grammar', {
    question: 'Which of the following is not one of the true grammatical moods?',
    options: ['Indicative mood', 'Subjunctive mood', 'Imperative mood', 'Emphatic mood', 'Infinitive mood', 'A & B', 'C & E', 'D & E'],
    correctAnswer: 'D & E' // Based on Quiz answers: 5-h (assuming 'D & E' corresponds to option 'h')
});

console.log('Provided quiz questions added for "Mood (Introduction)" lesson.');


wait(1000);

// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const indicativeMoodHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Indicative Mood</h2>
    <p class="mb-4">
        The <strong class="font-bold">indicative mood</strong> is the most common mood in English. It is used to express statements of fact, opinions, and questions about facts. It describes things that the speaker considers to be real or true.
    </p>
    <p class="mb-4">
        Most sentences you encounter and create will be in the indicative mood.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Uses of the Indicative Mood:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Making Statements of Fact:</strong>
            <ul class="list-disc pl-5 space-y-2">
                <li>The sky <strong class="font-bold">is</strong> blue.</li>
                <li>Birds <strong class="font-bold">fly</strong>.</li>
                <li>She <strong class="font-bold">lives</strong> in London.</li>
            </ul>
        </li>
        <li><strong class="font-bold">Expressing Opinions:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li>I <strong class="font-bold">think</strong> it's a good idea.</li>
                <li>He <strong class="font-bold">believes</strong> she is right.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Asking Questions about Facts:</strong>
             <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">Is</strong> the sky blue?</li>
                <li><strong class="font-bold">Do</strong> birds fly?</li>
                <li><strong class="font-bold">Does</strong> she live in London?</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Verb Forms in the Indicative Mood:</h3>
    <p class="mb-4">
        Verbs in the indicative mood follow the standard conjugation patterns for different tenses (present, past, future, perfect, continuous, etc.).
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>She <strong class="font-bold">walks</strong> every day. (Present Simple)</li>
        <li>They <strong class="font-bold">visited</strong> Paris last year. (Past Simple)</li>
        <li>We <strong class="font-bold">will travel</strong> tomorrow. (Future Simple)</li>
        <li>I <strong class="font-bold">have finished</strong> my work. (Present Perfect)</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        The indicative mood is your primary tool for communicating factual information and asking direct questions.
     </p>
</div>
`;

const lessonB2_12 = await addLesson(
    'Grammar', // lesson_type
    'Indicative Mood', // lesson_title
    { // lesson_content JSON
        description: 'This lesson focuses on the indicative mood, used for statements of fact, opinions, and questions about facts.',
        html: indicativeMoodHtml
    },
    4, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Indicative Mood" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_12 is the variable holding the result of adding the "Indicative Mood" lesson.

// Question 1
const questionB2_12_q1 = await addQuestion(lessonB2_12.id, 'grammar', {
    question: 'The indicative mood can be used to express which of the following?',
    options: ['statements', 'opinions', 'questions', 'facts', 'All of the above'],
    correctAnswer: 'All of the above' // Based on Quiz answers: 1-e
});

// Question 2
const questionB2_12_q2 = await addQuestion(lessonB2_12.id, 'grammar', {
    question: 'Which of the following sentences uses the past indicative?',
    options: ['“Jude is preparing breakfast for the guests.”', '“Have you ever been to Egypt?”', '“The child was complaining about her missing toy.”', '“I won’t be able to take time off from work.”'],
    correctAnswer: '“The child was complaining about her missing toy.”' // Based on Quiz answers: 2-c
});

// Question 3
const questionB2_12_q3 = await addQuestion(lessonB2_12.id, 'grammar', {
    question: 'Which of the following sentences uses the present indicative?',
    options: ['“She’ll be busy at summer camp from June to August.”', '“He usually goes for a jog in the afternoon.”', '“Were you at the movie theater last night?”', '“The two best friends hadn’t seen each other in years.”'],
    correctAnswer: '“He usually goes for a jog in the afternoon.”' // Based on Quiz answers: 3-b
});

// Question 4
const questionB2_12_q4 = await addQuestion(lessonB2_12.id, 'grammar', {
    question: 'Which of the following sentences uses the future indicative?',
    options: ['“Casey suffers from terrible migraines.”', '“They spent all day yesterday exploring the museum.”', '“Is he going to attend college or take a year off?”', '“What country are you moving to with your family?”'],
    correctAnswer: '“Is he going to attend college or take a year off?”' // Based on Quiz answers: 4-c
});

console.log('Provided quiz questions added for "Indicative Mood" lesson.');


wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const voiceIntroductionHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Voice (Introduction)</h2>
    <p class="mb-4">
        In grammar, <strong class="font-bold">voice</strong> refers to the relationship between the verb and the subject of a sentence. It indicates whether the subject performs the action (active voice) or receives the action (passive voice).
    </p>
    <p class="mb-4">
        Understanding voice helps you to structure your sentences effectively and choose the best way to express an idea depending on what you want to emphasize. The two main voices in English are the <strong class="font-bold">active voice</strong> and the <strong class="font-bold">passive voice</strong>.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Active Voice:</h3>
    <p class="mb-2">
        In the active voice, the subject of the sentence performs the action of the verb. The focus is on the doer of the action.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Structure:</strong> Subject + Verb + Object (optional)</li>
        <li><strong class="font-bold">Example:</strong> The dog <strong class="font-bold">chased</strong> the ball. (The subject 'dog' performs the action 'chased')</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Passive Voice:</h3>
    <p class="mb-2">
        In the passive voice, the subject of the sentence receives the action of the verb. The focus is on the action and the receiver of the action, rather than the doer.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Structure:</strong> Subject (receiver) + form of 'be' + Past Participle + by + Agent (doer - optional)</li>
        <li><strong class="font-bold">Example:</strong> The ball <strong class="font-bold">was chased</strong> by the dog. (The subject 'ball' receives the action 'chased')</li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Why Use Different Voices?</h3>
    <p class="mb-4">
        We choose between active and passive voice depending on what we want to emphasize or if the doer of the action is unknown or unimportant.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Use active voice for clear, direct sentences where the doer is important.</li>
        <li>Use passive voice when the action or the receiver of the action is more important than the doer, or when the doer is unknown.</li>
        <li>In scientific or technical writing, where the process or result is often more important than the person who performed the action.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Active voice is generally more common and direct, while passive voice has specific uses in certain contexts.
     </p>
</div>
`;

const lessonB2_13 = await addLesson(
    'Grammar', // lesson_type
    'Voice (Introduction)', // lesson_title
    { // lesson_content JSON
        description: 'This lesson introduces the concept of voice in grammar and the difference between active and passive voice.',
        html: voiceIntroductionHtml
    },
    4, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Voice (Introduction)" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_13 is the variable holding the result of adding the "Voice (Introduction)" lesson.

// Question 1
const questionB2_13_q1 = await addQuestion(lessonB2_13.id, 'grammar', {
    question: 'Which of the following voices is typically regarded as the default voice?',
    options: ['passive voice', 'active voice', '“middle” voice', 'none of the above'],
    correctAnswer: 'active voice' // Based on Quiz answers: 1-b
});

// Question 2
const questionB2_13_q2 = await addQuestion(lessonB2_13.id, 'grammar', {
    question: 'Which of the following choices contains the correct word order for an activevoice sentence?',
    options: ['agent – verb – object', 'verb – agent – object', 'agent – verb – reflexive pronoun', 'subject – verb – prepositional phrase'],
    correctAnswer: 'agent – verb – object' // Based on Quiz answers: 2-a (Assuming 'agent' refers to the subject/doer in this context)
});

// Question 3
const questionB2_13_q3 = await addQuestion(lessonB2_13.id, 'grammar', {
    question: 'Which of the following choices contains the correct word order for a passivevoice sentence?',
    options: ['agent – verb – object', 'verb – agent – object', 'agent – verb – reflexive pronoun', 'subject – verb – prepositional phrase'],
    correctAnswer: 'subject – verb – prepositional phrase' // Based on Quiz answers: 3-d
});

// Question 4
const questionB2_13_q4 = await addQuestion(lessonB2_13.id, 'grammar', {
    question: 'Which of the following sentences uses the “middle” voice?',
    options: ['“Her parents had chosen the school she would attend.”', '“I was blinded by a bright light.”', '“He threw a birthday party for himself.”', '“All of our food burned.”'],
    correctAnswer: '“All of our food burned.”' // Based on Quiz answers: 4-d
});

console.log('Provided quiz questions added for "Voice (Introduction)" lesson.');


wait(1000);




// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const activeVoiceHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Active Voice</h2>
    <p class="mb-4">
        The <strong class="font-bold">active voice</strong> is the most common and direct voice in English. In a sentence written in the active voice, the subject performs the action expressed by the verb. The focus is clearly on who or what is doing the action.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Structure of Active Voice:</h3>
    <p class="mb-4">
        The basic structure of an active voice sentence is: <strong class="font-bold">Subject + Verb + Object (optional)</strong>
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>The subject is the doer of the action.</li>
        <li>The verb is the action being performed.</li>
        <li>The object is the receiver of the action (if there is one).</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Examples of Active Voice:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Birds sing</strong>. (Subject: Birds, Verb: sing - no object needed)</li>
        <li><strong class="font-bold">She reads</strong> a book. (Subject: She, Verb: reads, Object: a book)</li>
        <li><strong class="font-bold">The students finished</strong> the project. (Subject: The students, Verb: finished, Object: the project)</li>
        <li><strong class="font-bold">He wrote</strong> a letter yesterday. (Subject: He, Verb: wrote, Object: a letter, Adverbial: yesterday)</li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Why Use Active Voice?</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Clarity and Directness:</strong> Active voice sentences are usually clearer, more direct, and easier to understand.</li>
        <li><strong class="font-bold">Conciseness:</strong> They are often more concise than passive voice sentences.</li>
        <li><strong class="font-bold">Emphasis on the Doer:</strong> Use active voice when you want to emphasize who or what is performing the action.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Active voice is the preferred voice in most types of writing and speaking because it is clear and dynamic.
     </p>
</div>
`;

const lessonB2_14 = await addLesson(
    'Grammar', // lesson_type
    'Active Voice', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the active voice, where the subject performs the action, focusing on its structure and uses for clarity and directness.',
        html: activeVoiceHtml
    },
    5, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Active Voice" added:');

// Assuming addQuestion is an async function that interacts with your database
// and lessonB2_14 is the variable holding the result of adding the "Active Voice" lesson.

// Question 1
const questionB2_14_q1 = await addQuestion(lessonB2_14.id, 'grammar', {
    question: 'In the following active-voice sentence, which word is the agent of the verb?\n“Damien built a bookshelf with his own two hands.”',
    options: ['built', 'bookshelf', 'Damien', 'hands'],
    correctAnswer: 'Damien' // Based on Quiz answers: 1-c
});

// Question 2
const questionB2_14_q2 = await addQuestion(lessonB2_14.id, 'grammar', {
    question: 'Which of the following active-voice sentences does not contain a direct object?',
    options: ['“She reads a chapter from her book before bed every night.”', '“Mom already made plans for the weekend.”', '“The tornado caused severe damage to the neighborhood.”', '“Tomorrow night I will be dining with my friends.”'],
    correctAnswer: '“Tomorrow night I will be dining with my friends.”' // Based on Quiz answers: 2-d
});

// Question 3
const questionB2_14_q3 = await addQuestion(lessonB2_14.id, 'grammar', {
    question: 'In which of the following cases should you always use the active voice?',
    options: ['When the agent is known or relevant', 'When the agent is an ongoing topic', 'When there is no direct object', 'A & B', 'B & C', 'All of the above'],
    correctAnswer: 'All of the above' // Based on Quiz answers: 3-f (Assuming 'All of the above' corresponds to option 'f')
});

// Question 4
const questionB2_14_q4 = await addQuestion(lessonB2_14.id, 'grammar', {
    question: 'Which of the following sentences uses the active voice?',
    options: ['“The town was founded over 400 years ago.”', '“The father surprised his children by bringing home a kitten.”', '“Her car has been missing since last week.”', '“I will be visited by my grandfather tomorrow.”'],
    correctAnswer: '“The father surprised his children by bringing home a kitten.”' // Based on Quiz answers: 4-b
});

console.log('Provided quiz questions added for "Active Voice" lesson.');

wait(1000);

        // Assuming addQuestion is an async function that interacts with your database





        // Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const passiveVoiceHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Passive Voice</h2>
    <p class="mb-4">
        In the <strong class="font-bold">passive voice</strong>, the subject of the sentence receives the action of the verb, rather than performing it. The focus is on the action itself or the person/thing that is affected by the action, not necessarily on who or what performed the action.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Forming the Passive Voice:</h3>
    <p class="mb-4">
        The passive voice is formed using a form of the verb <strong class="font-bold">'be'</strong> followed by the <strong class="font-bold">past participle</strong> of the main verb.
    </p>
    <p class="mb-4">
        <strong class="font-bold">Structure:</strong> Subject (receiver of action) + form of 'be' + Past Participle (+ by + Agent/Doer - optional)
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>The form of 'be' changes depending on the tense (is, am, are, was, were, has been, have been, had been, will be, will have been, etc.).</li>
        <li>The past participle is the third form of the verb (e.g., eaten, written, finished).</li>
        <li>The original subject (the doer of the action) can be included in a 'by' phrase, but it is often omitted if unknown or unimportant.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Examples of Passive Voice:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Active: The dog chased the ball. &rarr; Passive: The ball <strong class="font-bold">was chased</strong> (by the dog).</li>
        <li>Active: She wrote a letter. &rarr; Passive: A letter <strong class="font-bold">was written</strong> (by her).</li>
        <li>Active: The students finished the project. &rarr; Passive: The project <strong class="font-bold">was finished</strong> (by the students).</li>
        <li>Active: Someone stole my bike. &rarr; Passive: My bike <strong class="font-bold">was stolen</strong>. (Doer is unknown)</li>
        <li>Active: The company will launch a new product. &rarr; Passive: A new product <strong class="font-bold">will be launched</strong> (by the company).</li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">When to Use Passive Voice:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>When the doer of the action is unknown, unimportant, or obvious from the context.</li>
        <li>When you want to emphasize the action or the receiver of the action.</li>
        <li>In scientific or technical writing, where the process or result is often more important than the person who performed the action.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        While active voice is generally preferred, the passive voice is a useful tool for shifting focus in a sentence.
     </p>
</div>
`;

const lessonB2_15 = await addLesson(
    'Grammar', // lesson_type
    'Passive Voice', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains the passive voice, where the subject receives the action, focusing on its formation and when to use it.',
        html: passiveVoiceHtml
    },
    5, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Passive Voice" added:');

// and lessonB2_15 is the variable holding the result of adding the "Passive Voice" lesson.

// Question 1
const questionB2_15_q1 = await addQuestion(lessonB2_15.id, 'grammar', {
    question: 'In the following passive-voice sentence, which group of words is the receiver of the action?\n“The large monument was erected by the construction crew last spring.”',
    options: ['the large monument', 'was erected', 'by the construction crew', 'last spring'],
    correctAnswer: 'the large monument' // Based on Quiz answers: 1-a
});

// Question 2
const questionB2_15_q2 = await addQuestion(lessonB2_15.id, 'grammar', {
    question: 'Which of the following passive-voice sentences does not contain an agent of the verb?',
    options: ['“The homework assignment was completed last Thursday.”', '“Frank was struck by lightning.”', '“Her poem will be read aloud by her teacher.”', '“This desk was assembled by my aunt.”'],
    correctAnswer: '“The homework assignment was completed last Thursday.”' // Based on Quiz answers: 2-a
});

// Question 3
const questionB2_15_q3 = await addQuestion(lessonB2_15.id, 'grammar', {
    question: 'Which choice correctly converts the following active-voice sentence into the passive voice?\n“You should congratulate your sister on her academic achievement.”',
    options: ['“Your sister should congratulate on her academic achievement.”', '“Your sister should be congratulated on her academic achievement.”', '“Your sister should congratulate on her academic achievement by you.”', '“Your sister on her academic achievement should be congratulated.”'],
    correctAnswer: '“Your sister should be congratulated on her academic achievement.”' // Based on Quiz answers: 3-b
});

// Question 4
const questionB2_15_q4 = await addQuestion(lessonB2_15.id, 'grammar', {
    question: 'In which of the following cases should you use the passive voice?',
    options: ['When softening an authoritative tone', 'When the agent is important', 'When expressing a neutral or professional tone', 'A & B', 'A & C', 'All of the above'],
    correctAnswer: 'A & C' // Based on Quiz answers: 4-e (assuming 'A & C' corresponds to option 'e')
});

// Question 5
const questionB2_15_q5 = await addQuestion(lessonB2_15.id, 'grammar', {
    question: 'Which of the following sentences uses the passive voice?',
    options: ['“You can get to Vienna from Salzburg by train.”', '“The elementary school is by the park.”', '“I learned Korean by watching dramas.”', '“This scarf was crocheted by my friend.”'],
    correctAnswer: '“This scarf was crocheted by my friend.”' // Based on Quiz answers: 5-d
});

console.log('Provided quiz questions added for "Passive Voice" lesson.');

        // Assuming addQuestion is an async function that interacts with your database





wait(1000);






        // Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const reportedSpeechHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Reported Speech (Indirect Speech)</h2>
    <p class="mb-4">
        <strong class="font-bold">Reported speech</strong> (also called indirect speech) is used to tell someone what another person said, without using the exact words. When we report speech, we often need to change the tense of the verbs, pronouns, and time/place expressions.
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Changes in Tense (Backshifting):</h3>
    <p class="mb-4">
        When the reporting verb (e.g., said, told) is in the past tense, the verb tense in the reported clause usually shifts back one step into the past.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Present Simple &rarr; Past Simple
            <ul class="list-disc pl-5 space-y-2">
                <li>Direct: "I <strong class="font-bold">like</strong> pizza."</li>
                <li>Reported: He said he <strong class="font-bold">liked</strong> pizza.</li>
            </ul>
        </li>
        <li>Present Continuous &rarr; Past Continuous
             <ul class="list-disc pl-5 space-y-2">
                <li>Direct: "I <strong class="font-bold">am studying</strong>."</li>
                <li>Reported: She said she <strong class="font-bold">was studying</strong>.</li>
            </ul>
        </li>
         <li>Present Perfect &rarr; Past Perfect
             <ul class="list-disc pl-5 space-y-2">
                <li>Direct: "I <strong class="font-bold">have finished</strong>."</li>
                <li>Reported: He said he <strong class="font-bold">had finished</strong>.</li>
            </ul>
        </li>
         <li>Past Simple &rarr; Past Perfect
             <ul class="list-disc pl-5 space-y-2">
                <li>Direct: "I <strong class="font-bold">went</strong> to the park."</li>
                <li>Reported: She said she <strong class="font-bold">had gone</strong> to the park.</li>
            </ul>
        </li>
         <li>Will &rarr; Would
             <ul class="list-disc pl-5 space-y-2">
                <li>Direct: "I <strong class="font-bold">will help</strong> you."</li>
                <li>Reported: He said he <strong class="font-bold">would help</strong> me.</li>
            </ul>
        </li>
         <li>Can &rarr; Could
             <ul class="list-disc pl-5 space-y-2">
                <li>Direct: "I <strong class="font-bold">can swim</strong>."</li>
                <li>Reported: She said she <strong class="font-bold">could swim</strong>.</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Changes in Pronouns and Possessives:</h3>
    <p class="mb-4">
        Pronouns and possessive adjectives usually change to match the new subject of the sentence.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Direct: "I like <strong class="font-bold">my</strong> new car."</li>
        <li>Reported: He said he liked <strong class="font-bold">his</strong> new car.</li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Changes in Time and Place Expressions:</h3>
    <p class="mb-4">
        Words referring to time and place often change to reflect the shift in perspective.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>now &rarr; then</li>
        <li>today &rarr; that day</li>
        <li>yesterday &rarr; the day before / the previous day</li>
        <li>tomorrow &rarr; the next day / the following day</li>
        <li>here &rarr; there</li>
        <li>this &rarr; that</li>
        <li>these &rarr; those</li>
         <li>Direct: "I will come <strong class="font-bold">tomorrow</strong>."</li>
        <li>Reported: She said she would come <strong class="font-bold">the next day</strong>.</li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Reporting Questions:</h3>
    <p class="mb-4">
        When reporting questions, the word order changes to that of a statement (subject before verb), and question marks are not used. 'If' or 'whether' are used for yes/no questions.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Direct: "Do you like coffee?"</li>
        <li>Reported: He asked <strong class="font-bold">if I liked</strong> coffee.</li>
        <li>Direct: "Where do you live?"</li>
        <li>Reported: She asked <strong class="font-bold">where I lived</strong>.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Reported speech is a key skill for summarizing conversations and conveying information from others.
     </p>
</div>
`;

const lessonB2_16 = await addLesson(
    'Grammar', // lesson_type
    'Reported Speech (Indirect Speech)', // lesson_title
    { // lesson_content JSON
        description: 'This lesson explains reported speech (indirect speech), including tense changes (backshifting), pronoun changes, and reporting questions.',
        html: reportedSpeechHtml
    },
    5, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Reported Speech (Indirect Speech)" added:');

// and lessonB2_16 is the variable holding the result of adding the "Reported Speech (Indirect Speech)" lesson.

// Question 1
const questionB2_16_q1 = await addQuestion(lessonB2_16.id, 'grammar', {
    question: 'What is the conventional rule for the verb tense of speech that we report?',
    options: ['It stays the same as the original tense', 'It shifts back one tense in the past', 'It shifts forward one tense in the future', 'It is always in the past simple tense'],
    correctAnswer: 'It shifts back one tense in the past' // Based on Quiz answers: 1-b
});

// Question 2
const questionB2_16_q2 = await addQuestion(lessonB2_16.id, 'grammar', {
    question: 'What does the reporting verb tell require that the verb say does not?',
    options: ['a direct object', 'a direct subject', 'an indirect object', 'an indirect subject'],
    correctAnswer: 'an indirect object' // Based on Quiz answers: 2-c
});

// Question 3
const questionB2_16_q3 = await addQuestion(lessonB2_16.id, 'grammar', {
    question: 'Which verbs always remain in the same tense when they are reported?',
    options: ['reporting verbs (other than suggest and advise)', 'modal auxiliary verbs (other than can and will)', 'linking verbs (other than seem and feel)', 'action verbs (other than say and go)'],
    correctAnswer: 'modal auxiliary verbs (other than can and will)' // Based on Quiz answers: 3-b
});

// Question 4
const questionB2_16_q4 = await addQuestion(lessonB2_16.id, 'grammar', {
    question: 'Which verb form is uniquely used to reporting commands, requests, and advice?',
    options: ['infinitive', 'past perfect', 'future simple', 'present participle'],
    correctAnswer: 'infinitive' // Based on Quiz answers: 4-a
});

// Question 5
const questionB2_16_q5 = await addQuestion(lessonB2_16.id, 'grammar', {
    question: 'Which of these is not a reporting verb?',
    options: ['advise', 'say', 'suggest', 'speak'],
    correctAnswer: 'speak' // Based on Quiz answers: 5-d
});

// Question 6
const questionB2_16_q6 = await addQuestion(lessonB2_16.id, 'grammar', {
    question: 'Complete the following sentence with the appropriate tense according to conventional grammar rules:\nDirect speech: “I have seen that movie already.”\nReported speech: “He said he ________ that movie already.”',
    options: ['saw', 'has seen', 'had seen', 'having seen'],
    correctAnswer: 'had seen' // Based on Quiz answers: 6-c
});

console.log('Provided quiz questions added for "Reported Speech (Indirect Speech)" lesson.');


wait(1000);




// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const relativeClausesHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Relative Clauses</h2>
    <p class="mb-4">
        A <strong class="font-bold">relative clause</strong> (also called an adjective clause) is a type of dependent clause that functions like an adjective. It modifies a noun or pronoun (called the antecedent) by providing more information about it. Relative clauses usually begin with a relative pronoun (who, whom, whose, which, that) or a relative adverb (where, when, why).
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Relative Pronouns:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Who:</strong> Refers to people (subject or object).</li>
        <li><strong class="font-bold">Whom:</strong> Refers to people (object - more formal).</li>
        <li><strong class="font-bold">Whose:</strong> Shows possession (for people or things).</li>
        <li><strong class="font-bold">Which:</strong> Refers to things or animals.</li>
        <li><strong class="font-bold">That:</strong> Refers to people, things, or animals (can often replace who, whom, or which in defining clauses).</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Relative Adverbs:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Where:</strong> Refers to places.</li>
        <li><strong class="font-bold">When:</strong> Refers to times.</li>
        <li><strong class="font-bold">Why:</strong> Refers to reasons.</li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Types of Relative Clauses:</h3>
    <p class="mb-2">
        There are two main types: defining and non-defining.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Defining Relative Clauses:</strong> Provide essential information needed to identify the noun they modify. They are NOT separated by commas. 'That' can often be used instead of 'who', 'whom', or 'which'.
            <ul class="list-disc pl-5 space-y-2">
                <li>This is the book <strong class="font-bold">that I told you about</strong>. (The clause identifies which specific book)</li>
                <li>He is the man <strong class="font-bold">who lives next door</strong>. (The clause identifies which specific man)</li>
            </ul>
        </li>
        <li><strong class="font-bold">Non-defining Relative Clauses:</strong> Provide extra, non-essential information about the noun. The noun is already clearly identified. They ARE separated by commas. 'That' cannot be used.
             <ul class="list-disc pl-5 space-y-2">
                <li>My brother, <strong class="font-bold">who lives in Canada</strong>, is visiting next week. (My brother is already identified; the clause adds extra info)</li>
                <li>London, <strong class="font-bold">which is the capital of the UK</strong>, is a big city. (London is already identified; the clause adds extra info)</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Omitting the Relative Pronoun:</h3>
    <p class="mb-4">
        In defining relative clauses, the relative pronoun (who, whom, which, that) can be omitted when it is the object of the relative clause.
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>This is the book (that) I told you about. ( 'that' is the object of 'told you about')</li>
        <li>He is the man (whom/that) I saw yesterday. ('whom/that' is the object of 'saw')</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Relative clauses help to combine sentences and add descriptive detail efficiently.
     </p>
</div>
`;

const lessonB2_17 = await addLesson(
    'Grammar', // lesson_type
    'Relative Clauses', // lesson_title
    { // lesson_content JSON
        description: 'This lesson covers relative clauses (adjective clauses), explaining how they modify nouns using relative pronouns and adverbs, and distinguishing between defining and non-defining types.',
        html: relativeClausesHtml
    },
    5, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Relative Clauses" added:');


        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_17 is the variable holding the result of adding the "Relative Clauses" lesson.

// Question 1
const questionB2_17_q1 = await addQuestion(lessonB2_17.id, 'grammar', {
    question: 'Which of the following do relative clauses describe?',
    options: ['verbs', 'nouns', 'adjectives', 'adverbs'],
    correctAnswer: 'nouns' // Based on Quiz answers: 1-b
});

// Question 2
const questionB2_17_q2 = await addQuestion(lessonB2_17.id, 'grammar', {
    question: 'Which of the following is used to introduce a relative clause that is clarifying who or what the sentence is talking about?',
    options: ['relative pronoun', 'relative adverb', 'relative adjective', 'relative determiner'],
    correctAnswer: 'relative pronoun' // Based on Quiz answers: 2-a
});

// Question 3
const questionB2_17_q3 = await addQuestion(lessonB2_17.id, 'grammar', {
    question: 'What punctuation marks are used to separate non-restrictive clauses from the rest of the sentence?',
    options: ['semicolons', 'periods', 'parentheses', 'commas'],
    correctAnswer: 'commas' // Based on Quiz answers: 3-d
});

// Question 4
const questionB2_17_q4 = await addQuestion(lessonB2_17.id, 'grammar', {
    question: 'Choose the most correct relative pronoun or relative adverb to complete the following sentence:\n“The company, _____ was acknowledged for its outstanding environmental efforts, more than doubled its profits over the past year.”',
    options: ['who', 'whom', 'which', 'that'],
    correctAnswer: 'which' // Based on Quiz answers: 4-c
});

console.log('Provided quiz questions added for "Relative Clauses" lesson.');

wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const adverbialClausesHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Adverbial Clauses</h2>
    <p class="mb-4">
        An <strong class="font-bold">adverbial clause</strong> (also called an adverb clause) is a type of dependent clause that functions like an adverb. It modifies a verb, an adjective, or another adverb in the main clause by providing more information about how, when, where, why, under what condition, or to what extent the action or state occurs.
    </p>
    <p class="mb-4">
        Adverbial clauses begin with a subordinating conjunction (e.g., because, although, while, if, when, where, so that).
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Types of Adverbial Clauses (by meaning):</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Time:</strong> Tell *when* something happens (begin with when, while, as, before, after, until, since, as soon as).
            <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">When I finish work</strong>, I will go home.</li>
                <li>She listened <strong class="font-bold">while he was talking</strong>.</li>
            </ul>
        </li>
        <li><strong class="font-bold">Place:</strong> Tell *where* something happens (begin with where, wherever).
             <ul class="list-disc pl-5 space-y-2">
                <li>You can sit <strong class="font-bold">wherever you like</strong>.</li>
                <li>They followed him <strong class="font-bold">wherever he went</strong>.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Manner:</strong> Tell *how* something happens (begin with as, like, the way).
             <ul class="list-disc pl-5 space-y-2">
                <li>Do as I say. / Do <strong class="font-bold">as I say</strong>.</li>
                <li>He sings <strong class="font-bold">like a professional singer does</strong>.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Reason/Cause:</strong> Tell *why* something happens (begin with because, since, as).
             <ul class="list-disc pl-5 space-y-2">
                <li>I am happy <strong class="font-bold">because you are here</strong>.</li>
                <li><strong class="font-bold">Since it's raining</strong>, we will stay inside.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Purpose:</strong> Tell *why* something is done (begin with so that, in order that).
             <ul class="list-disc pl-5 space-y-2">
                <li>He studies hard <strong class="font-bold">so that he can pass the exam</strong>.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Result:</strong> Show the result of the main clause (begin with so...that, such...that).
             <ul class="list-disc pl-5 space-y-2">
                <li>It was <strong class="font-bold">so hot that we couldn't go out</strong>.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Condition:</strong> State the condition for the main clause to be true (begin with if, unless, provided that, as long as).
             <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">If you study hard</strong>, you will pass.</li>
                <li>You won't succeed <strong class="font-bold">unless you try</strong>.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Concession:</strong> Present a contrasting idea (begin with although, even though, though, while, whereas).
             <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">Although it was cold</strong>, we went for a walk.</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Punctuation:</h3>
    <p class="mb-4">
        If the adverbial clause comes before the main clause, use a comma. If the main clause comes first, a comma is usually not needed (except for some clauses of concession or contrast).
    </p>
     <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Because it was raining,</strong> we stayed inside.</li>
        <li>We stayed inside <strong class="font-bold">because it was raining</strong>.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Adverbial clauses add crucial context and detail to sentences, explaining the circumstances of the main action.
     </p>
</div>
`;

const lessonB2_18 = await addLesson(
    'Grammar', // lesson_type
    'Adverbial Clauses', // lesson_title
    { // lesson_content JSON
        description: 'This lesson covers adverbial clauses, explaining how they function like adverbs to modify verbs, adjectives, or other adverbs by providing information about time, place, manner, reason, purpose, result, condition, or concession.',
        html: adverbialClausesHtml
    },
    5, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Adverbial Clauses" added:');


        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_18 is the variable holding the result of adding the "Adverbial Clauses" lesson.

// Question 1
const questionB2_18_q1 = await addQuestion(lessonB2_18.id, 'grammar', {
    question: 'Which of the following is not a subordinating conjunction?',
    options: ['wherever', 'after', 'until', 'with'],
    correctAnswer: 'with' // Based on Quiz answers: 1-d
});

// Question 2
const questionB2_18_q2 = await addQuestion(lessonB2_18.id, 'grammar', {
    question: 'Which sentence contains an adverbial clause of place?',
    options: ['“My goal is to travel everywhere my sister has visited.”', '“When I am alone, I write in my diary.”', '“George promised he’d come, even if he had to walk the entire distance.”', '“This soup is as healthy as it is delicious.”'],
    correctAnswer: '“My goal is to travel everywhere my sister has visited.”' // Based on Quiz answers: 2-a
});

// Question 3
const questionB2_18_q3 = await addQuestion(lessonB2_18.id, 'grammar', {
    question: 'Which sentence contains an adverbial clause of condition?',
    options: ['“Whenever an expensive bill comes in the mail, I complain to my roommate.”', '“Alex will probably become famous, provided she builds up her portfolio.”', '“The man smiled and said he’d go wherever the wind took him.”', '“Although they’re just toddlers, the twins seem very intelligent.”'],
    correctAnswer: '“Alex will probably become famous, provided she builds up her portfolio.”' // Based on Quiz answers: 3-b
});

// Question 4
const questionB2_18_q4 = await addQuestion(lessonB2_18.id, 'grammar', {
    question: 'Which sentence contains an adverbial phrase, as opposed to an adverbial clause?',
    options: ['“Don’t believe him if he says he’s telling the truth.”', '“Sarah will start her presentation in an hour.”', '“She’s much taller than he is.”', '“My uncle tells jokes like he’s a comedian.”'],
    correctAnswer: '“Sarah will start her presentation in an hour.”' // Based on Quiz answers: 4-b
});

console.log('Provided quiz questions added for "Adverbial Clauses" lesson.');



wait(1000);



// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const complexSentencesHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Complex Sentences</h2>
    <p class="mb-4">
        A <strong class="font-bold">complex sentence</strong> is a sentence that contains one independent clause and at least one dependent clause.
    </p>
    <p class="mb-4">
        An <strong class="font-bold">independent clause</strong> can stand alone as a complete sentence because it has a subject and a verb and expresses a complete thought.
    </p>
    <p class="mb-4">
        A <strong class="font-bold">dependent clause</strong> (also called a subordinate clause) has a subject and a verb, but it cannot stand alone as a complete sentence because it does not express a complete thought. Dependent clauses often begin with a subordinating conjunction (e.g., because, although, when, if) or a relative pronoun (e.g., who, which, that).
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Structure of Complex Sentences:</h3>
    <p class="mb-4">
        The dependent clause can come before or after the independent clause.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Independent Clause + Dependent Clause
            <ul class="list-disc pl-5 space-y-2">
                <li>I went home <strong class="font-bold">because I was tired</strong>. ('I went home' is independent; 'because I was tired' is dependent)</li>
            </ul>
        </li>
        <li>Dependent Clause + , + Independent Clause
             <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">Because I was tired</strong>, I went home. (Comma is used when the dependent clause comes first)</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Types of Dependent Clauses in Complex Sentences:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong class="font-bold">Adverbial Clauses:</strong> Function as adverbs (as discussed in the previous lesson).
            <ul class="list-disc pl-5 space-y-2">
                <li>She will call you <strong class="font-bold">when she arrives</strong>.</li>
            </ul>
        </li>
        <li><strong class="font-bold">Relative Clauses:</strong> Function as adjectives (as discussed in a previous lesson).
             <ul class="list-disc pl-5 space-y-2">
                <li>This is the house <strong class="font-bold">that I bought last year</strong>.</li>
            </ul>
        </li>
         <li><strong class="font-bold">Noun Clauses:</strong> Function as nouns (subject, object, complement).
             <ul class="list-disc pl-5 space-y-2">
                <li>I don't know <strong class="font-bold">what he wants</strong>. (Noun clause is the object of 'know')</li>
            </ul>
        </li>
    </ul>

     <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Why Use Complex Sentences?</h3>
    <p class="mb-4">
        Complex sentences allow you to show a clearer relationship between ideas (cause and effect, time, contrast, etc.) and create more varied and sophisticated sentence structures.
    </p>
     <p class="mt-4 text-sm text-gray-600">
        Combining independent and dependent clauses correctly is key to forming complex sentences.
     </p>
</div>
`;

const lessonB2_19 = await addLesson(
    'Grammar', // lesson_type
    'Complex Sentences', // lesson_title
    { // lesson_content JSON
        description: 'This lesson defines complex sentences as containing one independent clause and at least one dependent clause, and explains their structure and the types of dependent clauses.',
        html: complexSentencesHtml
    },
    5, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Complex Sentences" added:');

        // Assuming addQuestion is an async function that interacts with your database
// and lessonB2_19 is the variable holding the result of adding the "Complex Sentences" lesson.

// Question 1
const questionB2_19_q1 = await addQuestion(lessonB2_19.id, 'grammar', {
    question: 'Complex sentences are usually made up of ________.',
    options: ['two independent clauses', 'two dependent clauses', 'an independent clause and a dependent clause'],
    correctAnswer: 'an independent clause and a dependent clause' // Based on Quiz answers: 1-c
});

// Question 2
const questionB2_19_q2 = await addQuestion(lessonB2_19.id, 'grammar', {
    question: 'The two clauses in a complex sentence are joined using a ________.',
    options: ['coordinating conjunction', 'subordinating conjunction', 'conjunctive adverb', 'correlative conjunction'],
    correctAnswer: 'subordinating conjunction' // Based on Quiz answers: 2-b
});

// Question 3
const questionB2_19_q3 = await addQuestion(lessonB2_19.id, 'grammar', {
    question: 'Which of the following statements about complex sentences is correct?',
    options: ['We never separate the two clauses with a comma.', 'We always separate the two clauses with a comma.', 'We separate the two clauses with a comma if the sentence begins with the independent clause.', 'We separate the two clauses with a comma if the sentence begins with the dependent clause.'],
    correctAnswer: 'We separate the two clauses with a comma if the sentence begins with the dependent clause.' // Based on Quiz answers: 3-d
});

// Question 4
const questionB2_19_q4 = await addQuestion(lessonB2_19.id, 'grammar', {
    question: 'Which of the following sentences is punctuated correctly?',
    options: ['“Even though I recognized her, I didn’t say hello.”', '“Even though, I recognized her, I didn’t say hello.”', '“I didn’t say hello even though, I recognized her.”', '“I didn’t say, hello even though I recognized her.”'],
    correctAnswer: '“Even though I recognized her, I didn’t say hello.”' // Based on Quiz answers: 4-a
});

// Question 5
const questionB2_19_q5 = await addQuestion(lessonB2_19.id, 'grammar', {
    question: 'Which of the following sentences is punctuated correctly?',
    options: ['“I didn’t stop at the store because I didn’t think there was anything we needed.”', '“I didn’t stop at the store, because I didn’t think there was anything we needed.”', '“I didn’t stop at the store because, I didn’t think there was anything we needed.”', '“I didn’t stop, at the store because I didn’t think there was anything we needed.”'],
    correctAnswer: '“I didn’t stop at the store because I didn’t think there was anything we needed.”' // Based on Quiz answers: 5-a
});

console.log('Provided quiz questions added for "Complex Sentences" lesson.');



wait(1000);


// Assuming addLesson is an async function that interacts with your database
// and the HTML content is stored in a variable or directly in the call.

const compoundComplexSentencesHtml = `
<div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Compound-Complex Sentences</h2>
    <p class="mb-4">
        A <strong class="font-bold">compound-complex sentence</strong> is a sentence that contains <strong class="font-bold">at least two independent clauses</strong> and <strong class="font-bold">at least one dependent clause</strong>.
    </p>
    <p class="mb-4">
        It combines the features of a compound sentence (two or more independent clauses joined by a coordinating conjunction or semicolon) and a complex sentence (one independent clause and at least one dependent clause).
    </p>

    <h3 class="text-xl font-semibold mb-3 text-gray-800">Structure of Compound-Complex Sentences:</h3>
    <p class="mb-4">
        These sentences can have various arrangements of independent and dependent clauses.
    </p>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>Independent Clause + Coordinating Conjunction + Independent Clause + Dependent Clause
            <ul class="list-disc pl-5 space-y-2">
                <li>I finished my work, <strong class="font-bold">and</strong> then I went home <strong class="font-bold">because I was tired</strong>. ('I finished my work' and 'then I went home' are independent; 'because I was tired' is dependent)</li>
            </ul>
        </li>
        <li>Dependent Clause + , + Independent Clause + Coordinating Conjunction + Independent Clause
             <ul class="list-disc pl-5 space-y-2">
                <li><strong class="font-bold">When the music started</strong>, I stood up, <strong class="font-bold">and</strong> I began to dance. ('When the music started' is dependent; 'I stood up' and 'I began to dance' are independent)</li>
            </ul>
        </li>
         <li>Independent Clause + Dependent Clause + Coordinating Conjunction + Independent Clause
             <ul class="list-disc pl-5 space-y-2">
                <li>She likes the book <strong class="font-bold">that I gave her</strong>, <strong class="font-bold">but</strong> she hasn't finished it yet. ('She likes the book' and 'she hasn't finished it yet' are independent; 'that I gave her' is dependent)</li>
            </ul>
        </li>
    </ul>

    <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">Key Components:</h3>
    <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li>At least two independent clauses (can stand alone).</li>
        <li>At least one dependent clause (cannot stand alone).</li>
        <li>Independent clauses are joined by a coordinating conjunction (FANBOYS) or a semicolon.</li>
        <li>Dependent clauses are introduced by subordinating conjunctions or relative pronouns.</li>
    </ul>
     <p class="mt-4 text-sm text-gray-600">
        Compound-complex sentences allow for the expression of multiple related ideas and relationships within a single sentence, adding sophistication to your writing.
     </p>
</div>
`;

const lessonB2_20 = await addLesson(
    'Grammar', // lesson_type
    'Compound-Complex Sentences', // lesson_title
    { // lesson_content JSON
        description: 'This lesson defines compound-complex sentences as containing at least two independent clauses and at least one dependent clause, explaining their structure.',
        html: compoundComplexSentencesHtml
    },
    5, // lesson_importance (can be adjusted)
    'B2' // lesson_level
);

console.log('Lesson "Compound-Complex Sentences" added:');

// and lessonB2_20 is the variable holding the result of adding the "Compound-Complex Sentences" lesson.

// Question 1
const questionB2_20_q1 = await addQuestion(lessonB2_20.id, 'grammar', {
    question: 'A complex-compound sentence requires at least one of which of the following?',
    options: ['independent clause', 'dependent clause', 'coordinating conjunction', 'semicolon'],
    correctAnswer: 'dependent clause' // Based on Quiz answers: 1-b
});

// Question 2
const questionB2_20_q2 = await addQuestion(lessonB2_20.id, 'grammar', {
    question: 'Which of the following can be used to join the two independent clauses in a complex-compound sentence?',
    options: ['coordinating conjunction', 'correlative conjunction', 'conjunctive adverb', 'semicolon', 'All of the above', 'None of the above'],
    correctAnswer: 'All of the above' // Based on Quiz answers: 2-e (assuming 'All of the above' corresponds to option 'e')
});

// Question 3
const questionB2_20_q3 = await addQuestion(lessonB2_20.id, 'grammar', {
    question: 'Which of the following can be used to join a dependent clause to an independent clause in a complex-compound sentence?',
    options: ['coordinating conjunction', 'subordinating conjunction', 'conjunctive adverb', 'semicolon', 'All of the above', 'None of the above'],
    correctAnswer: 'subordinating conjunction' // Based on Quiz answers: 3-b
});

// Question 4
const questionB2_20_q4 = await addQuestion(lessonB2_20.id, 'grammar', {
    question: 'Identify the dependent clause or clauses in the following sentence:\n“I’m going to see Shawna at the mall later; you can come with me, though I know you two don’t get along.”',
    options: ['I’m going to see Shawna at the mall later', 'you can come with me', 'though I know you two don’t get along', 'A & B', 'B & C', 'A & C'],
    correctAnswer: 'though I know you two don’t get along' // Based on Quiz answers: 4-c
});

// Question 5
const questionB2_20_q5 = await addQuestion(lessonB2_20.id, 'grammar', {
    question: 'Identify the dependent clause or clauses in the following sentence:\n“Although I’ve saved up for a few years, I’ve never been able to afford buying a house, but we should be able to get a mortgage soon, providing my job remains secure.”',
    options: ['Although I’ve saved up for a few years', 'I’ve never been able to afford buying a house', 'we should be able to get a mortgage soon', 'providing my job remains secure', 'A & C', 'B & C', 'A & D', 'B & D'],
    correctAnswer: 'A & D' // Based on Quiz answers: 5-f (assuming 'A & D' corresponds to option 'f')
});

console.log('Provided quiz questions added for "Compound-Complex Sentences" lesson.');

    }
    catch (error) {
        console.error('Test failed:', error);
    } finally {
        pool.end(); // Close DB connection
    }
}


//addTestData();

//createB2Lessons();

//createProgramForUser(1, 'B2');