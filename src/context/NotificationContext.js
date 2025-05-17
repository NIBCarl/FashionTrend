import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

const ADMIN_NOTIFICATIONS_KEY = 'admin_notifications';
const MAX_RECENT_NOTIFICATIONS = 50; // Increased limit for persisted notifications

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications from AsyncStorage on mount
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const storedNotifications = await AsyncStorage.getItem(ADMIN_NOTIFICATIONS_KEY);
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setRecentNotifications(parsedNotifications);
          setNotificationCount(parsedNotifications.filter(n => !n.isRead).length);
        } else {
          setRecentNotifications([]);
          setNotificationCount(0);
        }
      } catch (error) {
        console.error('Failed to load notifications from AsyncStorage:', error);
        setRecentNotifications([]);
        setNotificationCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const addNotification = useCallback(async (notificationData) => { // notificationData: { title: string, message: string, type: 'order' | 'stock' | 'user', itemId?: string | number }
    if (isLoading) {
      console.log("Skipping addNotification as notifications are still loading.");
      return;
    }
    const newNotification = {
      id: `${notificationData.type}_${Date.now()}_${notificationData.itemId || Math.random().toString(36).substr(2, 9)}`,
      ...notificationData,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    try {
      setRecentNotifications(prevRecent => {
        const updatedNotifications = [newNotification, ...prevRecent.slice(0, MAX_RECENT_NOTIFICATIONS - 1)];
        AsyncStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications)).catch(err => console.error("Failed to save notifications", err));
        setNotificationCount(updatedNotifications.filter(n => !n.isRead).length);
        return updatedNotifications;
      });
      // Optionally, show a toast for every new notification
      // showToast(newNotification.title, newNotification.type || 'info');
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  }, [isLoading]);

  const markAsRead = useCallback(async (notificationId) => {
    if (isLoading) return;
    try {
      setRecentNotifications(prevRecent => {
        const updatedNotifications = prevRecent.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        AsyncStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications)).catch(err => console.error("Failed to save notifications on markAsRead", err));
        setNotificationCount(updatedNotifications.filter(n => !n.isRead).length);
        return updatedNotifications;
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [isLoading]);
  
  const clearNotificationCount = useCallback(async () => { // Now marks all as read
    if (isLoading) return;
    try {
      setRecentNotifications(prevRecent => {
        const allReadNotifications = prevRecent.map(n => ({ ...n, isRead: true }));
        AsyncStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(allReadNotifications)).catch(err => console.error("Failed to save notifications on clearNotificationCount", err));
        setNotificationCount(0);
        return allReadNotifications;
      });
    } catch (error) {
      console.error('Failed to clear notification count (mark all as read):', error);
    }
  }, [isLoading]);

  const dismissRecentNotification = useCallback(async (notificationId) => {
    if (isLoading) return;
    try {
      setRecentNotifications(prevRecent => {
        const filteredNotifications = prevRecent.filter(n => n.id !== notificationId);
        AsyncStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(filteredNotifications)).catch(err => console.error("Failed to save notifications on dismiss", err));
        setNotificationCount(filteredNotifications.filter(n => !n.isRead).length);
        return filteredNotifications;
      });
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  }, [isLoading]);

  return (
    <NotificationContext.Provider value={{
      toast,
      showToast,
      notificationCount,
      addNotification,
      clearNotificationCount, // This now means "mark all as read"
      recentNotifications,
      dismissRecentNotification,
      markAsRead, // New function to mark specific notification as read
      isLoadingNotifications: isLoading,
    }}>
      {children}
      {/* Basic Toast UI (can be improved or replaced with a library) */}
      {toast && (
        <View style={{
          position: 'absolute',
          bottom: 50,
          left: 20,
          right: 20,
          padding: 15,
          backgroundColor: toast.type === 'error' ? 'red' : toast.type === 'success' ? 'green' : '#333',
          borderRadius: 8,
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <Text style={{ color: 'white' }}>{toast.message}</Text>
        </View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 