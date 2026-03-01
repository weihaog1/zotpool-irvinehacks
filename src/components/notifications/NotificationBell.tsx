import React, { useState, useRef } from 'react';
import {
  Bell,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import type { AppNotification, NotificationType } from '../../types';
import { formatRelativeTime } from '../../lib/formatters';

interface NotificationBellProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

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

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:text-uci-blue hover:bg-blue-50 rounded-full transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` - ${unreadCount} unread` : ''}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  onMarkAllRead();
                }}
                className="text-xs font-semibold text-uci-blue hover:text-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
              </div>
            ) : (
              recentNotifications.map((notification) => {
                const Icon = typeIcons[notification.type];
                const colorClasses = typeColors[notification.type];

                return (
                  <button
                    key={notification.id}
                    onClick={() => {
                      if (!notification.isRead) {
                        onMarkRead(notification.id);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-slate-50 ${
                      !notification.isRead ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClasses}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm truncate ${
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
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100">
              <a
                href="#/notifications"
                className="block text-center text-sm font-semibold text-uci-blue hover:text-blue-700 transition-colors"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
