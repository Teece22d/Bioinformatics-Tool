/**
 * Middleware Module
 *
 * This file contains two middleware functions for the bioinformatics backend:
 *
 * 1. protect
 *    - Verifies that the incoming request has a valid JWT token in the
 *      Authorization header.
 *    - Fetches the authenticated user's data and attaches it to req.user.
 *    - Returns 401 Unauthorized if token is missing, invalid, or user does not exist.
 *
 * 2. upload
 *    - Handles file uploads using Multer.
 *    - Configured to store files in the 'uploads/' directory with unique filenames.
 *    - Restricts uploads to plain text (.txt) files only.
 *    - Limits file size to 50MB per file.
 *
 * Usage:
 * const { protect } = require('../middleware/auth');
 * const upload = require('../middleware/upload');
 * router.post('/analyze', protect, upload.fields([{name: 'protein'}, {name: 'genome'}]), analyzeSequence);
 */




const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return 401 Unauthorized
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded ID, excluding password
    req.user = await User.findById(decoded.id).select('-password');

    // If user not found, return 401
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    // Token invalid, expired, or verification failed
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };

const multer = require('multer');
const path = require('path');

// Configure where and how files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // All files saved in 'uploads/' folder
  },
  filename: function (req, file, cb) {
    // Create a unique filename: timestamp + random number + original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filter to accept only .txt/plain text files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/plain' || path.extname(file.originalname) === '.txt') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only .txt files are allowed'), false); // Reject file
  }
};

// Create upload middleware with storage, filter, and size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max per file
  }
});

module.exports = upload;
