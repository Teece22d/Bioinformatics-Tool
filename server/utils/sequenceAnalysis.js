/**
 * Sequence Analysis Utility
 *
 * This module provides a basic algorithm for comparing a protein sequence
 * against a genome sequence using a sliding window approach.
 *
 * How it works:
 * 1. Cleans the input sequences by removing whitespace and converting to uppercase.
 * 2. Iterates through the genome sequence using a window equal to the protein length.
 * 3. For each window segment, calculates the percentage of matching characters
 *    compared to the protein sequence (simple positional match, no gaps allowed).
 * 4. Records any segment that meets or exceeds the minimum similarity threshold.
 *
 * Returned result includes:
 * - totalMatches: Number of genome segments matching the threshold.
 * - matchDetails: Array of objects with position, matched sequence, and similarity percentage.
 *
 * Note:
 * - This is a simplified linear comparison, not a full alignment algorithm.
 * - For advanced bioinformatics needs, we will consider Smith-Waterman, Needleman-Wunsch,
 *   or libraries like Biopython or NCBI BLAST.
 */

const analyzeSequences = async (proteinSequence, genomeSequence, minSimilarity) => {
  const results = {
    totalMatches: 0,
    matchDetails: []
  };

  // Clean sequences (remove whitespace, newlines)
  const cleanProtein = proteinSequence.replace(/\s+/g, '').toUpperCase();
  const cleanGenome = genomeSequence.replace(/\s+/g, '').toUpperCase();

  if (!cleanProtein || !cleanGenome) {
    throw new Error('Invalid sequence data');
  }

  const proteinLength = cleanProtein.length;
  const genomeLength = cleanGenome.length;

  // Sliding window approach to find matches
  for (let i = 0; i <= genomeLength - proteinLength; i++) {
    const genomeSegment = cleanGenome.substring(i, i + proteinLength);
    const similarity = calculateSimilarity(cleanProtein, genomeSegment);

    if (similarity >= minSimilarity) {
      results.totalMatches++;
      results.matchDetails.push({
        position: i,
        sequence: genomeSegment,
        similarity: Math.round(similarity * 100) / 100
      });
    }
  }

  return results;
};

const calculateSimilarity = (seq1, seq2) => {
  if (seq1.length !== seq2.length) {
    return 0;
  }

  let matches = 0;
  for (let i = 0; i < seq1.length; i++) {
    if (seq1[i] === seq2[i]) {
      matches++;
    }
  }

  return (matches / seq1.length) * 100;
};

module.exports = { analyzeSequences };