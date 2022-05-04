import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext({});
const prefix = '/api';

const AuthProvider = ({ children }) => {
    const [data, setData] = useState(() => {
    const token = localStorage.getItem('@PR-MANAGER:token');
    const user = localStorage.getItem('@PR-MANAGER:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {};
  });

  const signIn = useCallback(async ({ email, password }) => {
    const resp = await api.post(`${prefix}/users/authenticate`, {
      email,
      password,
    });

    const { token, user } = resp.data;

    localStorage.setItem('@PR-MANAGER:token', token);
    localStorage.setItem('@PR-MANAGER:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@PR-MANAGER:token');
    localStorage.removeItem('@PR-MANAGER:user');

    setData({});
  }, []);

  const updateUser = useCallback(
    (user) => {
      localStorage.setItem('@PR-MANAGER:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider!');
  }

  return context;
}

export { AuthProvider, useAuth };
