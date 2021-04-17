const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhp8f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());




const port = 5550

app.get('/', (req, res) => {
    res.send('Hello from db its working fine')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
    const bookingsCollection = client.db("greenGround").collection("bookings");
    const servicesCollection = client.db("greenGround").collection("services");
    const reviewsCollection = client.db("greenGround").collection("reviews");
    const adminsCollection = client.db("greenGround").collection("admins");

    console.log('Database connected successfully');

    app.post('/addService', (req, res) => {
        const newService = req.body;
        servicesCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
                res.redirect('/');
            })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/services/:id', (req, res) => {
        console.log(req.params.id);
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewsCollection.insertOne(review)
            .then(result => {

                console.log(result);

                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        reviewsCollection.find()
            .toArray((err, document) => {
                res.send(document);
                console.log(document);
            })
    })

    app.post('/addBooking', (req, res) => {
        const bookings = req.body;
        bookingsCollection.insertOne(bookings)
            .then(result => {

                console.log(result);

                res.send(result.insertedCount > 0)
            })
    })


    app.post('/bookings', (req, res) => {
        const date = req.body;
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admins) => {
                const filter = { date: date.date }
                if (admins.length === 0) {
                    filter.email = email;
                }
                bookingsCollection.find(filter)
                    .toArray((err, documents) => {
                        console.log(email, date.date, admins, documents)
                        res.send(documents);
                    })
            })
    })



    app.get('/bookings', (req, res) => {
        bookingsCollection.find()
            .toArray((err, document) => {
                res.send(document);
                console.log(document);
            })
    })

    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminsCollection.insertOne(admin)
            .then(result => {

                console.log(result);

                res.send(result.insertedCount > 0)
            })
    })

    app.get('/admins', (req, res) => {
        adminsCollection.find()
            .toArray((err, document) => {
                res.send(document);
                console.log(document);
            })
    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })



    app.get('/services/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })



});

app.listen(process.env.PORT || port);