import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
// Potentially use UserContext if you have one for global user state management,
// though for admin creation, direct AsyncStorage might be simpler initially.
// import { UserContext } from '../../context/UserContext'; 

const UserCreateScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // const { addUser } = useContext(UserContext); // If using context

  const handleCreateUser = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Basic email validation (can be more robust)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const userKey = `user_${email.toLowerCase()}`;
      const existingUser = await AsyncStorage.getItem(userKey);

      if (existingUser) {
        setError('A user with this email already exists.');
        setIsLoading(false);
        return;
      }

      // In a real app, hash the password before storing
      // For this mock-up, we'll store it as is, as per project's existing pattern.
      const newUser = {
        id: userKey, // Using the key as ID for consistency with UsersScreen
        name,
        email: email.toLowerCase(),
        passwordHash: password, // Storing plain password under passwordHash field
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(userKey, JSON.stringify(newUser));
      console.log('[UserCreateScreen] New user created:', newUser);
      
      // If using a global UserContext, you might call addUser here
      // addUser(newUser); 

      Alert.alert('Success', 'User created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

    } catch (err) {
      console.error('[UserCreateScreen] Error creating user:', err);
      setError('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New User</Text>
          <View style={{width: 28}} />{/* Spacer */}
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreateUser} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create User</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 30, // For scrollable content
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 15,
  },
  backButton: {
    padding: 5, // Easier to tap
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 15,
  },
});

export default UserCreateScreen; 