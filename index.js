const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Use Middleware
app.use(cors());
app.use(express.json());

//___________________________________ __// MongoDB //________________________________//
// /---/ /---/ /---/ /---/ /---/ /---/ /---/ /---/ /---/ /---/ /---/ /---/ /---/ //

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@s-cluster0.pvehgyn.mongodb.net/?retryWrites=true&w=majority&appName=S-Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // DataCollections (From MongoDb - NoSQL Dtabase)
        const dataCollection = client.db('obsnest').collection('procuctData');

        // Get Api
        app.get('/', (req, res) => {
            res.send('Get Api Is Working Properly.')
        });

        app.get('/productData', async (req, res) => {
            const result = await dataCollection.find().toArray();
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // const collectedData = client.db("obsnest").collection("productData");

        //_________________________________// Get Operation //_____________________________//

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
// // // // // // // // //----------END MongoDb-----------// // // // // // // // // //



// Listen port
app.listen(port, () => {
    console.log(`Obsnest Server is running on port :${port}`)
});