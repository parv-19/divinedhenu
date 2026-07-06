import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../services/api.js';

const AuthContext = createContext(null);
const storageKey = 'divinedhenu-customer-auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || { customer: null, token: '' };
    } catch {
      return { customer: null, token: '' };
    }
  });

  useEffect(() => {
    if (auth.token) localStorage.setItem(storageKey, JSON.stringify(auth));
    else localStorage.removeItem(storageKey);
  }, [auth]);

  const applyAuth = (data) => {
    setAuth({ customer: data.customer, token: data.token });
    return data.customer;
  };

  const value = useMemo(() => ({
    customer: auth.customer,
    token: auth.token,
    isAuthenticated: Boolean(auth.token && auth.customer),
    login: async (payload) => applyAuth(await publicApi.loginCustomer(payload)),
    register: async (payload) => applyAuth(await publicApi.registerCustomer(payload)),
    loginWithGoogle: async (credential) => applyAuth(await publicApi.loginWithGoogle(credential)),
    logout: () => setAuth({ customer: null, token: '' }),
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
