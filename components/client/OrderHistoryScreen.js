import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Navbar from '../../navigation/navBar';
import BottomNavBar from '../../navigation/BottomNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../src/context/AuthContext'; // Adjust path if needed
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Helper function for status styling (similar to admin side)
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
      case 'delivered': return { color: '#4CAF50', fontWeight: 'bold' }; // Green
      case 'shipped': return { color: '#2196F3', fontWeight: 'bold' };   // Blue
      case 'processing': return { color: '#FFC107', fontWeight: 'bold' };// Amber
      case 'pending': return { color: '#FF9800', fontWeight: 'bold' };    // Orange
      case 'cancelled': return { color: '#F44336', fontWeight: 'bold' };  // Red
      default: return { color: '#757575', fontWeight: 'bold' };        // Grey
  }
};

const OrderHistoryScreen = ({ navigation }) => {
  const { loggedInUserEmail } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderHistory = useCallback(async () => {
    if (!loggedInUserEmail) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const storageKey = `orders_${loggedInUserEmail}`;
      console.log(`[OrderHistory] Loading orders from key: ${storageKey}`);
      const storedOrders = await AsyncStorage.getItem(storageKey);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        // Sort orders by date, newest first
        parsedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(parsedOrders);
        console.log(`[OrderHistory] Loaded ${parsedOrders.length} orders.`);
      } else {
        setOrders([]); // No orders found
        console.log(`[OrderHistory] No orders found in storage.`);
      }
    } catch (err) {
      console.error("[OrderHistory] Failed to load orders:", err);
      setError("Failed to load order history.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [loggedInUserEmail]);

  // Load orders when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Wrap the call to the async function
      loadOrderHistory();

      // Optional: Return a cleanup function if needed
      // return () => { console.log("[OrderHistory] Screen unfocused"); };
    }, [loadOrderHistory]) // Depend on the memoized loadOrderHistory function
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.id.substring(0, 8)}...</Text>
        {/* Display Status next to Date */}
        <View style={styles.headerRight}>
             <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>
                {item.status || 'Pending'} 
             </Text>
            <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.itemSummaryContainer}>
        {item.items.slice(0, 2).map((product, index) => { // Show first 2 items preview
           // Check image type before rendering
           const showImage = typeof product.image === 'string' && product.image.trim() !== '';
           return (
             <View key={index} style={styles.productItem}>
                {showImage ? (
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                ) : (
                    <View style={styles.productImagePlaceholder}>
                        <Icon name="image-outline" size={15} color="#ccc" />
                    </View>
                )}
                <Text style={styles.productInfo}>{product.name} (x{product.quantity})</Text>
             </View>
           );
        })}
        {item.items.length > 2 && <Text style={styles.moreItems}>...and {item.items.length - 2} more</Text>}
      </View>
      <Text style={styles.orderTotal}>Total: ${item.totalPrice.toFixed(2)}</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContent}>
      <Icon name="receipt-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.shopButton}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderListHeader = () => (
    <Text style={styles.header}>My Orders</Text>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <Navbar />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text>Loading Orders...</Text>
        </View>
        <View style={styles.bottomNavWrapper}>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <Navbar />
        <View style={[styles.container, styles.centerContent]}>
          <Icon name="alert-circle-outline" size={50} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
        <View style={styles.bottomNavWrapper}>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <Navbar />
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.bottomNavWrapper}>
        <BottomNavBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#F5F5F5',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  sideBar: {
    width: 6,
    backgroundColor: 'orange',
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'cover',
    margin: 10,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 14,
    flexShrink: 1, // Allow ID to shrink
    marginRight: 5,
  },
  status: {
    backgroundColor: 'green',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  link: {
    fontSize: 13,
    color: 'green',
    fontWeight: '500',
    marginBottom: 6,
  },
  location: {
    fontSize: 13,
    color: '#333',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  trackingContainer: {
    marginTop: 10,
    paddingLeft: 10,
    marginLeft: -170,
    marginTop: 50,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeline: {
    alignItems: 'center',
    marginRight: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginVertical: 4,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: '#ccc',
  },
  stepText: {
    fontSize: 13,
    color: '#333',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'TenorSans', // Example font
  },
  shopButton: {
    marginTop: 30,
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'TenorSans', // Example font
  },
  errorText: {
    marginTop: 15,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    backgroundColor: '#F5F5F5',
  },
  orderItemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  headerRight: { // Container for status and date
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatus: {
      fontSize: 13,
      fontWeight: 'bold',
      marginRight: 8, // Add space between status and date
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
      overflow: 'hidden', // Needed for potential background in future
  },
  orderDate: {
    fontSize: 13,
    color: '#666',
  },
  itemSummaryContainer: {
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#eee', // Placeholder bg
  },
  productImagePlaceholder: { // Style for placeholder
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    fontSize: 13,
    color: '#555',
    flexShrink: 1, // Allow text to shrink if needed
  },
  moreItems: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 38, // Align with product info text
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 5,
    color: '#8A2BE2',
  },
  detailsLink: {
    color: '#007bff',
    textAlign: 'right',
    fontSize: 13,
    marginTop: 5,
  },
  bottomNavWrapper: {
  },
});

export default OrderHistoryScreen;
