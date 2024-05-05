const express = require('express');
const cors = require('cors');
require ('dotenv').config();
const app = express();

// Port
const port = process.env.PORT || 5000;

// Use of middleware
app.use(cors());
app.use(express.json());

// Get Apies
app.get('/', async(req, res)=>{
    const result = "Obsnest Banckend Server Is Running Propperly";
    res.sendStatus(result);
});

// Listen Apies
app.listen(port, () => {
        console.log(`Started Server on port${port}`);
});