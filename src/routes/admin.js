/**
 * Admin routes for viewing signups when email fails
 * Note: This is a simple implementation and should be properly secured in production
 */

const express = require('express');
const router = express.Router();
const { getRecentSignups } = require('../fallbackLogger');

// Basic auth middleware
const basicAuth = (req, res, next) => {
  // Get auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Parse auth header
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];
  
  // Check credentials (IMPORTANT: Use environment variables in production)
  // This is just a simple example - use a proper authentication system in production
  if (user === 'admin' && pass === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Get recent signups
router.get('/signups', basicAuth, (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const signups = getRecentSignups(limit);
    res.json({ success: true, signups });
  } catch (error) {
    console.error('Error getting signups:', error);
    res.status(500).json({ success: false, error: 'Error fetching signups' });
  }
});

module.exports = router;