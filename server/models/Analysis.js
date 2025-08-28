/**
 * Analysis Model
 *
 * This Mongoose schema defines the structure of an "Analysis" document in MongoDB.
 * It is used to store data related to protein-genome sequence analysis performed
 * by users of the bioinformatics application.
 *
 * Fields:
 * - userId          → Reference to the User who performed the analysis (required).
 * - proteinFilename → Original filename of the uploaded protein sequence (required).
 * - genomeFilename  → Original filename of the uploaded genome sequence (required).
 * - matchPercentage → User-defined threshold for sequence similarity (0–100).
 * - results         → Stores the analysis results:
 *     - totalMatches → Number of genome segments that meet or exceed the threshold.
 *     - matchDetails → Array of match objects, each containing:
 *         - position   → Start index of the matching segment in the genome.
 *         - sequence   → Genome segment sequence that matched.
 *         - similarity → Percentage similarity of this match.
 * - status          → Current status of the analysis:
 *     - 'pending'    → Created but not yet processed.
 *     - 'processing' → Analysis is currently running.
 *     - 'completed'  → Analysis finished successfully.
 *     - 'failed'     → Analysis encountered an error.
 *
 * Options:
 * - timestamps → Automatically adds `createdAt` and `updatedAt` fields.
 *
 * Usage:
 * const Analysis = require('../models/Analysis');
 * const newAnalysis = new Analysis({ ... });
 */



const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proteinFilename: {
    type: String,
    required: true
  },
  genomeFilename: {
    type: String,
    required: true
  },
  matchPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  results: {
    totalMatches: Number,
    matchDetails: [{
      position: Number,
      sequence: String,
      similarity: Number
    }]
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analysis', AnalysisSchema);