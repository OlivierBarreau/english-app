const {  getUserById, addUser, updateUserById, deleteUserById, getUserByLogin } = require('./userModel');
const { getQuestionById, addQuestion, updateQuestionById, deleteQuestionById, getQuestionsByLessonId, getQuestionIdsByLessonId } = require('./questionModel');
const { getLessonById, addLesson, updateLessonById, deleteLessonById, getLessonsByType, getLessonsByLevel } = require('./lessonModel');
const { getLessonResultById, addLessonResult, updateLessonResultById, deleteLessonResultById } = require('./lesson_resultModel');
const { addQuestionResult, getQuestionResultById, updateQuestionResultById, deleteQuestionResultById } = require('./question_resultModel');
const { addProgram, getProgramById, updateProgramById, deleteProgramById} = require('./programModel.js');
const { addLessonToProgram, getLessonsForProgram, updateLessonOrder, removeLessonFromProgram, getLessonsWithResultsForUser } = require('./program_lessonModel.js');
const pool = require('./db_connexion');


// ✅ Ajouter un programme
async function fillProgram(programID, lessons_list) {
    try {
        for (const aLesson of lessons_list) {
            console.log(`Adding lesson ID ${aLesson} to program ID ${programID}...`);
            const result = await addLessonToProgram(programID, aLesson);
            console.log('Lesson added:', result);
        }
        console.log('All lessons have been added to the program.');
    } catch (error) {
        console.error('Error while filling program with lessons:', error);
        throw error;
    }
}

async function createProgramForUser(userId, userEnglishLevel) {
    try {
        // 1. Get all lessons matching the user's level
        const allLessons = await getLessonsByLevel(userEnglishLevel);
        
        // 2. Randomly select 15 lessons
        const selectedLessons = [];
        const used = new Set();
        const numLessons = 15;
        
        while (selectedLessons.length < numLessons) {
            const idx = Math.floor(Math.random() * allLessons.length);
            if (!used.has(idx)) {
                used.add(idx);
                selectedLessons.push(allLessons[idx]);
            }
        }

        // 3. Create a new program
        const program = await addProgram(userId, 0, 0);

        // 4. Add lessons to program, create lesson results and question results
        for (let i = 0; i < selectedLessons.length; i++) {
            const lesson = selectedLessons[i];
            // Add lesson to program with order i+1
            await addLessonToProgram(program.id, lesson.id, i + 1);
            
            // Create initial lesson result with 0 completion and 0 right answers
            const lessonResult = await addLessonResult(userId, lesson.id, 0, 0);
            
            // Get all questions for this lesson and create results for each
            const questionIds = await getQuestionIdsByLessonId(lesson.id);
            for (const questionId of questionIds) {
                await addQuestionResult(lessonResult.id, questionId, false, "");
            }
        }
        

        return program;
    } catch (error) {
        console.error('Error creating program for user:', error);
        throw error;
    }
}


// Export functions
module.exports = { 
    fillProgram,
    createProgramForUser
};
