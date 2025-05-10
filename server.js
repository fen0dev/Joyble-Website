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
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "https://joyble-app.firebaseio.com", "https://identitytoolkit.googleapis.com"]
        }
    }
}));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://joyble.dk' : 'http://localhost:8080',
    methods: ['GET' ,'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// rate limiting - general API limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, // Increased for static assets
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
app.use(bodyParser.urlencoded({ extended: true }));

// Static files middleware with correct MIME types
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(apiLimiter);

// routes - initialize with router
const signupRouter = require('./src/routes/signup');
const adminRouter = require('./src/routes/admin');

app.use('/api/signup', signupLimiter, signupRouter);
app.use('/api/admin', adminRouter);

// 404 handler - must come after all valid routes
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
});

// Error handler - must be last
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
      success: false,
      error: 'Something went wrong on the server'
    });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});