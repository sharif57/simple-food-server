const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PROT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors())
app.use(express.json())

// SimpleFood
// 15CDcoyUu5ce4L3X

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwjeixv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const foodCollection = client.db('SimpleFood').collection('food')


        app.get('/food', async (req, res) => {
            const cursor = foodCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result)
        })

        app.post(('/food'), async (req, res) => {
            const newUsers = req.body;
            // console.log(newUsers);
            const result = await foodCollection.insertOne(newUsers)
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.deleteOne(query)
            res.send(result)
            console.log(result);
        })



        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('simple food is running')
})

app.listen(port, () => {
    console.log(`simple food running on port ${port}`);
})