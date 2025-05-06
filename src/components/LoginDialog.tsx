
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface LoginDialogProps {
  trigger: React.ReactNode;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
    setOpen(false);
    setUsername('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-signaldude-bg-light text-signaldude-text border-slate-700 w-[90%] max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl font-bold">Join SignalDude Network</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="bg-signaldude-bg-dark border-slate-700 text-signaldude-text"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-signaldude-bg-dark border-slate-700 text-signaldude-text"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-signaldude-primary hover:bg-signaldude-primary/80"
          >
            Sign In
          </Button>
          <p className="text-sm text-signaldude-text-muted text-center">
            For demo purposes, any username and password will work.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
