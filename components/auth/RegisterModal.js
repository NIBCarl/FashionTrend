import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '../../src/context/NotificationContext';

const ADMIN_NOTIFICATIONS_KEY = 'admin_notifications'; // Key for admin notifications

export default function RegisterModal({ navigation }) {
  const { isLoading: contextLoading, error, setError, clearError } = useAuth();
  const { addNotification } = useNotifications();
  const [isRegistering, setIsRegistering] = useState(false);

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    middlename: '',
    gender: '',
    age: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    if (error) clearError();
  };

  const handleRegister = async () => {
    const { firstname, lastname, phone, password, confirmPassword } = form;
    const email = phone;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsRegistering(true);
    clearError();

    try {
      const existingUser = await AsyncStorage.getItem(`user_${email}`);
      if (existingUser) {
        throw new Error('User with this email already exists.');
      }

      const passwordHash = password;

      const userData = {
        name: `${firstname} ${lastname}`,
        email: email,
        passwordHash: passwordHash,
        middlename: form.middlename,
        gender: form.gender,
        age: form.age,
        registeredAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(`user_${email}`, JSON.stringify(userData));
      console.log(`[RegisterModal] User ${email} registered locally.`);

      // --- Add Admin Notification for New User --- 
      try {
        addNotification({
            title: 'New Customer Registered!',
            message: `User ${userData.name} (${email}) just signed up.`,
            type: 'user',
            itemId: email, // Using email as the identifier for the user
        });
        console.log(`[RegisterModal] Admin notification for new user ${email} sent via context.`);
      } catch (notifError) {
          console.error("[RegisterModal] Error sending admin notification for new user via context:", notifError);
      }
      // --- End Admin Notification --- 

      Alert.alert('Success', 'Registration successful! Please sign in.');
      navigation.navigate('SignInModal');

    } catch (err) {
      console.error("Local Registration error:", err);
      setError(err.message || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const isLoading = contextLoading || isRegistering;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Here</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Firstname</Text>
          <TextInput
            style={styles.input}
            value={form.firstname}
            onChangeText={(val) => handleChange('firstname', val)}
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Lastname</Text>
          <TextInput
            style={styles.input}
            value={form.lastname}
            onChangeText={(val) => handleChange('lastname', val)}
            editable={!isLoading}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Middlename</Text>
          <TextInput
            style={styles.input}
            value={form.middlename}
            onChangeText={(val) => handleChange('middlename', val)}
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={form.gender}
            onChangeText={(val) => handleChange('gender', val)}
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={form.age}
            onChangeText={(val) => handleChange('age', val)}
            keyboardType="numeric"
            editable={!isLoading}
          />
        </View>
      </View>

      <View style={styles.inputWrapperFull}>
        <Text style={styles.label}>Email (Phone Number)</Text>
        <TextInput
          style={styles.fullInput}
          value={form.phone}
          onChangeText={(val) => handleChange('phone', val)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputWrapperFull}>
        <Text style={styles.label}>Create Password</Text>
        <TextInput
          style={styles.fullInput}
          secureTextEntry
          value={form.password}
          onChangeText={(val) => handleChange('password', val)}
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputWrapperFull}>
        <Text style={styles.label}>Retry Password</Text>
        <TextInput
          style={styles.fullInput}
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(val) => handleChange('confirmPassword', val)}
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
        <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.switchText}>
        Already have an account?{' '}
        <Text
          style={styles.linkText}
          onPress={() => !isLoading && navigation.navigate('SignInModal')}
        >
          Sign in
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#f9d5d3',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 25,
    },
    title: {
      fontSize: 34,
      fontFamily: 'IslandMoments',
      marginBottom: 20,
      color: '#000',
    },
    errorContainer: {
      width: '100%',
      padding: 10,
      backgroundColor: '#ffcccc',
      borderRadius: 5,
      marginBottom: 15,
      alignItems: 'center'
    },
    errorText: {
      color: '#cc0000',
      textAlign: 'center'
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 15,
      flexWrap: 'wrap',
    },
    inputWrapper: {
      flex: 1,
      marginHorizontal: 5,
      marginBottom: 10,
    },
    inputWrapperFull: {
      width: '100%',
      marginBottom: 15,
    },
    label: {
        fontFamily: 'Itim', fontSize: 18,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#f9d5d3',
    },
    fullInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#f9d5d3',
    },
    button: {
      marginTop: 20,
      backgroundColor: '#a24dfd',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 15,
      minWidth: 150,
      alignItems: 'center'
    },
    buttonDisabled: {
      backgroundColor: '#cccccc'
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    switchText: {
      marginTop: 20,
      fontSize: 14,
      color: '#000',
    },
    linkText: {
      fontWeight: 'bold',
      color: '#000',
    },
  });
  
  