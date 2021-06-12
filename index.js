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

app.get('/', (req, res) => {
    res.send('Welcome to DEV Book Shop Server')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("Orders");
  
    console.log('db connect')

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, document) => res.send(document))
    })

    app.get('/search', (req, res) => {
        if (!req.query.keyword) {
            return productCollection.find({})
                .toArray((err, docs) => res.send(docs))
        }
        productCollection.find({ $text: { $search: req.query.keyword } })
            .toArray((err, docs) => res.send(docs))
    })

    app.get('/orders', (req, res) => {
        const queryEmail = req.query.email;
        orderCollection.find({ email: queryEmail })
            .toArray((err, docs) => res.send(docs))
    })

    app.post('/addProduct', (req, res) => {
        productCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => res.send(!!result.insertedCount))
    })

});


app.listen(port)