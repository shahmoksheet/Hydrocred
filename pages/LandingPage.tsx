
import React from 'react';
import { AtomIcon } from '../components/shared/icons/Icons';

interface LandingPageProps {
    onGoToAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,100,255,0.15),rgba(255,255,255,0))]"></div>
        <header className="p-4 sm:p-6 md:p-8 z-10">
             <div className="flex items-center">
              <AtomIcon className="w-8 h-8 text-cyan-400 mr-3" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-100">
                Hydro-Cred
              </h1>
            </div>
        </header>
        <main className="flex-grow flex items-center justify-center text-center z-10">
            <div className="container mx-auto px-4 fade-in">
                <h2 className="text-4xl md:text-6xl font-extrabold text-slate-100 tracking-tight">
                    The Future of <span className="text-cyan-400">Green Hydrogen</span> is Transparent.
                </h2>
                <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
                    Hydro-Cred provides a transparent, auditable, and immutable system to issue, track, and retire Green Hydrogen Credits on a simulated blockchain.
                </p>
                <button
                    onClick={onGoToAuth}
                    className="mt-10 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                >
                    Access the Platform
                </button>
            </div>
        </main>
        <footer className="p-4 text-center text-slate-500 text-sm z-10">
             &copy; {new Date().getFullYear()} Hydro-Cred System. All Rights Reserved.
        </footer>
    </div>
  );
};

export default LandingPage;