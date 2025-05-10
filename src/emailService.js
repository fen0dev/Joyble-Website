/**
 * This module handles the automated emails to be sent to the development team
 * After user sign up for test program
*/

const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

let transporter;

try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} catch (error) {
    console.error('failed to create email transporter:', error);
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
    if (!transporter) {
      throw new Error('Email service not configured correctly');
    }
    
    try {
      // Sanitize user data for email
      const sanitizedName = sanitizeForEmail(userData.name);
      const sanitizedEmail = sanitizeForEmail(userData.email);
      const sanitizedMessage = sanitizeForEmail(userData.message || 'No message provided');
      
      const mailOptions = {
        from: `"Joyble Test Program" <${process.env.EMAIL_USER}>`,
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
        await sendConfirmationToUser(sanitizedEmail, sanitizedName);
      }
  
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
};

const sendConfirmationToUser = async (email, name) => {
    try {
      const mailOptions = {
        from: `"Joyble" <${process.env.EMAIL_USER}>`,
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
  
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('User confirmation email failed:', error);
      // Don't throw error here, as this is optional and shouldn't block the signup process
    }
  };

module.exports = { sendSignupNotification, sendConfirmationToUser };