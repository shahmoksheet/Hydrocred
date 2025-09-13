
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import { AtomIcon, UserCircleIcon, CogIcon, LogoutIcon } from './icons/Icons';
import Spinner from './Spinner';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentPage, onNavigate }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
        await onLogout();
    } catch (error) {
        console.error("Logout failed:", error);
        // In a real app, you might show an error message to the user
        setIsLoggingOut(false);
    }
  };


  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'about', label: 'About Us' },
    { id: 'help', label: 'Help' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <AtomIcon className="w-8 h-8 text-cyan-400 mr-3" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-100">
            Hydro-Cred
          </h1>
          <nav className="ml-10 hidden md:flex items-center space-x-2">
             {navItems.map(item => (
                 <button key={item.id} onClick={() => onNavigate(item.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
                        currentPage === item.id 
                        ? 'text-cyan-400 bg-cyan-900/50' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                 >
                     {item.label}
                 </button>
             ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
            >
              <UserCircleIcon className="w-8 h-8 text-slate-400" />
              <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-slate-200">{user.name}</span>
                  <span className="text-xs text-slate-400">{user.role}</span>
              </div>
            </button>
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-20"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <button
                  onClick={() => { onNavigate('profile'); setDropdownOpen(false); }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  role="menuitem"
                >
                  <UserCircleIcon className="w-5 h-5 mr-2 text-slate-400"/> Profile
                </button>
                 <button
                  onClick={() => { onNavigate('settings'); setDropdownOpen(false); }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  role="menuitem"
                >
                  <CogIcon className="w-5 h-5 mr-2 text-slate-400"/> Settings
                </button>
                <div className="border-t border-slate-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors disabled:opacity-50"
                  role="menuitem"
                  aria-disabled={isLoggingOut}
                >
                    {isLoggingOut ? <><Spinner className="w-5 h-5 mr-2" /> Logging out...</> : <><LogoutIcon className="w-5 h-5 mr-2"/> Logout</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
