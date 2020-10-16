const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const fileUpload=require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.dyvn0.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('service'))
app.use(fileUpload());


const port = 5000

app.get('/', (req, res) => {
    res.send('hello')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    console.log(err)

    const CustomerCollection = client.db("CreativeAgency").collection("customer");
    const OrderCollection = client.db("CreativeAgency").collection("order");
    const ServiceCollection = client.db("CreativeAgency").collection("service");


    app.post('/addCustomer', (req, res) => {

        const order = req.body;
        console.log(order)
        OrderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/Findorder', (req, res) => {

        // const customers=req.body;
        OrderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

////////////////////////////////////////////////////////////////

    app.post('/CustomerReview', (req, res) => {

        const review = req.body;
        console.log(review)
        CustomerCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/FindCustomer', (req, res) => {

        // const customers=req.body;
        CustomerCollection.find({}).limit(5)
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    
////////////////////////////////////////////////////////////////


    app.post('/AddService', (req, res) => {

        const review = req.body;
        ServiceCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/FindService', (req, res) => {

       ServiceCollection.find({}).limit(5)
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
  
});

app.listen(port);