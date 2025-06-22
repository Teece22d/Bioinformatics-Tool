import React, { useState } from 'react';
import { useAuth } from '../utils/auth';
import api from '../services/api';

const Home = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    proteinFile: null,
    genomeFile: null,
    matchPercentage: 80
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0]
    });
  };

  const handlePercentageChange = (e) => {
    setFormData({
      ...formData,
      matchPercentage: parseFloat(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    if (!formData.proteinFile || !formData.genomeFile) {
      setError('Please select both protein and genome files');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('protein', formData.proteinFile);
      formDataToSend.append('genome', formData.genomeFile);
      formDataToSend.append('matchPercentage', formData.matchPercentage);

      const response = await api.post('/bioinformatics/analyze', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data.results);
    } catch (error) {
      setError(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bioinformatics Analysis</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="main-content">
        <div className="analysis-form-container">
          <h2>Protein-Genome Analysis</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="analysis-form">
            <div className="form-group">
              <label htmlFor="proteinFile">Protein File (.txt)</label>
              <input
                type="file"
                id="proteinFile"
                name="proteinFile"
                accept=".txt"
                onChange={handleFileChange}
                required
              />
              {formData.proteinFile && (
                <span className="file-info">Selected: {formData.proteinFile.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="genomeFile">Genome File (.txt)</label>
              <input
                type="file"
                id="genomeFile"
                name="genomeFile"
                accept=".txt"
                onChange={handleFileChange}
                required
              />
              {formData.genomeFile && (
                <span className="file-info">Selected: {formData.genomeFile.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="matchPercentage">Match Percentage (%)</label>
              <input
                type="number"
                id="matchPercentage"
                name="matchPercentage"
                min="0"
                max="100"
                step="0.1"
                value={formData.matchPercentage}
                onChange={handlePercentageChange}
                required
              />
              <small>Minimum similarity percentage for matches</small>
            </div>

            <button type="submit" disabled={loading} className="analyze-btn">
              {loading ? 'Analyzing...' : 'Analyze Sequences'}
            </button>
          </form>
        </div>

        {results && (
          <div className="results-container">
            <h3>Analysis Results</h3>
            <div className="results-summary">
              <p><strong>Total Matches Found:</strong> {results.totalMatches}</p>
              <p><strong>Minimum Similarity:</strong> {formData.matchPercentage}%</p>
            </div>

            {results.matchDetails && results.matchDetails.length > 0 && (
              <div className="match-details">
                <h4>Match Details</h4>
                <div className="matches-list">
                  {results.matchDetails.slice(0, 10).map((match, index) => (
                    <div key={index} className="match-item">
                      <div className="match-info">
                        <span><strong>Position:</strong> {match.position}</span>
                        <span><strong>Similarity:</strong> {match.similarity}%</span>
                      </div>
                      <div className="match-sequence">
                        <strong>Sequence:</strong> {match.sequence.substring(0, 50)}
                        {match.sequence.length > 50 && '...'}
                      </div>
                    </div>
                  ))}
                  {results.matchDetails.length > 10 && (
                    <p className="more-results">
                      ... and {results.matchDetails.length - 10} more matches
                    </p>
                  )}
                </div>
              </div>
            )}

            {results.totalMatches === 0 && (
              <div className="no-matches">
                <p>No matches found with the specified similarity threshold.</p>
                <p>Try reducing the match percentage for more results.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;