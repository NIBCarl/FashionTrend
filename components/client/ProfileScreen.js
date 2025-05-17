import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../../navigation/BottomNavBar';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default image
const defaultProfileImage = require('../../assets/images/ando.jpg');

export default function ProfileScreen({ navigation }) {
  const { loggedInUserEmail } = useAuth();
  
  const [editable, setEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // State for saving process

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!loggedInUserEmail) {
        console.log("No logged in user email found");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const userDataString = await AsyncStorage.getItem(`user_${loggedInUserEmail}`);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setProfileData({
            firstName: userData.name?.split(' ')[0] || '',
            fullName: userData.name || '',
            email: loggedInUserEmail,
            address: userData.address || '',
            mobile: userData.mobile || '',
          });
          // Load profile image URI if it exists
          if (userData.profileImageUri) {
            setProfileImage({ uri: userData.profileImageUri });
          } else {
            setProfileImage(defaultProfileImage); // Reset to default if no URI saved
          }
          console.log("Profile data loaded for:", loggedInUserEmail, userData);
        } else {
          console.error("No profile data found in storage for:", loggedInUserEmail);
          Alert.alert("Error", "Could not load profile data.");
          setProfileData({ firstName: '', fullName: '', email: loggedInUserEmail, address: '', mobile: '' });
          setProfileImage(defaultProfileImage);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        Alert.alert("Error", "Failed to load profile data.");
        setProfileData({ firstName: '', fullName: '', email: loggedInUserEmail, address: '', mobile: '' });
        setProfileImage(defaultProfileImage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [loggedInUserEmail]);

  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // Function to save profile data (including image URI)
  const saveProfileData = async (dataToSave) => {
    if (!loggedInUserEmail) return false;
    setIsSaving(true);
    try {
      const currentDataString = await AsyncStorage.getItem(`user_${loggedInUserEmail}`);
      const currentData = currentDataString ? JSON.parse(currentDataString) : {};
      
      // Merge new data with existing data
      const updatedUserData = {
        ...currentData,
        ...dataToSave // Overwrite/add fields from dataToSave
      };

      await AsyncStorage.setItem(`user_${loggedInUserEmail}`, JSON.stringify(updatedUserData));
      console.log("Profile data saved for", loggedInUserEmail, updatedUserData);
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to save profile data:", error);
      Alert.alert("Error", "Failed to save profile.");
      return false; // Indicate failure
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving text fields when exiting edit mode
  const handleSaveProfile = async () => {
    if (!profileData) return;
    const success = await saveProfileData({
      name: profileData.fullName, // Save full name
      address: profileData.address, // Save address
      mobile: profileData.mobile, // Save mobile
      // profileImageUri is saved separately in pickImage
    });
    if (success) {
      Alert.alert("Success", "Profile updated locally");
      setEditable(false); // Exit edit mode
    }
  };

  // Handle image picking and saving URI
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Specify images
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setProfileImage({ uri: imageUri }); // Update display immediately
      
      // Save the new URI to AsyncStorage
      await saveProfileData({ profileImageUri: imageUri });
      // Optionally show a success message for image update
      // Alert.alert("Success", "Profile photo updated."); 
    }
  };

  // Combine loading states
  const isBusy = isLoading || isSaving;

  if (isLoading) { // Initial load check
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </SafeAreaView>
    );
  }

  if (!profileData) { // Check if data loaded successfully
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <Text>Could not load profile. Please try logging out and back in.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Profile</Text>

        {/* Disable changing photo while saving */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={isBusy}>
          <Image source={profileImage} style={styles.avatar} />
          <Text style={styles.changePhoto}>Tap to change photo</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          {/* Fields - Disable based on isBusy state */}
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.firstName}
            editable={editable && !isBusy}
            onChangeText={(text) => handleChange('firstName', text)}
          />

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.fullName}
            editable={editable && !isBusy}
            onChangeText={(text) => handleChange('fullName', text)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profileData.email}
            editable={false} // Email not editable
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={profileData.address}
            placeholder="Enter your address"
            editable={editable && !isBusy}
            onChangeText={(text) => handleChange('address', text)}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.mobile}
            placeholder="Enter your mobile number"
            editable={editable && !isBusy}
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange('mobile', text)}
          />

          {/* Edit/Save Button - Disable based on isBusy state */}
          <TouchableOpacity
            style={[styles.editButton, isBusy && styles.buttonDisabled]} // Add disabled style
            disabled={isBusy}
            onPress={() => {
              if (editable) {
                handleSaveProfile();
              } else {
                setEditable(true);
              }
            }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.editButtonText}>
                {editable ? 'Save Profile' : 'Edit Profile'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNavWrapper}>
        <BottomNavBar active="Profile" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  changePhoto: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  form: {
    backgroundColor: '#fce0e5',
    padding: 20,
    borderRadius: 16,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  editButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center', // Center content (for ActivityIndicator)
    minHeight: 45, // Ensure height for indicator
  },
  buttonDisabled: { // Style for disabled button
    backgroundColor: '#cccccc'
  },
  editButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNavWrapper: {
    backgroundColor: '#fff',
  },
});
