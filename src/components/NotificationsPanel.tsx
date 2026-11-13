/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, CheckCheck, Award, BookOpen, Megaphone, ClipboardCheck, X } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { NotificationType } from '../types/lms';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconForType = (type: NotificationType) => {
  switch (type) {
    case 'certificate':
      return <Award className="w-4 h-4 text-amber-400" />;
    case 'quiz':
      return <ClipboardCheck className="w-4 h-4 text-emerald-400" />;
    case 'announcement':
      return <Megaphone className="w-4 h-4 text-[#f04432]" />;
    case 'completion':
      return <CheckCheck className="w-4 h-4 text-cyan-400" />;
    default:
      return <BookOpen className="w-4 h-4 text-[#4b8bff]" />;
  }
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, currentUser } = usePlatform();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#0c1424] border-l border-slate-800 h-full flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#4b8bff]" />
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f04432] text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-[#4b8bff] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!currentUser ? (
            <div className="text-center py-12 text-xs text-[#a7b0c0]">
              Sign in to view course enrollment updates, quiz scores, and certificate notifications.
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#a7b0c0]">
              No notifications yet. Enroll in a course or complete an assessment to receive updates here.
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  n.read
                    ? 'bg-[#080d1a] border-slate-800/80 opacity-75'
                    : 'bg-[#10182a] border-[#4b8bff]/40 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#080d1a] border border-slate-800 shrink-0">
                    {iconForType(n.type)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#f04432] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#a7b0c0] leading-relaxed">{n.message}</p>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
