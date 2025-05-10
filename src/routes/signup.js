/**
 * This module routes the user sign up to the server POST endpoint
*/

const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { sendSignupNotification } = require('../emailService');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // save to firestore
        await db.collecion('signups').add({
            name,
            email,
            message: message || '',
            createdAt: new Date()
        });

        await sendSignupNotification({ name, email, message });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error processing signup:', error);
        res.status(500).json({ success: false, error: 'Server error'});
    }
});

module.exports = router;