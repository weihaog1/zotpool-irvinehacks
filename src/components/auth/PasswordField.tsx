import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  show: boolean;
  onToggle: () => void;
  hint?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id, label, placeholder, value, onChange, show, onToggle, hint,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-uci-blue transition-colors" />
      </div>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        required
        minLength={6}
        className="block w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-uci-blue/10 focus:border-uci-blue outline-none transition-all bg-slate-50 focus:bg-white font-medium"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {hint && <p className="text-xs text-slate-400 mt-1.5 ml-1">{hint}</p>}
  </div>
);
