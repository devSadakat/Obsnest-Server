const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Use Middleware
app.use(cors());
app.use(express.json());

//_____________________________________// MongoDB //________________________________//


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.jhrstoy.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db('obsnest').collection('productData');

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// // // // // // // // //----------END MongoDb-----------// // // // // // // // // //


// Get Apies
app.get('/', async (req, res) => {
    const result = 'MongoDB Server Is Working Properly.';
    res.send(result);
})


app.get('/data', async (req, res) => {
    try {
        const result = await productCollection.find().toArray();
        res.send(result);
    } catch (err) {
        console.error("Error fetching data from MongoDB:", err);
        res.status(500).send("Error fetching data from MongoDB");
    }
});


// Listen port
app.listen(port, () => {
    console.log(`Obsnest Server is running on port :${port}`)
});