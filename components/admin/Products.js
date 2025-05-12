// components/admin Products.js
import React, { useState } from 'react'; // ✅ useState comes from React
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  
} from 'react-native';
import AdminNavbar from './AdminNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddProductModal from './AddProductModal';
const data = [
    { id: '1', name: 'Lorem Ipsum', price: '$599', image: require('../../assets/products/product1.png') },
    { id: '2', name: 'Lorem Ipsum', price: '$599', image: require('../../assets/products/product1.png') },
    { id: '3', name: 'Lorem Ipsum', price: '$599', image: require('../../assets/products/product1.png') },
    { id: '4', name: 'Lorem Ipsum', price: '$599', image: require('../../assets/products/product1.png') },
    { id: '5', name: 'Lorem Ipsum', price: '$599', image: require('../../assets/products/product1.png') },
    { id: '6', name: 'Lorem Ipsum', price: '$599', image: require('../../assets/products/product1.png') },
];

const Products = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <AdminNavbar />
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: '#FF7A00',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignSelf: 'flex-end',
                        margin: 16,
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add new products</Text>
                </TouchableOpacity>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
                      <AddProductModal visible={modalVisible} onClose={() => setModalVisible(false)} />

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        flex: 1,
    },
    addButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#FF7A00',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 6,
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    card: {
        width: Dimensions.get('window').width / 2 - 20,
        alignItems: 'center',
    },
    image: {
        width: 163,
        height: 175,
        borderRadius: 8,
        marginBottom: 5,
    },
    name: {
        fontSize: 14,
        color: '#333',
    },
    price: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000',
    },
});

export default Products;
