const User = require('../models/userModel'); // Import the User model
const bcrypt = require('bcrypt');

const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.getUserByLogin(email);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // Save user information in the session
    req.session.user = {id: user.id, email: user.login, firstname: user.firstname, lastname: user.lastname, english_lvl: user.english_lvl, current_program_id: user.current_program_id };

    // Redirect to the home page
    res.redirect('/');
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = signinUser;