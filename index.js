const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42e2srw.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const serviceCollection = client.db('dental-care').collection('services');
        const reviewCollection = client.db('dental-care').collection('reviews');

        // reading data from database
        app.get('/services', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();

            res.send(services);
        });

        // reading data from database by id
        app.get('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);

            res.send(service);
        });

        // reading limited data for home section
        app.get('/home', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();

            res.send(services);
        });

        // creating a new service to db
        app.post('/services', async(req,res)=>{
            const newService = req.body;
            // console.log(newService);
            const result = await serviceCollection.insertOne(newService);

            res.send(result);
        });

        // api for storing reviews
        app.post('/reviews', async(req, res) => {
            const reviews = req.body;
            // console.log(reviews);
            const result = await reviewCollection.insertOne(reviews);

            res.send(result);
        });
        app.get('/reviews', async(req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
        })
    }
    finally{}
}

run().catch(e=>console.log(e));

app.get('/', (req, res)=>{
    res.send('Dental care server is running...');
});

app.listen(port, ()=>{
    console.log('Dental server is running on: ', port);;
});