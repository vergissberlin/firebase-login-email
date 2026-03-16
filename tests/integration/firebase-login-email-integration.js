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

// Requirements
var { initializeApp } = require('firebase/app');
var FirebaseLoginEmail = require('../../dist/firebase-login-email');

// Initialize Firebase app
var app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN
});

// Login process
FirebaseLoginEmail(app, {
    debug: true,
    email: process.env.FIREBASE_EMAIL,
    password: process.env.FIREBASE_PASSWORD
}, function (error, data) {
    if (error !== null) {
        console.log(error);
        process.exit(1);
    } else {
        //console.log(data);
        process.exit(0);
    }
});

// Check exit code
process.on('exit', function (code) {
    console.log('About to exit with code:', code);
});
