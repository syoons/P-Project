import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import UserStatistics from './pages/UserStatistics';
import BookStatistics from './pages/BookStatistics';

import { isAuthenticated } from './utils/auth';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<UserManagement />} />
          <Route path="stats/users" element={<UserStatistics />} />
          <Route path="stats/books" element={<BookStatistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
