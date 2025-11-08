'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Welcome to your Dashboard
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="text-lg font-semibold mb-2" style={{color: 'var(--primary)'}}>
                    Profile Information
                  </h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {user?.name}</p>
                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                    <p><span className="font-medium">Member since:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                
                <div className="card">
                  <h2 className="text-lg font-semibold mb-2" style={{color: 'var(--secondary)'}}>
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    <button className="btn-primary w-full text-sm font-medium">
                      Update Profile
                    </button>
                    <button className="btn-secondary w-full text-sm font-medium">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 card">
                <h2 className="text-lg font-semibold mb-2" style={{color: 'var(--accent)'}}>
                  Getting Started
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Congratulations! You have successfully authenticated with Invyfy. 
                  This is a protected route that only authenticated users can access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
