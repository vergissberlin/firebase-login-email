firebase-login-email
=====================

[![Dependency Status](https://gemnasium.com/vergissberlin/firebase-login-email.svg)](https://gemnasium.com/vergissberlin/firebase-login-email)


Authenticating Users with Email & Password
------------------------------------------

Firebase makes it easy to integrate email and password authentication into your app. Firebase automatically stores your users' credentials securely (using bcrypt) and redundantly (daily off-site backups).

This separates sensitive user credentials from your application data, and lets you focus on the user interface and experience for your app.
Allows your node applications to authenticate a Firebase reference using Firebase **Simple Login** with _email_ and _password_.


Installation
------------

Install via npm:

```bash
    npm install firebase firebase-login-email
```

Example
-------

```javascript
    var ref = new Firebase('https://<Your Firebase>.firebaseio.com');

    FirebaseLoginEmail(ref, {
            email: "<Your Email>",
            password: "<Your Password>"
        },
        function (error, data) {
            console.log(data.token);
        }
    );
```

Issues
------

Please report issues to [ticket system](https://github.com/vergissberlin/firebase-login-email/issues).
Pull requests are welcome here!

Contributing
------------

1. Fork it
2. Create your feature branch (`git flow feature start my-new-feature`)
3. Commit your changes (`git commit -am 'Add code'`)
4. Finish your implementation (`git flow feature finish my-new-feature`)
4. Push to origin (`git push origin`)
5. Create new Pull Request

Install locally
---------------

```bash
$ cd /path/to/firebase-login-email/
$ npm install
$ export FIREBASE_ID=<YOUR_TEST_ID>
$ export FIREBASE_EMAIL=<test@email.com>
$ export FIREBASE_PASSWORD=<1234567>
$ node tests/integration/firebase-login-email-integration.js
```

<a name="thanks"></a>
Thanks to
---------
1. A special thanks to the developers of **NodeJS** and **Firebase**.
