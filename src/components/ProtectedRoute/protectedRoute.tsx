import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for authentication token

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children; // Render protected component if authenticated
};

export default ProtectedRoute;
