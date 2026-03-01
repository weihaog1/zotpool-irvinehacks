import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, PasswordField } from '../components/auth';
import { Mail, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithGoogle, loginWithEmail, authError } = useAuth();

  const handleGoogleLogin = async () => {
    setError('');
    await loginWithGoogle();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        setSuccessMessage('Signed in successfully.');
        setEmail('');
        setPassword('');
      } else {
        setError(result.error || 'An error occurred. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = error || authError;

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 pt-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-bg opacity-20"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <img src="/assets/icon.png" alt="ZotPool" className="w-16 h-16 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to your account</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-all hover:shadow-md mb-6 group"
          >
            <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Continue with UCI Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide font-bold">
              <span className="px-4 bg-white/50 backdrop-blur-md text-slate-400 rounded-full">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-uci-blue transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-uci-blue/10 focus:border-uci-blue outline-none transition-all bg-slate-50 focus:bg-white font-medium"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <PasswordField
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {displayError && (
              <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-xl gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} className="shrink-0" />
                {displayError}
              </div>
            )}

            {successMessage && (
              <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-xl gap-2 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 size={16} className="shrink-0" />
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-uci-blue text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>

            <p className="mt-4 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-uci-blue font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
