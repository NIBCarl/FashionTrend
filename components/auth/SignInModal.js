import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Home from '../client/Home';
import RegisterModal from './RegisterModal';
export default function SignInModal({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username && password) {
            navigation.replace("DrawerScreens")
            // Replace current screen with Home
        } else {
            alert('Please enter credentials');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Username</Text>
                <TextInput style={styles.input} onChangeText={setUsername} value={username} />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} secureTextEntry onChangeText={setPassword} value={password} />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <Text style={styles.switchText}>
                Do you have an account?{' '}
                <Text
                    style={styles.linkText}
                    onPress={() => navigation.navigate('RegisterModal')}
                >
                    Register
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9d5d3' },
    title: { fontSize: 32, fontFamily: 'IslandMoments', marginBottom: 20 },
    inputWrapper: { width: '80%', marginBottom: 15 },
    label: { fontFamily: 'Itim', fontSize: 18 },
    input: { borderWidth: 1, borderColor: '#000', padding: 10, borderRadius: 10 },
    button: { marginTop: 20, marginBottom: 20, padding: 10, backgroundColor: '#9a55ff', borderRadius: 10,
        paddingHorizontal: 30, 

    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    linkText: {
        fontWeight: 'bold',
        color: '#000',
      },
});
