const express = require('express');
const path = require('path');
const session = require('express-session');
const nunjucks = require("nunjucks");
const bodyParser = require('body-parser');
require('dotenv').config();

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

app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.render("home", { user: req.session.user });
    }else {
        res.redirect("/signin");
    }
});

// Handle POST request for sign-in
app.post('/', (req, res) => {
    const { email, password } = req.body;
  
    // Example: Verify user credentials (replace with your logic)
    if (email === 'alice@example.com' && password === 'mdp') {
      // Save user information in the session
      req.session.user = { email };
  
      // Redirect to dashboard
      res.redirect('/');
    } else {
      // Send error message if invalid
      res.status(401).send('Invalid email or password');
    }
  });

app.get('/grammar', (req, res) => {
    if (req.session && req.session.user) {
        res.render("grammar", { user: req.session.user });
    }else {
        res.redirect("/signin");
    }
});

app.get('/vocabulary', (req, res) => {
    if (req.session && req.session.user) {
        res.render("vocabulary", { user: req.session.user });
    }else {
        res.redirect("/signin");
    }    
});

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

app.get('/signin', (req, res) => {
    res.render("signin");
});

app.get('/signout', (req, res) => {
    // Destroy the session and redirect to sign-in page
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal server error');
        }
        res.redirect('/signin');
    });
});

const server = app.listen(8000, () => {
    console.log(`The application started on port ${server.address().port}`);
});