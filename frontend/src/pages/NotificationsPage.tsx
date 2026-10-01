import React, { useEffect, useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { api } from '../services/api';
import { Notification } from '../types';
import { Bell, Check, Loader2, AlertCircle } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const notifications = useUIStore(state => state.notifications);
  const setNotifications = useUIStore(state => state.setNotifications);
  const addToast = useUIStore(state => state.addToast);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.listNotifications();
        setNotifications(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [setNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      addToast('success', 'Notification marked as read');
    } catch (err) {
      addToast('error', 'Failed to update notification');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading">Notifications</h1>
          <p className="text-sm text-muted">Stay updated on agent generations, reports status, and team activity.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <span className="text-xs text-muted font-medium">Fetching updates...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card p-12 text-center rounded-3xl border border-border shadow-soft space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-primary flex items-center justify-center rounded-full mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-heading">No notifications yet</h3>
          <p className="text-xs text-muted leading-relaxed">
            We will alert you here when agent runs finish, comments are posted, or PDF reports compile.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-card p-5 rounded-3xl border shadow-soft flex items-start justify-between gap-4 transition ${
                notif.read ? 'border-border/60 opacity-85' : 'border-primary/30 bg-primary-light/5'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-slate-300' : 'bg-primary'}`} />
                  <h4 className="font-bold text-heading text-xs">{notif.title}</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed font-semibold pl-4">
                  {notif.message}
                </p>
                <span className="text-[9px] text-muted block pl-4">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-light text-primary hover:bg-primary/20 text-[10px] font-bold transition shrink-0"
                >
                  <Check className="w-3 h-3" /> Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

