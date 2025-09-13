import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { AtomIcon } from '../components/shared/icons/Icons';
import { indianStatesAndUTs } from '../constants/govData';
import Spinner from '../components/shared/Spinner';

interface AuthPageProps {
    onBackToLanding: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBackToLanding }) => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>(Role.Producer);
    const [location, setLocation] = useState<string>(indianStatesAndUTs[0]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password, role, location);
            }
        } catch (err) {
            let errorMessage = "An unknown error occurred.";
            if (err instanceof Error && 'code' in err) {
                const firebaseError = err as { code: string; message: string };
                switch (firebaseError.code) {
                    case 'auth/too-many-requests':
                        errorMessage = "Access temporarily disabled due to too many requests. Please try again later.";
                        break;
                    case 'auth/configuration-not-found':
                    case 'auth/missing-email-field':
                        errorMessage = "Firebase Authentication is not enabled correctly. Please go to your Firebase project console, navigate to 'Authentication' > 'Sign-in method', and ensure the 'Email/Password' provider is enabled.";
                        break;
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = "Incorrect email or password. Please try again.";
                        break;
                    case 'auth/user-not-found':
                        errorMessage = "No account found with this email address.";
                        break;
                    case 'auth/email-already-in-use':
                         errorMessage = "An account with this email address already exists.";
                         break;
                    case 'auth/weak-password':
                        errorMessage = "Password is too weak. It should be at least 6 characters long.";
                        break;
                    default:
                        errorMessage = firebaseError.message;
                }
            } else if (err instanceof Error) {
                 errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = "mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 transition-colors";
    const availableRoles = [Role.Producer, Role.Consumer];

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
             <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,100,255,0.15),rgba(255,255,255,0))]"></div>
            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                     <AtomIcon className="w-12 h-12 text-cyan-400 mx-auto" />
                     <h1 className="text-3xl font-bold text-slate-100 mt-2">Hydro-Cred</h1>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-xl shadow-2xl shadow-black/20">
                    <h2 className="text-2xl font-bold text-center text-slate-100 mb-6">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                             <div>
                                <label className="block text-sm font-medium text-slate-400">Full Name / Company</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputStyles}/>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-400">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputStyles}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputStyles}/>
                        </div>
                         {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400">I am a...</label>
                                    <select value={role} onChange={e => setRole(e.target.value as Role)} className={inputStyles}>
                                        {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                {role === Role.Producer && (
                                     <div>
                                        <label className="block text-sm font-medium text-slate-400">Registered State / UT</label>
                                        <select value={location} onChange={e => setLocation(e.target.value)} className={inputStyles}>
                                            {indianStatesAndUTs.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                            </>
                         )}

                        {error && <p className="text-sm text-red-400 text-center bg-red-900/30 p-3 rounded-md border border-red-500/30">{error}</p>}

                        <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105">
                            {loading ? <><Spinner className="mr-2" /> Processing...</> : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                    </form>

                    <p className="text-sm text-center text-slate-400 mt-6">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => {setIsLogin(!isLogin); setError('')}} className="font-medium text-cyan-400 hover:underline ml-1">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
                 <button onClick={onBackToLanding} className="text-sm text-center text-slate-500 mt-6 block w-full hover:underline">
                    &larr; Back to Home
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
