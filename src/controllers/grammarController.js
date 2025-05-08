const lessonsM = require('../models/lessonModel');

const getGrammar = async (req, res) => {

    if (req.session && req.session.user) {
        
        const programId = req.params.programId; // Get the program ID from the request parameters

        try {
            // Fetch lessons for the specified program ID
            const lessons = await lessonsM.getLessonsByType("Grammar");
            
            if (lessons.length > 0) {
                res.render("grammar", { user: req.session.user, lessons });
            } else {
                res.status(404).json({ message: 'No grammar lessons found.' });
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    } else {
            res.redirect("/signin");
    }

};

module.exports = getGrammar ;