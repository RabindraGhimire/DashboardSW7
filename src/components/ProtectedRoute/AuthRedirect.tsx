import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRedirect: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for authentication token

  if (token) {
    // Redirect to admin if already authenticated
    return <Navigate to="/admin" replace />;
  }

  return children; // Render auth component if not authenticated
};

export default AuthRedirect;
