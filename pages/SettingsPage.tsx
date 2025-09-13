
import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
    const [notifications, setNotifications] = useState({ email: true, sms: false });
    const [message, setMessage] = useState('');

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            setMessage('New passwords do not match.');
            return;
        }
        // In a real app, you would call an API here.
        console.log("Changing password...", password);
        setMessage('Password updated successfully! (Simulated)');
        setPassword({ current: '', new: '', confirm: '' });
        setTimeout(() => setMessage(''), 3000);
    };

    const inputStyles = "mt-1 w-full max-w-sm px-3 py-2 bg-slate-800 border border-slate-700 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 transition-colors";
    const primaryButtonStyles = "bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105";

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400">Current Password</label>
                        <input type="password" value={password.current} onChange={e => setPassword({...password, current: e.target.value})} className={inputStyles}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-400">New Password</label>
                        <input type="password" value={password.new} onChange={e => setPassword({...password, new: e.target.value})} className={inputStyles}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-400">Confirm New Password</label>
                        <input type="password" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} className={inputStyles}/>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className={primaryButtonStyles}>
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Notification Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input id="email-notifications" type="checkbox" checked={notifications.email} onChange={e => setNotifications({...notifications, email: e.target.checked})} className="h-4 w-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"/>
                        <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-slate-300">Email Notifications</label>
                    </div>
                     <div className="flex items-center">
                        <input id="sms-notifications" type="checkbox" checked={notifications.sms} onChange={e => setNotifications({...notifications, sms: e.target.checked})} className="h-4 w-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"/>
                        <label htmlFor="sms-notifications" className="ml-3 block text-sm font-medium text-slate-300">SMS Notifications (coming soon)</label>
                    </div>
                </div>
                 <div className="pt-6">
                    <button onClick={() => setMessage('Notification settings saved! (Simulated)')} className={primaryButtonStyles}>
                        Save Settings
                    </button>
                </div>
            </div>
             {message && <p className="text-center text-teal-400">{message}</p>}
        </div>
    );
};

export default SettingsPage;