// AdminNavbar.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation,  useRoute  } from '@react-navigation/native';

const AdminNavbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {/* Left: Menu and Dashboard */}
      <View style={styles.leftSection}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={26} color="#1f3e32" />
        </TouchableOpacity>

        <Text style={styles.title}>{route.name}</Text>
      </View>

      {/* Center: Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color="#1f3e32" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#1f3e32"
          style={styles.searchInput}
        />
      </View>

      {/* Right: Icons and Admin */}
      <View style={styles.rightSection}>
        <TouchableOpacity>
          <FontAwesome name="bell" size={20} color="#FF7A00" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="person" size={22} color="#FF7A00" style={styles.icon} />
        </TouchableOpacity>
        </View>
    </View>
  );
};

export default AdminNavbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f3e32',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1f3e32',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f9f9f9',
    flex: 1,
    marginHorizontal: 15,
    maxWidth: 280,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 35,
    fontSize: 14,
    color: '#1f3e32',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 5,
  },
  adminText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
    color: '#1f3e32',
  },
});
