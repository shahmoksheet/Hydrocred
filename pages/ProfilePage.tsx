import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-100 mb-6">My Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-400">Full Name / Company</label>
          <p className="text-lg text-slate-200">{user.name}</p>
        </div>
        <div className="border-t border-slate-800 pt-4">
          <label className="text-sm font-medium text-slate-400">Email Address</label>
          <p className="text-lg text-slate-200">{user.email}</p>
        </div>
        <div className="border-t border-slate-800 pt-4">
          <label className="text-sm font-medium text-slate-400">Role</label>
          <p className="text-lg text-slate-200">
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-cyan-900/50 text-cyan-300 border border-cyan-500/30">
                {user.role}
            </span>
          </p>
        </div>
        {user.role === Role.Producer && user.location && (
             <div className="border-t border-slate-800 pt-4">
              <label className="text-sm font-medium text-slate-400">Registered Location</label>
              <p className="text-lg text-slate-200">{user.location}</p>
            </div>
        )}
        {user.role === Role.Certifier && user.jurisdictionName && (
             <div className="border-t border-slate-800 pt-4">
              <label className="text-sm font-medium text-slate-400">Jurisdiction</label>
              <p className="text-lg text-slate-200">{user.jurisdictionName} ({user.jurisdictionType})</p>
            </div>
        )}
         <div className="border-t border-slate-800 pt-4">
          <label className="text-sm font-medium text-slate-400">User ID</label>
          <p className="text-sm text-slate-500 font-mono">{user.id}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;