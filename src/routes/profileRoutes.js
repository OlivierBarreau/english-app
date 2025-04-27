

const express = require('express');
const router = express.Router();
const getProfile= require('../controllers/profileController');
const { getChangePassword, postChangePassword } = require('../controllers/changePasswordController'); // Import the change password controller

router.get('/profile', getProfile); // Route to get user profile
router.get('/change-password', getChangePassword); // Route to change password
router.post('/change-password', postChangePassword); // Route to handle password change form submission

module.exports = router;