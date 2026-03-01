import React, { useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false), isOpen);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2" ref={ref}>
      <label className="block text-sm font-bold text-slate-700 ml-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-[58px] p-4 pr-12 bg-slate-50 border rounded-2xl font-medium outline-none transition-all text-left flex items-center ${
            isOpen
              ? 'border-uci-blue ring-2 ring-uci-blue/20 bg-white'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left font-medium transition-colors flex items-center justify-between ${
                  value === option.value
                    ? 'bg-uci-blue/10 text-uci-blue'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option.label}
                {value === option.value && <Check size={18} className="text-uci-blue" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
