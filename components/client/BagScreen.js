import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import Navbar from "../../navigation/navBar";
import { SafeAreaView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../navigation/BottomNavBar';


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

const BagScreen = () => {
  const [cartItems, setCartItems] = useState(initialCart);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderCompleteVisible, setOrderCompleteVisible] = useState(false);
  const navigation = useNavigation();

  const handleCheckout = () => {
    setOrderCompleteVisible(true);
  };
  const handleQuantity = (id, change) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleDelete = id => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSizeChange = (id, size) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, size } : item
      )
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <SafeAreaView style={styles.container2}>

      <View style={{ flex: 1 }}>
        {/* Navbar */}
        <Navbar />

        {/* Scrollable Content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 10}}>
          <View style={styles.container}>
            <Text style={styles.title}>Shopping Cart</Text>
            <FlatList
              data={cartItems}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.details}>
                    <Text style={styles.name}>Lorem Ipsum</Text>
                    <Text style={styles.desc}>{item.name}</Text>
                    <RNPickerSelect
                      onValueChange={(value) => handleSizeChange(item.id, value)}
                      items={[
                        { label: '33 L', value: '33 L' },
                        { label: '34 L', value: '34 L' },
                        { label: '35 L', value: '35 L' },
                      ]}
                      value={item.size}
                      style={pickerSelectStyles}
                    />
                  </View>
                  <View style={styles.controls}>
                    <TouchableOpacity onPress={() => handleQuantity(item.id, -1)} style={styles.btn}>
                      <Text style={styles.controlText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => handleQuantity(item.id, 1)} style={styles.btn}>
                      <Text style={styles.controlText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.side}>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                    <Text style={styles.price}>Php {'\n'}{item.price.toLocaleString()}</Text>
                  </View>
                </View>
              )}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.continue}>‹ Continue{"\n"}Shopping</Text>
              <View>
                <Text style={styles.total}>Subtotal: <Text style={styles.amount}>Php {subtotal.toLocaleString()}</Text></Text>
                <Text style={styles.total}>Shipping: <Text style={styles.free}>Free</Text></Text>
              </View>
            </View>
          </View>
          <View style={styles.checkoutBar}>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setModalVisible(true)}
            >
              <FontAwesome5 name="money-check-alt" size={16} color="#000" />
              <Text style={styles.paymentText}> Cash On Delivery</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Check Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Checkout Bar */}


        {/* Payment Modal */}
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

        {/* Order Completed Modal */}
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
                setOrderCompleteVisible(false); // close modal first
                navigation.navigate('OrderHistory'); // navigate to your Order History screen
              }}>
                <Text style={styles.orderLink}>View order history</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
    paddingTop: 36,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b4332',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginRight: 12,
  },
  details: {
    width: 100,
  },
  name: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: 13,
  },
  desc: {
    fontSize: 12,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  btn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  controlText: {
    fontSize: 18,
    color: '#000',
  },
  qty: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  side: {
    alignItems: 'flex-end',
    width: 70,
    marginLeft: -10,
  },
  delete: {
    color: 'red',
    fontSize: 13,
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    marginTop: -25,
    borderTopColor: '#ccc',
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 70,
  },
  continue: {
    color: '#333',
    fontSize: 12,
  },
  total: {
    fontSize: 14,
    color: '#333',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  free: {
    color: 'green',
    fontWeight: 'bold',
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
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E8ECF4', // Light grayish background
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
});

export default BagScreen;
