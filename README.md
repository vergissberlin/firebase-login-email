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
let firebase = require('firebase/app');
require('firebase/auth');

let app = firebase.initializeApp({
    apiKey: "<Your Firebase API Key>",
    authDomain: "<Your Project ID>.firebaseapp.com"
});

FirebaseLoginEmail(app, {
        email: "<Your Email>",
        password: "<Your Password>"
    },
    function (error, user) {
        console.log(user.uid);
    }
);
```

## Support

Please report issues to [ticket system](https://github.com/vergissberlin/firebase-login-email/issues).
Pull requests are welcome here!

## Contributing

1. Fork it
2. Create your feature branch (`git flow feature start my-new-feature`)
3. Commit your changes (`git commit -am 'Add code'`)
4. Finish your implementation (`git flow feature finish my-new-feature`)
5. Push to origin (`git push origin`)
6. Create new Pull Request

## Install locally

```bash
cd /path/to/firebase-login-email/
npm install
export FIREBASE_API_KEY=<YOUR_API_KEY>
export FIREBASE_AUTH_DOMAIN=<YOUR_PROJECT_ID>.firebaseapp.com
export FIREBASE_EMAIL=<test@email.com>
export FIREBASE_PASSWORD=<1234567>
node tests/integration/firebase-login-email-integration.js
```

## Thanks to

1. A special thanks to the developers of **NodeJS** and **Firebase**.


---
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/vergissberlin/firebase-login-email/trend.png)](https://bitdeli.com/free "Bitdeli Badge") [![Greenkeeper badge](https://badges.greenkeeper.io/vergissberlin/firebase-login-email.svg)](https://greenkeeper.io/)
