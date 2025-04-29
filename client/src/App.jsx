import React, { useState } from 'react';
import './App.css';
import hebrewWordDefinitions from '../../server/hebrewWordDefinitions.json'; // Assuming you have this

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedWordInfo, setSelectedWordInfo] = useState(null);

  const searchHebrew = async () => {
    try {
      const response = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      // Ensure your backend now returns 'book' and 'chapter' in the results
      setResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleWordClick = (word) => {
    const definition = hebrewWordDefinitions[word] || 'No definition found.';
    // Use the passed verseObject to get book and chapter for filtering
    const otherVerses = results
      .filter(result => result.text.includes(word))
      .map(result => `${result.book} ${result.chapter}:${result.verse}`);
    setSelectedWordInfo({ word, definition, otherVerses });
  };

  return (
    <div className="App">
      <h1>Hebrew Bible Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Hebrew..."
      />
      <button onClick={searchHebrew}>Search</button>

      {selectedWordInfo && (
        <div className="word-info-popup">
          <h3>{selectedWordInfo.word}</h3>
          <p><strong>Definition:</strong> {selectedWordInfo.definition}</p>
          {selectedWordInfo.otherVerses.length > 0 && (
            <div>
              <p><strong>Also found in:</strong></p>
              <ul>
                {selectedWordInfo.otherVerses.map((verseRef) => (
                  <li key={verseRef}>{verseRef}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setSelectedWordInfo(null)}>Close</button>
        </div>
      )}

<ul>
  {results.map((result) => (
    <li key={`${result.book}-${result.chapter}-${result.verse}`}> 
      <strong>Verse:</strong> {result.book} {result.chapter}:{result.verse}{' '}
      {result.text.split(/(\s+)/).map((word, index) => (
        <span
          key={`${result.book}-${result.chapter}-${result.verse}-${index}`} 
          style={{ cursor: 'pointer', margin: '0 5px' }}
          onClick={() => handleWordClick(word, result)} 
        >
          {word}
        </span>
      ))}
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;