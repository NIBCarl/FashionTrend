import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts } from "expo-font";
import { IslandMoments_400Regular } from "@expo-google-fonts/island-moments";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { BodoniModa_400Regular } from '@expo-google-fonts/bodoni-moda';
import { TenorSans_400Regular } from "@expo-google-fonts/tenor-sans";
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from "../../navigation/navBar";
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../navigation/BottomNavBar';

const Contact = () => {
    const navigation = useNavigation();

    const handleLinkPress = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.warn(`Failed to open URL: ${url}`);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>CONTACT US</Text>
                <Image
                    source={require('../../assets/products/contact_image.png')}
                    style={styles.image}
                />
                <Text style={styles.subtitle}>
                    Get in touch with us through any of the channels below. We're happy to help!
                </Text>

                <View style={styles.infoSection}>
                    <TouchableOpacity style={styles.infoItem} onPress={() => handleLinkPress('mailto:support@fashiontrend.com')}>
                        <Icon name="mail-outline" size={24} color="#ff6a00" style={styles.infoIcon} />
                        <Text style={styles.infoText}>support@fashiontrend.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoItem} onPress={() => handleLinkPress('tel:+1234567890')}>
                        <Icon name="call-outline" size={24} color="#ff6a00" style={styles.infoIcon} />
                        <Text style={styles.infoText}>+1 (234) 567-890</Text>
                    </TouchableOpacity>

                    <View style={styles.infoItem}>
                        <Icon name="location-outline" size={24} color="#ff6a00" style={styles.infoIcon} />
                        <Text style={styles.infoText}>123 Fashion Ave, New York, NY 10001</Text>
                    </View>
                    </View>

                <Text style={styles.socialHeader}>Follow Us</Text>
                <View style={styles.socialIconsContainer}>
                    <TouchableOpacity onPress={() => handleLinkPress('https://twitter.com/fashiontrend')}>
                        <Icon name="logo-twitter" size={30} color="#1DA1F2" style={styles.socialIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLinkPress('https://instagram.com/fashiontrend')}>
                        <Icon name="logo-instagram" size={30} color="#C13584" style={styles.socialIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLinkPress('https://facebook.com/fashiontrend')}>
                        <Icon name="logo-facebook" size={30} color="#4267B2" style={styles.socialIcon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        paddingBottom: 80,
    },
    title: {
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        fontFamily: 'TenorSans',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    image: {
        width: '90%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
        marginBottom: 25,
    },
    infoSection: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 20,
        marginBottom: 30,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    infoIcon: {
        marginRight: 15,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        flexShrink: 1,
    },
    socialHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        fontFamily: 'TenorSans',
    },
    socialIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
    socialIcon: {
    },
});

export default Contact;
