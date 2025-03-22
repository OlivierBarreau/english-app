const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
})

const server = app.listen(8000, () => {
    console.log(`The application started on port ${server.address().port}`);
});