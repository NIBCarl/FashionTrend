import React from 'react';
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
import ProfileScreen from './components/client/ProfileScreen'; // adjust path as needed
// Drawer

//admin screen
import Dashboard from './components/admin/Dashboard';
import CustomDrawer from './components/CustomDrawer';
import AdminDrawer from './navigation/AdminDrawer';
import Orders from './components/admin/Order';
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
      <Stack.Screen name="DrawerScreens" component={DrawerScreens} />
      <Stack.Screen name="ProfileScreens" component={ProfileScreen} />
      <Stack.Screen name="DrawerNavigator" component={Dashboard} />
      <Stack.Screen name="CustomDrawer" component={CustomDrawer} />
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} options={{ headerShown: false }} />


      
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    IslandMoments: IslandMoments_400Regular,
    Itim: Itim_400Regular,
    BodoniModa: BodoniModa_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
