import React, { useState } from 'react';
import './App.css';
import hebrewVerses from './hebrewData.json'; // Import the verse data
import hebrewWordDefinitions from './hebrewWordDefinitions.json'; // Import the definitions

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedWordInfo, setSelectedWordInfo] = useState(null);

  // Client-side search implementation
  const searchHebrew = () => {
    const normalizedQuery = query.normalize('NFC');
    const matches = hebrewVerses
      .filter(verseObj => {
        const text = verseObj.text.normalize('NFC');
        return text.includes(normalizedQuery);
      })
      .map(verseObj => ({
        book: verseObj.book,
        chapter: verseObj.chapter,
        verse: verseObj.verse,
        text: verseObj.text,
      }));
    setResults(matches);
  };

  const handleWordClick = (word) => {
        const definition = hebrewWordDefinitions[word] || 'No definition found.';
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
            <strong>Verse:</strong> {result.book} {result.chapter}:{result.verse}
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
