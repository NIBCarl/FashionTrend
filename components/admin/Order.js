// components/admin/Order.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminNavbar from './AdminNavbar';

const OrderCard = ({ id, date, status }) => {
  const isCompleted = (status || '').toLowerCase() === 'completed';

  return (
    <View style={styles.card}>
      <View style={styles.sideBar} />

      <View style={styles.content}>
        {/* Status Box */}
        <View style={styles.statusBoxContainer}>
          <View style={[styles.statusBox, isCompleted && styles.filledBox]} />
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            Order: <Text style={styles.orderId}>UID{id}</Text>
          </Text>
          <Text style={styles.label}>Date: <Text style={styles.date}>{date}</Text></Text>
          <Text style={styles.label}>Status: <Text style={styles.status}>{status}</Text></Text>
        </View>

        {/* Details */}
        <TouchableOpacity onPress={() => console.log(`Viewing details for ${id}`)}>
          <Text style={styles.detailsText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Order = () => {
    
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AdminNavbar />
      <ScrollView style={styles.container}>
        <OrderCard id="123456" date="2024/10/05" status="Delivering" />
        <OrderCard id="123456" date="2024/10/05" status="Completed" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: 8,
    marginHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  sideBar: {
    width: 3,
    backgroundColor: '#00c800',
    borderRadius: 3,
    marginRight: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusBoxContainer: {
    marginRight: 10,
  },
  statusBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#00c800',
  },
  filledBox: {
    backgroundColor: '#00c800',
    borderWidth: 0,
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  orderId: {
    color: '#00c800',
    fontWeight: 'bold',
  },
  date: {
    color: '#444',
  },
  status: {
    color: '#999',
  },
  detailsText: {
    color: '#00c800',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default Order;
