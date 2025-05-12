import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminNavbar from './AdminNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const stats = [
  { icon: 'account-group', label: 'Total Customers', value: '5,8962' },
  { icon: 'account', label: 'Members', value: '3,012' },
  { icon: 'monitor', label: 'Active now', value: '1,012' },
];

const customers = [
  {
    id: 1,
    name: 'Juan Luna',
    number: '(+63) 9123 124 852',
    email: 'jluna@email.com',
    location: 'Surigao City',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Dan Rizal',
    number: '(+63) 9741 124 456',
    email: 'drizal@email.com',
    location: 'Davao City',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Carla Will',
    number: '(+63) 9369 124 987',
    email: 'cwill@email.com',
    location: 'Cebu City',
    status: 'Inactive',
  },
  // Add more customers as needed
];

const Customers = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const renderCustomer = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      
      <View style={styles.customerItem}>
        <View style={styles.customerHeader}>
          <View>
            <Text style={styles.customerName}>{item.name}</Text>
            <Text style={styles.customerNumber}>{item.number}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={styles.seeMore}>
              {isExpanded ? 'See less' : 'See more'}
            </Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.detailBox}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Customer Name:</Text>
              <Text style={styles.value}>{item.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{item.number}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{item.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{item.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Status:</Text>
              <View style={styles.statusContainer}>
                <Text
                  style={[
                    styles.status,
                    { backgroundColor: item.status === 'Active' ? 'green' : 'gray' },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
                  <AdminNavbar />
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statItem}>
            <Icon name={item.icon} size={24} color="#333" />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.allCustomersTitle}>All Customers</Text>

      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCustomer}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
  },
  allCustomersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  customerItem: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0.8,
    borderBottomColor: '#ccc',
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '500',
  },
  customerNumber: {
    color: '#444',
  },
  seeMore: {
    color: 'green',
    fontWeight: 'bold',
  },
  detailBox: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#888',
    fontWeight: '500',
  },
  value: {
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});

export default Customers;
