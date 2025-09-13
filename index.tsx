import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BlockchainProvider } from './context/BlockchainContext';
import { AuthProvider } from './context/AuthContext';
import { isFirebaseConfigured } from './services/firebase';
import FirebaseSetupPage from './pages/FirebaseSetupPage';
import { seedDatabase } from './services/seed';
import { setupGovernmentAuth } from './services/setupAuth';
import ErrorBoundary from './components/shared/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const startApp = async () => {
  if (isFirebaseConfigured) {
    try {
      // Run the one-time database seed check before rendering the app
      await seedDatabase();
      
      // Setup Firebase Auth for government accounts
      await setupGovernmentAuth();

      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <AuthProvider>
              <BlockchainProvider>
                <App />
              </BlockchainProvider>
            </AuthProvider>
          </ErrorBoundary>
        </React.StrictMode>
      );
    } catch (error) {
      // If seeding fails, render an error message
      console.error("Failed to start the application:", error);
      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center p-4">
              <div className="max-w-2xl text-center">
                <h1 className="text-2xl font-bold">Application Initialization Failed</h1>
                <p className="mt-2">Could not set up the required data in Firestore. Please check the browser console for errors and ensure your Firestore security rules are set to "test mode".</p>
              </div>
            </div>
          </ErrorBoundary>
        </React.StrictMode>
      );
    }
  } else {
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <FirebaseSetupPage />
        </ErrorBoundary>
      </React.StrictMode>
    );
  }
};

startApp();
