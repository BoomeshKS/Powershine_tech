import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login(email, password, rememberMe);
      toast.success('Login successful!');
      
      // Check role for redirect
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@shop.com');
      setPassword('admin123');
    } else {
      setEmail('user@shop.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center mb-6 group">
            <div className="relative h-16 flex items-center">
              <img 
                src="/26472logo.png" 
                alt="Powershine Tech" 
                className="h-full w-auto object-contain transition-transform group-hover:scale-105"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to access your industrial dashboard</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => handleQuickLogin('admin')}
              className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 py-3 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-all"
            >
              Admin Login
            </button>
            <button 
              onClick={() => handleQuickLogin('user')}
              className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 py-3 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-all"
            >
              User Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="admin@shop.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="admin123" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={cn(
                  "w-5 h-5 rounded-md border border-white/10 flex items-center justify-center transition-all",
                  rememberMe ? "bg-primary border-primary" : "bg-white/5"
                )}>
                  {rememberMe && <ShieldCheck size={14} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember Me</span>
              </label>
              <button type="button" className="text-sm text-primary hover:underline font-bold">Forgot Password?</button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] neon-glow-primary disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? 'Authenticating...' : (
                <>Login to Dashboard <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm">
              Demo Credentials:<br/>
              Admin: admin@shop.com / admin123<br/>
              User: user@shop.com / user123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
