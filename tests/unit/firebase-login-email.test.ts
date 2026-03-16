import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignInWithEmailAndPassword = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
}));

// Load SUT after mock so firebase/auth is mocked
const mod = await import('../../src/firebase-login-email');
const FirebaseLoginEmail = typeof mod.default !== 'undefined' ? mod.default : mod;

describe('FirebaseLoginEmail', () => {
  const fakeApp = { name: '[DEFAULT]', options: {} };

  beforeEach(() => {
    mockSignInWithEmailAndPassword.mockReset();
  });

  it('calls signInWithEmailAndPassword with app, email and password', () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'user-123', email: 'test@example.com' },
    });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'secret' }, callback);

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'a@b.co',
      'secret'
    );
  });

  it('invokes callback with user on success', async () => {
    const user = { uid: 'user-456', email: 'ok@test.com' };
    mockSignInWithEmailAndPassword.mockResolvedValue({ user });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'ok@test.com', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(null, user);
    });
  });

  it('invokes callback with error on auth/invalid-email', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-email' });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'bad', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('invalid') }),
        null
      );
    });
  });

  it('invokes callback with error on auth/wrong-password', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'wrong' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('password') }),
        null
      );
    });
  });

  it('invokes callback with error on auth/user-not-found', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/user-not-found' });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'nope@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('does not exist') }),
        null
      );
    });
  });

  it('throws if data.email is missing', () => {
    expect(() => {
      new FirebaseLoginEmail(fakeApp, { password: 'pwd' }, () => {});
    }).toThrow('email');
  });

  it('throws if data.password is missing', () => {
    expect(() => {
      new FirebaseLoginEmail(fakeApp, { email: 'a@b.co' }, () => {});
    }).toThrow('password');
  });
});
