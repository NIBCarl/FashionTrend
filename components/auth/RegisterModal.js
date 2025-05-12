import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function RegisterModal({ navigation }) {
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
  };

  const handleRegister = () => {
    const { firstname, lastname, phone, password, confirmPassword } = form;

    if (!firstname || !lastname || !phone || !password || !confirmPassword) {
      alert('Please fill all required fields');
    } else if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      navigation.replace('DrawerScreens');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Here</Text>

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Firstname</Text>
          <TextInput
            style={styles.input}
            value={form.firstname}
            onChangeText={(val) => handleChange('firstname', val)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Lastname</Text>
          <TextInput
            style={styles.input}
            value={form.lastname}
            onChangeText={(val) => handleChange('lastname', val)}
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
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={form.gender}
            onChangeText={(val) => handleChange('gender', val)}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={form.age}
            onChangeText={(val) => handleChange('age', val)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputWrapperFull}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.fullInput}
          value={form.phone}
          onChangeText={(val) => handleChange('phone', val)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputWrapperFull}>
        <Text style={styles.label}>Create Password</Text>
        <TextInput
          style={styles.fullInput}
          secureTextEntry
          value={form.password}
          onChangeText={(val) => handleChange('password', val)}
        />
      </View>

      <View style={styles.inputWrapperFull}>
        <Text style={styles.label}>Retry Password</Text>
        <TextInput
          style={styles.fullInput}
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(val) => handleChange('confirmPassword', val)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.switchText}>
        Already have an account?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('SignInModal')}>
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
      marginBottom: 30,
      color: '#000',
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
  
  