import React from 'react';
import { AtomIcon } from '../components/shared/icons/Icons';
import SetupTest from '../components/shared/SetupTest';

const FirebaseSetupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl shadow-black/20 fade-in">
        <div className="flex items-center mb-6">
          <AtomIcon className="w-10 h-10 text-cyan-400 mr-4" />
          <h1 className="text-3xl font-bold text-slate-100">Firebase Configuration Required</h1>
        </div>
        <div className="space-y-4 text-slate-300">
          <p>Welcome to Hydro-Cred! To run this application, you need to connect it to your own Firebase project.</p>
          
          <div className="bg-red-900/50 p-4 rounded-lg border border-red-500/50 my-4">
              <p className="font-bold text-lg text-red-300">ATTENTION: READ THIS TO FIX THE CONNECTION ERROR</p>
              <p className="mt-2 text-red-200">
                  If you are seeing a <code className="font-mono text-yellow-300 bg-red-800/50 px-1 py-0.5 rounded">[code=unavailable]</code> or <code className="font-mono text-yellow-300 bg-red-800/50 px-1 py-0.5 rounded">Could not reach Cloud Firestore backend</code> error in your browser console, it means you have missed the critical setup steps below. You <span className="font-bold">MUST</span> enable the required services in your Firebase project.
              </p>
          </div>

          <h2 className="text-2xl font-semibold text-slate-100 pt-4">Setup Instructions:</h2>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Firebase Console</a> and create a new project.</li>
            <li>In your project's settings (<code className="font-mono text-slate-400">⚙️</code>), add a new Web App (<code className="font-mono text-slate-400">&lt;/&gt;</code>).</li>
            <li>Copy the <code className="font-mono text-slate-400">firebaseConfig</code> object.</li>
            <li>Paste your config object into the file: <code className="font-mono text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">services/firebase.ts</code>.</li>
            <li className="bg-blue-900/50 p-4 rounded-md border border-blue-500/50">
                <p className="font-bold text-blue-300">CRITICAL STEP TO FIX THE CONNECTION ERROR:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li>In the Firebase Console, go to the <span className="font-semibold text-slate-100">Build &gt; Authentication</span> section, select the "Sign-in method" tab, and <span className="font-semibold text-slate-100">enable the "Email/Password" provider</span>.</li>
                  <li>In the Firebase Console, go to the <span className="font-semibold text-slate-100">Build &gt; Firestore Database</span> section and click <span className="font-semibold text-slate-100">"Create database"</span>.</li>
                  <li>When prompted for Security Rules, you MUST select <strong className="text-yellow-300">"Start in test mode"</strong>. This is required for the application to connect during development.</li>
                </ul>
            </li>
          </ol>
          <p className="pt-4">Once you have updated the configuration and enabled the services, save the file and refresh this page. The application should then load correctly.</p>
        </div>
        
        {/* Add the setup test component */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <SetupTest />
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupPage;