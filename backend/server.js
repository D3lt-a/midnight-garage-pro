require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./configs/db');

// Import Routes
const userRoutes = require('./routes/userRoute');
const carRoutes = require('./routes/carRoutes');
const servRoutes = require('./routes/servRoutes');
const recordRoutes = require('./routes/recordRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/services', servRoutes);
app.use('/records', recordRoutes);
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Midnight Garage Pro Backend!',
        version: '1.0.0',
        endpoints: {
            users: '/users',
            cars: '/cars',
            services: '/services',
            records: '/records',
            payments: '/payments'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});