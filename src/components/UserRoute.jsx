import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

/**
 * UserRoute - Protects routes that should only be accessible by regular users
 * Admin users will be redirected to /admin
 */
const UserRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log("🔍 UserRoute - User:", user);
  console.log("🔍 UserRoute - User Role:", user?.role);
  console.log("🔍 UserRoute - Is Authenticated:", isAuthenticated);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, check if they are admin
  if (isAuthenticated) {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';
    console.log("🔍 UserRoute - Is Admin:", isAdmin);
    
    if (isAdmin) {
      console.log("⚠️ UserRoute - Admin trying to access user route, redirecting to /admin");
      return <Navigate to="/admin" replace />;
    }
  }

  // Allow access for non-authenticated users or regular users
  console.log("✅ UserRoute - Allowing access");
  return children;
};

export default UserRoute;
