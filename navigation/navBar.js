import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Icon name="bars" size={24} color="black" />
    </TouchableOpacity>

    <View style={styles.logoContainer}>
      <Text style={[styles.star, { color: 'orange' }]}>✦</Text>
      <View>
        <Text style={styles.logoLine1}>Fashion</Text>
        <Text style={styles.logoLine2}>Trend</Text>
      </View>
      <Text style={[styles.star, { color: 'blue' }]}>✦</Text>
    </View>

    <View style={styles.navIcons}>
      <TouchableOpacity onPress={() => navigation.navigate('SearchClient')}>
      <Icon name="search" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('BagScreen')}>
      <Icon name="shopping-bag" size={24} color="black" />
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E8ECF4', // Light grayish background
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },

  logoLine1: {
    fontFamily: 'IslandMoments',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 20,
  },

  logoLine2: {
    fontFamily: 'IslandMoments',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -5,
    color: '#black',
  },

  star: {
    fontSize: 20,
    marginHorizontal: 4,
  },

  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default Navbar;
