import React, { useState, useEffect } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { sounds } from '../../utils/sound';
import { adminAuth } from '../../utils/adminAuth';

interface AdminLoginProps {
  onLoginSuccess: (adminEmail: string) => void;
  onBackToStudentApp: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStudentApp,
}) => {
  const [email, setEmail] = useState('aashnaagrawal1200@gmail.com');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = adminAuth.getAdminEmail();
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (!cleanEmail) {
        setErrorMessage('Please enter your administrator email.');
        sounds.playPop();
        return;
      }

      if (!cleanPassword) {
        setErrorMessage('Please enter your password.');
        sounds.playPop();
        return;
      }

      // Strict Password Verification
      const isValid = adminAuth.verifyPassword(cleanPassword);
      if (isValid) {
        adminAuth.setAdminEmail(cleanEmail);
        sounds.playCelebration();
        onLoginSuccess(cleanEmail);
      } else {
        setErrorMessage('Incorrect password. Please verify and try again.');
        sounds.playPop();
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-2xl mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Educator & Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Welcome back! Enter your administrator password to access the portal.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          {/* Admin Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter administrator email"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white text-sm placeholder-slate-600 transition-all font-mono"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password</span>
              </span>
            </label>
            <input
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white text-sm placeholder-slate-600 transition-all font-mono"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Verifying...' : 'Sign In to Admin Portal'}</span>
          </button>
        </form>

        {/* Back to App */}
        <div className="flex items-center justify-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onBackToStudentApp();
            }}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Student App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
