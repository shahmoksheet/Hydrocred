
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Hydro-Cred System. All Rights Reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;