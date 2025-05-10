/**
 * This module routes the user sign up to the server POST endpoint
*/

const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { sendSignupNotification } = require('../emailService');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const validateSignup = [
    // name validation
    body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),

    // email validation
    body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

    // message sanitization
    body('message')
    .optional()
    .trim()
    .customSanitizer(value => {
        // sanitize HTML content to prevent XSS
        return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
        });
    })
];

router.post('/', validateSignup, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, message } = req.body;

        // save to firestore
        await db.collection('signups').add({
            name,
            email,
            message: message || '',
            createdAt: new Date(),
            ipAddress: req.ip 
        });

        await sendSignupNotification({ name, email, message });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error processing signup:', error);
        res.status(400).json({ success: false, error: 'Authentication error'});
        res.status(500).json({ success: false, error: 'Server error processing request'});
    }
});

module.exports = router;