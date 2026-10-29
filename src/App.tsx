import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { MemberLayout } from './layouts/MemberLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PasswordRecoveryPage } from './pages/PasswordRecoveryPage';

// Member Pages
import { MemberDashboard } from './pages/MemberDashboard';
import { MemberHistoryPage } from './pages/MemberHistoryPage';
import { MemberSavedPage } from './pages/MemberSavedPage';
import { MemberProfilePage } from './pages/MemberProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUserManagement } from './pages/AdminUserManagement';
import { AdminActivityPage } from './pages/AdminActivityPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/recovery" element={<PasswordRecoveryPage />} />
            </Route>

            {/* Member Workspace Layout */}
            <Route path="/member" element={<MemberLayout />}>
              <Route index element={<MemberDashboard />} />
              <Route path="history" element={<MemberHistoryPage />} />
              <Route path="saved" element={<MemberSavedPage />} />
              <Route path="profile" element={<MemberProfilePage />} />
            </Route>

            {/* Admin Console Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="activity" element={<AdminActivityPage />} />
              <Route path="config" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
