import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    console.log('[AdminOrders] Loading orders...');
    setError(null);
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const orderKeys = allKeys.filter((key) => key.startsWith('orders_'));
      console.log(`[AdminOrders] Found order keys:`, orderKeys);

      let combinedOrders = [];
      if (orderKeys.length > 0) {
        const orderDataPromises = orderKeys.map(key => AsyncStorage.getItem(key));
        const orderJsonStrings = await Promise.all(orderDataPromises);

        for (let i = 0; i < orderJsonStrings.length; i++) {
          const jsonString = orderJsonStrings[i];
          const storageKey = orderKeys[i];

          if (jsonString) {
            try {
              const userOrdersArray = JSON.parse(jsonString);

              if (Array.isArray(userOrdersArray)) {
                for (const singleOrder of userOrdersArray) {
                  if (singleOrder && singleOrder.id) {
                    let customerEmail = 'Unknown User';
                    if (singleOrder.userEmail) {
                        customerEmail = singleOrder.userEmail;
                    } else {
                        const keyParts = storageKey.split('orders_');
                        if (keyParts.length > 1) customerEmail = keyParts[1];
                    }

                    const orderWithDetails = {
                      ...singleOrder,
                      customerEmail,
                      uniqueId: `${storageKey}-${singleOrder.id}`
                    };
                    combinedOrders.push(orderWithDetails);

                  } else {
                    console.warn("[AdminOrders] Skipping an individual order object because it's missing an ID or is invalid:", singleOrder, "from key:", storageKey);
                  }
                }
              } else {
                console.warn("[AdminOrders] Parsed data for key", storageKey, "is not an array:", userOrdersArray);
                setError('Warning: Some order data is not in the expected format (array).');
              }
            } catch (parseError) {
              console.error("[AdminOrders] Error parsing order JSON for key", storageKey, ":", parseError);
              setError('Error parsing some order data.');
            }
          }
        }
      }

      combinedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(combinedOrders);
      console.log(`[AdminOrders] Loaded ${combinedOrders.length} total orders from ${orderKeys.length} users.`);

    } catch (err) {
      console.error('[AdminOrders] Failed to load orders:', err);
      setError('Failed to load orders data.');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
        setLoading(true);
        loadOrders();
    }, [loadOrders])
  );

  const onRefresh = useCallback(() => {
      setRefreshing(true);
      loadOrders();
  }, [loadOrders]);

  const renderOrderItem = ({ item }) => {
    const firstItem = item.items?.[0];
    const itemSummaryText = `${firstItem?.name || 'Unknown Item'} (x${firstItem?.quantity || 0})${item.items.length > 1 ? ` + ${item.items.length - 1} more` : ''}`;
    const imageUrl = firstItem?.image;

    const showImage = typeof imageUrl === 'string' && imageUrl.trim() !== '';
    if (imageUrl && !showImage) {
        console.warn(`[AdminOrders] Invalid image URL found for item ${firstItem?.name}:`, imageUrl, '(type:', typeof imageUrl, ')');
    }

    return (
      <TouchableOpacity
        style={styles.orderItemContainer}
        onPress={() => {
            console.log('Navigating to details for order:', item.id, 'for customer:', item.customerEmail);
            navigation.navigate('OrderDetail', { orderId: item.id, customerEmail: item.customerEmail });
        }}
      >
        <View style={styles.orderContent}>
          {showImage ? (
             <Image source={{ uri: imageUrl }} style={styles.productImage} />
          ) : (
             <View style={styles.productImagePlaceholder}>
                <Icon name="image-outline" size={30} color="#ccc" />
             </View>
          )}
          <View style={styles.orderDetails}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId} numberOfLines={1}>ID: {item.id.substring(0, 8)}...</Text>
                <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.customerEmail}>Customer: {item.customerEmail}</Text>
              <View style={styles.itemSummaryContainer}>
                <Text style={styles.productInfo} numberOfLines={1}>
                  {itemSummaryText}
                </Text>
              </View>
              <View style={styles.footerContainer}>
                  <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>
                      Status: {item.status || 'Pending'}
                  </Text>
                  <Text style={styles.orderTotal}>Total: ${item.totalPrice?.toFixed(2) ?? 'N/A'}</Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.centerContent}>
      <Icon name="receipt-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No orders found.</Text>
      {error && orders.length === 0 && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return styles.statusDelivered;
      case 'shipped': return styles.statusShipped;
      case 'processing': return styles.statusProcessing;
      case 'pending': return styles.statusPending;
      case 'cancelled': return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Loading Orders...</Text>
      </SafeAreaView>
    );
  }

  if (error && orders.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.errorText}>{error}</Text>
         <TouchableOpacity onPress={loadOrders} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon name="menu-outline" size={30} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Orders</Text>
        </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.uniqueId}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#8A2BE2"]}/>
        }
      />
      {error && orders.length > 0 && (
         <Text style={styles.partialErrorText}>{error}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  errorText: {
      marginTop: 10,
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
  },
  retryButton: {
      marginTop: 20,
      backgroundColor: '#8A2BE2',
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 5,
  },
  retryButtonText: {
      color: '#fff',
      fontSize: 16,
  },
  partialErrorText: {
      textAlign: 'center',
      color: 'orange',
      padding: 10,
      backgroundColor: '#fff8e1'
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  orderItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 2,
    overflow: 'hidden',
  },
  orderContent: {
      flexDirection: 'row',
      padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderDetails: {
      flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 13,
    flexShrink: 1,
    marginRight: 5,
  },
  orderDate: {
    fontSize: 12,
    color: '#777',
  },
  customerEmail: {
      fontSize: 13,
      color: '#007bff',
      marginBottom: 6,
  },
  itemSummaryContainer: {
    marginBottom: 6,
  },
  productInfo: {
    fontSize: 13,
    color: '#555',
  },
  footerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: '#eee',
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
   orderStatus: {
      fontSize: 13,
      fontWeight: '500',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
      overflow: 'hidden',
      color: '#fff',
      textAlign: 'center',
  },
    statusPending: { backgroundColor: '#FFA726' },
    statusProcessing: { backgroundColor: '#29B6F6' },
    statusShipped: { backgroundColor: '#FFEE58', color: '#555' },
    statusDelivered: { backgroundColor: '#66BB6A' },
    statusCancelled: { backgroundColor: '#EF5350' },
});

export default OrdersScreen; 