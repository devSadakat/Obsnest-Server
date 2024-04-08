const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Use Middleware
app.use(cors());
app.use(express.json());

// Connect With MongoDB //



// Get Api
app.get('/', (req, res) => {
    res.send('Get Api Is Working Properly.')
});

// Listen port
app.listen(port, () => {
    console.log(`Obsnest Server is running on port :${port}`)
});