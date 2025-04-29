// server/HebrewData.js (example - adjust based on your actual code)
const express = require('express');
const cors = require('cors');
const hebrewVerses = require('./hebrewData.json'); // Assuming your data is now structured with book/chapter

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/search', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'No query provided' });

  const normalizedQuery = query.normalize('NFC');

  const matches = hebrewVerses
    .map(verseObj => {
      const text = verseObj.text.normalize('NFC');
      const matchCount = (text.match(new RegExp(normalizedQuery, 'g')) || []).length;
      return matchCount > 0 ? {
        book: verseObj.book, // Include book
        chapter: verseObj.chapter, // Include chapter
        verse: verseObj.verse,
        text: verseObj.text,
        count: matchCount
      } : null;
    })
    .filter(Boolean);

  res.json({ results: matches });
});

app.listen(PORT, () => {
  console.log(`🔎 Hebrew search server running at http://localhost:${PORT}`);
});