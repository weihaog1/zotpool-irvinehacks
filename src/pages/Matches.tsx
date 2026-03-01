import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRides } from '../context/RideContext';
import { MatchCard, FindMatchResults } from '../components/matches';
import type { FindResult } from '../components/matches';
import { findMatches } from '../services/matching';
import { createMatchRequest, respondToMatch, fetchUserMatches } from '../services/matches';
import {
  Search,
  Zap,
  Clock,
  CheckCircle,
  Archive,
  ChevronDown,
  Loader2,
  Inbox,
} from 'lucide-react';
import type { Ride, Match } from '../types';

type TabKey = 'pending' | 'active' | 'history';

const VALID_TABS: TabKey[] = ['pending', 'active', 'history'];

export const Matches: React.FC = () => {
  const { user } = useAuth();
  const { rides } = useRides();
  const [searchParams] = useSearchParams();

  const initialTab = VALID_TABS.includes(searchParams.get('tab') as TabKey)
    ? (searchParams.get('tab') as TabKey)
    : 'pending';

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [respondingIds, setRespondingIds] = useState<Set<string>>(new Set());

  const [selectedRideId, setSelectedRideId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [findResults, setFindResults] = useState<FindResult[]>([]);
  const [isFinding, setIsFinding] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [requestingIds, setRequestingIds] = useState<Set<string>>(new Set());

  const myRides = useMemo(
    () => rides.filter((r) => r.userId === user?.id && r.status === 'active'),
    [rides, user?.id],
  );

  const selectedRide = useMemo(
    () => myRides.find((r) => r.id === selectedRideId) ?? null,
    [myRides, selectedRideId],
  );

  useEffect(() => {
    if (!user?.id) return;
    setIsLoadingMatches(true);
    fetchUserMatches(user.id)
      .then((data) => setMatches(data as unknown as Match[]))
      .catch(() => setMatches([]))
      .finally(() => setIsLoadingMatches(false));
  }, [user?.id]);

  const pendingMatches = useMemo(
    () => matches.filter((m) => m.status === 'pending'),
    [matches],
  );
  const activeMatches = useMemo(
    () => matches.filter((m) => m.status === 'accepted'),
    [matches],
  );
  const historyMatches = useMemo(
    () => matches.filter((m) => m.status === 'declined' || m.status === 'cancelled'),
    [matches],
  );

  const tabCounts: Record<TabKey, number> = {
    pending: pendingMatches.length,
    active: activeMatches.length,
    history: historyMatches.length,
  };

  const currentMatches = useMemo(() => {
    switch (activeTab) {
      case 'pending': return pendingMatches;
      case 'active': return activeMatches;
      case 'history': return historyMatches;
    }
  }, [activeTab, pendingMatches, activeMatches, historyMatches]);

  const handleFindMatches = useCallback(() => {
    if (!selectedRide) return;
    setIsFinding(true);
    setFindResults([]);
    setHasSearched(false);

    const activeRides = rides.filter((r) => r.status === 'active');
    const results = findMatches(selectedRide, activeRides);

    const mapped: FindResult[] = results
      .map((r) => {
        const original = rides.find((ride) => ride.id === r.ride.id);
        if (!original) return null;
        return { ride: original, score: r.score };
      })
      .filter((r): r is FindResult => r !== null);

    setFindResults(mapped);
    setIsFinding(false);
    setHasSearched(true);
  }, [selectedRide, rides]);

  const handleRequestMatch = useCallback(
    async (candidateRide: Ride, score: number) => {
      if (!selectedRide || !user?.id) return;
      setRequestingIds((prev) => new Set(prev).add(candidateRide.id));
      try {
        const driverRideId = selectedRide.type === 'driver' ? selectedRide.id : candidateRide.id;
        const passengerRideId = selectedRide.type === 'passenger' ? selectedRide.id : candidateRide.id;
        const newMatch = await createMatchRequest(driverRideId, passengerRideId, score, user.id);
        setMatches((prev) => [newMatch as unknown as Match, ...prev]);
        setFindResults((prev) => prev.filter((r) => r.ride.id !== candidateRide.id));
      } finally {
        setRequestingIds((prev) => {
          const next = new Set(prev);
          next.delete(candidateRide.id);
          return next;
        });
      }
    },
    [selectedRide, user?.id],
  );

  const handleRespond = useCallback(async (matchId: string, accept: boolean) => {
    setRespondingIds((prev) => new Set(prev).add(matchId));
    try {
      const updated = await respondToMatch(matchId, accept);
      setMatches((prev) => prev.map((m) => (m.id === matchId ? (updated as unknown as Match) : m)));
    } finally {
      setRespondingIds((prev) => {
        const next = new Set(prev);
        next.delete(matchId);
        return next;
      });
    }
  }, []);

  const getUserRideForMatch = useCallback(
    (match: Match) => {
      if (!user?.id) return null;
      const driverRide = match.driverRide ?? rides.find((r) => r.id === match.driverRideId);
      const passengerRide = match.passengerRide ?? rides.find((r) => r.id === match.passengerRideId);
      if (driverRide?.userId === user.id) return driverRide;
      if (passengerRide?.userId === user.id) return passengerRide;
      return null;
    },
    [user?.id, rides],
  );

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Pending', icon: <Clock size={16} /> },
    { key: 'active', label: 'Active', icon: <CheckCircle size={16} /> },
    { key: 'history', label: 'History', icon: <Archive size={16} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Matches</h1>
        <p className="text-slate-500 mt-2 text-lg">Find compatible rides and manage your match requests.</p>
      </div>

      {/* Find Matches */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 p-2 rounded-lg text-uci-blue"><Search size={20} /></div>
          <h2 className="font-display font-bold text-slate-900 text-xl">Find Matches</h2>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          Select one of your active rides, then search for compatible drivers or passengers nearby.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
            >
              <span className={selectedRide ? 'text-slate-900' : 'text-slate-400'}>
                {selectedRide
                  ? `${selectedRide.origin} to ${selectedRide.destination} (${selectedRide.type})`
                  : 'Select a ride...'}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                {myRides.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-400">No active rides. Create a ride first.</p>
                ) : (
                  myRides.map((ride) => (
                    <button
                      key={ride.id}
                      onClick={() => { setSelectedRideId(ride.id); setIsDropdownOpen(false); setFindResults([]); setHasSearched(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedRideId === ride.id ? 'bg-blue-50 text-uci-blue font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <span className="font-medium">{ride.origin} to {ride.destination}</span>
                      <span className="ml-2 text-xs text-slate-400 uppercase">{ride.type}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleFindMatches}
            disabled={!selectedRide || isFinding}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-uci-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md whitespace-nowrap"
          >
            {isFinding ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            Find Matches
          </button>
        </div>

        <FindMatchResults
          results={findResults}
          isFinding={isFinding}
          hasSearched={hasSearched}
          requestingIds={requestingIds}
          onRequestMatch={handleRequestMatch}
        />
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-uci-blue text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Match list */}
      {isLoadingMatches ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse" />
          ))}
        </div>
      ) : currentMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <Inbox size={32} />
          </div>
          <p className="font-medium text-slate-900">
            {activeTab === 'pending' && 'No pending matches'}
            {activeTab === 'active' && 'No active matches yet'}
            {activeTab === 'history' && 'No match history'}
          </p>
          <p className="text-sm text-slate-500 mt-1 text-center max-w-xs">
            {activeTab === 'pending' && 'When someone requests to match with your ride, it will appear here.'}
            {activeTab === 'active' && 'Accepted matches with upcoming rides will show here.'}
            {activeTab === 'history' && 'Declined and cancelled matches will be listed here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentMatches.map((match) => {
            const resolvedMatch: Match = {
              ...match,
              driverRide: match.driverRide ?? rides.find((r) => r.id === match.driverRideId),
              passengerRide: match.passengerRide ?? rides.find((r) => r.id === match.passengerRideId),
            };
            const userRide = getUserRideForMatch(resolvedMatch);
            if (!userRide || (!resolvedMatch.driverRide && !resolvedMatch.passengerRide)) return null;
            return (
              <MatchCard
                key={match.id}
                match={resolvedMatch}
                userRide={userRide}
                onAccept={match.status === 'pending' && !respondingIds.has(match.id) ? (id: string) => handleRespond(id, true) : undefined}
                onDecline={match.status === 'pending' && !respondingIds.has(match.id) ? (id: string) => handleRespond(id, false) : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
