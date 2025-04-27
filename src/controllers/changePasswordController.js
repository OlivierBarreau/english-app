const userModel = require('../models/userModel'); // Import the model to fetch lessons
const bcrypt = require('bcrypt');

const getChangePassword = async (req, res) => {

    if (req.session && req.session.user) {

        res.render("changePassword", { user: req.session.user }); 

    } else {
            res.redirect("/signin");
    }

};

const postChangePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body; // Get the old and new passwords from the request body

    if (req.session && req.session.user) {
        try {
            // Fetch user information from the session
            const user = await userModel.getUserByLogin(req.session.user.email); // Get user information from the session

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Check if the old password matches the stored password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Old password is incorrect.' });
            }

            // Hash the new password and update it in the database
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await userModel.updateUserPassword(user.id, hashedNewPassword); // Update the password in the database

            res.redirect("/signout"); // Redirect to the signout page after successful password change
            
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.redirect("/signin");
    }
};

// Export the defined functions
module.exports = {
    getChangePassword,
    postChangePassword
};
