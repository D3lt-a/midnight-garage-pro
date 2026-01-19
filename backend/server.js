require('dotenv').config();

const express = require('express');

const app = express();
const db = require('./configs/db');
app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Welcome to Midnight Garage Pro Backend!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});