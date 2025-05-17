import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { IslandMoments_400Regular } from "@expo-google-fonts/island-moments";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import SignInModal from "./components/auth/SignInModal";
import Dashboard from "./components/admin/Dashboard";
import AdminDrawer from "./navigation/AdminDrawer";
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");

const StarIcon = ({ color, style }) => (
  <Animated.View style={style}>
    <Svg width={56} height={96} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2l2.09 6.26H21l-5.34 4.14 2.09 6.26L12 14.52l-5.75 4.14 2.09-6.26L3 8.26h6.91z" />
    </Svg>
  </Animated.View>
);

const FashionTrendScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    IslandMoments: IslandMoments_400Regular,
    Itim: Itim_400Regular,
  });

  const [showMainScreen, setShowMainScreen] = useState(false);
  const fadeAnim = new Animated.Value(1);
  const translateYAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setShowMainScreen(true));
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (!showMainScreen) {
    return (
      <View style={styles.splashContainer}>
        <StarIcon
          color="#ff8000"
          style={{ transform: [{ translateY: translateYAnim }], opacity: fadeAnim }}
        />
        <Text style={styles.splashText}>Fashion Trend</Text>
        <StarIcon
          color="#0066ff"
          style={{ transform: [{ translateY: translateYAnim }], opacity: fadeAnim }}
        />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View onLayout={onLayoutRootView} style={styles.mainContainer}>
        <View style={styles.titleContainer}>
          <StarIcon color="#ff8000" style={styles.starLeft} />
          <Text style={styles.title}>Fashion {"\n"} Trend</Text>
          <StarIcon color="#0066ff" style={styles.starRight} />
        </View>

        <Text style={styles.subtitle}>Log In{"\n"} as</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignInModal")}
        >
          <Text style={styles.buttonText}>Client</Text>
        </TouchableOpacity>
        {/* ADMIN TEXT */}
        <TouchableOpacity onPress={() => navigation.navigate("AdminSignInModal")}>
        <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  splashText: {
    fontSize: 40,
    fontFamily: "IslandMoments",
    color: "#000",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 50,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 50,
    fontFamily: "IslandMoments",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 30,
    fontFamily: "Itim",
    color: "#000",
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#a64dff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontFamily: "Itim",
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  adminText: {
    marginTop: 15,
    fontSize: 20,
    fontFamily: "Itim",
    textDecorationLine: "underline",
    color: "#000",
  },
  starLeft: {
    position: "absolute",
    left: -50,
  },
  starRight: {
    position: "absolute",
    right: -50,
  },
});

export default FashionTrendScreen;
