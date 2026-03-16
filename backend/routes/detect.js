const express = require('express');
const multer = require('multer');
const { handleDetection } = require('../controllers/detectController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
});

router.post('/', upload.single('media'), handleDetection);

module.exports = router;
