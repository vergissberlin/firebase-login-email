// Requirements
var Firebase = require('firebase');
var FirebaseLoginEmail = require('../../dist/firebase-login-email');

// Login process
var ref = new Firebase('https://' + process.env.FIREBASE_ID + '.firebaseio.com');
FirebaseLoginEmail(ref, {
    email: process.env.FIREBASE_EMAIL,
    password: process.env.FIREBASE_PASSWORD
}, function (error, data) {
    if (error !== null) {
        console.log(error);
        process.exit(1);
    } else {
        console.log(data);
        process.exit(0);
    }
});

// Check exit code
process.on('exit', function (code) {
    console.log('About to exit with code:', code);
});
