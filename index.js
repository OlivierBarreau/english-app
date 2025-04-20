const express = require('express');
const path = require('path');
const nunjucks = require("nunjucks");

// require("dotenv").config();
const app = express();

// Configure Nunjucks
nunjucks.configure("src/views", {
    autoescape: true,
    express: app
  });

app.set("view engine", "njk"); // Use .njk for Nunjucks files

app.use(express.static("public"));

// app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("home");
})

app.get('/grammar', (req, res) => {
    res.render("grammar");
})

app.get('/vocabulary', (req, res) => {
    res.render("vocabulary");
})

app.get('/expressions', (req, res) => {
    res.render("expressions");
})

app.get('/articles', (req, res) => {
    res.render("articles");
})

app.get('/signin', (req, res) => {
    res.render("signin");
})

app.get('/signout', (req, res) => {
    
})

const server = app.listen(8000, () => {
    console.log(`The application started on port ${server.address().port}`);
});