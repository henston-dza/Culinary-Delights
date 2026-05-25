const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Frontend folder
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/reservations', require('./src/routes/reservations'));

// Fallback route: Serve Frontend index.html for any other non-API request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/culinary_delights';
console.log('Connecting to MongoDB...');

const startServer = (dbConnected = false) => {
    const server = app.listen(PORT, () => {
        const status = dbConnected ? '' : ' (NO DATABASE)';
        console.log(`Server is running on port ${PORT}${status}`);
        console.log(`Open in browser: http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use!`);
            console.error('Trying alternative port...');
            // Try port 5001
            const altServer = app.listen(5001, () => {
                const status = dbConnected ? '' : ' (NO DATABASE)';
                console.log(`Server is running on port 5001${status}`);
                console.log(`Open in browser: http://localhost:5001`);
            });
            altServer.on('error', (altErr) => {
                console.error('Could not start server on any port:', altErr.message);
                process.exit(1);
            });
        } else {
            console.error('Server error:', err.message);
            process.exit(1);
        }
    });
};

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connection established successfully!');
        startServer(true);
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        console.error('Please make sure your MongoDB service is running (mongod).');
        console.warn('Server will start without database functionality.');
        startServer(false);
    });
