const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
const port = 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mugev.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("bookStore").collection("books");
  const orderCollection = client.db("bookStore").collection("orders");

  app.post('/addBook', (req, res) => {
    bookCollection.insertOne(req.body)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addOrder', (req, res) => {
    orderCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/allBook', (req, res) => {
    bookCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/book/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    bookCollection.find({ _id: ObjectID(id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.get('/orders', (req, res) => {
    const queryEmail = req.query.email;
    orderCollection.find({ email: queryEmail })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.delete('/delete/:id', (req, res) => {
    bookCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)