// src/server.js
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables first

const app = require('./app'); // Express app
const admin = require('./firebase/firebase-config'); // Firebase admin config
const db = admin.firestore(); // Firestore instance

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
