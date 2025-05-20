
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';
import LoginDialog from './LoginDialog';

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // If not authenticated, show sign in option but don't make it required
  if (!isAuthenticated) {
    return (
      <LoginDialog 
        trigger={
          <Button variant="outline" className="text-signaldude-text border-slate-700 bg-signaldude-bg-dark hover:bg-signaldude-bg-light">
            <LogIn className="mr-1.5" size={16} />
            Sign In (Optional)
          </Button>
        }
      />
    );
  }

  // For authenticated users, show their info
  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium">{displayName}</p>
        <p className="text-xs text-signaldude-text-muted">Network Member</p>
      </div>
      <Button 
        variant="outline" 
        size="icon"
        className="relative border border-slate-700"
      >
        <User size={18} />
      </Button>
      <Button 
        variant="ghost"
        size="sm" 
        onClick={() => logout()}
        className="text-signaldude-text-muted hover:text-gray-600"
      >
        <LogOut size={16} className="mr-1.5" />
        Sign Out
      </Button>
    </div>
  );
};

export default UserMenu;
