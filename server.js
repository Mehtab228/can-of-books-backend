'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

//NEW! dont forget to add
//If req.body is undefined make sure to use this middleware
app.use(express.json());

const Book = require('./models/book.js');

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
db.once('open', function() {
  console.log('Mongoose is connected to mongo')
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/test', (request, response) => {
  response.status(200).send('test request received')
})

app.get('/books', getBooks);

async function getBooks(request, response, next) {
  try {
    const results = await Book.find();
    response.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

//POST endpoint will trigger a create action on our database
app.post('/books', postBooks);

async function postBooks(req, res, next) {
  // double check what gets added to database (for debugging)
  console.log(req.body);
  try {
    // "Book" is the name of the model, .create() is the mongoose method, req.body is the book information
      const newBook = await Book.create(req.body);
      res.status(200).send(newBook);
  } catch (error) {
      next(error);
  }
}

// Delete endpoint

app.delete('/books/:id', deletebook);

async function deletebook(req, res, next) {
  const id = req.params.id;
  console.log(id);
  try {
     await Book.findByIdAndDelete(id);
     res.status(204).send('Successfully Deleted') 
  } catch (error) {
    next(error)
  }
}

app.get('*', (req, res) => {
  res.status(404).send('Not available: 404 Not Found')
});

// Put this error handlinig at the bottom
// it's the last app.use()!
app.use((error, req, res) => {
  res.status(500).send(error.message);
})
