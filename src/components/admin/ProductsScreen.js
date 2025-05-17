import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ADMIN_PRODUCTS_KEY = 'admin_products'; // Use the same key as in Dashboard

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    console.log('[AdminProducts] Loading products...');
    setLoading(true);
    setError(null);
    try {
      const storedProducts = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        console.log(`[AdminProducts] Loaded ${parsedProducts.length} products.`);
      } else {
        setProducts([]);
        console.log('[AdminProducts] No products found in storage.');
        // setError('No products found. Add products first.'); // Or handle empty state differently
      }
    } catch (err) {
      console.error('[AdminProducts] Failed to load products:', err);
      setError('Failed to load products data.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts(); // Call the existing async function

      // Optional cleanup function
      return () => {
        // console.log('[AdminProducts] Screen is unfocused, potential cleanup here.');
      };
    }, [loadProducts]) // Ensure loadProducts is a dependency if it can change
  );

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            console.log(`[AdminProducts] Deleting product ID: ${productId}`);
            // ** Add Delete Logic Here (Phase 4 Step 6) **
            // 1. Filter out the product
            const updatedProducts = products.filter(p => p.id !== productId);
            // 2. Save back to AsyncStorage
            try {
              await AsyncStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(updatedProducts));
              setProducts(updatedProducts); // Update local state
              Alert.alert("Deleted", "Product successfully deleted.");
            } catch (error) {
                console.error("[AdminProducts] Failed to delete product:", error);
                Alert.alert("Error", "Could not delete product.");
            }
          }
        }
      ]
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItemContainer}>
      {item.image && typeof item.image === 'string' ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Icon name="image-outline" size={24} color="#ccc" />
        </View>
      )}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price?.toFixed(2)}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => {
            console.log('[AdminProducts] Edit product ID:', item.id);
            // ** Add Navigation to Edit Screen Here (Phase 4 Step 5) **
            navigation.navigate('ProductEdit', { product: item });
            // Alert.alert("Edit", "Edit functionality not yet implemented.");
          }}
        >
          <Icon name="create-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Icon name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContent}>
      <Icon name="cube-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No products found.</Text>
      <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            console.log('[AdminProducts] Add New Product');
            // ** Add Navigation to Add Screen Here (Phase 4 Step 5) **
            navigation.navigate('ProductEdit');
            // Alert.alert("Add New", "Add functionality not yet implemented.");
          }}
        >
          <Text style={styles.addButtonText}>Add New Product</Text>
       </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Loading Products...</Text>
      </SafeAreaView>
    );
  }

  if (error && products.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.errorText}>{error}</Text>
         <TouchableOpacity onPress={loadProducts} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Add Header Here Later if needed, e.g., with title and Add button */}
      <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.openDrawer()}>
               <Icon name="menu-outline" size={30} color="#333" />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Manage Products</Text>
           <TouchableOpacity 
             style={styles.addButtonHeader} 
             onPress={() => {
                console.log('[AdminProducts] Add New Product from header');
                // ** Add Navigation Here (Phase 4 Step 5) **
                navigation.navigate('ProductEdit');
                // Alert.alert("Add New", "Add functionality not yet implemented.");
             }}
           >
             <Icon name="add-circle-outline" size={30} color="#007AFF" />
           </TouchableOpacity>
       </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()} // Ensure ID is string
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
      />
      {/* Show non-critical errors */}
      {error && products.length > 0 && (
         <Text style={styles.partialErrorText}>{error}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
   addButtonHeader: {
      padding: 5, // Make tappable area larger
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    flex: 1, // Use flex 1 to center vertically
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  errorText: {
      marginTop: 10,
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
  },
  retryButton: {
      marginTop: 20,
      backgroundColor: '#8A2BE2',
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 5,
  },
  retryButtonText: {
      color: '#fff',
      fontSize: 16,
  },
  partialErrorText: {
      textAlign: 'center',
      color: 'orange',
      padding: 10,
      backgroundColor: '#fff8e1'
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexGrow: 1, // Important for ListEmptyComponent
  },
  productItemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1, // Take available space
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#8A2BE2',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: { // For empty state
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  addButtonText: { // For empty state
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductsScreen; 