# firebase-login-email

[![Release Please](https://github.com/vergissberlin/firebase-login-email/actions/workflows/release-please.yml/badge.svg)](https://github.com/vergissberlin/firebase-login-email/actions/workflows/release-please.yml)
[![npm version](https://img.shields.io/npm/v/firebase-login-email.png)](https://npmjs.org/package/firebase-login-email "View this project on npm")
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vergissberlin/firebase-login-email?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Issues](https://img.shields.io/github/issues/vergissberlin/firebase-login-email.svg)](https://github.com/vergissberlin/firebase-login-email/issues "GitHub ticket system")

## Authenticating Users with Email & Password

Firebase makes it easy to integrate [email and password authentication](https://www.firebase.com/docs/web/guide/login/password.html) into your app. Firebase automatically stores your users' credentials securely (using bcrypt) and redundantly (daily off-site backups).

This separates sensitive user credentials from your application data, and lets you focus on the user interface and experience for your app.
Allows your node applications to authenticate a Firebase reference using Firebase **Simple Login** with _email_ and _password_.

## Important

>
> :heavy_exclamation_mark: Do not embet your credentials on public code!

## Installation

Install via npm:

```bash
npm install firebase firebase-login-email
```

## Example

```javascript
const { initializeApp } = require('firebase/app');
require('firebase/auth');
const FirebaseLoginEmail = require('firebase-login-email');

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
  (error, user) => {
    if (error) {
      console.error('Login failed:', error.message);
      return;
    }
    console.log('Logged in as:', user.uid);
  }
);
```

**Promise-based (async/await):**

```javascript
const { initializeApp } = require('firebase/app');
const { FirebaseLoginEmail } = require('firebase-login-email');

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
});

const user = await FirebaseLoginEmail.login(app, {
  email: process.env.FIREBASE_EMAIL,
  password: process.env.FIREBASE_PASSWORD,
});
console.log('Logged in as:', user.uid);
```

Load credentials from a `.env` file (e.g. with `dotenv`) or set `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_EMAIL`, and `FIREBASE_PASSWORD` in your environment before running.

## Support

Please report issues to the [ticket system](https://github.com/vergissberlin/firebase-login-email/issues).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute, run tests, and install the project locally.

## Thanks to

1. A special thanks to the developers of **NodeJS** and **Firebase**.
