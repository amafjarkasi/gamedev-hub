import React, { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  isLegacyHash,
} from '../utils/cryptoUtils';
import { getGravatarUrl } from '../utils/gravatar';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('kaz_users', []);
  const [session, setSession] = useLocalStorage('kaz_session', null);

  const currentUser = useMemo(() => {
    if (!session) return null;
    return users.find((u) => u.id === session.userId) || null;
  }, [session, users]);

  const register = useCallback(
    async ({ username, email, password, displayName }) => {
      const existingUser = users.find(
        (u) => u.username === username || u.email === email
      );
      if (existingUser) {
        if (existingUser.username === username) {
          return { success: false, error: 'Username already taken' };
        }
        return { success: false, error: 'Email already registered' };
      }

      const salt = generateSalt();
      const passwordHash = await hashPassword(password, salt);

      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        passwordHash,
        displayName: displayName || username,
        avatarUrl: getGravatarUrl(email, 80, 'identicon'),
        createdAt: new Date().toISOString(),
      };

      setUsers([...users, newUser]);
      setSession({ userId: newUser.id, loginAt: new Date().toISOString() });
      return { success: true, user: newUser };
    },
    [users, setUsers, setSession]
  );

  const login = useCallback(
    async ({ username, password }) => {
      const user = users.find(
        (u) => u.username === username || u.email === username
      );
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (isLegacyHash(user.passwordHash)) {
        // Legacy btoa comparison + silent migration
        if (user.passwordHash !== btoa(password)) {
          return { success: false, error: 'Incorrect password' };
        }
        // Migrate to PBKDF2
        const salt = generateSalt();
        const newHash = await hashPassword(password, salt);
        const updatedUsers = users.map((u) =>
          u.id === user.id ? { ...u, passwordHash: newHash } : u
        );
        setUsers(updatedUsers);
      } else {
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          return { success: false, error: 'Incorrect password' };
        }
      }

      setSession({ userId: user.id, loginAt: new Date().toISOString() });
      return { success: true, user };
    },
    [users, setUsers, setSession]
  );

  const logout = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      register,
      login,
      logout,
    }),
    [currentUser, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
