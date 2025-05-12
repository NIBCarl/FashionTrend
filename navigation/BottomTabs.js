import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Home from '../screens/Home';

const Tab = createBottomTabNavigator();

// Dummy components
const Bag = () => <View style={styles.screen}><Text>Bag Screen</Text></View>;
const Profile = () => <View style={styles.screen}><Text>Profile Screen</Text></View>;

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={24} color={focused ? '#F4A8A0' : 'black'} />;
          } else if (route.name === 'Bag') {
            return <Feather name="shopping-bag" size={24} color="black" />;
          } else if (route.name === 'Profile') {
            return <Feather name="user" size={24} color="black" />;
          }
        },
        tabBarLabel: ({ focused }) => {
          let labelStyle = [styles.labelText];

          if (route.name === 'Home' && focused) {
            labelStyle.push(styles.activeHomeLabel);
            return <Text style={labelStyle}>Home</Text>;
          } else if (route.name === 'Bag') {
            labelStyle.push(focused ? styles.bold : {});
            return <Text style={labelStyle}>Bag</Text>;
          } else if (route.name === 'Profile') {
            return <Text style={labelStyle}>Profile</Text>;
          }
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Bag" component={Bag} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'TenorSans',
    color: '#000',
  },
  activeHomeLabel: {
    color: '#F4A8A0',
  },
  bold: {
    fontWeight: 'bold',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabs;
