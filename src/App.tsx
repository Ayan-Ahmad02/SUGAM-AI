import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppLayout } from './layouts/AppLayout';

import { SplashPage } from './pages/SplashPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoadingLaunchPage } from './pages/LoadingLaunchPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { StandardsSearchPage } from './pages/StandardsSearchPage';
import { StandardDetailsPage } from './pages/StandardDetailsPage';
import { StandardComparePage } from './pages/StandardComparePage';
import { ProductMatchingPage } from './pages/ProductMatchingPage';
import { ComplianceNavigatorPage } from './pages/ComplianceNavigatorPage';
import { DocumentCheckerPage } from './pages/DocumentCheckerPage';
import { OcrVerificationPage } from './pages/OcrVerificationPage';
import { BisVerificationPage } from './pages/BisVerificationPage';
import { ClaimCheckerPage } from './pages/ClaimCheckerPage';
import { LaboratoryFinderPage } from './pages/LaboratoryFinderPage';
import { OfficeLocatorPage } from './pages/OfficeLocatorPage';
import { AlertsPage } from './pages/AlertsPage';
import { SavedWorkspacePage } from './pages/SavedWorkspacePage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Auth & Splash Screens */}
            <Route path="/splash" element={<SplashPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/loading" element={<LoadingLaunchPage />} />

            {/* Authenticated / SaaS Workspace Layout */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="standards" element={<StandardsSearchPage />} />
              <Route path="standards/:id" element={<StandardDetailsPage />} />
              <Route path="compare" element={<StandardComparePage />} />
              <Route path="product-matching" element={<ProductMatchingPage />} />
              <Route path="compliance" element={<ComplianceNavigatorPage />} />
              <Route path="documents" element={<DocumentCheckerPage />} />
              <Route path="verification" element={<BisVerificationPage />} />
              <Route path="verification/ocr" element={<OcrVerificationPage />} />
              <Route path="claim-check" element={<ClaimCheckerPage />} />
              <Route path="laboratories" element={<LaboratoryFinderPage />} />
              <Route path="offices" element={<OfficeLocatorPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="saved" element={<SavedWorkspacePage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="admin" element={<AdminDashboardPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
