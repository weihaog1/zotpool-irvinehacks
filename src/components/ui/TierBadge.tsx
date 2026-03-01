import React from 'react';
import { Shield, Users } from 'lucide-react';

interface TierBadgeProps {
  tier: 'uci' | 'general';
  size?: 'sm' | 'md';
}

const tierConfig = {
  uci: {
    icon: Shield,
    label: 'UCI Verified',
    classes: 'bg-blue-50 text-uci-blue border-blue-200',
  },
  general: {
    icon: Users,
    label: 'Community',
    classes: 'bg-slate-50 text-slate-600 border-slate-200',
  },
} as const;

const sizeConfig = {
  sm: {
    wrapper: 'px-2 py-0.5 gap-1 text-xs',
    icon: 12,
  },
  md: {
    wrapper: 'px-3 py-1 gap-1.5 text-sm',
    icon: 14,
  },
} as const;

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md' }) => {
  const config = tierConfig[tier];
  const sizing = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center font-semibold border rounded-full ${config.classes} ${sizing.wrapper}`}
    >
      <Icon size={sizing.icon} />
      {config.label}
    </span>
  );
};
