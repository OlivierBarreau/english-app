const express = require('express');
const path = require('path');
const session = require('express-session');
const nunjucks = require("nunjucks");
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./src/routes/auth');
const pagesRoutes = require('./src/routes/pagesRoutes'); // Import the home routes
const profileRoutes = require('./src/routes/profileRoutes'); // Import the profile routes

// require("dotenv").config();
const app = express();

// Configure Nunjucks
nunjucks.configure("src/views", {
    autoescape: true,
    express: app
  });

app.set("view engine", "njk"); // Use .njk for Nunjucks files

app.use(express.static("public"));
// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with a strong secret key
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set `secure: true` if using HTTPS
    })
  );
  
// app.use(express.static(path.join(__dirname, "public")));
// Use the auth routes
app.use(authRoutes);
app.use(pagesRoutes); // Use the home routes
app.use(profileRoutes); // Use the profile routes

app.get('/expressions', (req, res) => {
    if (req.session && req.session.user) {
        
        res.render("expressions", { user: req.session.user });
    }else {
        res.redirect("/signin");
    }
});

app.get('/articles', (req, res) => {
    if (req.session && req.session.user) {
        
        res.render("articles", { user: req.session.user });
    }else {
        res.redirect("/signin");
    }
});

app.get('/settings', (req, res) => {
    if (req.session && req.session.user) {
        
        res.render("settings", { user: req.session.user });
    }else {
        res.redirect("/signin");
    }
});

app.get('/toeic/listening', (req, res) => {
    if (req.session && req.session.user) {
        const audioFile = '/audio/sample.mp3'; // Simulated audio file
        const questions = [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'What is the main topic of the audio?',
                options: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
            },
            {
                id: 2,
                type: 'short-answer',
                question: 'What is the name of the speaker in the audio?'
            }
        ];

        res.render('toeicListening', { user: req.session.user, audioFile, questions });
    } else {
        res.redirect('/signin');
    }
});

const server = app.listen(8000, () => {
    console.log(`The application started on port ${server.address().port}`);
});