import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RideProvider } from './context/RideContext';
import { NotificationProvider } from './context/NotificationContext';
import { Layout } from './components/ui';
import { Landing } from './pages/Landing';
import { CURRENT_WAIVER_VERSION } from './data/waiverContent';

const Login = lazy(async () => ({ default: (await import('./pages/Login')).Login }));
const SignUp = lazy(async () => ({ default: (await import('./pages/SignUp')).SignUp }));
const Waiver = lazy(async () => ({ default: (await import('./pages/Waiver')).Waiver }));
const Onboarding = lazy(async () => ({ default: (await import('./pages/Onboarding')).Onboarding }));
const Dashboard = lazy(async () => ({ default: (await import('./pages/Dashboard')).Dashboard }));
const CreatePost = lazy(async () => ({ default: (await import('./pages/CreatePost')).CreatePost }));
const Browse = lazy(async () => ({ default: (await import('./pages/Browse')).Browse }));
const Profile = lazy(async () => ({ default: (await import('./pages/Profile')).Profile }));
const Matches = lazy(async () => ({ default: (await import('./pages/Matches')).Matches }));
const Notifications = lazy(async () => ({ default: (await import('./pages/Notifications')).Notifications }));

const RouteLoader: React.FC = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="flex items-center gap-3 text-slate-500">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-uci-blue"></div>
      <span className="text-sm font-medium">Loading page...</span>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWaiver?: boolean;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireWaiver = true,
  requireOnboarding = true,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uci-blue"></div>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Waiver check: user must have signed the current version
  const hasValidWaiver =
    user.waiverSignedAt && user.waiverVersion === CURRENT_WAIVER_VERSION;

  if (requireWaiver && !hasValidWaiver && location.pathname !== '/waiver') {
    return <Navigate to="/waiver" replace />;
  }

  if (requireOnboarding && !user.isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
    return (
        <Layout>
            <Suspense fallback={<RouteLoader />}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/waiver"
                        element={
                            <ProtectedRoute requireWaiver={false} requireOnboarding={false}>
                                <Waiver />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute requireOnboarding={false}>
                                <Onboarding />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create"
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/browse"
                        element={
                            <ProtectedRoute>
                                <Browse />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/matches"
                        element={
                            <ProtectedRoute>
                                <Matches />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Layout>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RideProvider>
          <Router>
            <AppContent />
          </Router>
        </RideProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
