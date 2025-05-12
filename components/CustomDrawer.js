import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import FashionScreen from './client/FashionScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './admin/Dashboard';
import Order from './admin/Order';
const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/ando.jpg')} // or use a URI if from the web
          style={styles.avatar}
        />
        <Text style={styles.name}>Donalyn Ando</Text>
        <Text style={styles.email}>dando@ssct.edu.ph</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('Home')}>
          <Icon name="home-outline" size={22} />
          <Text style={styles.itemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('FashionScreen')}>
          <Icon name="document-text-outline" size={22} />
          <Text style={styles.itemText}>New</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('FashionScreenMore')}>
          <Icon name="chatbubble-ellipses-outline" size={22} />
          <Text style={styles.itemText}>Trends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('ProfileScreen')}>
          <Icon name="person-outline" size={22} />
          <Text style={styles.itemText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={() => <CustomAdminDrawer />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Orders" component={Order} />
      <Drawer.Screen name="Products" component={Products} />
      <Drawer.Screen name="Customers" component={Customers} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    fontSize: 12,
    color: '#888',
  },
  menu: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CustomDrawer;
