const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

// Port
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.jhrstoy.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


let cartCollection, productDataCollection, usersCollection;

// Connect to the database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        cartCollection = client.db("obsnest").collection("carts");
        productDataCollection = client.db("obsnest").collection("productData");
        usersCollection = client.db("obsnest").collection("obsnestusers");

    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Call connectToDatabase and start the server
connectToDatabase().then(() => {
    // Get Operation
    // Ping route

    // ---------------------Get Apies-------------
    app.get('/', (req, res) => {
        res.send("Obsnest Backend Server Is Running Properly");
    });

    // ---------------Menu
    app.get('/menudata', async (req, res) => {
        try {
            const cursor = productDataCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        } catch (error) {
            console.log("Error fetching menu data:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    //-------------------- get cart item
    app.get('/carts', async (req, res) => {
        const email = req.query.email;
        if (!email) {
            return res.send([]);
        }
        try {
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        } catch (error) {
            console.log("Error fetching cart data:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // get ObsnestUser data
    app.get('/obsnestusers', async (req, res) => {
        try {
            const result = await usersCollection.find().toArray();
            res.send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send('Data loading problem from database.')
        }
    })

    // ----------------Post Operation-------------

    // ---------------Post User
    app.post('/obsnestusers', async (req, res) => {
        try {
            const user = req.body;
            console.log(user);
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);
            console.log('Esisted Uuser', existingUser);
            if (existingUser) {
                return (res.send({ message: "This User Is Already Exists" }))
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
            // res.status(201).json(result)
        } catch (error) {
            console.log("Sorry, Somthing Went Wrong During Post User Data For Obsnest Market", error);
            res.status(500).json({ message: "Sorry Somthing Went Wrong During Post User Data For Obsnest Market." })
        }
    })

    // ----------------Post Cart
    app.post('/carts', async (req, res) => {
        try {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            if (result.insertedId) {
                res.status(201).send({ insertedId: result.insertedId });
            } else {
                res.status(500).send("Failed to add item in cart");
            }
        } catch (error) {
            console.log("Error during POST operation in cart database:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // -------------------Delete Operations ------------------

    // ToDo: Need to work with delete apies because of difrent code with Programming hero.
    app.delete('/carts/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        } catch (error) {
            console.log("There is some error during deleting process");
            res.status(500).send("Deletning Errro")
        }
    })

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }).on('error', (error) => {
        console.log("Server startup error:", error);
    });
}).catch(error => {
    console.log("Failed to connect to the database. Server not started.", error);
});