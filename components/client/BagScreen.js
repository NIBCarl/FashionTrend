import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import Navbar from "../../navigation/navBar";
import { SafeAreaView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../navigation/BottomNavBar';
import { useBag } from '../../src/context/BagContext'; // Adjust path if needed
import { useAuth } from '../../src/context/AuthContext'; // Import useAuth
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useNotifications } from '../../src/context/NotificationContext'; // Added import

const ADMIN_NOTIFICATIONS_KEY = 'admin_notifications'; // Key for admin notifications

const initialCart = [
  {
    id: '1',
    name: 'Polo shirt',
    image: require('../../assets/products/polo.png'),
    size: '35 L',
    quantity: 2,
    price: 6000,
  },
  {
    id: '2',
    name: 'Jacket',
    image: require('../../assets/products/jacket1.png'),
    size: '34 L',
    quantity: 1,
    price: 6000,
  },
  {
    id: '3',
    name: 'Jacket',
    image: require('../../assets/products/jacket2.png'),
    size: '34 L',
    quantity: 1,
    price: 6000,
  },
  {
    id: '4',
    name: 'Shirt',
    image: require('../../assets/products/shirt.png'),
    size: '33 L',
    quantity: 1,
    price: 6000,
  },
];

const BagScreen = ({ navigation }) => {
  const { 
    bagItems,
    loading,
    removeItem,
    updateItemQuantity,
    totalPrice,
    clearBag // Get clearBag function from context
  } = useBag();
  const { loggedInUserEmail } = useAuth(); // Get user email
  const { addNotification } = useNotifications(); // Added useNotifications hook
  const [modalVisible, setModalVisible] = useState(false);
  const [orderCompleteVisible, setOrderCompleteVisible] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Add loading state for checkout

  // --- Simulated Checkout Logic --- 
  const handleSimulatedCheckout = async () => {
    if (!loggedInUserEmail) {
        Alert.alert("Error", "You must be logged in to check out.");
        return;
    }
    if (bagItems.length === 0) {
        Alert.alert("Error", "Your bag is empty.");
        return;
    }

    setIsCheckingOut(true);

    try {
        // 1. Generate Order ID and Date
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const orderDate = new Date().toISOString();

        // 2. Create New Order Object - **Process items to ensure image is a string URI**
        const processedItems = bagItems.map(item => {
            let imageUrl = null;
            if (typeof item.image === 'string') {
                // Already a string URI
                imageUrl = item.image;
            } else if (typeof item.image === 'object' && item.image !== null && typeof item.image.uri === 'string') {
                // It's an object like { uri: '...' }, extract the uri
                imageUrl = item.image.uri;
            } else if (typeof item.image === 'number') {
                // It might be a require() result - This is less ideal for data saving.
                // For simplicity, we'll log a warning and maybe set to null or a placeholder.
                // A better long-term solution is to ensure bagItems *always* store the string URI.
                console.warn(`[Checkout] Item '${item.name}' image is a number (require?), cannot reliably save. Setting to null.`);
                imageUrl = null; // Or set a default placeholder string URI if you have one
            }
            // Return a new item object with the processed image URL and ensure quantity is copied
            return {
                ...item,
                image: imageUrl, // Save the processed string URI (or null)
                quantity: item.quantity // Ensure quantity is explicitly copied
            };
        });

        const newOrder = {
            id: orderId,
            date: orderDate,
            items: processedItems, // Use the processed items
            totalPrice: totalPrice,
            userEmail: loggedInUserEmail // Store user email with the order
        };
        console.log("[Checkout] Creating new order with processed items:", JSON.stringify(newOrder));

        // 3. Load Existing Orders
        const storageKey = `orders_${loggedInUserEmail}`;
        const existingOrdersRaw = await AsyncStorage.getItem(storageKey);
        const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
        console.log(`[Checkout] Found ${existingOrders.length} existing orders.`);

        // 4. Add New Order
        const updatedOrders = [...existingOrders, newOrder];

        // 5. Save Updated Orders
        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedOrders));
        console.log(`[Checkout] Saved ${updatedOrders.length} orders to ${storageKey}.`);

        // --- Add Admin Notification --- 
        try {
            addNotification({
                title: 'New Client Order!',
                message: `Order ${newOrder.id.substring(0,8)} for $${newOrder.totalPrice.toFixed(2)} by ${loggedInUserEmail}.`,
                type: 'order',
                itemId: `${newOrder.id}|${loggedInUserEmail}`,
            });
            console.log(`[Checkout] Admin notification for new order ${newOrder.id} (user: ${loggedInUserEmail}) sent via context.`);
        } catch (notifError) {
            console.error("[Checkout] Error sending admin notification via context:", notifError);
        }
        // --- End Admin Notification --- 

        // 6. Clear Bag (from context)
        clearBag();
        console.log("[Checkout] Bag cleared.");

        // 7. Show Confirmation
        setOrderCompleteVisible(true);

    } catch (error) {
        console.error("[Checkout] Error during simulated checkout:", error);
        Alert.alert("Checkout Error", "Could not process your order. Please try again.");
    } finally {
        setIsCheckingOut(false);
    }
  };
  // --- End Simulated Checkout Logic ---

  const renderBagItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => updateItemQuantity(item.id, item.quantity - 1)} style={styles.quantityButton}>
            <Icon name="remove-circle-outline" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateItemQuantity(item.id, item.quantity + 1)} style={styles.quantityButton}>
            <Icon name="add-circle-outline" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
        <Icon name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const renderListHeader = () => (
    <Text style={styles.title}>Shopping Bag</Text>
  );

  const renderEmptyList = () => (
    <View style={styles.centerContentEmpty}>
      <Icon name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>Your bag is empty.</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.shopButton}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container2}>
        <Navbar />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text>Loading Bag...</Text>
        </View>
        <View style={styles.bottomNavWrapper}>
          <BottomNavBar active="Bag" navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container2}>
      <Navbar />

      <FlatList
        data={bagItems}
        renderItem={renderBagItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContainer}
      />

      {bagItems.length > 0 && (
        <>
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.checkoutButton, isCheckingOut && styles.disabledButton]} 
            onPress={handleSimulatedCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={clearBag}>
            <Text style={styles.clearButtonText}>Clear Bag</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.checkoutBar}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome5 name="money-check-alt" size={16} color="#000" />
          <Text style={styles.paymentText}> Cash On Delivery</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.fullScreenOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <FontAwesome name="close" size={22} color="#333" />
          </TouchableOpacity>
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Payment Info.</Text>
            <Text style={styles.sheetSubTitle}>Payment Method:</Text>
            <View style={styles.radioGroup}>
              <View style={styles.radioItem}>
                <View style={[styles.radioCircle, { borderColor: '#007bff' }]}>
                  <View style={styles.radioSelected} />
                </View>
                <FontAwesome5 name="money-check-alt" size={16} color="#000" style={{ marginHorizontal: 8 }} />
                <Text style={styles.radioText}>Cash On Delivery</Text>
              </View>
              <View style={styles.radioItem}>
                <View style={styles.radioCircle} />
                <FontAwesome5 name="credit-card" size={16} color="#000" style={{ marginHorizontal: 8 }} />
                <Text style={styles.radioText}>Credit Card</Text>
              </View>
              <View style={styles.radioItem}>
                <View style={styles.radioCircle} />
                <FontAwesome5 name="paypal" size={16} color="#000" style={{ marginHorizontal: 8 }} />
                <Text style={styles.radioText}>PayPal</Text>
              </View>
              <View style={styles.radioItem}>
                <View style={styles.radioCircle} />
                <FontAwesome5 name="money-bill-wave" size={16} color="#000" style={{ marginHorizontal: 8 }} />
                <Text style={styles.radioText}>GCash</Text>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>Juan Luna</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>
                Brgy. San Juan, Surigao City, Surigao del Norte
              </Text>
              <Text style={styles.estimatedDelivery}>Estimated delivery: <Text style={{ fontWeight: 'bold' }}>3 - 7 days</Text></Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={orderCompleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOrderCompleteVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.orderModal}>
            <Text style={styles.orderText}>Order Completed ✅</Text>
            <TouchableOpacity onPress={() => {
              setOrderCompleteVisible(false);
              navigation.navigate('OrderHistory');
            }}>
              <Text style={styles.orderLink}>View order history</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNavWrapper}>
        <BottomNavBar active="Bag" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};


const pickerSelectStyles = {
  inputIOS: {
    fontSize: 13,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 3,
    color: '#333',
    width: 60,
    marginTop: 4,
  },
  inputAndroid: {
    fontSize: 13,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 3,
    color: '#333',
    width: 60,
    marginTop: 4,
  },
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b4332',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'TenorSans',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 15,
    color: '#8A2BE2',
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerContentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#888',
    fontFamily: 'TenorSans',
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
    fontFamily: 'TenorSans',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'TenorSans',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  checkoutButton: {
    backgroundColor: '#f97316',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'TenorSans',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'TenorSans',
  },
  checkoutBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
    color: '#1b4332',
  },
  chevron: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
    color: '#1b4332',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E8ECF4',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },

  logoLine1: {
    fontFamily: 'IslandMoments',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 20,
  },

  logoLine2: {
    fontFamily: 'IslandMoments',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -5,
    color: '#black',
  },

  star: {
    fontSize: 20,
    marginHorizontal: 4,
  },

  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fullScreenOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },

  sheetSubTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },

  radioGroup: {
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 280,
    right: 10,
    zIndex: 1,

  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },

  radioText: {
    fontSize: 15,
    color: '#222',
  },

  infoBlock: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },

  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },

  estimatedDelivery: {
    fontSize: 13,
    color: '#222',
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  orderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 10,
  },
  checkmark: {
    fontSize: 28,
    marginBottom: 20,
  },
  orderLink: {
    fontSize: 14,
    color: '#1d3557',
    textDecorationLine: 'underline',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default BagScreen;
