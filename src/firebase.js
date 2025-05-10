/**
 * Firebase setup
*/

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databseURL: 'https://joyble-app.firebaseio.com'
});

const db = admin.firestore();
module.exports = { admin, db };