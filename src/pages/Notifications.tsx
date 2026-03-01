import React from 'react';
import {
  Bell,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  CheckCheck,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import type { AppNotification, NotificationType } from '../types';
import { formatRelativeTime } from '../lib/formatters';

const typeIcons: Record<NotificationType, React.ComponentType<{ size?: number; className?: string }>> = {
  match_request: UserPlus,
  match_accepted: CheckCircle,
  match_declined: XCircle,
  pickup_reminder: Clock,
  ride_cancelled: AlertTriangle,
};

const typeColors: Record<NotificationType, string> = {
  match_request: 'text-uci-blue bg-blue-50',
  match_accepted: 'text-emerald-600 bg-emerald-50',
  match_declined: 'text-red-500 bg-red-50',
  pickup_reminder: 'text-amber-500 bg-amber-50',
  ride_cancelled: 'text-red-500 bg-red-50',
};

function groupByDate(notifications: AppNotification[]): { label: string; items: AppNotification[] }[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const weekStart = todayStart - 6 * 86400000;

  const groups: Record<string, AppNotification[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  };

  for (const n of notifications) {
    const ts = new Date(n.createdAt).getTime();
    if (ts >= todayStart) {
      groups.Today.push(n);
    } else if (ts >= yesterdayStart) {
      groups.Yesterday.push(n);
    } else if (ts >= weekStart) {
      groups['This Week'].push(n);
    } else {
      groups.Earlier.push(n);
    }
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

export const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  const grouped = groupByDate(notifications);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-uci-blue hover:bg-blue-50 rounded-full transition-colors"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <Bell size={32} />
          </div>
          <p className="font-medium text-slate-900">No notifications yet</p>
          <p className="text-sm text-slate-500 mt-1">
            You will be notified when someone matches with your ride.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.label}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">
                {group.label}
              </h2>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
                {group.items.map((notification) => {
                  const Icon = typeIcons[notification.type];
                  const colorClasses = typeColors[notification.type];

                  return (
                    <button
                      key={notification.id}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification.id);
                        }
                      }}
                      className={`w-full text-left px-5 py-4 flex gap-4 transition-colors hover:bg-slate-50 ${
                        !notification.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClasses}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              !notification.isRead
                                ? 'font-bold text-slate-900'
                                : 'font-medium text-slate-600'
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-uci-blue shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{notification.body}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
