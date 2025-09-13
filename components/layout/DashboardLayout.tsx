
import React, { useState } from 'react';
import { Role, User } from '../../types';
import Header from '../shared/Header';
import Footer from './Footer';
import ProducerDashboard from '../producer/ProducerDashboard';
import MarketplaceDashboard from '../marketplace/MarketplaceDashboard';
import CertifierDashboard from '../certifier/CertifierDashboard';
import RegulatorDashboard from '../regulator/RegulatorDashboard';
import ProfilePage from '../../pages/ProfilePage';
import SettingsPage from '../../pages/SettingsPage';
import AboutPage from '../../pages/AboutPage';
import HelpPage from '../../pages/HelpPage';
import { useBlockchain } from '../../hooks/useBlockchain';
import Spinner from '../shared/Spinner';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { isLoading: isBlockchainLoading } = useBlockchain();

  const renderRoleDashboard = () => {
    try {
      switch (user.role) {
        case Role.Producer: return <ProducerDashboard />;
        case Role.Consumer: return <MarketplaceDashboard />;
        case Role.Certifier: return <CertifierDashboard />;
        case Role.Regulator: return <RegulatorDashboard />;
        default: return (
          <div className="text-center py-10">
            <p className="text-red-400 text-lg">Error: Unknown user role '{user.role}'</p>
            <p className="text-slate-400 mt-2">Please contact support to resolve this issue.</p>
          </div>
        );
      }
    } catch (error) {
      console.error('Error rendering dashboard:', error);
      return (
        <div className="text-center py-10">
          <p className="text-red-400 text-lg">Error loading dashboard</p>
          <p className="text-slate-400 mt-2">Please refresh the page or contact support.</p>
        </div>
      );
    }
  };
  
  const renderPage = () => {
      try {
          switch (currentPage) {
              case 'dashboard': return renderRoleDashboard();
              case 'profile': return <ProfilePage />;
              case 'settings': return <SettingsPage />;
              case 'about': return <AboutPage />;
              case 'help': return <HelpPage />;
              default: return renderRoleDashboard();
          }
      } catch (error) {
          console.error('Error rendering page:', error);
          return (
            <div className="text-center py-10">
              <p className="text-red-400 text-lg">Error loading page</p>
              <p className="text-slate-400 mt-2">Please try navigating to a different page.</p>
            </div>
          );
      }
  };

  if (isBlockchainLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header user={user} onLogout={onLogout} currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <Spinner className="w-12 h-12 mx-auto text-cyan-400" />
            <p className="mt-4 text-slate-400">Loading blockchain data...</p>
            <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      <Header user={user} onLogout={onLogout} currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow p-4 sm:p-6 md:p-8 container mx-auto fade-in">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
