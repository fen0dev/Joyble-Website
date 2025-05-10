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
    console.log('Received signup request:', req.body);
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
        const docRef = await db.collection('signups').add({
            name,
            email,
            message: message || '',
            createdAt: new Date(),
            ipAddress: req.ip
        });

        console.log(`User signup saved to Firebase with ID: ${docRef.id}`);

        // Try to send notification email, but don't block signup if it fails
        try {
            const emailResult = await sendSignupNotification({ name, email, message });
            if (emailResult && emailResult.skipped) {
                console.log('Email notification skipped:', emailResult.reason || 'Unknown reason');
            } else {
                console.log('Email notification sent successfully');
            }
        } catch (emailError) {
            console.error('Failed to send email notification, but signup was saved:', emailError);
            // Continue with success response anyway - signup was saved
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error processing signup:', error);
        // Log more detailed error info for debugging
        if (error.stack) console.error(error.stack);
        if (error.code) console.error('Error code:', error.code);

        if (error.code && error.code.startsWith('auth/')) {
            return res.status(400).json({ success: false, error: 'Authentication error'});
        }
        return res.status(500).json({ success: false, error: 'Server error processing request: ' + error.message});
    }
});

module.exports = router;