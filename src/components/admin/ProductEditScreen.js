import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNotifications } from '../../context/NotificationContext';
import { getLowStockThreshold } from '../../../src/services/api';

const ADMIN_PRODUCTS_KEY = 'admin_products';

const ProductEditScreen = ({ route, navigation }) => {
  const [product, setProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    image: '', // Store image URL as string
    category: '', // Added category
    quantity: '0', // Added quantity, ensure it's string for TextInput
    tags: '', // Added tags as comma-separated string for form input
  });
  const [loading, setLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const loadProductData = async () => {
      setIsScreenLoading(true);
      const { product: productParam, productId: productIdParam } = route.params || {};

      if (productParam) {
        console.log('[ProductEdit] Editing product from param:', productParam);
        setProduct({
          id: productParam.id,
          name: productParam.name || '',
          description: productParam.description || '',
          price: productParam.price ? productParam.price.toString() : '',
          image: productParam.image || '',
          category: productParam.category || '',
          quantity: productParam.quantity ? productParam.quantity.toString() : '0',
          tags: Array.isArray(productParam.tags) ? productParam.tags.join(', ') : '',
        });
        setIsEditMode(true);
        navigation.setOptions({ title: 'Edit Product' });
      } else if (productIdParam) {
        console.log('[ProductEdit] Editing product by ID from param:', productIdParam);
        try {
          const existingProductsRaw = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
          const productsArray = existingProductsRaw ? JSON.parse(existingProductsRaw) : [];
          const foundProduct = productsArray.find(p => p.id.toString() === productIdParam.toString());
          if (foundProduct) {
      setProduct({
              id: foundProduct.id,
              name: foundProduct.name || '',
              description: foundProduct.description || '',
              price: foundProduct.price ? foundProduct.price.toString() : '',
              image: foundProduct.image || '',
              category: foundProduct.category || '',
              quantity: foundProduct.quantity ? foundProduct.quantity.toString() : '0',
              tags: Array.isArray(foundProduct.tags) ? foundProduct.tags.join(', ') : '',
      });
      setIsEditMode(true);
      navigation.setOptions({ title: 'Edit Product' });
          } else {
            Alert.alert('Error', 'Product not found. Cannot edit.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            setIsEditMode(false); // Should not happen if ID is valid
          }
        } catch (error) {
          console.error('[ProductEdit] Failed to load product by ID:', error);
          Alert.alert('Error', 'Failed to load product data.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
          setIsEditMode(false);
        }
    } else {
      console.log('[ProductEdit] Adding new product');
      setIsEditMode(false);
      navigation.setOptions({ title: 'Add New Product' });
      setProduct(prev => ({ ...prev, id: Date.now().toString() }));
    }
      setIsScreenLoading(false);
    };

    loadProductData();
  }, [route.params, navigation]);

  const handleInputChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const validateInput = () => {
    if (!product.name.trim()) {
      Alert.alert('Validation Error', 'Product name is required.');
      return false;
    }
    if (!product.category.trim()) { // Validate category
        Alert.alert('Validation Error', 'Product category is required.');
      return false;
    }
    if (!product.description.trim()) {
        Alert.alert('Validation Error', 'Product description is required.');
        return false;
      }
    const priceValue = parseFloat(product.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid positive price.');
      return false;
    }
    const quantityValue = parseInt(product.quantity, 10);
    if (isNaN(quantityValue) || quantityValue < 0) {
        Alert.alert('Validation Error', 'Please enter a valid non-negative quantity.');
      return false;
    }
    // Optional: Validate image URL format if needed
    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) {
      return;
    }
    setLoading(true);
    console.log('[ProductEdit] Saving product:', product);
    
    const originalQuantity = isEditMode && route.params?.product ? parseInt(route.params.product.quantity, 10) : Infinity;
    
    try {
      const existingProductsRaw = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
      let productsArray = existingProductsRaw ? JSON.parse(existingProductsRaw) : [];

      const productToSave = {
        ...product,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity, 10),
        tags: product.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      };

      if (isEditMode) {
        productsArray = productsArray.map(p => 
          p.id === productToSave.id ? productToSave : p
        );
        console.log('[ProductEdit] Product updated.');
      } else {
        productsArray.push(productToSave);
        console.log('[ProductEdit] New product added.');
      }

      await AsyncStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(productsArray));

      // --- Low Stock Notification Logic ---
      try {
        const lowStockThreshold = await getLowStockThreshold();
        const newQuantity = productToSave.quantity;
        
        // Notify if quantity drops below threshold OR if a new product is added already below threshold
        if (newQuantity < lowStockThreshold && (isEditMode ? originalQuantity >= lowStockThreshold : true) ) {
          if (isEditMode && newQuantity >= originalQuantity) {
            // If editing and quantity increased but still below threshold, don't notify again unless it crossed from above.
            // This case is complex, for now, let's simplify: notify if newQuantity < threshold and it wasn't already below threshold before *this specific edit session began*.
          } else {
            addNotification({
                title: 'Low Stock Alert!',
                message: `Product "${productToSave.name}" (ID: ${productToSave.id.substring(0,8)}) quantity is ${newQuantity}. Threshold: ${lowStockThreshold}`,
                type: 'stock',
                itemId: productToSave.id,
            });
            console.log(`[ProductEdit] Low stock notification triggered for ${productToSave.name} (Qty: ${newQuantity}, Threshold: ${lowStockThreshold})`);
          }
        }
      } catch (notifError) {
        console.error("[ProductEdit] Error triggering low stock notification:", notifError);
      }
      // --- End Low Stock Notification Logic ---

      Alert.alert(
        isEditMode ? "Product Updated" : "Product Saved",
        isEditMode ? "The product has been successfully updated." : "The new product has been successfully saved.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('[ProductEdit] Failed to save product:', error);
      Alert.alert('Error', 'Could not save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isScreenLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredLoadingContainer]}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={{ marginTop: 10 }}>Loading product data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            value={product.name}
            onChangeText={text => handleInputChange('name', text)}
            placeholder="Enter product name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={product.description}
            onChangeText={text => handleInputChange('description', text)}
            placeholder="Enter product description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={product.price}
            onChangeText={text => handleInputChange('price', text)}
            placeholder="e.g., 49.99"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={product.image}
            onChangeText={text => handleInputChange('image', text)}
            placeholder="Enter image URL (https://...)"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
          />
          {/* Optional: Add Image Picker functionality later */}
          {product.image ? (
            <Text style={styles.imagePreviewText}>Image URL provided</Text>
            // <Image source={{ uri: product.image }} style={styles.imagePreview} />
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={product.category}
            onChangeText={text => handleInputChange('category', text)}
            placeholder="e.g., Tops, Outerwear, Shoes"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity in Stock</Text>
          <TextInput
            style={styles.input}
            value={product.quantity}
            onChangeText={text => handleInputChange('quantity', text)}
            placeholder="e.g., 50"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags (comma-separated)</Text>
          <TextInput
            style={styles.input}
            value={product.tags}
            onChangeText={text => handleInputChange('tags', text)}
            placeholder="e.g., t-shirt, white, cotton"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditMode ? 'Update Product' : 'Save Product'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // For Android
  },
  saveButton: {
    backgroundColor: '#007AFF', // Blue color
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#a0cfff', // Lighter blue when disabled
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
   imagePreviewText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        fontStyle: 'italic',
    },
  // Uncomment if you add image preview:
  // imagePreview: {
  //   width: 100,
  //   height: 100,
  //   marginTop: 10,
  //   resizeMode: 'contain',
  //   borderRadius: 4,
  //   alignSelf: 'center'
  // },
  centeredLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductEditScreen; 