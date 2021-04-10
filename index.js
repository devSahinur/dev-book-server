const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1zupo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("devBookStore").collection("books");
  
    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        booksCollection.insertOne(newBook)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/books', (req, res) => {
        booksCollection.find({})
        .toArray((err, document) => {
            res.send(document)
        })
    })
});


app.listen(port)