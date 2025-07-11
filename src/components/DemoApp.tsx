"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  FormEvent
} from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Enhanced interfaces for marketing-focused auth
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
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User['profile']>) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
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

// Mock API functions for demonstration
const mockAPI = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; data?: any; error?: string }> {
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
  async signup(userData: SignupData): Promise<{ success: boolean; data?: any; error?: string }> {
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
  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  async sendVerificationEmail(): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },
  async updateProfile(updates: any): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true };
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  // Store token in memory instead of localStorage
  const tokenStore = { current: '' };

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      if (authToken === 'mock-jwt-token') {
        setUser({
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
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response = await mockAPI.login(credentials);
      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        tokenStore.current = newToken;
        trackEvent('user_login', {
          userId: userData.id,
          loginCount: userData.usage.loginCount,
          planType: userData.usage.planType
        });
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signup = async (userData: SignupData): Promise<AuthResult> => {
    try {
      const response = await mockAPI.signup(userData);
      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        tokenStore.current = newToken;
        trackEvent('user_signup', {
          userId: newUser.id,
          source: userData.source,
          campaign: userData.campaign,
          company: userData.company,
          acceptedMarketing: userData.acceptedMarketing
        });
        return { 
          success: true, 
          requiresVerification: !newUser.emailVerified 
        };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    tokenStore.current = '';
    if (user) {
      trackEvent('user_logout', { userId: user.id });
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const response = await mockAPI.sendVerificationEmail();
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to send verification email' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await mockAPI.resetPassword(email);
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  const updateProfile = async (updates: Partial<User['profile']>) => {
    try {
      const response = await mockAPI.updateProfile(updates);
      if (response.success && user) {
        setUser({
          ...user,
          profile: { ...user.profile, ...updates }
        });
      }
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await mockAPI.verifyEmail(token);
      if (response.success && user) {
        setUser({
          ...user,
          emailVerified: true
        });
      }
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to verify email' };
    }
  };

  const trackEvent = (eventName: string, properties: Record<string, any>) => {
    console.log('Marketing Event:', eventName, properties);
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

// Login Component
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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </button>
        </div>
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600">
        Try demo account: demo@example.com / demo123
      </div>
    </div>
  );
};

// Signup Component
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
      setError('Please accept the terms and conditions');
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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="acceptedMarketing"
              checked={formData.acceptedMarketing}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              I'd like to receive marketing emails and product updates
            </span>
          </label>
        </div>
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

// Main App Component
const DemoApp = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Marketing Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.profile.firstName}!
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">Name: {user.profile.firstName} {user.profile.lastName}</p>
                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                    <p className="text-sm text-gray-600">Company: {user.profile.company}</p>
                    <p className="text-sm text-gray-600">Plan: {user.usage.planType}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Marketing Data</h3>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">Source: {user.marketing.source}</p>
                    <p className="text-sm text-gray-600">Campaign: {user.marketing.campaign}</p>
                    <p className="text-sm text-gray-600">Tags: {user.marketing.tags.join(', ')}</p>
                    <p className="text-sm text-gray-600">
                      Marketing Emails: {user.marketing.acceptedMarketing ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      {user.emailVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-600">
                        Email {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Login Count: {user.usage.loginCount}</p>
                    <p className="text-sm text-gray-600">
                      Member Since: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    {user.usage.trialEndDate && (
                      <p className="text-sm text-gray-600">
                        Trial Ends: {new Date(user.usage.trialEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketing Platform</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your marketing campaigns and track performance
          </p>
        </div>
        <div className="mb-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentView('login')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                currentView === 'login'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('signup')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border-t border-r border-b ${
                currentView === 'signup'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Signup
            </button>
          </div>
        </div>
        {currentView === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

// Export AuthProvider for wrapping the app
export { AuthProvider, useAuth, DemoApp };