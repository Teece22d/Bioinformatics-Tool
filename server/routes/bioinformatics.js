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