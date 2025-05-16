const User = require('../models/userModel'); // Import the User model

const addUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password , english_lvl, current_program_id} = req.body;

    // Check if the email already exists
    const existingUser = await User.getUserByLogin(email);
    if (existingUser) {
      // Return to the signup page with an error message
      return res.render('signup', {
        error: 'Email already in use. Please use a different email address.',
        formData: { firstname, lastname, email, english_lvl }
      });
    }    // Create and save the user
    const newUser = User.addUser(email, password, firstname, lastname, english_lvl, current_program_id);
    if (!newUser) {
      return res.render('signup', {
        error: 'Error creating user. Please try again.',
        formData: { firstname, lastname, email, english_lvl }
      });
    }

    // Redirect to login page or dashboard
    res.redirect('/signin');  } catch (error) {
    console.error('Error creating user:', error);
    return res.render('signup', {
      error: 'An error occurred during registration. Please try again later.',
      formData: { firstname, lastname, email, english_lvl }
    });
  }
};

module.exports = addUser;