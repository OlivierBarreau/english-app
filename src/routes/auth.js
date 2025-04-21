const express = require('express');
const router = express.Router();
const signupUser = require('../controllers/signupUser'); // Import the controller
const signinUser = require('../controllers/signinUser'); // Import the controller
const signoutUser = require('../controllers/signoutUser'); // Import the controller

// Render the sign-in page
router.get('/signin', (req, res) => {
    res.render('signin');
});

// Handle POST request for sign-in
router.post('/signin', signinUser);

router.get('/signup', (req, res) => {
    res.render("signup");
});

// Route to handle user signup
router.post('/signup', signupUser);

router.get('/signout', signoutUser);

module.exports = router;