import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon, PasswordField } from '../auth';
import {
  Mail, AlertCircle, Loader2, CheckCircle2,
  KeyRound, Shield, Users, RefreshCw, UserPlus,
} from 'lucide-react';

type SubStep = 'choose' | 'general-form' | 'otp';

export const StepSignUp: React.FC = () => {
  const [subStep, setSubStep] = useState<SubStep>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { loginWithGoogle, signUpWithEmail, verifyOtp, authError } = useAuth();

  const handleGoogleSignUp = async () => {
    setError('');
    await loginWithGoogle();
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUpWithEmail(email, password);
      if (result.success) {
        setSuccessMessage(result.message || 'Check your email for the verification code.');
        setSubStep('otp');
      } else {
        setError(result.error || 'An error occurred. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const result = await verifyOtp(email, otpCode);
      if (result.success) {
        setSuccessMessage('Email verified successfully.');
      } else {
        setError(result.error || 'Invalid code. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccessMessage('');
    setIsResending(true);

    try {
      const result = await signUpWithEmail(email, password);
      if (result.success) {
        setSuccessMessage('A new verification code has been sent to your email.');
      } else {
        setError(result.error || 'Could not resend the code. Please try again.');
      }
    } catch {
      setError('Could not resend the code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const displayError = error || authError;

  const feedbackBlock = (
    <>
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
    </>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner -rotate-3">
          <UserPlus size={40} />
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-900">Join ZotPool</h2>
        <p className="text-slate-500 text-lg mt-2">Create an account to start carpooling.</p>
      </div>

      {subStep === 'choose' && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-uci-blue" />
              <span className="text-sm font-bold text-slate-700">UCI Student</span>
              <span className="text-xs bg-blue-50 text-uci-blue px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                Verified
              </span>
            </div>
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-all hover:shadow-md group"
            >
              <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Sign up with UCI Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide font-bold">
              <span className="px-4 bg-white/80 text-slate-400 rounded-full">Or</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-slate-500" />
              <span className="text-sm font-bold text-slate-700">Everyone Else</span>
              <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                Community
              </span>
            </div>
            <button
              onClick={() => setSubStep('general-form')}
              className="w-full bg-uci-blue text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Mail size={20} />
              Sign up with Email
            </button>
          </div>

          {feedbackBlock}
        </div>
      )}

      {subStep === 'general-form' && (
        <form onSubmit={handleSignUpSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-uci-blue transition-colors" />
              </div>
              <input
                type="email" id="email" required
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
            placeholder="At least 6 characters"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            hint="Must be at least 6 characters"
          />

          <PasswordField
            id="confirm-password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {feedbackBlock}

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-uci-blue text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => { setSubStep('choose'); setError(''); setSuccessMessage(''); }}
            className="w-full text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            Back to sign up options
          </button>
        </form>
      )}

      {subStep === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <div className="text-center mb-2">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Mail size={24} />
            </div>
            <p className="text-sm text-slate-600">We sent a verification code to</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{email}</p>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
              Verification Code
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-uci-blue transition-colors" />
              </div>
              <input
                type="text" id="otp" required maxLength={6}
                className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-uci-blue/10 focus:border-uci-blue outline-none transition-all bg-slate-50 focus:bg-white font-medium tracking-widest text-center text-lg"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          {feedbackBlock}

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-uci-blue text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Verify'}
          </button>

          <div className="text-center">
            <button
              type="button" onClick={handleResendCode} disabled={isResending}
              className="text-sm text-uci-blue hover:underline font-medium inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {isResending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Resend code
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="text-uci-blue font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};
