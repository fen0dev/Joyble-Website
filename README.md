# Joyble Landing Page

A professional landing page for Joyble with signup functionality for the test program.

## Features

- Responsive landing page
- User signup form with validation
- Firebase integration for data storage
- SendGrid email notifications
- Security measures including rate limiting and input sanitization
- Fallback logging for when email notifications fail

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file:
   ```
   EMAIL_USER=em8440.joyble.dk
   EMAIL_PASS=your_sendgrid_api_key
   NOTIFICATION_EMAIL=contact@joyble.dk
   SEND_USER_CONFIRMATION=true
   NODE_ENV=production
   PORT=8080
   ENABLE_FALLBACK_LOGGING=true
   ADMIN_PASSWORD=your_secure_password
   ```
4. Place your Firebase `serviceAccountKey.json` in the `src` directory
5. Run development server: `npm run dev`
6. Run production server: `npm start`

## Deployment

1. Ensure environment variables are set correctly
2. Deploy to your preferred hosting service
3. Set up your domain and SSL certificate
4. Configure DNS settings

## API Endpoints

- `/api/signup` - Submit signup form
- `/api/admin/signups` - View recent signups (Basic Auth protected)

## Accessing Signup Data

Access signup data through:
1. Firebase Firestore database
2. Email notifications sent to NOTIFICATION_EMAIL
3. Backup logs at `/logs/signups.log`
4. Admin API endpoint: `/api/admin/signups` (Basic Auth: username=admin, password=ADMIN_PASSWORD)

## Troubleshooting

If emails are not being sent:
1. Check the SendGrid API key permissions
2. Verify sender domain authentication in SendGrid
3. Check server logs for detailed error messages
4. Access backup signup data through the admin endpoint or log files

## License

ISC