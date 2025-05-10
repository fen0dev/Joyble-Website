/**
 * This module is Joyble's server for this very landing page
 * 
 * Handles Form submission and automated email reply
*/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

// security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"],
            scriptSrc: ["'self'"]
        }
    }
}));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://joyble.dk' : 'http:localhost:3000',
    methods: ['GET' ,'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// rate limiting - general API limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later'
});

// more strict limit for signup endpoint
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later'
});

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(apiLimiter);

// routes
app.post('/api/signup', signupLimiter, require('./src/routes/signup'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Something went wrong on the server'
    });
});
  

app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});