import React from 'react';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Spinner from './components/shared/Spinner';

const App: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isAuthPage, setIsAuthPage] = React.useState(false);

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto text-cyan-400" />
          <p className="mt-4 text-slate-400">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isAuthPage) {
        return <AuthPage onBackToLanding={() => setIsAuthPage(false)} />;
    }
    return <LandingPage onGoToAuth={() => setIsAuthPage(true)} />;
  }

  return <DashboardLayout user={user!} onLogout={logout} />;
};

export default App;