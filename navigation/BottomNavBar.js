import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import ProfileScreen from '../components/client/ProfileScreen';
const BottomNavBar = ({ navigation }) => {
    const route = useRoute();
    const currentRoute = route.name;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Home')}
            >
                <Icon name="home" size={24} color={currentRoute === 'Home' ? 'black' : '#888'} />
                <Text style={[styles.label, currentRoute === 'Home' && styles.activeLabel]}>
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('BagScreen')}
            >
                <Icon name="bag-handle" size={24} color={currentRoute === 'BagScreen' ? 'black' : '#888'} />
                <Text style={[styles.label, currentRoute === 'BagScreen' && styles.activeLabel]}>
                    Bag
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('ProfileScreen')}
            >
                <Icon name="person-outline" size={24} color={currentRoute === 'OrderHistory' ? 'black' : '#888'} />
                <Text style={[styles.label, currentRoute === 'OrderHistory' && styles.activeLabel]}>
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    item: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: '#888',
    },
    activeLabel: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default BottomNavBar;
