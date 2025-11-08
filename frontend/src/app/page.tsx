'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Home() {
  const { darkMode, mounted, toggleDarkMode } = useDarkMode();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-darkBackground text-textLight dark:text-textDark">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--primary)'}}>
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-2xl font-bold" style={{color: 'var(--primary)'}}>Invyfy</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:opacity-80 transition-colors" style={{color: 'var(--textLight)'}}>Features</a>
              <a href="#pricing" className="hover:opacity-80 transition-colors" style={{color: 'var(--textLight)'}}>Pricing</a>
              <a href="#about" className="hover:opacity-80 transition-colors" style={{color: 'var(--textLight)'}}>About</a>
              <button 
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              {isAuthenticated ? (
                <>
                  <a href="/dashboard" className="hover:opacity-80 transition-colors" style={{color: 'var(--textLight)'}}>
                    Dashboard
                  </a>
                  <span className="text-sm" style={{color: 'var(--textLight)'}}>
                    Welcome, {user?.name}
                  </span>
                  <button 
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="hover:opacity-80 transition-colors" style={{color: 'var(--textLight)'}}>Login</a>
                  <a href="/signup" className="btn-primary">Get Started</a>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Business with{' '}
            <span style={{color: 'var(--primary)'}}>Invyfy</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The modern SaaS platform that helps businesses scale efficiently with powerful tools, 
            analytics, and seamless integrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="btn-primary text-lg px-8 py-4 text-center"
            >
              Start Free Trial
            </a>
            <a 
              href="/login" 
              className="btn-secondary text-lg px-8 py-4 text-center"
            >
              Sign In
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: 'rgba(79, 70, 229, 0.1)'}}>
              <div className="w-6 h-6 rounded-lg" style={{backgroundColor: 'var(--primary)'}}></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get deep insights into your business performance with AI-powered analytics.
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: 'rgba(34, 211, 238, 0.1)'}}>
              <div className="w-6 h-6 rounded-lg" style={{backgroundColor: 'var(--secondary)'}}></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with your favorite tools and platforms effortlessly.
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: 'rgba(250, 204, 21, 0.1)'}}>
              <div className="w-6 h-6 rounded-lg" style={{backgroundColor: 'var(--accent)'}}></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our expert team is always here to help you succeed.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2024 Invyfy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
