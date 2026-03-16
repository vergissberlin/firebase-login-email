/**
 * FirebaseLoginEmail
 *
 * Authenticating Users with Email & Password
 * Firebase makes it easy to integrate email and password authentication
 * into your app. Firebase automatically stores your users' credentials
 * securely (using bcrypt) and redundantly (daily off-site backups).
 * This separates sensitive user credentials from your application data,
 * and lets you focus on the user interface and experience for your app.
 *
 * @author  André Lademann <vergissberlin@googlemail.com>
 * @link    https://firebase.google.com/docs/auth/web/password-auth
 */
import type { FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth';

/** Credentials for email/password sign-in */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Callback invoked when sign-in completes (error or user). */
export type LoginCallback = (error: Error | null, user: User | null) => void;

class FirebaseLoginEmail {
  constructor(
    app: FirebaseApp = {} as FirebaseApp,
    data: LoginCredentials = { email: '', password: '' },
    callback: LoginCallback = () => {}
  ) {
    if (typeof data.email !== 'string') {
      throw new Error('Data object must have an "email" field!');
    }
    if (typeof data.password !== 'string') {
      throw new Error('Data object must have a "password" field!');
    }

    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        callback(null, userCredential.user);
      })
      .catch((error: unknown) => {
        const err =
          error && typeof error === 'object' && 'code' in error
            ? this.normalizeAuthError(error as { code?: string })
            : new Error('Error logging user in: ' + String(error));
        callback(err, null);
      });
  }

  private normalizeAuthError(error: { code?: string }): Error {
    switch (error.code) {
      case 'auth/invalid-email':
        return new Error('The specified user account email is invalid.');
      case 'auth/wrong-password':
        return new Error('The specified user account password is incorrect.');
      case 'auth/user-not-found':
        return new Error('The specified user account does not exist.');
      default:
        return new Error('Error logging user in: ' + String(error));
    }
  }

  /**
   * Sign in with email and password. Returns a Promise (async/await friendly).
   */
  static async login(
    app: FirebaseApp,
    credentials: LoginCredentials
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      new FirebaseLoginEmail(app, credentials, (err, user) => {
        if (err) reject(err);
        else if (user) resolve(user);
        else reject(new Error('No user returned'));
      });
    });
  }
}

export default FirebaseLoginEmail;
export { FirebaseLoginEmail };
