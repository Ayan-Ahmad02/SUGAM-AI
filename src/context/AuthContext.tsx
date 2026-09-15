import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Manufacturer' | 'MSME' | 'Consultant' | 'Laboratory' | 'Compliance Lead' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr-afnan-001',
  name: 'Afnan Ahmad',
  email: 'demo@sugam.ai',
  role: 'Manufacturer',
  company: 'Bharat EcoWare Solutions Pvt. Ltd.'
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  switchRole: () => {},
  isAuthenticated: true,
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sugam_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_DEMO_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sugam_token') || 'sugam-demo-token';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sugam_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sugam_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sugam_token', token);
    } else {
      localStorage.removeItem('sugam_token');
    }
  }, [token]);

  const login = async (email: string, password = 'password123', role: UserRole = 'Manufacturer') => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
      } else {
        // Fallback local demo login if offline
        const demoUser: User = {
          id: `usr-${Date.now()}`,
          name: email.includes('admin') ? 'Dr. R. K. Sharma' : (email.split('@')[0] || 'Afnan Ahmad'),
          email,
          role: email.includes('admin') ? 'Admin' : role,
          company: 'Hindustan Quality Products Ltd'
        };
        setUser(demoUser);
        setToken('sugam-demo-token');
      }
    } catch {
      // Offline fallback
      const demoUser: User = {
        id: `usr-${Date.now()}`,
        name: 'Afnan Ahmad',
        email,
        role,
        company: 'Bharat EcoWare Solutions Pvt. Ltd.'
      };
      setUser(demoUser);
      setToken('sugam-demo-token');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sugam_user');
    localStorage.removeItem('sugam_token');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = {
      ...user,
      role: newRole,
      name: newRole === 'Admin' ? 'Dr. R. K. Sharma' : 'Afnan Ahmad'
    };
    setUser(updated);
    // sync with backend
    fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, role: newRole })
    }).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
