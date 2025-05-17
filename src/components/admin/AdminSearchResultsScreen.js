import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList, // For grouped results
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ADMIN_PRODUCTS_KEY = 'admin_products';

const AdminSearchResultsScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async () => {
    if (!query) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log(`[AdminSearchResultsScreen] Searching for: "${query}"`);

    try {
      const lowerCaseQuery = query.toLowerCase();
      let products = [];
      let orders = [];
      let users = [];

      // Search Products
      try {
        const productsDataString = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
        if (productsDataString) {
          const allProducts = JSON.parse(productsDataString);
          products = allProducts.filter(product => 
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.category.toLowerCase().includes(lowerCaseQuery) ||
            (product.description && product.description.toLowerCase().includes(lowerCaseQuery)) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
          );
        }
      } catch (e) { console.error('[Search] Error fetching/filtering products:', e); }

      // Search Orders
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const orderKeys = allKeys.filter(key => key.startsWith('orders_'));
        let allOrdersRaw = [];
        if (orderKeys.length > 0) {
          const orderData = await AsyncStorage.multiGet(orderKeys);
          orderData.forEach(([key, value]) => {
            if (value) {
              try {
                const userOrders = JSON.parse(value);
                if (Array.isArray(userOrders)) {
                  // Attach customerEmail to each order for searching
                  const customerEmail = key.substring('orders_'.length);
                  userOrders.forEach(order => {
                    allOrdersRaw.push({ ...order, customerEmail });
                  });
                }
              } catch (e) { console.error(`[Search] Error parsing orders for key ${key}:`, e); }
            }
          });
        }
        orders = allOrdersRaw.filter(order => 
          (order.id && order.id.toLowerCase().includes(lowerCaseQuery)) ||
          (order.customerEmail && order.customerEmail.toLowerCase().includes(lowerCaseQuery)) ||
          (order.status && order.status.toLowerCase().includes(lowerCaseQuery))
        );
      } catch (e) { console.error('[Search] Error fetching/filtering orders:', e); }

      // Search Users
      try {
        const allUserKeys = (await AsyncStorage.getAllKeys()).filter(key => key.startsWith('user_'));
        if (allUserKeys.length > 0) {
          const usersDataStrings = await AsyncStorage.multiGet(allUserKeys);
          const allUsers = usersDataStrings.map(([key, value]) => value ? JSON.parse(value) : null).filter(Boolean);
          users = allUsers.filter(user => 
            user.name.toLowerCase().includes(lowerCaseQuery) ||
            user.email.toLowerCase().includes(lowerCaseQuery)
          );
        }
      } catch (e) { console.error('[Search] Error fetching/filtering users:', e); }
      
      const results = [];
      if (products.length > 0) results.push({ title: 'Products', data: products, type: 'product' });
      if (orders.length > 0) results.push({ title: 'Orders', data: orders, type: 'order' });
      if (users.length > 0) results.push({ title: 'Customers', data: users, type: 'user' });

      setSearchResults(results);
      if (results.length === 0) {
        console.log(`[AdminSearchResultsScreen] No results found for "${query}"`);
      } else {
        console.log(`[AdminSearchResultsScreen] Found ${results.reduce((sum, section) => sum + section.data.length, 0)} results.`);
      }

    } catch (err) {
      console.error('[AdminSearchResultsScreen] Search failed:', err);
      setError('Search operation failed. ' + err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Optional: Refetch on focus if data might change frequently in background
  // useFocusEffect(performSearch);

  const navigateToDetail = (item, type) => {
    switch (type) {
      case 'product':
        navigation.navigate('Products', { 
          screen: 'ProductEdit', 
          params: { product: item, isEditing: true } 
        });
        break;
      case 'order':
        navigation.navigate('Orders', { 
          screen: 'OrderDetail', 
          params: { order: item } 
        });
        break;
      case 'user':
        navigation.navigate('Customers', { 
          screen: 'UserEdit', 
          params: { user: item } 
        });
        break;
      default:
        console.warn('Unknown item type for navigation:', type);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToDetail(item, 'product')}>
      {typeof item.image === 'string' && item.image.trim() !== '' ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.placeholderImage]}>
          <Icon name="image-outline" size={24} color="#ccc" />
        </View>
      )}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.category} - Php {item.price}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToDetail(item, 'order')}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>Order ID: {item.id}</Text>
        <Text style={styles.itemSubtitle}>Customer: {item.customerEmail} - Status: {item.status}</Text>
        <Text style={styles.itemSubtitle}>Total: Php {item.totalPrice.toFixed(2)}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToDetail(item, 'user')}>
       <Icon name="person-circle-outline" size={40} color="#8A2BE2" style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.email}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderItem = ({ item, section }) => {
    if (section.type === 'product') return renderProductItem({ item });
    if (section.type === 'order') return renderOrderItem({ item });
    if (section.type === 'user') return renderUserItem({ item });
    return null;
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Searching...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Icon name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={performSearch} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry Search</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (searchResults.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Icon name="search-circle-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No results found for "{query}".</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Search Results for "{query}"</Text>
        <View style={{width: 28}} />{/* Spacer */}
      </View>
      <SectionList
        sections={searchResults}
        keyExtractor={(item, index) => item.id + index} // Ensure unique keys
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={() => (
            <View style={styles.centerContainerEmptyList}>
                 <Icon name="search-circle-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No results found.</Text>{/* Should be covered by earlier check, but good fallback*/}
            </View>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  centerContainerEmptyList: { alignItems: 'center', paddingVertical: 50 }, 
  errorText: { marginTop: 10, color: 'red', fontSize: 16, textAlign: 'center' },
  emptyText: { marginTop: 20, fontSize: 18, color: '#888', textAlign: 'center' },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: { padding: 5 },
  headerTitleText: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center' },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#E9E9EF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 1, // Minimal separation between items in a section
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#e0e0e0', // Background for placeholder
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemTextContainer: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemSubtitle: { fontSize: 13, color: '#666', marginTop: 3 },
  listContainer: { paddingBottom: 20 },
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
});

export default AdminSearchResultsScreen; 