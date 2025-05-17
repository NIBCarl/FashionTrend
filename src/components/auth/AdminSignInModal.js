import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert, // Use Alert for displaying errors initially
} from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import Icon from 'react-native-vector-icons/Ionicons'; // Example icon usage

const AdminSignInModal = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth(); // Assuming adminLogin will be added to AuthContext

  const handleAdminLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      // Call the actual adminLogin function from context
      const success = await adminLogin(email, password);
      if (!success) {
        // Error is set within AuthContext, but we show a generic alert here
        Alert.alert('Login Failed', 'Invalid admin credentials. Please try again.');
      }
      // If login is successful, the navigation logic in App.js (RootNavigator)
      // will automatically handle showing the AdminDrawer based on the updated isAdminLoggedIn state.

    } catch (error) {
      // Catch unexpected errors during the login process itself
      console.error('[AdminSignIn] Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close-circle-outline" size={30} color="#555" />
        </TouchableOpacity>

        <Text style={styles.title}>Admin Access</Text>
        <Text style={styles.subtitle}>Sign in to manage the platform</Text>

        <TextInput
          style={styles.input}
          placeholder="Admin Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#8A2BE2" style={styles.button} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        )}

        {/* Optional: Add forgot password link if needed later */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30, // Increased padding
    borderRadius: 15, // More rounded corners
    width: '90%', // Wider modal
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 26, // Larger title
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30, // More space below subtitle
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50, // Taller input fields
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15, // Spacing between inputs
    fontSize: 16,
    backgroundColor: '#f9f9f9' // Slight background tint
  },
  button: {
    backgroundColor: '#8A2BE2', // Admin theme color (can adjust)
    paddingVertical: 15, // Taller button
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10, // Space above button
    height: 50, // Ensure button has same height for loading indicator consistency
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Add other styles as needed (e.g., error messages)
});

export default AdminSignInModal; 