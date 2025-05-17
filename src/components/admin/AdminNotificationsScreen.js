import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../../../src/context/NotificationContext'; // Corrected path
import Icon from 'react-native-vector-icons/Ionicons';

const AdminNotificationsScreen = ({ navigation }) => {
  const { 
    recentNotifications, 
    clearNotificationCount, 
    dismissRecentNotification, 
    markAsRead, 
    isLoadingNotifications 
  } = useNotifications();

  useEffect(() => {
    // Clear the badge count when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isLoadingNotifications) { // Only clear if not loading
        clearNotificationCount();
      }
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, clearNotificationCount, isLoadingNotifications]);

  const handleNotificationPress = (notification) => {
    if (!notification || !notification.id) return;

    markAsRead(notification.id);

    console.log(`[AdminNotifications] Pressed notification: ${notification.id}, type: ${notification.type}, itemId: ${notification.itemId}`);

    switch (notification.type) {
      case 'order':
        if (notification.itemId && typeof notification.itemId === 'string') {
          const parts = notification.itemId.split('|');
          if (parts.length === 2) {
            const orderId = parts[0];
            const customerEmail = parts[1];
            navigation.navigate('Orders', { 
              screen: 'OrderDetail', 
              params: { orderId: orderId, customerEmail: customerEmail } 
            });
          } else {
            console.warn("[AdminNotifications] Order notification itemId has incorrect format.", notification.itemId);
          }
        } else {
          console.warn("[AdminNotifications] Order notification missing or invalid itemId.")
        }
        break;
      case 'stock':
        if (notification.itemId) {
          // ProductEditScreen expects a product object or productId to fetch.
          // For now, we pass productId. ProductEditScreen might need adjustment if it only accepts full product object.
          navigation.navigate('Products', { 
            screen: 'ProductEdit', 
            params: { productId: notification.itemId } // Ensure ProductEditScreen can handle fetching by ID
          });
        } else {
          console.warn("[AdminNotifications] Stock notification missing itemId.")
        }
        break;
      case 'user':
        if (notification.itemId) {
          navigation.navigate('Customers', { 
            screen: 'UserEdit', 
            params: { userId: notification.itemId } 
          });
        } else {
          console.warn("[AdminNotifications] User notification missing itemId.")
        }
        break;
      default:
        console.log(`[AdminNotifications] Unknown notification type: ${notification.type}`);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)} style={styles.touchableItem}>
      <View style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
        <View style={styles.notificationHeader}>
          <Icon 
            name={item.type === 'order' ? "cart-outline" : item.type === 'stock' ? "cube-outline" : item.type === 'user' ? "person-circle-outline" : "notifications-outline"} 
            size={24} 
            color={item.type === 'order' ? styles.orderIcon.color : 
                   item.type === 'stock' ? styles.stockIcon.color : 
                   item.type === 'user' ? styles.userIcon.color : styles.defaultIcon.color}
            style={styles.icon}
          />
          <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); dismissRecentNotification(item.id); }} style={styles.dismissButton}>
            <Icon name="close-circle-outline" size={22} color="#999" />
          </TouchableOpacity>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTimestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoadingNotifications && recentNotifications.length === 0) { // Show loading indicator only if list is empty initially
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={{marginTop: 10}}>Loading notifications...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} />{/* Spacer to balance header */}
      </View>

      {recentNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No new notifications.</Text>
        </View>
      ) : (
        <FlatList
          data={recentNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
          extraData={recentNotifications} // Ensure FlatList re-renders on data change
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContent: { // Added for loading indicator
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContentContainer: {
    padding: 10,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  orderIcon: { color: '#2979FF' }, // Blue for orders
  stockIcon: { color: '#FF6D00' }, // Orange for stock
  userIcon: { color: '#00C853' }, // Added user icon color (e.g., green)
  defaultIcon: { color: '#4CAF50' }, // Green for others
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  dismissButton: {
    padding: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#aaa',
    marginTop: 10,
  },
  unreadItem: {
    backgroundColor: '#E8F0FE', // Light blue for unread items
    borderLeftWidth: 4,
    borderLeftColor: '#2979FF',
  },
  unreadTitle: {
    fontWeight: 'bold', // Make title bold for unread items
  },
  touchableItem: { // Added for TouchableOpacity ripple effect if any
    // No specific styles needed here unless you want to customize touch feedback area
  },
});

export default AdminNotificationsScreen; 