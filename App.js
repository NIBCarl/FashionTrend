import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { IslandMoments_400Regular } from '@expo-google-fonts/island-moments';
import { Itim_400Regular } from '@expo-google-fonts/itim';
import { BodoniModa_400Regular } from '@expo-google-fonts/bodoni-moda';
import { ActivityIndicator, View } from 'react-native';
import Home from './components/client/Home';
// Screens
import FashionTrendScreen from './FashionTrendScreen';


import OrderHistoryScreen from './components/client/OrderHistoryScreen';
import FashionScreen from './components/client/FashionScreen';
import BagScreen from './components/client/BagScreen';
import FashionScreenMore from './components/client/FashionScreenMore';
import Contact from './components/client/Contact';
import SignInModal from './components/auth/SignInModal';
import RegisterModal from './components/auth/RegisterModal';
import AdminSignInModal from './src/components/auth/AdminSignInModal';
import ProfileScreen from './components/client/ProfileScreen'; // adjust path as needed
import ProductDetailScreen from './components/client/ProductDetailScreen'; // Import ProductDetailScreen
import SearchScreen from './components/client/SearchScreen'; // Import the new screen
// Drawer

//admin screen
import Dashboard from './components/admin/Dashboard';
import CustomDrawer from './components/CustomDrawer';
import AdminDrawer from './navigation/AdminDrawer';
import Orders from './components/admin/Order';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BagProvider } from './src/context/BagContext';
import { NotificationProvider } from './src/context/NotificationContext';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


// This is the drawer containing the client screens
function DrawerScreens() {
  return (
      <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {/* Client Screens */}
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="FashionScreen" component={FashionScreen} />
      <Drawer.Screen name="FashionScreenMore" component={FashionScreenMore} />
      <Drawer.Screen name="BagScreen" component={BagScreen} />
      <Drawer.Screen name="Contact" component={Contact} />
      <Drawer.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* Add ProductDetailScreen - typically not shown in drawer, but needs to be navigable */}
      <Drawer.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ drawerItemStyle: { height: 0 } }} // Hide from drawer menu
      />
      {/* Add SearchScreen - also hide from drawer menu */}
       <Drawer.Screen 
        name="SearchClient" 
        component={SearchScreen} 
        options={{ drawerItemStyle: { height: 0 } }} // Hide from drawer menu
      />
    
      {/* Admin Screens */}
      

    </Drawer.Navigator>
  );
}

// Main Stack that controls flow: Trend → Sign In → Drawer
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FashionTrend" component={FashionTrendScreen} />
      <Stack.Screen name="SignInModal" component={SignInModal} />
      <Stack.Screen name="RegisterModal" component={RegisterModal} />
      <Stack.Screen name="AdminSignInModal" component={AdminSignInModal} />
    </Stack.Navigator>
  );
}

// New Root Navigator component to handle auth state
function RootNavigator() {
    const { loggedInUserEmail, isAdminLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        // Show loading spinner while checking token or during login/logout
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#9a55ff" />
            </View>
        );
    }

    // Choose navigator based on login state
    return (
      <NavigationContainer>
        {isAdminLoggedIn ? (
          <AdminDrawer />
        ) : loggedInUserEmail ? (
          <DrawerScreens />
        ) : (
          <MainStack />
        )}
      </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    IslandMoments: IslandMoments_400Regular,
    Itim: Itim_400Regular,
    BodoniModa: BodoniModa_400Regular,
  });

  // Font loading check remains
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9a55ff" />
      </View>
    );
  }

  // Render AuthProvider which contains the RootNavigator
  return (
    <AuthProvider>
      <BagProvider>
        <NotificationProvider>
        <RootNavigator />
        </NotificationProvider>
      </BagProvider>
    </AuthProvider>
  );
}
