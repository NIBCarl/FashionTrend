import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
    ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchProducts } from '../../src/services/api';
import { TenorSans_400Regular } from "@expo-google-fonts/tenor-sans";
import { useFonts } from 'expo-font';

const SearchScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fontsLoaded] = useFonts({
        TenorSans: TenorSans_400Regular,
    });

    // Fetch all products once
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const products = await fetchProducts(); // Fetching mock products
                setAllProducts(products);
                setFilteredProducts(products); // Initially show all
            } catch (error) {
                console.error("Error fetching products:", error);
                // Handle error appropriately
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    // Filter products whenever searchQuery changes
    useEffect(() => {
        // Only filter if allProducts is actually an array
        if (Array.isArray(allProducts)) {
            if (searchQuery === '') {
                setFilteredProducts(allProducts);
            } else {
                const lowerCaseQuery = searchQuery.toLowerCase();
                const filtered = allProducts.filter(product =>
                    product.name.toLowerCase().includes(lowerCaseQuery) ||
                    (product.description && product.description.toLowerCase().includes(lowerCaseQuery))
                );
                setFilteredProducts(filtered);
            }
        } else {
            // If allProducts isn't an array (e.g., still loading or error), set filtered to empty
            setFilteredProducts([]);
        }
    }, [searchQuery, allProducts]);

    const handleProductPress = (productId) => {
        navigation.navigate('ProductDetail', { productId });
    };

    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item.id)}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    if (!fontsLoaded || loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6a00" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Search Products</Text>
                <View style={{width: 24}} />
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for items..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />
            </View>

            {filteredProducts.length === 0 && searchQuery !== '' ? (
                <View style={styles.noResultsContainer}>
                    <Icon name="sad-outline" size={50} color="#ccc" />
                    <Text style={styles.noResultsText}>No products found matching "{searchQuery}".</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2} // Display in two columns like Home screen
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
      padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'TenorSans',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        margin: 15,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    productItem: {
        flex: 1,
        margin: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center',
        maxWidth: '48%',
    },
    productImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 10,
        alignItems: 'center',
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        fontFamily: 'TenorSans',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: '#ff6a00',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    noResultsText: {
        marginTop: 15,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});

export default SearchScreen; 