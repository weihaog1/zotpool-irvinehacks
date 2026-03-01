import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Loader2 } from 'lucide-react';
import {
  CURRENT_WAIVER_VERSION,
  WAIVER_TITLE,
  WAIVER_SECTIONS,
} from '../data/waiverContent';

export const Waiver: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = agreed && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateUser({
        waiverSignedAt: new Date().toISOString(),
        waiverVersion: CURRENT_WAIVER_VERSION,
      });

      if (user.isOnboarded) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch {
      setError('Failed to save your waiver signature. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-10" />

      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-12 border border-white/50 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-uci-blue shadow-inner">
            <Shield size={40} />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            {WAIVER_TITLE}
          </h1>
          <p className="text-slate-500 text-lg mt-2">
            Please read the following terms carefully before proceeding.
          </p>
        </div>

        {/* Scrollable waiver content */}
        <div className="max-h-[400px] overflow-y-auto border border-slate-200 rounded-2xl p-6 mb-8 bg-slate-50/50 space-y-6">
          {WAIVER_SECTIONS.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {section.heading}
              </h3>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
              {index < WAIVER_SECTIONS.length - 1 && (
                <hr className="mt-6 border-slate-200" />
              )}
            </div>
          ))}
        </div>

        {/* Agreement checkbox */}
        <label className="flex items-start gap-3 cursor-pointer mb-8 group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-slate-300 text-uci-blue focus:ring-uci-blue/20 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            I have read and agree to the terms outlined above. I understand and
            accept the liability waiver, community guidelines, data consent, and
            ride safety requirements.
          </span>
        </label>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-uci-blue text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Saving...
            </>
          ) : (
            'Sign and Continue'
          )}
        </button>

        {/* Version note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Waiver version {CURRENT_WAIVER_VERSION}
        </p>
      </div>
    </div>
  );
};
