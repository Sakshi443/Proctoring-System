const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'templates')));

// Serve HTML template from "templates"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'templates', 'error.html'));
});

module.exports = app; // Export app for use in server.js
