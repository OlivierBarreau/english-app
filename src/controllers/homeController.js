const program_lessons = require('../models/program_lessonModel');
const lessonModel = require('../models/lessonModel');
const questionModel = require('../models/questionModel');

const getHome = async (req, res) => {

    if (req.session && req.session.user) {
        
        //const programId = req.params.programId; // Get the program ID from the request parameters

        try {
            // Fetch lessons for the specified program ID
            //const lessons = await program_lessons.getLessonsWithResultsForUser(req.session.user.current_program_id, req.session.user.id);

            const lessons = await program_lessons.getLessonsWithResultsForUser(req.session.user.current_program_id, req.session.user.id);

            
            // res.render("home", { user: req.session.user });
            if (lessons.length > 0) {
                res.render("home", { user: req.session.user, lessons }); // Render the home page with the lessons data
            } else {
                res.status(404).json({ message: 'No lessons found for this program.' });
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    } else {
            res.redirect("/signin");
    }

};

const getProgramLesson = async (req, res) => {

    if (req.session && req.session.user) {

        const lessonId = req.params.lessonId;

        // Logic to handle the lesson based on the lessonId
        try {

            const lesson = await lessonModel.getLessonById(lessonId);
            const questions = await questionModel.getQuestionsByLessonId(lessonId);
            
            if (lesson) {
                if (lesson.lesson_type === "Vocabulary") {
                    res.render("vocabularyLesson", { lesson, questions });
                }
                else if (lesson.lesson_type === "Grammar") {

                    console.log(lesson.lesson_content.description);
                    // TO REMOVE AFTER : Onnly for test
                    // lesson.lesson_content.description = `

                    // <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">English Grammar: Nouns</h1>

                    // <div class="p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
                    //     <h2 class="text-2xl font-semibold mb-4 text-gray-800">What are Nouns?</h2>
                    //     <p class="mb-4">
                    //         Nouns are fundamental building blocks of the English language. They are words that are used to identify or name people, places, or things. Think of them as the labels we use for everything around us and even abstract concepts.
                    //     </p>
                    //     <p class="mb-4">
                    //         In a sentence, nouns play crucial roles. They can function as the <strong class="font-bold">subject</strong> (the person or thing doing the action), the <strong class="font-bold">object</strong> of a verb or preposition (the person or thing receiving the action or related by a preposition), or even follow linking verbs to rename or re-identify the subject (known as <strong class="font-bold">predicate nouns</strong>).
                    //     </p>

                    //     <h3 class="text-xl font-semibold mb-3 text-gray-800">Examples of Nouns:</h3>
                    //     <ul class="list-disc pl-5 space-y-2 text-gray-700">
                    //         <li><strong class="font-bold">People:</strong> teacher, student, John, Mary</li>
                    //         <li><strong class="font-bold">Places:</strong> city, park, London, school</li>
                    //         <li><strong class="font-bold">Things:</strong> book, table, car, computer, dog</li>
                    //         <li><strong class="font-bold">Ideas/Concepts (Abstract Nouns):</strong> happiness, freedom, love, information</li>
                    //     </ul>
                    // </div>

                    // <div class=" p-6 rounded-md shadow-md mb-8 bg-white border-l-4 border-blue-500">
                    //     <h2 class="text-2xl font-semibold mb-4 text-gray-800">Nouns in Sentences</h2>
                    //     <p class="mb-4">Let's look at how nouns function within sentences:</p>

                    //     <h3 class="text-xl font-semibold mb-3 text-gray-800">As the Subject:</h3>
                    //     <ul class="list-disc pl-5 space-y-2 text-gray-700">
                    //         <li>The <strong class="font-bold">dog</strong> chased its tail. (<strong class="font-bold">dog</strong> is the subject performing the action 'chased')</li>
                    //         <li><strong class="font-bold">Mary</strong> reads a book every week. (<strong class="font-bold">Mary</strong> is the subject performing the action 'reads')</li>
                    //     </ul>

                    //     <h3 class="text-xl font-semibold mb-3 text-gray-800">As Objects:</h3>
                    //     <p class="mb-2">Nouns can be direct objects, indirect objects, or objects of prepositions.</p>
                    //     <ul class="list-disc pl-5 space-y-2 text-gray-700">
                    //         <li><strong class="font-bold">Direct Object:</strong> Receives the action of the verb.
                    //             <ul class="list-disc pl-5 space-y-2">
                    //                 <li>The dog chased its <strong class="font-bold">tail</strong>. (<strong class="font-bold">tail</strong> receives the action 'chased')</li>
                    //                 <li>Mary reads a <strong class="font-bold">book</strong> every week. (<strong class="font-bold">book</strong> receives the action 'reads')</li>
                    //             </ul>
                    //         </li>
                    //         <li><strong class="font-bold">Indirect Object:</strong> The person or thing who receives the direct object.
                    //             <ul class="list-disc pl-5 space-y-2">
                    //                 <li>Please pass <strong class="font-bold">Jeremy</strong> the salt. (<strong class="font-bold">Jeremy</strong> receives the direct object 'salt')</li>
                    //                 <li>I sent the <strong class="font-bold">company</strong> an application. (<strong class="font-bold">company</strong> receives the direct object 'application')</li>
                    //             </ul>
                    //         </li>
                    //         <li><strong class="font-bold">Object of a Preposition:</strong> Follows a preposition (like in, on, under, for, with).
                    //             <ul class="list-disc pl-5 space-y-2">
                    //                 <li>Your backpack is under the <strong class="font-bold">table</strong>. (<strong class="font-bold">table</strong> follows the preposition 'under')</li>
                    //                 <li>I am looking for <strong class="font-bold">work</strong>. (<strong class="font-bold">work</strong> follows the preposition 'for')</li>
                    //             </ul>
                    //         </li>
                    //     </ul>

                    //     <h3 class="text-xl font-semibold mb-3 text-gray-800">As Predicate Nouns:</h3>
                    //     <p class="mb-2">These follow linking verbs (like 'is', 'am', 'are', 'was', 'were', 'seem', 'become') and rename or identify the subject.</p>
                    //     <ul class="list-disc pl-5 space-y-2 text-gray-700">
                    //         <li>Love is a <strong class="font-bold">virtue</strong>. (<strong class="font-bold">virtue</strong> renames the subject 'Love')</li>
                    //         <li>Tommy seems like a real <strong class="font-bold">bully</strong>. (<strong class="font-bold">bully</strong> renames the subject 'Tommy')</li>
                    //     </ul>
                    // </div>

                    // <div class=" p-6 rounded-md shadow-md bg-white border-l-4 border-blue-500">
                    //     <h2 class="text-2xl font-semibold mb-4 text-gray-800">Categories of Nouns</h2>
                    //     <p class="mb-4">Nouns can be divided into different categories based on their characteristics:</p>
                    //     <ul class="list-disc pl-5 space-y-2 text-gray-700">
                    //         <li><strong class="font-bold">Common Nouns:</strong> General names (city, person, book).</li>
                    //         <li><strong class="font-bold">Proper Nouns:</strong> Specific names, always capitalized (Paris, John, The Farlex Grammar Book).</li>
                    //         <li><strong class="font-bold">Concrete Nouns:</strong> Things you can perceive with your senses (table, music, water).</li>
                    //         <li><strong class="font-bold">Abstract Nouns:</strong> Ideas, feelings, concepts (love, happiness, information).</li>
                    //         <li><strong class="font-bold">Countable Nouns:</strong> Can be counted, have singular/plural forms (apple/apples, book/books).</li>
                    //         <li><strong class="font-bold">Uncountable Nouns:</strong> Cannot be counted as individual units (water, information, advice).</li>
                    //         <li><strong class="font-bold">Collective Nouns:</strong> Refer to a group (team, family, committee).</li>
                    //         <li><strong class="font-bold">Compound Nouns:</strong> Made up of two or more words (football, classroom, mother-in-law).</li>
                    //     </ul>
                    //     <p class="mt-4 text-sm text-gray-600">
                    //         (Further details on each category are covered in separate lessons.)
                    //     </p>
                    // </div>


                    // `;
                    res.render("grammarLesson", { lesson, questions });

                }
                // else if (lesson.type === "Listening") {
                //     res.render("listeningLesson", { lesson, questions });
                // }
                // else if (lesson.type === "Writing") {
                //     res.render("writingLesson", { lesson, questions });
                // }
                // else if (lesson.type === "Speaking") {
                //     res.render("speakingLesson", { lesson, questions });
                // }
                // else if (lesson.type === "Reading") {
                //     res.render("readingLesson", { lesson, questions });
                // }

            } else {
                res.status(404).send('Lesson not found');
            }
        }
        catch (error) {
            console.error('Error fetching lesson:', error);
            res.status(500).send('Internal server error');
        }
    }
    else {
        res.redirect("/signin");
    }
}

module.exports = {
    getHome,
    getProgramLesson
};

