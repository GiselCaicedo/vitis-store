'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

export default function NotificationButton({ initialNotifications = [] }) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  // Calcula el número de notificaciones no leídas (si se pasan notificaciones iniciales)
  useEffect(() => {
    if (initialNotifications.length > 0) {
      setUnreadCount(initialNotifications.filter(notification => !notification.read).length);
    }
  }, [initialNotifications]);

  return (
    <button
      onClick={() => router.push('/notificaciones')}
      className="flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100 transition-colors relative"
      aria-label="Notificaciones"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-medium rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
