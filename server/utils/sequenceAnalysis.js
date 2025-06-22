/**
 * Basic sequence analysis utility for protein-genome matching
 * This is a simplified implementation - you may want to integrate
 * more sophisticated bioinformatics libraries like BioPython equivalent
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