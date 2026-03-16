# Contributing

Thank you for considering contributing to firebase-login-email.

## Support

Please report issues to the [ticket system](https://github.com/vergissberlin/firebase-login-email/issues).  
Pull requests are welcome.

## How to contribute

1. Fork the repository.
2. Create your feature branch (`git flow feature start my-new-feature`).
3. Commit your changes (`git commit -am 'Add code'`).
4. Finish your implementation (`git flow feature finish my-new-feature`).
5. Push to origin (`git push origin`).
6. Open a new Pull Request.

## Install locally

```bash
cd /path/to/firebase-login-email/
pnpm install
export FIREBASE_API_KEY=<YOUR_API_KEY>
export FIREBASE_AUTH_DOMAIN=<YOUR_PROJECT_ID>.firebaseapp.com
export FIREBASE_EMAIL=<test@email.com>
export FIREBASE_PASSWORD=<1234567>
pnpm run test:integration
```

## Testing

**Unit tests** (Firebase is mocked; no credentials needed):

```bash
pnpm install
pnpm test
```

**Integration test** (uses real Firebase; set env vars first):

```bash
export FIREBASE_API_KEY=<YOUR_API_KEY>
export FIREBASE_AUTH_DOMAIN=<YOUR_PROJECT_ID>.firebaseapp.com
export FIREBASE_EMAIL=<test@email.com>
export FIREBASE_PASSWORD=<1234567>
pnpm run test:integration
```
