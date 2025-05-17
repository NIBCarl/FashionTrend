import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { fetchProductById } from '../../src/services/api'; // Corrected path
import { useBag } from '../../src/context/BagContext'; // Corrected path
import Icon from 'react-native-vector-icons/Ionicons';

const ProductDetailScreen = ({ route, navigation }) => {
    const { productId } = route.params;
    const { addItem } = useBag();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchProductById(productId);
                if (response.success) {
                    setProduct(response.data);
                } else {
                    setError(response.message || 'Failed to load product details.');
                }
            } catch (err) {
                setError(err.message || 'An unexpected error occurred.');
            }
            setLoading(false);
        };

        if (productId) {
            loadProduct();
        } else {
            setError('Product ID not provided.');
            setLoading(false);
        }
    }, [productId]);

    const handleAddToBag = () => {
        if (product) {
            addItem(product, 1); // Add one item
            Alert.alert('Success', `${product.name} added to bag!`);
            // Optionally navigate to bag screen or stay on page
            // navigation.navigate('BagScreen'); 
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#8A2BE2" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error || 'Product not found.'}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={product.image} style={styles.productImage} resizeMode="cover" />
            
            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                
                <Text style={styles.descriptionHeader}>Description</Text>
                <Text style={styles.productDescription}>{product.description}</Text>

                <View style={styles.infoRow}>
                     <Icon name="star" size={16} color="#FFD700" style={styles.icon} />
                     <Text style={styles.infoText}>Rating: {product.rating} ({product.reviews} reviews)</Text>
                </View>
                 <View style={styles.infoRow}>
                     <Icon name="pricetag-outline" size={16} color="#555" style={styles.icon} />
                     <Text style={styles.infoText}>Category: {product.category}</Text>
                </View>

                 {/* Add to Bag Button */}
                <TouchableOpacity style={styles.addToBagButton} onPress={handleAddToBag}>
                    <Icon name="cart-outline" size={22} color="#fff" />
                    <Text style={styles.addToBagButtonText}>Add to Bag</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    backButtonText: {
        color: '#333',
        fontSize: 16,
    },
    productImage: {
        width: '100%',
        height: 350, // Adjust height as needed
    },
    detailsContainer: {
        padding: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'TenorSans' // Example Font
    },
    productPrice: {
        fontSize: 20,
        color: '#8A2BE2', // Accent color
        marginBottom: 20,
        fontWeight: 'bold',
    },
    descriptionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'TenorSans' // Example Font
    },
    productDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        marginRight: 8,
    },
     infoText: {
        fontSize: 15,
        color: '#333',
    },
    addToBagButton: {
        flexDirection: 'row',
        backgroundColor: '#f97316', // Example orange color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addToBagButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        fontFamily: 'TenorSans' // Example Font
    },
});

export default ProductDetailScreen; 