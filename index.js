const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = 5000;

// middleware:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.muank.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const services = database.collection("services");

        // get api:2
        app.get('/services', async (req, res) => {
            const cursor = services.find({});
            const serviceItems = await cursor.toArray();
            res.send(serviceItems);
        });

        // get single service:3
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await services.findOne(query);
            res.json(service);
        })

        // post api:1
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await services.insertOne(service);
            console.log(result);
            res.json(result);
        });
        
        // delete api:4
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await services.deleteOne(query);
            res.json();
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Node js server open now!');
});

app.listen(port, () => {
    console.log(`This app listening from prot: ${port}`);
})