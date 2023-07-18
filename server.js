const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001
const app = express();
const dbPath = path.join(__dirname, 'db', 'db.json');

// Middleware to parse JSON in request body
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET /api/notes - Read and return all saved notes
app.get('/api/notes', (req, res) => {
  const notesData = fs.readFileSync(dbPath, 'utf8');
  const notes = JSON.parse(notesData);
  res.json(notes);
});

// POST /api/notes - Receive new note, add to db.json, and return the new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate a unique id for the new note

  const notesData = fs.readFileSync(dbPath, 'utf8');
  const notes = JSON.parse(notesData);
  notes.push(newNote);

  fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2), 'utf8');

  res.json(newNote);
});

// Other server setup and routes...

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
