import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const UserEditScreen = ({ route, navigation }) => {
  const { userId } = route.params;

  const [name, setName] = useState('');
  const [email, setEmail] = useState(userId || '');
  const [originalUser, setOriginalUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        setError("User ID (email) not provided.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const userStorageKey = `user_${userId}`;
        const userDataString = await AsyncStorage.getItem(userStorageKey);
        if (userDataString) {
          const fetchedUser = JSON.parse(userDataString);
          setOriginalUser(fetchedUser);
          setName(fetchedUser.name || '');
          setEmail(fetchedUser.email || userId);
          navigation.setOptions({ title: `Edit ${fetchedUser.name || 'User'}` });
          setError(null);
        } else {
          setError(`User with email ${userId} not found.`);
        }
      } catch (err) {
        console.error("[AdminUserEditScreen] Failed to load user details:", err);
        setError("Failed to load user details. " + err.message);
      }
      setIsLoading(false);
    };

    fetchUserDetails();
  }, [userId, navigation]);

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    if (!originalUser) {
        Alert.alert('Error', 'Original user data not loaded. Cannot save.');
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userStorageKey = `user_${originalUser.email}`;
      
      const updatedUserData = {
        ...originalUser,
        name: name.trim(),
      };

      await AsyncStorage.setItem(userStorageKey, JSON.stringify(updatedUserData));
      
      Alert.alert('Success', 'User details updated successfully.');
      setIsLoading(false);
      navigation.goBack();

    } catch (err) {
      console.error('[AdminUserEditScreen] Failed to save user details:', err);
      Alert.alert('Error', 'Failed to save user details. Please try again.');
      setError('Failed to save user details.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={{ marginTop: 10 }}>Loading user details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  if (!originalUser && !isLoading) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>User data could not be loaded.</Text>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter user's full name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Read-only)</Text>
          <TextInput
            style={[styles.input, styles.readOnlyInput]}
            value={email}
            editable={false}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveChanges} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 20,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  readOnlyInput: {
    backgroundColor: '#EFEFEF',
    color: '#777',
  },
  saveButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#BCA0DC',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserEditScreen; 