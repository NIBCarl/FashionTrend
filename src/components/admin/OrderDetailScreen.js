import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
// Potentially use a picker for status update
// import { Picker } from '@react-native-picker/picker';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId, customerEmail } = route.params; // MODIFIED: Expect orderId and customerEmail

  const [currentOrder, setCurrentOrder] = useState(null); // MODIFIED: Initialize as null
  const [isLoading, setIsLoading] = useState(true); // MODIFIED: Start with loading true
  const [newStatus, setNewStatus] = useState(''); // MODIFIED: Initialize as empty
  const [error, setError] = useState(null);

  // Available statuses - can be expanded
  const availableStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !customerEmail) {
        setError("Order ID or Customer Email not provided.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const storageKey = `orders_${customerEmail}`;
        const existingOrdersRaw = await AsyncStorage.getItem(storageKey);
        if (existingOrdersRaw) {
          const allUserOrders = JSON.parse(existingOrdersRaw);
          const foundOrder = allUserOrders.find(o => o.id === orderId);
          if (foundOrder) {
            setCurrentOrder(foundOrder);
            setNewStatus(foundOrder.status);
            navigation.setOptions({ title: `Order #${foundOrder.id.substring(0, 8)}...` });
            setError(null);
          } else {
            setError(`Order with ID ${orderId} not found for customer ${customerEmail}.`);
          }
        } else {
          setError(`No orders found for customer ${customerEmail}.`);
        }
      } catch (err) {
        console.error("[OrderDetail] Error fetching order details:", err);
        setError("Failed to load order details. " + err.message);
      }
      setIsLoading(false);
    };

    fetchOrderDetails();
  }, [orderId, customerEmail, navigation]);

  const handleUpdateStatus = async () => {
    if (!currentOrder) {
        Alert.alert("Error", "Order data is not loaded.");
        return;
    }
    if (newStatus === currentOrder.status) {
      Alert.alert("No Change", "The selected status is the same as the current status.");
      return;
    }
    setIsLoading(true);
    try {
      // currentOrder.userEmail should exist if order was fetched correctly
      if (!currentOrder.userEmail) {
        throw new Error("User email missing from order data.");
      }
      console.log(`[OrderDetail] Attempting to update status for order ${currentOrder.id} of user ${currentOrder.userEmail} to ${newStatus}`);
      
      const storageKey = `orders_${currentOrder.userEmail}`; // Use userEmail from the fetched order object
      const existingOrdersRaw = await AsyncStorage.getItem(storageKey);
      if (!existingOrdersRaw) {
        throw new Error("Order data not found for this user.");
      }
      let existingOrders = JSON.parse(existingOrdersRaw);
      
      const orderIndex = existingOrders.findIndex(o => o.id === currentOrder.id);
      if (orderIndex === -1) {
        throw new Error("Specific order not found in user's order list.");
      }
      
      // Update the status of the specific order
      existingOrders[orderIndex].status = newStatus;
      
      // Save the updated orders array back to AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify(existingOrders));
      
      setCurrentOrder({ ...currentOrder, status: newStatus });
      Alert.alert("Status Updated", `Order status changed to ${newStatus}`);

    } catch (error) {
      console.error("[OrderDetail] Error updating status:", error);
      Alert.alert("Error", "Could not update order status. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) { // MODIFIED: Show loading indicator if isLoading is true
    return (
      <SafeAreaView style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (error) { // MODIFIED: Show error message if an error occurred
    return (
      <SafeAreaView style={styles.centeredMessageContainer}>
        <Icon name="alert-circle-outline" size={48} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!currentOrder) { // This case might be redundant if error handles it, but good fallback
    return (
      <SafeAreaView style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  const renderOrderItem = ({ item, index }) => (
    <View key={index} style={styles.productItemContainer}>
      {item.image && typeof item.image === 'string' ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Icon name="cube-outline" size={24} color="#ccc" />
        </View>
      )}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name} (ID: {item.id?.substring(0,6)}...)</Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.productPrice}>Price: ${item.price?.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value} selectable>{currentOrder.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Customer Email:</Text>
            <Text style={styles.value} selectable>{currentOrder.customerEmail}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>{new Date(currentOrder.date).toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Current Status:</Text>
            <Text style={[styles.value, styles.statusText, getStatusStyle(currentOrder.status)]}>
              {currentOrder.status}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Price:</Text>
            <Text style={styles.value}>${currentOrder.totalPrice?.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({currentOrder.items?.length || 0})</Text>
          {currentOrder.items?.map((item, index) => renderOrderItem({ item, index }))}
          {(!currentOrder.items || currentOrder.items.length === 0) && (
             <Text style={styles.noItemsText}>No items in this order.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <View style={styles.statusUpdateContainer}>
            {/* Simple buttons for now, Picker could be an alternative */}
            {availableStatuses.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  newStatus === status && styles.statusButtonSelected,
                  currentOrder.status === status && styles.statusButtonCurrent // Highlight current actual status
                ]}
                onPress={() => setNewStatus(status)}
                disabled={isLoading}
              >
                <Text 
                    style={[
                        styles.statusButtonText,
                        newStatus === status && styles.statusButtonTextSelected
                    ]}
                >
                    {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity 
            style={[styles.updateButton, isLoading && styles.disabledButton]}
            onPress={handleUpdateStatus} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Confirm Status Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper for status color styling
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  container: {
    padding: 16,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    flexShrink: 1, // Allow text to wrap if too long
  },
  statusText: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden', // For rounded corners with background in future
  },
  productItemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  productQuantity: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
  },
  statusUpdateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20, // More rounded
    borderWidth: 1,
    borderColor: '#007AFF', // Blue border
    margin: 5,
    minWidth: 100, // Ensure buttons have some width
    alignItems: 'center',
  },
  statusButtonSelected: {
    backgroundColor: '#007AFF', // Blue background when selected
  },
  statusButtonCurrent: {
    borderColor: '#4CAF50', // Green border for current status
    backgroundColor: '#E8F5E9', // Light green background for current status
  },
  statusButtonText: {
    color: '#007AFF', // Blue text
    fontWeight: '500',
  },
  statusButtonTextSelected: {
    color: '#fff', // White text when selected
  },
  updateButton: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen; 