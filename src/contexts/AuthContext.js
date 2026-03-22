import React, { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('kaz_users', []);
  const [session, setSession] = useLocalStorage('kaz_session', null);

  const currentUser = useMemo(() => {
    if (!session) return null;
    return users.find((u) => u.id === session.userId) || null;
  }, [session, users]);

  const register = useCallback(
    ({ username, email, password, displayName }) => {
      const existingUser = users.find(
        (u) => u.username === username || u.email === email
      );
      if (existingUser) {
        if (existingUser.username === username) {
          return { success: false, error: 'Username already taken' };
        }
        return { success: false, error: 'Email already registered' };
      }

      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        passwordHash: btoa(password),
        displayName: displayName || username,
        avatarUrl: '',
        createdAt: new Date().toISOString(),
      };

      setUsers([...users, newUser]);
      setSession({ userId: newUser.id, loginAt: new Date().toISOString() });
      return { success: true, user: newUser };
    },
    [users, setUsers, setSession]
  );

  const login = useCallback(
    ({ username, password }) => {
      const user = users.find(
        (u) => (u.username === username || u.email === username)
      );
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      if (user.passwordHash !== btoa(password)) {
        return { success: false, error: 'Incorrect password' };
      }

      setSession({ userId: user.id, loginAt: new Date().toISOString() });
      return { success: true, user };
    },
    [users, setSession]
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
