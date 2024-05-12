const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

// Port
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.jhrstoy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        return client.db("obsnest").collection("productData");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Get menu data
app.get('/menudata', async (req, res) => {
    try {
        const obsnestdata = await connectToDatabase();
        const cursor = obsnestdata.find();
        const result = await cursor.toArray();
        res.send(result);
    } catch (error) {
        console.log("Error fetching menu data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Ping route
app.get('/', (req, res) => {
    res.send("Obsnest Backend Server Is Running Properly");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
    console.log("Server startup error:", error);
});
