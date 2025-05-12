// navigation/AdminDrawer.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../components/admin/Dashboard';
import Order from '../components/admin/Order';
import CustomAdminDrawer from './CustomAdminDrawer';
import Products from '../components/admin/Products';
import Customers from '../components/admin/Customers';
const Drawer = createDrawerNavigator();

const AdminDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomAdminDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Orders" component={Order} />
      <Drawer.Screen name="Products" component={Products} />
      <Drawer.Screen name="Customers" component={Customers} />

    </Drawer.Navigator>
  );
};

export default AdminDrawer;
