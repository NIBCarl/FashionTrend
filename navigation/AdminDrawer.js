// navigation/AdminDrawer.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomAdminDrawer from './CustomAdminDrawer';

// Admin Screens
import Dashboard from '../src/components/admin/Dashboard';
import ProductsScreen from '../src/components/admin/ProductsScreen'; // Import ProductsScreen
import ProductEditScreen from '../src/components/admin/ProductEditScreen'; // Import ProductEditScreen
import OrdersScreen from '../src/components/admin/OrdersScreen'; // Corrected path
import OrderDetailScreen from '../src/components/admin/OrderDetailScreen'; // Import OrderDetailScreen
import UsersScreen from '../src/components/admin/UsersScreen'; // Main screen for customer list
import UserEditScreen from '../src/components/admin/UserEditScreen'; // Screen for editing user
import UserCreateScreen from '../src/components/admin/UserCreateScreen'; // Screen for creating user
import AdminSearchResultsScreen from '../src/components/admin/AdminSearchResultsScreen'; // Screen for search results
import AdminNotificationsScreen from '../src/components/admin/AdminNotificationsScreen'; // Import AdminNotificationsScreen
// import Customers from '../src/components/admin/Customers'; // Assuming path, uncomment later

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator(); // Create a Stack Navigator instance

// Create a Stack Navigator for Orders flow
const OrderStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false // Hide header for the stack, drawer header is used
      }}
    >
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen} 
        options={({ route }) => ({ 
          // Optional: Customize header shown inside OrderDetailScreen if needed, 
          // or use navigation.setOptions within the component itself as done previously
          headerShown: true, // Show header for this specific screen
          title: `Order Details`, // Default title, can be overridden by component
          headerBackTitle: 'Orders', // Set back button text
         })}
      />
    </Stack.Navigator>
  );
};

// Create a Stack Navigator for Products flow
const ProductStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false // Hide header for the stack, drawer header is used
      }}
    >
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen 
        name="ProductEdit" 
        component={ProductEditScreen} 
        options={{
          headerShown: true,
          title: 'Edit Product', // Can be dynamic based on add/edit mode
          headerBackTitle: 'Products',
        }}
      />
    </Stack.Navigator>
  );
};

// Customers (Users) Stack
const CustomerStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomersList" component={UsersScreen} />
      <Stack.Screen 
        name="UserEdit" 
        component={UserEditScreen} 
        options={{
          headerShown: true,
          // Title for UserEditScreen is set dynamically within the component
          headerBackTitle: 'Customers',
        }}
      />
      <Stack.Screen 
        name="UserCreate" 
        component={UserCreateScreen} 
        options={{
          headerShown: false, // UserCreateScreen has its own header
          // title: 'Create New User', // Title is in the component's header
          // headerBackTitle: 'Customers', // Not needed as header is false
        }}
      />
    </Stack.Navigator>
  );
};

const AdminDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomAdminDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Orders" component={OrderStackNavigator} />
      <Drawer.Screen name="Products" component={ProductStackNavigator} />
      <Drawer.Screen name="Customers" component={CustomerStackNavigator} />
      {/* Screen for search results, not shown in drawer menu, but navigable */}
      <Drawer.Screen 
        name="AdminSearchResults" 
        component={AdminSearchResultsScreen} 
        options={{ 
          // drawerLabel: () => null, // Hide from drawer
          // title: null, // Hide from drawer
          // drawerIcon: () => null // Hide from drawer if you explicitly list items
          // Simplest way is to not include it in CustomAdminDrawer items if it's manually built there
          // Or, if CustomAdminDrawer iterates over routes, filter it out.
          // For now, just adding it here makes it navigable. Header is self-contained in the screen.
        }}
      />
      {/* Screen for notifications, not shown in drawer menu, but navigable */}
      <Drawer.Screen 
        name="AdminNotifications" 
        component={AdminNotificationsScreen} 
        // Options to hide from drawer can be added here if CustomAdminDrawer doesn't filter
        // For instance, if CustomAdminDrawer iterates routes, you might need:
        // options={{ drawerItemStyle: { height: 0, display: 'none' } }} 
        // However, if CustomAdminDrawer has a fixed list of items, this screen just needs to be navigable.
      />
      {/* <Drawer.Screen name="Customers" component={Customers} /> */}
    </Drawer.Navigator>
  );
};

export default AdminDrawer;
