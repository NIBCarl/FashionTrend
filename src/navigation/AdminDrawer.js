import OrdersScreen from '../src/components/admin/OrdersScreen';
import OrderDetailScreen from '../src/components/admin/OrderDetailScreen';
import ProductsScreen from '../src/components/admin/ProductsScreen';
import ProductEditScreen from '../src/components/admin/ProductEditScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const OrderStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
};

const ProductStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProductList" component={ProductsScreen} />
      <Stack.Screen name="ProductEdit" component={ProductEditScreen} />
    </Stack.Navigator>
  );
};

const AdminDrawer = () => {
  return (
    <Drawer.Navigator 
      drawerContent={props => <CustomAdminDrawer {...props} />}
      screenOptions={{ 
        headerShown: false,
        drawerActiveTintColor: '#8A2BE2',
        drawerInactiveTintColor: 'gray',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        }
      }}
    >
      <Drawer.Screen name="AdminDashboard" component={Dashboard} 
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({color}) => (
            <Icon name="home-outline" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen name="AdminOrders" component={OrderStackNavigator} 
        options={{
          drawerLabel: 'Manage Orders',
          drawerIcon: ({color}) => (
            <Icon name="receipt-outline" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen name="AdminProducts" component={ProductStackNavigator} 
        options={{
          drawerLabel: 'Manage Products',
          drawerIcon: ({color}) => (
            <Icon name="cube-outline" size={22} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminDrawer; 