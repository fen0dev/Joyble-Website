/**
 * This module handles the automated emails to be sent to the development team
 * After user sign up for test program
*/

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendSignupNotification = async (userData) => {
    try {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: 'contact@joyble.dk',
            subject: 'New Tester Sign Up',
            html: `<p>New sign-up from: ${userData.name}</p>
                <p>Email: ${userData.email}</p>
                <p>Message: ${userData.message || 'No message provided'}</p>`
        };

        return await transporter.sendMail(mailOption);
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

module.exports = { sendSignupNotification };