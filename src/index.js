require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));;

// Define Song model schema
const songSchema = new mongoose.Schema({
    album: String,
    artist: String,
    duration: Number,
    genre: String,
    id: String,
    image: String
}, { collection: 'musicColl' });

// Create Song model
const Music = mongoose.model('Music', songSchema, 'musicColl');

// Define routes for CRUD operations
app.get('/music', async (req, res) => {
    try {
      const music = await Music.findOne({}, {music:1, _id:0});
      res.json( music );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Create a new song
app.post('/music', async (req, res) => {
    try {
      const song = new Music(req.body);
      const savedSong = await song.save();
      res.json(savedSong);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get a single song by id
app.get('/music/:id', async (req, res) => {
    try {
      const music = await Music.findById(req.params.id);
      res.json(music);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Update a song by id
app.put('/music/:id', async (req, res) => {
    try {
      const music = await Music.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(music);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Delete a song by id
app.delete('/music/:id', async (req, res) => {
    try {
      const music = await Music.findByIdAndDelete(req.params.id);
      res.json(music);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

