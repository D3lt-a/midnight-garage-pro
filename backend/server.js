require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT;

const db = require('./configs/db');

const userRoutes = require('./routes/userRoute');
const carRoutes = require('./routes/carRoutes');
const servRoutes = require('./routes/servRoutes');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/services', servRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Midnight Garage Pro Backend!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});