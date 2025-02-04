const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Initialize a fake database of games
let games = [];

// GET request to retrieve the list of games
app.get('/games', (req, res) => {
  res.json(games);
});

// POST request to handle game uploads
app.post('/upload', upload.single('gameFile'), (req, res) => {
  const { gameName } = req.body;
  const gameFile = req.file;

  if (!gameName || !gameFile) {
    return res.status(400).json({ success: false, message: 'Please provide a game name and file.' });
  }

  // Add the new game to the fake database
  const newGame = {
    id: games.length + 1,
    name: gameName,
    filePath: `/uploads/${gameFile.filename}`, // Store the file path
  };
  games.push(newGame);

  res.json({ success: true, message: 'Game uploaded successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
