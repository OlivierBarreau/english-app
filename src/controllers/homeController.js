const program_lessons = require('../models/program_lessonModel');

const getHome = async (req, res) => {

    if (req.session && req.session.user) {
        
        const programId = req.params.programId; // Get the program ID from the request parameters

        try {
            // Fetch lessons for the specified program ID
            const lessons = await program_lessons.getLessonsForProgram(1);
            
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

module.exports = getHome ;

