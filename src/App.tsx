import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme'; // Import your theme
import { useState } from 'react';

import AuthRedirect from 'components/ProtectedRoute/AuthRedirect';
import ProtectedRoute from 'components/ProtectedRoute/protectedRoute';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="auth/*"
          element={
            <AuthRedirect>
              <AuthLayout />
            </AuthRedirect>
          }
        />

        {/* Admin Routes (Protected) */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />

        {/* RTL Layout (Protected) */}
        <Route
          path="rtl/*"
          element={
            <ProtectedRoute>
              <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Fallback Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </ChakraProvider>
  );
}
