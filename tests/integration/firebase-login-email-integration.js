/*
 Before run test, input follow on your CLI
 export FIREBASE_API_KEY=<YOUR-FIREBASE-API-KEY>
 export FIREBASE_AUTH_DOMAIN=<YOUR-PROJECT-ID>.firebaseapp.com
 export FIREBASE_EMAIL=<YOUR-EMAIL>
 export FIREBASE_PASSWORD=<YOUR-PASSWORD>

 If you already done this, and setup your Firebase Account
 you can run the test with:

 node tests/integration/firebase-login-email-integration.js
 */

const required = ['FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_EMAIL', 'FIREBASE_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error('Missing required env vars for integration test:', missing.join(', '));
  console.error('Set them first, e.g.: export FIREBASE_EMAIL=your@email.com');
  process.exit(1);
}

const { initializeApp } = require('firebase/app');
const FirebaseLoginEmail = require('../../dist/firebase-login-email');

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
});

new FirebaseLoginEmail(
  app,
  {
    email: process.env.FIREBASE_EMAIL,
    password: process.env.FIREBASE_PASSWORD,
  },
  (error, data) => {
    if (error !== null) {
      console.log(error);
      process.exit(1);
    }
    process.exit(0);
  }
);

process.on('exit', (code) => {
  console.log('About to exit with code:', code);
});
