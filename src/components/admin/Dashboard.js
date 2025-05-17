import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Or FontAwesome, etc.
import { useNotifications } from '../../../src/context/NotificationContext'; // Import useNotifications

// Import mock product data
import { mockProducts } from '../../../src/data/products'; // Adjust path as needed

const screenWidth = Dimensions.get('window').width;

const ADMIN_PRODUCTS_KEY = 'admin_products'; // Define key for admin products

// Placeholder chart data
const initialChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
  legend: ['Total Sales Per Month'], // optional
};

const initialLineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
  legend: ['Total Number of Orders'], // optional
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const Dashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    newOrders: 0,
    totalIncome: 0,
    totalExpense: 0, // Static for now
    totalUsers: 0,
  });
  const [salesChartData, setSalesChartData] = useState(initialChartData);
  const [ordersChartData, setOrdersChartData] = useState(initialLineChartData);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { notificationCount, addNotification, showToast } = useNotifications(); // Get notification count, addNotification and showToast

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[Dashboard] Fetching data from AsyncStorage...');
      const allKeys = await AsyncStorage.getAllKeys();
      const orderKeys = allKeys.filter((key) => key.startsWith('orders_'));
      const userKeys = allKeys.filter((key) => key.startsWith('user_'));

      // --- Check and Initialize Admin Products --- 
      const adminProductsRaw = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
      if (!adminProductsRaw) {
        console.log(`[Dashboard] No data found for ${ADMIN_PRODUCTS_KEY}. Initializing from mock data...`);
        await AsyncStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(mockProducts));
        console.log(`[Dashboard] Initialized ${ADMIN_PRODUCTS_KEY} with ${mockProducts.length} items.`);
      } else {
        console.log(`[Dashboard] ${ADMIN_PRODUCTS_KEY} already exists.`);
        // Optionally: Parse and log count if needed
        // const adminProducts = JSON.parse(adminProductsRaw);
        // console.log(`[Dashboard] Found ${adminProducts.length} products in ${ADMIN_PRODUCTS_KEY}.`);
      }
      // --- End Admin Products Check --- 

      let allOrders = [];
      if (orderKeys.length > 0) {
        const orderData = await AsyncStorage.multiGet(orderKeys);
        orderData.forEach(([key, value]) => {
          if (value) {
            try {
              const userOrders = JSON.parse(value);
              if (Array.isArray(userOrders)) {
                allOrders = allOrders.concat(userOrders);
              }
            } catch (e) {
              console.error(`[Dashboard] Error parsing orders for key ${key}:`, e);
            }
          }
        });
      }

      console.log(`[Dashboard] Found ${allOrders.length} total orders.`);
      console.log(`[Dashboard] Found ${userKeys.length} total users.`);

      // Calculate Summary Data
      const totalOrdersCount = allOrders.length;
      const totalIncome = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const totalUsersCount = userKeys.length;

      setSummaryData({
        newOrders: totalOrdersCount, // Using total orders for now
        totalIncome: totalIncome,
        totalExpense: 0, // Keep static
        totalUsers: totalUsersCount,
      });

      // --- Prepare Chart Data (Simplified Example) ---
      // This needs more sophisticated aggregation based on order dates
      // For now, just putting total count/income in the first month for illustration
      const currentMonthIndex = new Date().getMonth(); // 0-11

      const monthlySales = Array(8).fill(0);
      const monthlyOrders = Array(8).fill(0);

      allOrders.forEach(order => {
          const orderMonth = new Date(order.date).getMonth(); // Get month (0-11)
          // Map current year's months to Jan-Aug for simplicity if needed, or use full year labels
          // This example puts *all* sales/orders into the month they occurred in, 
          // assuming the labels array covers those months. Needs refinement for proper monthly bucketing.
          if(orderMonth >= 0 && orderMonth < 8) { // Fit into Jan-Aug labels
              monthlySales[orderMonth] += order.totalPrice || 0;
              monthlyOrders[orderMonth] += 1;
          } 
      });
      
      setSalesChartData({
        ...initialChartData,
        datasets: [{ ...initialChartData.datasets[0], data: monthlySales }],
      });
      setOrdersChartData({
          ...initialLineChartData,
          datasets: [{ ...initialLineChartData.datasets[0], data: monthlyOrders }],
      });

      console.log('[Dashboard] Data fetching complete.');

    } catch (err) {
      console.error('[Dashboard] Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
      // Optional: return a cleanup function if needed
      // return () => console.log("[Dashboard] unfocused or cleaned up");
    }, [loadDashboardData]) // Dependency array includes loadDashboardData
  );

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('AdminSearchResults', { query: searchQuery.trim() });
      // Optionally reset search state after navigation
      // setIsSearchActive(false);
      // setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    if (isSearchActive && searchQuery.trim()) {
        // If search is active and there's a query, submit it
        handleSearchSubmit();
    } else {
        // Otherwise, toggle search bar visibility
        setIsSearchActive(!isSearchActive);
        if (isSearchActive) { // If we are deactivating search
            setSearchQuery(''); // Clear query when hiding search bar
        }
    }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Loading Dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={40} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadDashboardData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {!isSearchActive ? (
          <>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
             <Icon name="menu-outline" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AdminNotifications')} 
              style={styles.notificationIconTouchable}
            >
              <Icon name="notifications-outline" size={28} color="#333" />
              {notificationCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders, products, users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
            returnKeyType="search"
          />
        )}
        <TouchableOpacity onPress={toggleSearch} style={styles.searchIconContainer}>
          <Icon name={isSearchActive ? "close-outline" : "search-outline"} size={isSearchActive ? 30 : 28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* REMOVED Simulate New Order Button - This section is removed
        <TouchableOpacity 
          style={styles.devButton}
          onPress={() => {
            // Simple way to trigger a test notification
            addNotification({
                title: 'Dev Test Order!',
                message: `A test order was simulated for dev purposes. Order ID: DEV_${Date.now()}`,
                type: 'order', // 'order', 'stock', 'user'
                itemId: `DEV_${Date.now()}|testuser@example.com` // Example composite ID for testing
            });
            showToast('Test order notification sent!', 'success');
          }}
        >
          <Text style={styles.devButtonText}>Simulate New Order (Dev)</Text>
        </TouchableOpacity>
        */}

        <View style={styles.summaryGrid}>
          <View style={[styles.summaryBox, styles.newOrdersBox]}>
            <Icon name="cart-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardValue}>{summaryData.newOrders}</Text>
            <Text style={styles.cardLabel}>New Orders</Text>
          </View>
          <View style={[styles.summaryBox, styles.totalIncomeBox]}>
             <Icon name="cash-outline" size={24} color="#fff" style={styles.cardIcon} />
             <Text style={styles.cardValue}>Php {summaryData.totalIncome.toFixed(2)}</Text>
            <Text style={styles.cardLabel}>Total Income</Text>
          </View>
        </View>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryBox, styles.totalExpenseBox]}>
            <Icon name="wallet-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardValue}>{summaryData.totalExpense}</Text>
            <Text style={styles.cardLabel}>Total Expense</Text>
          </View>
          <View style={[styles.summaryBox, styles.totalUsersBox]}>
            <Icon name="people-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardValue}>{summaryData.totalUsers}</Text>
            <Text style={styles.cardLabel}>Total Users</Text>
          </View>
        </View>

        {/* Charts */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Total Sales Per Month</Text>
          <BarChart
            style={styles.chart}
            data={salesChartData}
            width={screenWidth * 0.9}
            height={220}
            yAxisLabel="₱"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero={true}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Total Number of Orders</Text>
          <LineChart
            style={styles.chart}
            data={ordersChartData}
            width={screenWidth * 0.9}
            height={220}
            chartConfig={chartConfig}
            bezier // Makes the line smooth
            fromZero={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Changed to white for a cleaner look
  },
  container: {
    flex: 1,
  },
  contentContainer: {
      padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    minHeight: 50, // Ensure header has a minimum height
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginRight: 10, 
    color: '#333',
  },
  notificationIconTouchable: {
    padding: 5,
    position: 'relative', // For badge positioning
    marginRight: 10, // Space before search icon
  },
  searchIconContainer: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5, // Add some space between cards
    alignItems: 'flex-start', // Align icon/text to start
    minHeight: 100, // Ensure cards have some height
    justifyContent: 'space-between', // Space out content
  },
  cardIcon: {
      marginBottom: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#eee',
  },
  newOrdersBox: { backgroundColor: '#29B6F6' },
  totalIncomeBox: { backgroundColor: '#EF5350' },
  totalExpenseBox: { backgroundColor: '#FFA726' },
  totalUsersBox: { backgroundColor: '#66BB6A' },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 5, // Reduce horizontal padding for chart
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    // marginVertical: 8,
    // borderRadius: 16,
  },
  badgeContainer: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure badge is on top of the icon
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Dashboard; 