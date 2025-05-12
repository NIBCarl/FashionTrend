import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../navigation/navBar';
import BottomNavBar from '../../navigation/BottomNavBar';

const screenWidth = Dimensions.get('window').width;

const mockData = [
  {
    title: 'JACKETS',
    data: [
      { id: '1', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/jacket11.png') },
      { id: '2', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/jacket22.png') },
      { id: '3', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/jacket33.png') },
      { id: '4', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/jacket44.png') },
      { id: '5', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/jacket55.png') },
    ],
  },
  {
    title: 'SHIRTS / SWEATSHIRTS',
    data: [
      { id: '6', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/shirt11.png') },
      { id: '7', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/shirt22.png') },
      { id: '8', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/sweater.png') },
      { id: '7', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/shirt22.png') },
      { id: '8', name: 'Lorem ipsum', price: '$599', image: require('../../assets/products/sweater.png') },
    ],
  },
];

const FashionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <Navbar />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>FASHION TRENDS ✨</Text>

          {mockData.map((section) => (
            <View key={section.title}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <FlatList
                data={section.data}
                horizontal={false}
                numColumns={3}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Image source={item.image} style={styles.image} />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>

          ))}
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              paddingHorizontal: 24,
              paddingVertical: 10,
              alignSelf: 'center',
              borderRadius: 4,
              marginTop: 20
            }}
            onPress={() => navigation.navigate('FashionScreenMore')}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14, paddingHorizontal: 30, }}>SEE MORE</Text>
          </TouchableOpacity>

        </ScrollView>

      </View>

      <View style={styles.bottomNavWrapper}>
        <BottomNavBar active="Bag" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const cardSize = (screenWidth - 64) / 3;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,

  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 8,
    paddingBottom: 90, // leave space for BottomNavBar
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: 'red',
    marginBottom: 10,
    marginTop: 25,
  },
  card: {
    width: cardSize,
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  price: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 8,
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  seeMoreButton: {
    marginTop: 30,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 60,
    alignSelf: 'center',
    borderRadius: 2, // optional: makes it look more square
  },
  seeMoreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default FashionScreen;
