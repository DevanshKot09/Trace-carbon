import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layout panels
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import ActivityPage from './pages/ActivityPage';
import RecommendationsPage from './pages/RecommendationsPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import GamificationPage from './pages/GamificationPage';
import SettingsPage from './pages/SettingsPage';
import ErrorPage from './pages/ErrorPage';

// Toast alerts center drawer
import AiChatBot from './components/AiChatBot';

function ToastContainer() {
  const { toasts, removeToast } = useApp();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border text-white text-xs sm:text-sm font-semibold pointer-events-auto transition-all duration-300 animate-slide-in ${
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
            toast.type === 'error' ? 'bg-red-650 border-red-500' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <span>{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)} 
            className="text-white/60 hover:text-white font-bold ml-1.5 focus:outline-hidden text-sm"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// Protected Route Shield
function ProtectedRoute() {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

// Guest Shield (prevent logged in users entering Login page)
function GuestRoute() {
  const { user } = useApp();

  if (user) {
    if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// Onboarding shield
function OnboardingRoute() {
  const { user } = useApp();

  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingCompleted) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

// Main Scaffold frame integration
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F7F5] dark:bg-[#07130D] text-[#1A2E22] dark:text-[#E2EAE5] flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative min-h-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main id="app_main_canvas" className="flex-1 p-4 sm:p-6 lg:p-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public marketing channels */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest authentication routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* User onboarding router */}
          <Route element={<OnboardingRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Main App secure panels */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/tracker" element={<ActivityPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/achievements" element={<GamificationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback Error redirect channels */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
      <ToastContainer />
      <AiChatBot />
    </AppProvider>
  );
}
