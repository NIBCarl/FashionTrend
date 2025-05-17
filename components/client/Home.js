import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  Image,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from "expo-font";
import { IslandMoments_400Regular } from "@expo-google-fonts/island-moments";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { BodoniModa_400Regular } from '@expo-google-fonts/bodoni-moda';
import { TenorSans_400Regular } from "@expo-google-fonts/tenor-sans";
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from "../../navigation/navBar";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BottomNavBar from '../../navigation/BottomNavBar';
import BuyNowModal from './BuyNowModal';
import { fetchProducts } from '../../src/services/api';

const categories = ["All", "Apparel", "Dress", "Tshirt", "Bag"];

const hashtags = [
  '#2025', '#spring', '#collection', '#fall',
  '#dress', '#autumncollection', '#openfashion',
];

const features = [
  {
    icon: require('../../assets/icons/fast1.png'),
    text: 'Fast shipping. Free on orders over Php 1,000.',
  },
  {
    icon: require('../../assets/icons/sustainable.png'),
    text: 'Sustainable process from start to finish.',
  },
  {
    icon: require('../../assets/icons/unique.png'),
    text: 'Unique designs and high-quality materials.',
  },
  {
    icon: require('../../assets/icons/fast2.png'),
    text: 'Fast shipping.\nFree on orders over Php 1,000.',
  },
];

const Home = () => {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);

  // State for API data
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  const loadProducts = async () => {
    console.log("[Home.js] loadProducts called"); // Log: function entry
    setIsLoading(true);
    setError(null);
    try {
      // fetchProducts now returns the array directly
      const productsArray = await fetchProducts();
      console.log("[Home.js] Response from fetchProducts (Count):", productsArray?.length); // Log: API response
      
      // Check if the response is actually an array
      if (Array.isArray(productsArray)) {
        setProducts(productsArray);
        console.log("[Home.js] Products state set successfully"); // Log: State set success
      } else {
        // If fetchProducts didn't return an array, something is wrong
        throw new Error('Invalid data format received from fetchProducts');
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred while fetching products';
      setError(errorMessage);
      console.error("[Home.js] Error caught in loadProducts:", err); // Log: Caught exception
    }
    setIsLoading(false);
  };

  // Use useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("[Home.js] useFocusEffect triggered"); // Log: Effect trigger
      loadProducts();
    }, [])
  );

  // Render item for the main product FlatList
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <Text style={styles.productName} numberOfLines={2}>{item.name || 'Product Name'}</Text>
      <Text style={styles.price}>${item.price?.toFixed(2) || 'Price N/A'}</Text>
    </TouchableOpacity>
  );

  // Display loading indicator
  const renderLoading = () => (
    <View style={styles.centerStatus}>
      <ActivityIndicator size="large" color="#8A2BE2" />
      <Text>Loading Products...</Text>
    </View>
  );

  // Display error message
  const renderError = () => (
    <View style={styles.centerStatus}>
      <Text style={styles.errorText}>Error loading products.</Text>
      <Text style={styles.errorText}>{error}</Text>
      {/* TODO: Add a retry button? */}
    </View>
  );

  // Display message when no products are found
  const renderEmpty = () => (
    <View style={styles.centerStatus}>
      <Text>No products found.</Text>
    </View>
  );

  console.log("[Home.js] Rendering with State:", { isLoading, error, productCount: products.length }); // Log: State before render

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Conditionally render based on loading/error state */}
      {isLoading ? renderLoading() : error ? renderError() : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 0 }}
          renderItem={renderProductItem}
          ListHeaderComponent={
            <>
              {/* Hero Banner */}
              <ImageBackground
                source={{ uri: 'https://img.freepik.com/free-photo/portrait-young-japanese-woman-with-jacket_23-2148870732.jpg' }}
                style={styles.banner}
              >
                <View style={styles.overlay} />
                <Text style={styles.bannerText}>LUXURY{"\n"}FASHION{"\n"}& ACCESSORIES</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>EXPLORE COLLECTION</Text>
                </TouchableOpacity>
              </ImageBackground>

              {/* New Arrival Section */}
              <Text style={styles.header}>NEW ARRIVAL</Text>

              {/* Category Tabs */}
              <View style={styles.categoryContainer}>
                {categories.map((category, index) => (
                  <TouchableOpacity key={index} onPress={() => setSelectedCategory(category)}>
                    <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategory]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Add padding below categories if FlatList content starts too close */}
              <View style={{ height: 10 }} />
            </>
          }
          ListFooterComponent={
            <>
              {/* Explore More + Brand Grid */}
              <View style={{ marginVertical: 40, alignItems: 'center' }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: -80 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'TenorSans', marginRight: 8, marginTop: 50, }}>Explore More</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <View style={styles.brandGrid}>
                  <Text style={styles.brand}>PRADA</Text>
                  <Text style={styles.brand}>BURBERRY</Text>
                  <Text style={styles.brand}>BOSS</Text>
                  <Text style={styles.brandItalic}>Cartier</Text>
                  <Text style={styles.brand}>GUCCI</Text>
                  <Text style={styles.brand}>TIFFANY & CO.</Text>
                </View>
                <View style={styles.divider} />
              </View>

              {/* Collections Section */}
              <View style={styles.collectionsSection}>
                <Text style={styles.collectionsTitle}>COLLECTIONS</Text>
                <ImageBackground
                  source={{ uri: 'https://medevel.com/content/images/size/w960/2025/01/Spectrum-Hoodie-Collection.jpeg' }}
                  style={styles.collectionBanner}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <View style={styles.offerOverlay}>
                    <Text style={styles.offerText}>Flat</Text>
                    <Text style={styles.offerPercent}>50%</Text>
                    <Text style={styles.offerText}>OFF</Text>
                  </View>
                </ImageBackground>
                <TouchableOpacity style={styles.buyNowBtn} onPress={() => setModalVisible(true)}>
                  <Text style={styles.buyNowText}>Buy now</Text>
                </TouchableOpacity>
                <BuyNowModal
                  visible={modalVisible}
                  onClose={() => setModalVisible(false)}
                  product={{ name: 'Jacket', price: 6000, image: require('../../assets/products/jacket333.png') }}
                />
                {/* Trending */}
                <Text style={styles.trendingTitle}>Trending Outfit of The week</Text>
                <Text style={styles.trendingDesc}>
                  From run away to real life: Fashion trends you need to know.{"\n"}
                  Stay ahead of the curve with these trendsetting outfit.
                </Text>
                <View style={styles.trendingGrid}>
                  <Image
                    source={{ uri: 'https://assets.lummi.ai/assets/Qmd3CTTcqTcWQaCuqFMassWyWyQHX1XYz7XPjv3FKr2pgc?auto=format&w=640' }}
                    style={styles.trendingImageLarge}
                  />
                  <View style={styles.trendingColumn}>
                    <Image
                      source={{ uri: 'https://assets.lummi.ai/assets/QmPkoHyfcukb39rhXZ8bozBToZmZJt1cJsETHMr6sdi7sC?auto=format&w=640' }}
                      style={styles.trendingImageSmall}
                    />
                    <Image
                      source={{ uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTYG4p65MwDuuR7lmc5I90htD9T6iaqtea8_qwuWu2QW24fnYyD' }}
                      style={styles.trendingImageSmall}
                    />
                  </View>
                </View>
                <TouchableOpacity style={styles.seeMoreBtn}
                  onPress={() => navigation.navigate('FashionScreen')}>

                  <Text style={styles.seeMoreText}>See More Trending</Text>
                </TouchableOpacity>
              </View>

              {/* Just For You Section */}
              <View style={styles.justForYouSection}>
                <Text style={styles.justForYouTitle}>JUST FOR YOU</Text>
                <View style={styles.divider} />
                <View style={styles.dotsContainer}>
                  <Text style={styles.dot}>●</Text>
                  <Text style={styles.dotInactive}>○</Text>
                  <Text style={styles.dotInactive}>○</Text>
                </View>
              </View>

              {/* @TRENDING Section */}
              <View style={styles.container2}>
                <Text style={styles.title2}>@ T R E N D I N G</Text>
                <View style={styles.hashtagContainer2}>
                  {hashtags.map((tag, index) => (
                    <View key={index} style={styles.hashtag2}>
                      <Text style={styles.hashtagText2}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.card2}>
                  <View style={styles.logo2}>
                    <Text style={[styles.star, { color: 'orange' }]}>✦</Text>
                    <Text style={styles.brandText2}>Fashion{'\n'}Trend</Text>
                    <Text style={[styles.star, { color: 'blue' }]}>✦</Text>
                  </View>
                  <Text style={styles.subtitle2}>
                    Making a luxurious lifestyle accessible{'\n'}
                    for a generous group of women is our{'\n'}daily drive.
                  </Text>
                  <View style={styles.divider2} />
                  <View style={styles.features2}>
                    {features.map((item, index) => (
                      <View key={index} style={styles.featureItem2}>
                        <Image source={item.icon} style={styles.featureIcon2} />
                        <Text style={styles.featureText2}>{item.text}</Text>
                      </View>
                    ))}
                  </View>
                  <Image source={require('../../assets/icons/deco.png')} style={styles.footerDeco2} />
                </View>
              </View>

              {/* FOLLOW US Section */}
              <View style={styles.followSection3}>
                <Text style={styles.followTitle3}>FOLLOW US</Text>
                <Image source={require('../../assets/icons/instagram.png')} style={styles.socialIconLarge3} />
                <View style={styles.profileRow3}>
                  <View style={styles.profileCard3}>
                    <Image source={require('../../assets/images/ando.jpg')} style={styles.profileImage3} />
                    <Text style={styles.profileName3}>@ando</Text>
                  </View>
                  <View style={styles.profileCard3}>
                    <Image source={require('../../assets/images/edradan.jpg')} style={styles.profileImage3} />
                    <Text style={styles.profileName3}>@edradan</Text>
                  </View>
                </View>
                <View style={styles.footerContainer3}>
                  <View style={styles.footerIcons3}>
                    <Image source={require('../../assets/icons/twitter.png')} style={styles.footerIcon3} />
                    <Image source={require('../../assets/icons/instagram2.png')} style={styles.footerIcon3} />
                    <Image source={require('../../assets/icons/youtube.png')} style={styles.footerIcon3} />
                  </View>
                  <View style={styles.footerDivider3} />
                  <Text style={styles.footerText3}>support@fashion.trend</Text>
                  <Text style={styles.footerText3}>+63 912 3456 789</Text>
                  <Text style={styles.footerText3}>08:00 - 22:00 - Everyday</Text>
                  <View style={styles.footerDivider3} />
                  <View style={styles.footerLinks3}>
                    <Text style={styles.footerLink3}>About</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
                      <Text style={styles.footerLink3}>Contact</Text>
                    </TouchableOpacity>

                    <Text style={styles.footerLink3}>Blog</Text>
                  </View>
                  <Text style={styles.copyText3}>
                    Copyright© fashion.trend All Rights Reserved.
                  </Text>
                </View>
              </View>
            </>
          }
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNavWrapper}>
        <BottomNavBar active="Bag" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Layouts
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wrapper: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 100 },
  bottomNavWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },

  // Navbar
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E8ECF4',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 10 },
  logoLine1: { fontFamily: 'IslandMoments', fontSize: 18, lineHeight: 20 },
  logoLine2: { fontFamily: 'IslandMoments', fontSize: 20, lineHeight: 18, marginTop: -5 },
  navIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  // Banner
  banner: {
    marginTop: -10,
    width: '100%',
    height: 620,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  bannerText: {
    fontSize: 38,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: 'BodoniModa',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 150,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    width: 253,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: -150,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'TenorSans',
    fontSize: 16,
  },

  // Categories
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'TenorSans',
    letterSpacing: 2,
    marginVertical: 30,
  },
  categoryContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  categoryText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#999',
    fontFamily: 'TenorSans',
  },
  activeCategory: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  // Grid
  grid: { paddingBottom: 50 },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    maxWidth: '48%',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productName: {
    paddingHorizontal: 8,
    paddingTop: 8,
    fontSize: 13,
    fontFamily: 'TenorSans',
    minHeight: 40,
  },
  price: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    fontSize: 14,
    fontFamily: 'TenorSans',
    fontWeight: 'bold',
    color: '#8A2BE2',
  },

  // Collections
  collectionsSection: { marginTop: 15, alignItems: 'center', paddingHorizontal: 20 },
  collectionsTitle: {
    fontSize: 22,
    fontFamily: 'TenorSans',
    letterSpacing: 2,
    marginBottom: 20,
  },
  collectionBanner: { width: '100%', height: 200, justifyContent: 'flex-end' },
  offerOverlay: { position: 'absolute', right: 20, bottom: 20, alignItems: 'flex-end' },
  offerText: { fontSize: 18, color: '#fff', fontFamily: 'TenorSans' },
  offerPercent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'TenorSans',
  },
  buyNowBtn: {
    backgroundColor: '#f97316',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 10,
  },
  buyNowText: { color: '#fff', fontFamily: 'TenorSans', fontSize: 16 },

  // Trending
  trendingTitle: {
    fontSize: 18,
    fontFamily: 'TenorSans',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
  },
  trendingDesc: {
    fontSize: 14,
    fontFamily: 'Itim',
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
  },
  trendingGrid: { flexDirection: 'row', gap: 10 },
  trendingColumn: { justifyContent: 'space-between' },
  trendingImageLarge: { width: 160, height: 180, borderRadius: 10 },
  trendingImageSmall: { width: 130, height: 85, borderRadius: 10 },
  seeMoreBtn: {
    marginTop: 20,
    borderColor: '#f97316',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  seeMoreText: {
    fontFamily: 'TenorSans',
    fontSize: 16,
    color: '#f97316',
  },

  // Just For You
  justForYouSection: { marginTop: 10, alignItems: 'center', padding: 20 },
  justForYouTitle: { fontSize: 18, fontFamily: 'TenorSans', letterSpacing: 2 },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#aaa',
    marginVertical: 10,
  },
  dotsContainer: { flexDirection: 'row', marginTop: 10 },
  dot: { fontSize: 10, marginHorizontal: 3, color: '#000' },
  dotInactive: { fontSize: 10, marginHorizontal: 3, color: '#aaa' },

  // Brands
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10,
  },
  brand: { fontSize: 16, fontFamily: 'TenorSans', marginHorizontal: 10, marginVertical: 5 },
  brandItalic: {
    fontSize: 18,
    fontFamily: 'IslandMoments',
    marginHorizontal: 10,
    marginVertical: 5,
  },

  // Footer & Follow Us
  followSection3: { backgroundColor: '#fff', alignItems: 'center' },
  followTitle3: { fontSize: 16, letterSpacing: 4, marginBottom: 10, fontFamily: 'TenorSans-Regular' },
  socialIconLarge3: { width: 24, height: 24, marginBottom: 20 },
  profileRow3: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 20 },
  profileCard3: { alignItems: 'center', position: 'relative' },
  profileImage3: { width: 120, height: 120, borderRadius: 6 },
  profileName3: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 4,
    fontFamily: 'TenorSans-Regular',
  },
  footerContainer3: {
    backgroundColor: '#f0f4c4',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 16,
  },
  footerIcons3: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  footerIcon3: { width: 20, height: 20 },
  footerDivider3: { width: 20, height: 1, backgroundColor: '#aaa', marginVertical: 10 },
  footerText3: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'TenorSans-Regular',
    textAlign: 'center',
  },
  footerLinks3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 12,
  },
  footerLink3: {
    fontSize: 14,
    fontFamily: 'TenorSans-Regular',
    color: '#222',
  },
  copyText3: {
    fontSize: 12,
    marginTop: 18,
    color: '#666',
    fontFamily: 'TenorSans-Regular',
  },

  // Section 2 (Hashtags + Features)
  container2: { padding: 20, backgroundColor: '#fff' },
  title2: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'TenorSans-Regular',
    marginBottom: 20,
    letterSpacing: 4,
  },
  hashtagContainer2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  hashtag2: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 4,
  },
  hashtagText2: { fontSize: 13, color: '#333', fontFamily: 'TenorSans-Regular' },

  card2: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logo2: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  star2: { width: 18, height: 18, marginHorizontal: 8 },
  brandText2: {
    fontSize: 18,
    fontFamily: 'BodoniModa',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle2: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 12,
    fontFamily: 'TenorSans-Regular',
  },
  divider2: { width: 20, height: 1, backgroundColor: '#ccc', marginVertical: 14 },
  features2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
    columnGap: 10,
    marginBottom: 16,
  },
  featureItem2: { width: '45%', alignItems: 'center' },
  featureIcon2: { width: 38, height: 54, marginBottom: 8, resizeMode: 'contain' },
  featureText2: {
    textAlign: 'center',
    fontSize: 13,
    color: '#444',
    fontFamily: 'TenorSans-Regular',
    lineHeight: 20,
  },
  footerDeco2: { width: 80, height: 80, resizeMode: 'contain', marginTop: 10 },

  // New styles for loading/error/empty messages
  centerStatus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
    marginBottom: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default Home;
