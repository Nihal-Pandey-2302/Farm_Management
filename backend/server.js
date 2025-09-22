// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import main API router
const apiRoutes = require('./src/api/routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Configure CORS to specifically allow requests from the Vite development server
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Main API Route
app.use('/api', apiRoutes);

// Simple root endpoint for health check
app.get('/', (req, res) => {
  res.send('Farm Management Portal Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});