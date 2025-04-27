const userModel = require('../models/userModel'); // Import the model to fetch lessons

const getProfile = async (req, res) => {

    if (req.session && req.session.user) {

        try {
            // Fetch lessons for the specified program ID
            const user = await userModel.getUserByLogin(req.session.user.email); // Get user information from the session
            if (user) {
                res.render("profile", { user: req.session.user, userInfo: user });
            } else {
                res.status(404).json({ message: 'User not found.' });
            }
            
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    } else {
            res.redirect("/signin");
    }

};

module.exports = getProfile ;
