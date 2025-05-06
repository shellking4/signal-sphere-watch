
import React from 'react';
import { BellRing } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-signaldude-primary to-signaldude-accent">
          <BellRing size={18} className="text-white" />
        </div>
        <h1 className="font-bold text-xl">
          Signal<span className="gradient-text">Dude</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
          <span className="text-xs text-signaldude-text-muted">NY</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
