const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zfajy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('SyndicutX_Shop').collection('products');
        const ordersCollection = client.db('SyndicutX_Shop').collection('orders');
        const messagesCollection = client.db('SyndicutX_Shop').collection('messages');
        //Authentication API
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        });
        // Services API for Products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        app.post('/products', async (req, res) => {
            const product = req.body;
            const data = await productsCollection.insertOne(product);
            res.send(data);

        });
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        });
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });
        //API for orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const data = await ordersCollection.insertOne(order);
            res.send(data);
        });
        app.get('/orders', async (req, res) => {
            const query = {};
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            res.send(order);
        },[])
        //API for message
        app.post('/message/:email', async (req, res) => {
            //I will do it later
        })

    } finally {
        
    }
    

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('The warehouse server is running');
});
app.listen(port, () => {
    console.log(`The warehouse server is listening on port ${port}`);
})