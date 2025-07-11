// ...rest of the code above remains unchanged...

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