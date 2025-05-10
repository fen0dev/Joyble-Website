/**
 * This module handles the automated emails to be sent to the development team
 * After user sign up for test program
*/

// Make sure to load environment variables
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const sanitizeHtml = require('sanitize-html');

// Initialize SendGrid with API key
try {
    // Log configuration for debugging
    console.log('Email configuration:');
    console.log(`- Using sender domain: ${process.env.EMAIL_USER}`);
    console.log(`- Notification email: ${process.env.NOTIFICATION_EMAIL}`);
    console.log(`- Environment: ${process.env.NODE_ENV}`);

    // Set API key for SendGrid
    sgMail.setApiKey(process.env.EMAIL_PASS);
    console.log('SendGrid initialized with API key');

    // Verify the API key is working
    sgMail.client.request({
        method: 'GET',
        url: '/v3/user/credits',
    })
    .then(() => console.log('✅ SendGrid API key validated successfully'))
    .catch(error => {
        console.error('❌ SendGrid API key validation error:', error.message);
    });
} catch (error) {
    console.error('Failed to initialize SendGrid:', error);
}

// Sanitize content for email
const sanitizeForEmail = (content) => {
    if (!content) return '';
    
    return sanitizeHtml(content, {
      allowedTags: [], // No HTML tags allowed
      allowedAttributes: {},
      disallowedTagsMode: 'discard'
    });
  };

const sendSignupNotification = async (userData) => {
    try {
      // Force email sending regardless of environment (we're in production)
      console.log(`Current environment: ${process.env.NODE_ENV || 'not set'}`);

      // Only log this for debugging, but always try to send emails
      if (process.env.NODE_ENV !== 'production') {
        console.log('Note: Not in production mode, but sending email anyway');
      }

      // Sanitize user data for email
      const sanitizedName = sanitizeForEmail(userData.name);
      const sanitizedEmail = sanitizeForEmail(userData.email);
      const sanitizedMessage = sanitizeForEmail(userData.message || 'No message provided');

      // Use the SendGrid designated sender
      const msg = {
        from: `noreply@${process.env.EMAIL_USER}`, // Format sender based on verified domain
        to: process.env.NOTIFICATION_EMAIL || 'contact@joyble.dk',
        subject: 'New Joyble Test Program Signup',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4dc0e0;">New Test Program Signup!</h2>
            <p><strong>Name:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> ${sanitizedEmail}</p>
            <p><strong>Message:</strong> ${sanitizedMessage}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #888; font-size: 12px;">This is an automated notification from the Joyble website.</p>
          </div>
        `,
        // Text version for clients that don't support HTML
        text: `New Test Program Signup!\n\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nMessage: ${sanitizedMessage}\nTime: ${new Date().toLocaleString()}\n\nThis is an automated notification from the Joyble website.`
      };

      // Optional: Send a confirmation email to the user as well
      const sendUserConfirmation = process.env.SEND_USER_CONFIRMATION === 'true';

      if (sendUserConfirmation) {
        try {
          await sendConfirmationToUser(sanitizedEmail, sanitizedName);
        } catch (err) {
          console.error('User confirmation email failed:', err);
          // Don't rethrow - we still want to try sending the notification email
        }
      }

      console.log('Sending notification email via SendGrid:');
      console.log(`- From: noreply@${process.env.EMAIL_USER}`);
      console.log(`- To: ${process.env.NOTIFICATION_EMAIL || 'contact@joyble.dk'}`);
      console.log(`- Subject: New Joyble Test Program Signup`);

      // Send the email
      const response = await sgMail.send(msg);
      console.log(`✅ Notification email sent successfully! Status: ${response[0].statusCode}`);
      console.log(`Response headers: ${JSON.stringify(response[0].headers)}`);
      
      return { success: true };

    } catch (error) {
      console.error('Email sending failed:', error);
      if (error.response) {
        console.error('SendGrid error details:', error.response.body);
      }
      // Log but don't throw - allow the signup to complete without email
      return { error: error.message, skipped: true };
    }
};

const sendConfirmationToUser = async (email, name) => {
    try {
      // Use the SendGrid designated sender
      const msg = {
        from: `noreply@${process.env.EMAIL_USER}`, // Format sender based on verified domain
        to: email,
        subject: 'Welcome to the Joyble Test Program',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4dc0e0;">Thank You for Signing Up!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for signing up for the Joyble Test Program. We've received your application and will be in touch shortly with next steps.</p>
            <p>In the meantime, feel free to join our Discord community where you can connect with us as well as other testers and get exclusive updates:</p>
            <p style="text-align: center;">
              <a href="https://discord.gg/joyble" style="display: inline-block; background-color: #5856f2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Our Discord</a>
            </p>
            <p>If you have any questions, feel free to reply to this email!</p>
            <p>Best regards,<br>The Joyble Team</p>
          </div>
        `,
        text: `Thank You for Signing Up!\n\nHello ${name},\n\nThank you for signing up for the Joyble Test Program. We've received your application and will be in touch shortly with next steps.\n\nIn the meantime, feel free to join our Discord community where you can connect with other testers and get exclusive updates: https://discord.gg/joyble\n\nIf you have any questions, feel free to reply to this email!\n\nBest regards,\nThe Joyble Team`
      };

      console.log(`Sending confirmation email to user: ${email}`);
      console.log(`- From: noreply@${process.env.EMAIL_USER}`);

      // Send the email
      const response = await sgMail.send(msg);
      console.log(`✅ User confirmation email sent successfully! Status: ${response[0].statusCode}`);
      return { success: true };
    } catch (error) {
      console.error('User confirmation email failed:', error);
      if (error.response) {
        console.error('SendGrid error details:', error.response.body);
      }
      // Don't throw error here, as this is optional and shouldn't block the signup process
      return { error: error.message, skipped: true };
    }
  };

module.exports = { sendSignupNotification, sendConfirmationToUser };