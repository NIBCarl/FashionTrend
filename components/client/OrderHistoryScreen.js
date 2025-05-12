import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Navbar from '../../navigation/navBar';
import BottomNavBar from '../../navigation/BottomNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';

const orders = [
  {
    id: 'UID123456',
    date: '10-17-2024',
    location: 'Brgy. San Juan, Surigao City',
    image: require('../../assets/products/jacket.png'),
    status: 'In process',
    tracking: [
      { label: 'Depart', date: '10-10-2024', completed: true },
      { label: 'Shipped', date: '10-11-2024', completed: true },
      { label: 'Delivered', date: '10-17-2024', completed: false },
    ],
  },
  // Add other orders 
  {
    id: 'UID123456',
    date: '10-17-2024',
    location: 'Brgy. San Juan, Surigao City',
    image: require('../../assets/products/blouse.png'),
    status: 'In process',
    tracking: [
      { label: 'Depart', date: '10-10-2024', completed: true },
      { label: 'Shipped', date: '10-11-2024', completed: true },
      { label: 'Delivered', date: '10-17-2024', completed: false },
    ],
  },
  {
    id: 'UID123456',
    date: '10-17-2024',
    location: 'Brgy. San Juan, Surigao City',
    image: require('../../assets/products/sweater.png'),
    status: 'In process',
    tracking: [
      { label: 'Depart', date: '10-10-2024', completed: true },
      { label: 'Shipped', date: '10-11-2024', completed: true },
      { label: 'Delivered', date: '10-17-2024', completed: false },
    ],
  },
];

const OrderHistoryScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(Array(orders.length).fill(false));

  const toggleExpand = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
    <ScrollView style={styles.container2}>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.header}>Your Orders</Text>
        {orders.map((order, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.sideBar} />
            <Image source={order.image} style={styles.image} />
            <View style={styles.details}>
              <View style={styles.topRow}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={styles.status}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.date}>{order.date}</Text>
              <TouchableOpacity onPress={() => toggleExpand(index)}>
                <Text style={styles.link}>
                  {expanded[index] ? 'Hide details.' : 'More details.'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.location}>Order Location</Text>
              <Text style={styles.locationText}>{order.location}</Text>

              {expanded[index] && (
                <View style={styles.trackingContainer}>
                  {order.tracking.map((step, i) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={styles.timeline}>
                        <View
                          style={[
                            styles.dot,
                            { backgroundColor: step.completed ? '#000' : '#ccc' },
                          ]}
                        />
                        {i < order.tracking.length - 1 && (
                          <View style={styles.line} />
                        )}
                      </View>
                      <Text style={styles.stepText}>
                        {step.label}  {step.date}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    <View>
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
    color: '#2a9d8f',
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
});

export default OrderHistoryScreen;
