require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const admin = require('./config/firebase-config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Blog Backend is running!');
});

// Import route handlers
const authRoutes = require('./routes/auth'); // Initialize authRoutes
const articleRoutes = require('./routes/articles'); // Initialize articleRoutes

// Use route handlers
app.use('/api/auth', authRoutes); // Now authRoutes is defined
app.use('/api/articles', articleRoutes); // Now articleRoutes is defined

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});