import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TextInput,
    ImageBackground,
    ActivityIndicator,
    FlatList,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from "expo-font";
import { IslandMoments_400Regular } from "@expo-google-fonts/island-moments";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { BodoniModa_400Regular } from '@expo-google-fonts/bodoni-moda';
import { TenorSans_400Regular } from "@expo-google-fonts/tenor-sans";
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from "../../navigation/navBar";
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../navigation/BottomNavBar';



// ... [imports remain the same]

const Home = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>CONTACT US!</Text>
                <Text style={styles.subtitle}>
                    Need to get in touch with us? Either fill out the form with your inquiry or message us on
                </Text>
                <Text style={styles.email}>fashiontrend@email.com</Text>

                <Image
                    source={require('../../assets/products/contact_image.png')}
                    style={styles.image}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.formContainer}
                >
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Firstname"
                            value={firstName}
                            onChangeText={setFirstName}
                            style={styles.inputHalf}
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            placeholder="Lastname"
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.inputHalf}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TextInput
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        placeholder="What we can help you with?"
                        value={message}
                        onChangeText={setMessage}
                        style={styles.textArea}
                        multiline
                        numberOfLines={5}
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={() => Alert.alert("Submitted!", "Thank you for reaching out.")}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>

            {/* FOLLOW US section remains unchanged */}
            
            {/* BottomNavBar remains unchanged */}
            <BottomNavBar navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        color: 'red',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#444',
        marginBottom: 6,
    },
    email: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 20,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#f6f6f6',
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    inputHalf: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        width: '48%',
        fontSize: 14,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        fontSize: 14,
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingTop: 14,
        textAlignVertical: 'top',
        marginBottom: 16,
        minHeight: 100,
        fontSize: 14,
    },
    submitBtn: {
        backgroundColor: '#ff6a00',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // ... rest of your followSection3 & footer styles are unchanged
});

export default Home;
