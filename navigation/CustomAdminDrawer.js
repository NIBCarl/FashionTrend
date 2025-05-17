// navigation/CustomAdminDrawer.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import LogoutModal from '../components/admin/LogoutModal';
import { useAuth } from '../src/context/AuthContext';

const CustomAdminDrawer = ({ navigation }) => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { adminLogout } = useAuth();

  const handleConfirmLogout = async () => {
    await adminLogout();
    setLogoutVisible(false);
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>
        <Text style={styles.star}>★</Text>
        <Text> FASHION{"\n"}TREND </Text>
        <Text style={styles.blueStar}>★</Text>
      </Text>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Dashboard')}>
        <Feather name="menu" size={22} color="#000" />
        <Text style={styles.label}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Orders')}>
        <MaterialIcons name="receipt-long" size={22} color="#000" />
        <Text style={styles.label}>Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Products')}>
        <FontAwesome5 name="box-open" size={22} color="#000" />
        <Text style={styles.label}>Products</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Customers')}>
        <FontAwesome5 name="users" size={22} color="#000" />
        <Text style={styles.label}>Customers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => setLogoutVisible(true)}>
        <MaterialIcons name="logout" size={22} color="#000" />
        <Text style={styles.label}>Logout</Text>
      </TouchableOpacity>

      {/* Logout Modal */}
      <LogoutModal
        visible={logoutVisible}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutVisible(false)}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'center',
  },
  star: { color: 'orangered', fontSize: 28 },
  blueStar: { color: 'blue', fontSize: 28 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 18,
    marginLeft: 15,
  },
});

export default CustomAdminDrawer;
