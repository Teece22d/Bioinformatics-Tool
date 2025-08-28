/**
 * Bioinformatics Routes
 *
 * This file defines the API endpoints related to sequence analysis operations.
 * It uses Express Router and includes authentication and file upload handling.
 *
 * Routes:
 * - POST /analyze
 *    → Protected route that allows an authenticated user to upload a protein
 *      sequence file and a genome sequence file for analysis.
 *    → Uses Multer middleware (upload.fields) to handle file uploads for:
 *         - 'protein' (max 1 file)
 *         - 'genome' (max 1 file)
 *    → Calls analyzeSequence controller to process the uploaded sequences and
 *      return analysis results.
 *
 * - GET /history
 *    → Protected route that returns the authenticated user's analysis history
 *      (most recent analyses first).
 *
 * Middleware:
 * - protect → Ensures only authenticated users can access these routes.
 * - upload  → Handles multipart/form-data for file uploads.
 *
 * This router is typically mounted under /api/bioinformatics in the main server file.
 */


const express = require('express');
const { analyzeSequence, getAnalysisHistory } = require('../controllers/bioinformaticsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/analyze', protect, upload.fields([
  { name: 'protein', maxCount: 1 },
  { name: 'genome', maxCount: 1 }
]), analyzeSequence);

router.get('/history', protect, getAnalysisHistory);

module.exports = router;