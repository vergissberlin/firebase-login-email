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

/** Error with optional Firebase auth error code (e.g. "auth/wrong-password"). */
export interface AuthError extends Error {
  code?: string;
}

function safeInvokeCallback(
  callback: LoginCallback,
  error: Error | null,
  user: User | null
): void {
  try {
    callback(error, user);
  } catch (e) {
    const wrapped =
      e instanceof Error ? e : new Error(String(e));
    (wrapped as AuthError).code = 'auth/callback-error';
    try {
      callback(wrapped, null);
    } catch {
      // Avoid unhandled rejection if callback throws again
      console.error('[firebase-login-email] Callback threw:', wrapped);
    }
  }
}

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

    let auth;
    try {
      auth = getAuth(app);
    } catch (syncError: unknown) {
      const err =
        syncError instanceof Error
          ? syncError
          : new Error('Error initializing auth: ' + String(syncError));
      safeInvokeCallback(callback, err, null);
      return;
    }

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        safeInvokeCallback(callback, null, userCredential.user);
      })
      .catch((error: unknown) => {
        const err =
          error && typeof error === 'object' && 'code' in error
            ? this.normalizeAuthError(error as { code?: string })
            : new Error('Error logging user in: ' + String(error));
        safeInvokeCallback(callback, err, null);
      });
  }

  private normalizeAuthError(
    error: { code?: string } & Record<string, unknown>
  ): AuthError {
    const message = error.code
      ? this.authErrorMessage(error.code)
      : 'Error logging user in: ' + String(error);
    const err = new Error(message) as AuthError;
    if (error.code) err.code = error.code;
    return err;
  }

  private authErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'The specified user account email is invalid.';
      case 'auth/wrong-password':
        return 'The specified user account password is incorrect.';
      case 'auth/user-not-found':
        return 'The specified user account does not exist.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later.';
      case 'auth/network-request-failed':
        return 'A network error occurred. Check your connection.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is not enabled for this app.';
      default:
        return 'Error logging user in: ' + code;
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
