import React, { useState } from 'react';
import { setupGovernmentAuth, checkGovernmentAccount } from '../../services/setupAuth';
import { ALL_GOVERNMENT_USERS } from '../../constants/govData';

const SetupTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runSetup = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      setResults(prev => [...prev, "🔄 Starting government account setup..."]);
      await setupGovernmentAuth();
      setResults(prev => [...prev, "✅ Setup completed!"]);
      
      // Test a few accounts
      setResults(prev => [...prev, "🧪 Testing account authentication..."]);
      
      const testAccounts = [
        { email: 'certifier.gujarat@gov.in', password: 'Password@123' },
        { email: 'regulator.india@gov.in', password: 'Password@123' }
      ];
      
      for (const account of testAccounts) {
        const result = await checkGovernmentAccount(account.email, account.password);
        if (result.success) {
          setResults(prev => [...prev, `✅ ${account.email} - Authentication working`]);
        } else {
          setResults(prev => [...prev, `❌ ${account.email} - ${result.error}`]);
        }
      }
      
    } catch (error) {
      setResults(prev => [...prev, `❌ Setup failed: ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-slate-100">Government Account Setup Test</h3>
      
      <button
        onClick={runSetup}
        disabled={isRunning}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 mb-4"
      >
        {isRunning ? 'Running Setup...' : 'Run Setup Test'}
      </button>
      
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200">Available Accounts:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {ALL_GOVERNMENT_USERS.slice(0, 6).map(user => (
            <div key={user.id} className="bg-slate-800 p-2 rounded">
              <div className="font-medium text-cyan-400">{user.name}</div>
              <div className="text-slate-400">{user.email}</div>
              <div className="text-slate-500">Password: {user.password}</div>
            </div>
          ))}
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-slate-200 mb-2">Setup Results:</h4>
          <div className="bg-slate-800 p-3 rounded max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="text-sm text-slate-300 mb-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupTest;
