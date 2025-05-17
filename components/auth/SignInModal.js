import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInModal({ navigation }) {
    const { login, isLoading: contextLoading, error, setError, clearError } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        setIsLoggingIn(true);
        clearError();

        try {
            const normalizedEmail = email.toLowerCase();
            const storedUserDataString = await AsyncStorage.getItem(`user_${normalizedEmail}`);
            if (!storedUserDataString) {
                throw new Error('User not found. Please register.');
            }

            const storedUserData = JSON.parse(storedUserDataString);
            const isPasswordMatch = (password === storedUserData.passwordHash);

            if (isPasswordMatch) {
                await login(email);
                console.log(`User ${email} logged in locally.`);
        } else {
                throw new Error('Invalid email or password.');
            }
        } catch (err) {
            console.error("Local Login error:", err);
            setError(err.message || 'Login failed');
            await login(null);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const onEmailChange = (text) => {
        setEmail(text);
        if (error) clearError();
    };

    const onPasswordChange = (text) => {
        setPassword(text);
        if (error) clearError();
    };

    const isLoading = contextLoading || isLoggingIn;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onEmailChange}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    onChangeText={onPasswordChange}
                    value={password}
                    editable={!isLoading}
                />
            </View>
            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                <Text style={styles.buttonText}>Log In</Text>
                )}
            </TouchableOpacity>
            <Text style={styles.switchText}>
                Do you have an account?{' '}
                <Text
                    style={styles.linkText}
                    onPress={() => !isLoading && navigation.navigate('RegisterModal')}
                >
                    Register
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9d5d3', padding: 20 },
    title: { fontSize: 32, fontFamily: 'IslandMoments', marginBottom: 20 },
    errorContainer: {
        width: '80%',
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
    inputWrapper: { width: '80%', marginBottom: 15 },
    label: { fontFamily: 'Itim', fontSize: 18, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#000', padding: 10, borderRadius: 10, backgroundColor: '#fff' },
    button: {
        marginTop: 20,
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 30, 
        backgroundColor: '#9a55ff',
        borderRadius: 10,
        minWidth: 150,
        alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: '#cccccc'
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    switchText: {
        marginTop: 10,
        fontSize: 14,
        color: '#000',
    },
    linkText: {
        fontWeight: 'bold',
        color: '#000',
      },
});
