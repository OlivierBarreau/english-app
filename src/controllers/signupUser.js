const User = require('../models/userModel'); // Import the User model
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password , english_lvl, current_program_id} = req.body;

    // Check if the email already exists
    const existingUser = await User.getUserByLogin(email);
    if (existingUser) {
      return res.status(400).send('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = User.addUser(email, hashedPassword, firstname, lastname, english_lvl, current_program_id);
    if (!newUser) {
      return res.status(400).send('Error creating user');
    }

    // Redirect to login page or dashboard
    res.redirect('/signin');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = addUser;