const Analysis = require('../models/Analysis');
const fs = require('fs').promises;
const path = require('path');
const { analyzeSequences } = require('../utils/sequenceAnalysis');

const analyzeSequence = async (req, res) => {
  try {
    const { matchPercentage } = req.body;
    const files = req.files;

    if (!files || !files.protein || !files.genome) {
      return res.status(400).json({ message: 'Both protein and genome files are required' });
    }

    // Create analysis record
    const analysis = new Analysis({
      userId: req.user._id,
      proteinFilename: files.protein[0].originalname,
      genomeFilename: files.genome[0].originalname,
      matchPercentage: parseFloat(matchPercentage),
      status: 'processing'
    });

    await analysis.save();

    try {
      // Read file contents
      const proteinContent = await fs.readFile(files.protein[0].path, 'utf8');
      const genomeContent = await fs.readFile(files.genome[0].path, 'utf8');

      // Analyze sequences
      const results = await analyzeSequences(
        proteinContent.trim(),
        genomeContent.trim(),
        parseFloat(matchPercentage)
      );

      // Update analysis with results
      analysis.results = results;
      analysis.status = 'completed';
      await analysis.save();

      // Clean up uploaded files
      await fs.unlink(files.protein[0].path);
      await fs.unlink(files.genome[0].path);

      res.json({
        success: true,
        analysisId: analysis._id,
        results: results
      });

    } catch (analysisError) {
      analysis.status = 'failed';
      await analysis.save();
      throw analysisError;
    }

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};

const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeSequence, getAnalysisHistory };