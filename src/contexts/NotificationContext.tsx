import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS } from '@/mocks/data/notifications';
import type { Notification } from '@/types/notification';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    toggleStar: (id: number) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load notifications from localStorage or use mock data
    useEffect(() => {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            setNotifications(JSON.parse(saved));
        } else {
            setNotifications(MOCK_NOTIFICATIONS);
        }
    }, []);

    // Save to localStorage whenever notifications change
    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const toggleStar = (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, is_starred: !notif.is_starred } : notif
            )
        );
    };

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, is_read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, is_read: true }))
        );
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                toggleStar,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
