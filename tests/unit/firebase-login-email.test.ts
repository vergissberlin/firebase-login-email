import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetAuth = vi.fn(() => ({}));
const mockSignInWithEmailAndPassword = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: mockGetAuth,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
}));

// Load SUT after mock so firebase/auth is mocked
const mod = await import('../../src/firebase-login-email');
const FirebaseLoginEmail = typeof mod.default !== 'undefined' ? mod.default : mod;

describe('FirebaseLoginEmail', () => {
  const fakeApp = { name: '[DEFAULT]', options: {} };

  beforeEach(() => {
    mockGetAuth.mockReset();
    mockGetAuth.mockReturnValue({});
    mockSignInWithEmailAndPassword.mockReset();
  });

  it('calls getAuth with the provided app', () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: '1' } });
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, vi.fn());
    expect(mockGetAuth).toHaveBeenCalledWith(fakeApp);
  });

  it('invokes callback with error when getAuth throws synchronously', () => {
    const syncError = new Error('invalid app');
    mockGetAuth.mockImplementation(() => {
      throw syncError;
    });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    expect(callback).toHaveBeenCalledWith(syncError, null);
    expect(mockSignInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('calls signInWithEmailAndPassword with auth, email and password', () => {
    const authInstance = {};
    mockGetAuth.mockReturnValue(authInstance);
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'user-123', email: 'test@example.com' },
    });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'secret' }, callback);

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      authInstance,
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

  it('throws if data.email is not a string', () => {
    expect(() => {
      new FirebaseLoginEmail(fakeApp, { email: 123, password: 'pwd' }, () => {});
    }).toThrow('email');
  });

  it('throws if data.password is not a string', () => {
    expect(() => {
      new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: null }, () => {});
    }).toThrow('password');
  });

  it('invokes callback with generic error for unknown auth error code', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/unknown-code' });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Error logging user in'),
          code: 'auth/unknown-code',
        }),
        null
      );
    });
  });

  it('invokes callback with friendly message for auth/too-many-requests', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/too-many-requests' });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Too many failed attempts'),
          code: 'auth/too-many-requests',
        }),
        null
      );
    });
  });

  it('passes auth error code on error object for consumer branching', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => expect(callback).toHaveBeenCalled());
    const err = callback.mock.calls[0][0];
    expect(err).not.toBeNull();
    expect((err as { code?: string }).code).toBe('auth/wrong-password');
  });

  it('invokes callback with friendly message for auth/network-request-failed', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/network-request-failed',
    });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('network'),
          code: 'auth/network-request-failed',
        }),
        null
      );
    });
  });

  it('invokes callback with friendly message for auth/operation-not-allowed', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/operation-not-allowed',
    });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not enabled'),
          code: 'auth/operation-not-allowed',
        }),
        null
      );
    });
  });

  it('invokes callback with generic error when rejection is not an object', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue('plain string error');

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Error logging user in'),
        }),
        null
      );
    });
  });

  it('invokes callback with error when getAuth throws non-Error', () => {
    mockGetAuth.mockImplementation(() => {
      throw 'string throw';
    });

    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Error initializing auth'),
      }),
      null
    );
  });

  it('when callback throws on success, invokes callback again with wrapped error', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } });
    const callback = vi.fn().mockImplementation((_err: unknown, user: unknown) => {
      if (user !== null) throw new Error('consumer threw');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(2));

    expect(callback).toHaveBeenNthCalledWith(1, null, expect.anything());
    expect(callback).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        message: 'consumer threw',
        code: 'auth/callback-error',
      }),
      null
    );

    consoleSpy.mockRestore();
  });

  it('invokes callback exactly once on success', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } });
    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);
    await vi.waitFor(() => expect(callback).toHaveBeenCalled());
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('invokes callback exactly once on error', async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });
    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' }, callback);
    await vi.waitFor(() => expect(callback).toHaveBeenCalled());
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not throw when callback is omitted (default no-op)', () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } });
    expect(() => {
      new FirebaseLoginEmail(fakeApp, { email: 'a@b.co', password: 'pwd' });
    }).not.toThrow();
  });

  it('passes empty string email and password to Firebase', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } });
    const callback = vi.fn();
    new FirebaseLoginEmail(fakeApp, { email: '', password: '' }, callback);
    await vi.waitFor(() => expect(callback).toHaveBeenCalledWith(null, expect.anything()));
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), '', '');
  });

  describe('login()', () => {
    it('resolves with user on success', async () => {
      const user = { uid: 'promise-user', email: 'p@t.com' };
      mockSignInWithEmailAndPassword.mockResolvedValue({ user });
      const result = await FirebaseLoginEmail.login(fakeApp, {
        email: 'p@t.com',
        password: 'secret',
      });
      expect(result).toBe(user);
    });

    it('rejects with error on auth failure', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });
      await expect(
        FirebaseLoginEmail.login(fakeApp, { email: 'a@b.co', password: 'wrong' })
      ).rejects.toThrow(/password/);
    });

    it('rejects when getAuth throws synchronously', async () => {
      mockGetAuth.mockImplementation(() => {
        throw new Error('invalid app');
      });

      await expect(
        FirebaseLoginEmail.login(fakeApp, { email: 'a@b.co', password: 'pwd' })
      ).rejects.toThrow('invalid app');
    });

    it('rejects with AuthError containing code for auth/user-not-found', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/user-not-found' });

      try {
        await FirebaseLoginEmail.login(fakeApp, {
          email: 'missing@b.co',
          password: 'pwd',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect((err as { code?: string }).code).toBe('auth/user-not-found');
        expect((err as Error).message).toContain('does not exist');
      }
    });

    it('rejects with error on non-object rejection', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValue('network died');

      await expect(
        FirebaseLoginEmail.login(fakeApp, { email: 'a@b.co', password: 'pwd' })
      ).rejects.toMatchObject({
        message: expect.stringContaining('Error logging user in'),
      });
    });

    it('rejects when credentials are invalid (email not a string)', async () => {
      await expect(
        FirebaseLoginEmail.login(fakeApp, {
          email: 99 as unknown as string,
          password: 'pwd',
        })
      ).rejects.toThrow('email');
    });

    it('rejects when credentials are invalid (password not a string)', async () => {
      await expect(
        FirebaseLoginEmail.login(fakeApp, {
          email: 'a@b.co',
          password: null as unknown as string,
        })
      ).rejects.toThrow('password');
    });
  });
});
