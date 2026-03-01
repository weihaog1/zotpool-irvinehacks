import React from 'react';

export interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
}

interface VehicleDetailsFormProps {
  value: VehicleFormData;
  onChange: (data: VehicleFormData) => void;
  compact?: boolean;
}

interface FieldConfig {
  key: keyof VehicleFormData;
  label: string;
  placeholder: string;
  type: string;
  maxLength?: number;
}

const fields: FieldConfig[] = [
  { key: 'make', label: 'Make', placeholder: 'e.g. Honda', type: 'text' },
  { key: 'model', label: 'Model', placeholder: 'e.g. Civic', type: 'text' },
  { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number', maxLength: 4 },
  { key: 'color', label: 'Color', placeholder: 'e.g. Silver', type: 'text' },
  { key: 'licensePlate', label: 'License Plate', placeholder: 'e.g. ABC1234', type: 'text' },
];

export const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  value,
  onChange,
  compact = false,
}) => {
  const handleFieldChange = (key: keyof VehicleFormData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const inputBase = compact
    ? 'w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white transition-all text-sm'
    : 'w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white transition-all';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div
          key={field.key}
          className={field.key === 'licensePlate' ? 'md:col-span-2' : ''}
        >
          <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
            {field.label}
          </label>
          <input
            type={field.type}
            value={value[field.key]}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={inputBase}
          />
        </div>
      ))}
    </div>
  );
};
