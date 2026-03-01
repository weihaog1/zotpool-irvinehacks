import React, { useState, useMemo } from 'react';
import { Calculator, ChevronDown } from 'lucide-react';

interface PaymentSuggestionCardProps {
  distanceMiles: number;
  totalRiders: number;
  driverOverride?: number;
  className?: string;
}

const AVG_MPG = 28;
const GAS_PRICE = 4.5;
const PARKING_COST = 14.0;

export const PaymentSuggestionCard: React.FC<PaymentSuggestionCardProps> = ({
  distanceMiles,
  totalRiders,
  driverOverride,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const breakdown = useMemo(() => {
    const roundTripMiles = distanceMiles * 2;
    const gasCost = (roundTripMiles / AVG_MPG) * GAS_PRICE;
    const totalCost = gasCost + PARKING_COST;
    const perRider = totalRiders > 0 ? totalCost / totalRiders : totalCost;

    return {
      roundTripMiles,
      gasCost,
      parkingCost: PARKING_COST,
      totalCost,
      perRider,
    };
  }, [distanceMiles, totalRiders]);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div
      className={`bg-emerald-50/50 border border-emerald-200 rounded-2xl overflow-hidden ${className}`}
    >
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Calculator size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-emerald-700 font-medium">Suggested</p>
            <p className="text-lg font-bold text-emerald-800">
              ~{formatCurrency(breakdown.perRider)} per rider
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
          aria-label={isExpanded ? 'Collapse breakdown' : 'Expand breakdown'}
        >
          <ChevronDown
            size={18}
            className={`text-emerald-500 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="px-5 pb-4 pt-0 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="h-px bg-emerald-200/60" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-700">
                Gas ({breakdown.roundTripMiles.toFixed(1)} mi round trip)
              </span>
              <span className="font-semibold text-emerald-800">
                {formatCurrency(breakdown.gasCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Parking (UCI daily)</span>
              <span className="font-semibold text-emerald-800">
                {formatCurrency(breakdown.parkingCost)}
              </span>
            </div>
            <div className="h-px bg-emerald-200/60" />
            <div className="flex justify-between">
              <span className="text-emerald-700">Total cost</span>
              <span className="font-bold text-emerald-800">
                {formatCurrency(breakdown.totalCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">
                Split among {totalRiders} rider{totalRiders !== 1 ? 's' : ''}
              </span>
              <span className="font-bold text-emerald-800">
                {formatCurrency(breakdown.perRider)}
              </span>
            </div>
          </div>

          {driverOverride !== undefined && driverOverride !== breakdown.perRider && (
            <div className="bg-white/60 rounded-xl p-3 border border-emerald-200/50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 font-medium">Driver set price</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(driverOverride)}
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-emerald-600/70">
            Based on {AVG_MPG} MPG avg, ${GAS_PRICE.toFixed(2)}/gal SoCal avg, ${PARKING_COST.toFixed(2)} UCI parking
          </p>
        </div>
      )}
    </div>
  );
};
