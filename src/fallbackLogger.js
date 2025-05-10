/**
 * Fallback logger for when email notifications fail
 * This ensures we don't lose signup data even if emails aren't working
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file path
const signupLogPath = path.join(logsDir, 'signups.log');

/**
 * Log signup data to a file as a fallback when email notifications fail
 */
const logSignup = (userData) => {
  try {
    const { name, email, message = '' } = userData;
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      name,
      email,
      message,
    };
    
    // Append to log file
    fs.appendFileSync(
      signupLogPath,
      JSON.stringify(logEntry) + '\n',
      'utf8'
    );
    
    console.log(`Signup data logged to ${signupLogPath}`);
    return true;
  } catch (error) {
    console.error('Error logging signup data to file:', error);
    return false;
  }
};

/**
 * Get recent signups from the log file
 */
const getRecentSignups = (limit = 10) => {
  try {
    if (!fs.existsSync(signupLogPath)) {
      return [];
    }
    
    const content = fs.readFileSync(signupLogPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    return lines
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(entry => entry !== null)
      .slice(-limit)
      .reverse(); // Most recent first
  } catch (error) {
    console.error('Error reading signup log:', error);
    return [];
  }
};

module.exports = { logSignup, getRecentSignups };