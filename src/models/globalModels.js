const {  getUserById, addUser, updateUserById, deleteUserById, getUserByLogin } = require('./userModel');
const { getQuestionById, addQuestion, updateQuestionById, deleteQuestionById } = require('./questionModel');
const { getLessonById, addLesson, updateLessonById, deleteLessonById, getLessonsByType } = require('./lessonModel');
const { getLessonResultById, addLessonResult, updateLessonResultById, deleteLessonResultById } = require('./lesson_resultModel');
const { addQuestionResult, getQuestionResultById, updateQuestionResultById, deleteQuestionResultById } = require('./question_resultModel');
const { addProgram, getProgramById, updateProgramById, deleteProgramById } = require('./programModel.js');
const { addLessonToProgram, getLessonsForProgram, updateLessonOrder, removeLessonFromProgram } = require('./program_lessonModel.js');
const pool = require('./db_connexion'); // Import database connection


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


// Export functions
module.exports = { 
    fillProgram
};
