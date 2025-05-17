import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = (props) => {
  const { logout, isLoading: authLoading, loggedInUserEmail } = useAuth();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!loggedInUserEmail) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const userDataString = await AsyncStorage.getItem(`user_${loggedInUserEmail}`);
        if (userDataString) {
          const storedData = JSON.parse(userDataString);
          setUserData({
            name: storedData.name || 'User Name',
            email: loggedInUserEmail,
          });
        } else {
          setUserData({ name: 'User Name', email: loggedInUserEmail });
        }
      } catch (error) {
        console.error("Failed to fetch user data for drawer:", error);
        setUserData({ name: 'Error Loading', email: loggedInUserEmail });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [loggedInUserEmail]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const isOverallLoading = authLoading || isLoading;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/ando.jpg')}
          style={styles.avatar}
        />
        {isLoading ? (
          <Text style={styles.name}>Loading...</Text>
        ) : (
          <>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </>
        )}
      </View>

      <DrawerItemList {...props} />

      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.item}
          onPress={handleLogout}
          disabled={isOverallLoading}
        >
          <Icon name="log-out-outline" size={22} color={isOverallLoading ? '#ccc' : '#000'} />
          <Text style={[styles.itemText, isOverallLoading && { color: '#ccc' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    fontSize: 12,
    color: '#888',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  itemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 20,
    paddingTop: 10,
  },
});

export default CustomDrawer;
