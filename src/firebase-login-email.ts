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
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';

/** Credentials for email/password sign-in or sign-up */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Callback invoked when sign-in completes (error or user). */
export type LoginCallback = (error: Error | null, user: User | null) => void;

/** Callback invoked when auth state changes (e.g. sign-in or sign-out). */
export type AuthStateCallback = (user: User | null) => void;

/** Error with optional Firebase auth error code (e.g. "auth/wrong-password"). */
export interface AuthError extends Error {
  code?: string;
}

/** Result of login or loginWithIdToken with optional ID token for backend auth. */
export interface LoginResult {
  user: User;
  idToken?: string;
}

function authErrorMessage(code: string): string {
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
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'The password is too weak. Use at least 6 characters.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    default:
      return 'Error: ' + code;
  }
}

function normalizeAuthError(error: {
  code?: string;
} & Record<string, unknown>): AuthError {
  const message = error.code
    ? authErrorMessage(error.code)
    : 'Error: ' + String(error);
  const err = new Error(message) as AuthError;
  if (error.code) err.code = error.code;
  return err;
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
            ? normalizeAuthError(error as { code?: string })
            : new Error('Error logging user in: ' + String(error));
        safeInvokeCallback(callback, err, null);
      });
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

  /**
   * Sign in and return the user plus ID token (e.g. for sending to your backend).
   */
  static async loginWithIdToken(
    app: FirebaseApp,
    credentials: LoginCredentials
  ): Promise<LoginResult> {
    const user = await FirebaseLoginEmail.login(app, credentials);
    const idToken = await user.getIdToken();
    return { user, idToken };
  }

  /**
   * Get the current user's ID token (e.g. for Authorization header).
   */
  static async getIdToken(user: User): Promise<string> {
    return user.getIdToken();
  }

  /**
   * Create a new account with email and password.
   */
  static async signUp(
    app: FirebaseApp,
    credentials: LoginCredentials
  ): Promise<User> {
    if (typeof credentials.email !== 'string') {
      throw new Error('Credentials must have an "email" field!');
    }
    if (typeof credentials.password !== 'string') {
      throw new Error('Credentials must have a "password" field!');
    }

    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    ).catch((error: unknown) => {
      const err =
        error && typeof error === 'object' && 'code' in error
          ? normalizeAuthError(error as { code?: string })
          : new Error('Error creating user: ' + String(error));
      throw err;
    });
    return userCredential.user;
  }

  /**
   * Send a password reset email to the given address.
   */
  static async sendPasswordReset(app: FirebaseApp, email: string): Promise<void> {
    if (typeof email !== 'string' || !email.trim()) {
      throw new Error('Email must be a non-empty string.');
    }

    const auth = getAuth(app);
    await sendPasswordResetEmail(auth, email).catch((error: unknown) => {
      const err =
        error && typeof error === 'object' && 'code' in error
          ? normalizeAuthError(error as { code?: string })
          : new Error('Error sending password reset: ' + String(error));
      throw err;
    });
  }

  /**
   * Subscribe to auth state changes (sign-in, sign-out). Returns an unsubscribe function.
   */
  static onAuthStateChanged(app: FirebaseApp, callback: AuthStateCallback): Unsubscribe {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, callback);
  }
}

export default FirebaseLoginEmail;
export { FirebaseLoginEmail };
