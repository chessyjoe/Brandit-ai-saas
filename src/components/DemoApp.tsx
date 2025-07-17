"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  FormEvent
} from 'react';

// User and Auth interfaces
interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
  };
  usage: {
    onboardingCompleted: boolean;
    trialStartDate?: string;
    trialEndDate?: string;
    planType: 'free' | 'trial' | 'premium' | 'enterprise';
    lastLoginAt?: string;
    loginCount: number;
  };
  marketing: {
    source?: string;
    campaign?: string;
    referralCode?: string;
    acceptedMarketing: boolean;
    tags: string[];
  };
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    productUpdates: boolean;
  };
  createdAt: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  signup: (userData: SignupData) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
  sendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: () => Promise<{ success: boolean; error?: string }>;
  verifyEmail: () => Promise<{ success: boolean; error?: string }>;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  acceptedTerms: boolean;
  acceptedMarketing: boolean;
  referralCode?: string;
  source?: string;
  campaign?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock API functions
const mockAPI = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; data?: { token: string; user: User }; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'demo@example.com',
            profile: {
              firstName: 'Demo',
              lastName: 'User',
              company: 'Demo Company',
              jobTitle: 'Marketing Manager'
            },
            usage: {
              onboardingCompleted: true,
              planType: 'trial',
              trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              loginCount: 5
            },
            marketing: {
              source: 'google',
              campaign: 'spring-2024',
              acceptedMarketing: true,
              tags: ['high-value', 'engaged']
            },
            preferences: {
              notifications: true,
              newsletter: true,
              productUpdates: true
            },
            createdAt: new Date().toISOString(),
            emailVerified: true
          }
        }
      };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  async signup(userData: SignupData): Promise<{ success: boolean; data?: { token: string; user: User }; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (userData.email === 'existing@example.com') {
      return { success: false, error: 'Email already exists' };
    }
    return {
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '2',
          email: userData.email,
          profile: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            company: userData.company,
            jobTitle: userData.jobTitle,
            phone: userData.phone
          },
          usage: {
            onboardingCompleted: false,
            planType: 'trial',
            trialStartDate: new Date().toISOString(),
            trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            loginCount: 1
          },
          marketing: {
            source: userData.source,
            campaign: userData.campaign,
            referralCode: userData.referralCode,
            acceptedMarketing: userData.acceptedMarketing,
            tags: ['new-user']
          },
          preferences: {
            notifications: true,
            newsletter: userData.acceptedMarketing,
            productUpdates: true
          },
          createdAt: new Date().toISOString(),
          emailVerified: false
        }
      }
    };
  },

  async verifyEmail() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },

  async sendVerificationEmail() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  async resetPassword() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },

  async updateProfile() {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true };
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response = await mockAPI.login(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signup = async (userData: SignupData): Promise<AuthResult> => {
    try {
      const response = await mockAPI.signup(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true, requiresVerification: !response.data.user.emailVerified };
      } else {
        return { success: false, error: response.error };
      }
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const sendVerificationEmail = async () => {
    try {
      return await mockAPI.sendVerificationEmail();
    } catch {
      return { success: false, error: 'Failed to send verification email' };
    }
  };

  const resetPassword = async () => {
    try {
      return await mockAPI.resetPassword();
    } catch {
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  const updateProfile = async () => {
    try {
      return await mockAPI.updateProfile();
    } catch {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const verifyEmail = async () => {
    try {
      return await mockAPI.verifyEmail();
    } catch {
      return { success: false, error: 'Failed to verify email' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    sendVerificationEmail,
    resetPassword,
    updateProfile,
    verifyEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login form
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login({ email, password, rememberMe });
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </div>
      <div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>
      {error && <p>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};

// Signup form
const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    jobTitle: '',
    phone: '',
    acceptedTerms: false,
    acceptedMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!formData.acceptedTerms) {
      setError('Please accept the terms');
      setIsLoading(false);
      return;
    }
    const result = await signup({
      ...formData,
      source: 'organic',
      campaign: 'main-signup'
    });
    if (!result.success) {
      setError(result.error || 'Signup failed');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
      <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? 'Hide' : 'Show'}
      </button>
      <label>
        <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} />
        Accept terms
      </label>
      <label>
        <input type="checkbox" name="acceptedMarketing" checked={formData.acceptedMarketing} onChange={handleChange} />
        Accept marketing
      </label>
      {error && <p>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Signup'}
      </button>
    </form>
  );
};

// Demo App
const DemoApp = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.profile.firstName}!</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setCurrentView('login')}>Login</button>
      <button onClick={() => setCurrentView('signup')}>Signup</button>
      {currentView === 'login' ? <LoginForm /> : <SignupForm />}
    </div>
  );
};

export { AuthProvider, useAuth, DemoApp, LoginForm, SignupForm };