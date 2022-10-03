'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

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

async function getBooks(request, response) {
  try {
    const results = await Book.find();
    response.status(200).send(results);
  } catch (error) {
    response.status(500).send(error);
  }
}

