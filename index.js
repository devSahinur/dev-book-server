const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1zupo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5500;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("devBookStore").collection("books");
  const ordersCollection = client.db("devBookStore").collection("orders");
  
    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        booksCollection.insertOne(newBook)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })
    app.post('/addOrder', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        ordersCollection.insertOne(newBook)
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
    app.get('/orders', (req, res) => {
        ordersCollection.find({})
        .toArray((err, document) => {
            res.send(document)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        ordersCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => {
            console.log(result);
        })
    })
    app.delete('/post/:id', (req, res) => {
        booksCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => {
            console.log(result);
        })
    })

});


app.listen(port)