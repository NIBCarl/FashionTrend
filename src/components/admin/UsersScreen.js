import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder for fetching users logic
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('[AdminUsersScreen] Loading users...');
    // TODO: Implement logic to scan AsyncStorage for user_* keys
    // and parse user data (name, email).
    try {
      // Example: Fetch all keys
      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter(key => key.startsWith('user_')); 
      
      const usersData = [];
      for (const key of userKeys) {
        const userDataString = await AsyncStorage.getItem(key);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          // Assuming user data has at least email and name, adjust as per your structure
          usersData.push({ 
            id: key, // Or a unique ID from userData if available
            email: userData.email, 
            name: userData.name || 'N/A' 
          });
        }
      }
      setUsers(usersData);
      console.log(`[AdminUsersScreen] Loaded ${usersData.length} users.`);
    } catch (err) {
      console.error('[AdminUsersScreen] Failed to load users:', err);
      setError('Failed to load user data.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
      return () => {}; // Optional cleanup
    }, [loadUsers])
  );

  const handleDeleteUser = async (userId, userName) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the user "${userName || 'this user'}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              console.log(`[AdminUsersScreen] Attempting to delete user ID: ${userId}`);
              await AsyncStorage.removeItem(userId); // userId is the key like 'user_email@example.com'
              
              // Update the local state to reflect the deletion
              setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
              Alert.alert("Success", `User "${userName || ''}" deleted successfully.`);
              console.log(`[AdminUsersScreen] User ${userId} deleted successfully.`);
            } catch (err) {
              console.error('[AdminUsersScreen] Failed to delete user:', err);
              Alert.alert("Error", "Failed to delete user. Please try again.");
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItemContainer}>
      <Icon name="person-circle-outline" size={40} color="#8A2BE2" style={styles.userIcon} />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('UserEdit', { userId: item.email })}
      >
        <Icon name="create-outline" size={22} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => handleDeleteUser(item.id, item.name)}
      >
        <Icon name="trash-outline" size={22} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContent}>
      <Icon name="people-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No users found.</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Loading Users...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadUsers} style={styles.retryButton}>
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
        <Text style={styles.headerTitle}>Registered Customers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserCreate')} style={styles.addUserButton}>
          <Icon name="add-circle-outline" size={30} color="#8A2BE2" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
      />
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  addUserButton: {
    paddingLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  userItemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  userIcon: {
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default UsersScreen; 