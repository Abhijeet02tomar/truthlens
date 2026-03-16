const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const detectRoutes = require('./routes/detect');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routes
app.use('/detect', detectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TruthLens Backend Server running on port ${PORT}`);
});
