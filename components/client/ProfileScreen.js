import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Navbar from '../../navigation/navBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../../navigation/BottomNavBar';

export default function ProfileScreen({ navigation }) {
  const [editable, setEditable] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Donalyn',
    fullName: 'Donalyn Ando',
    email: 'dando@ssct.edu.ph',
    address: 'Surigao City, Philippines',
    mobile: '09123456789',
  });

  const [profileImage, setProfileImage] = useState(
    require('../../assets/images/ando.jpg') // default profile photo
  );

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Profile</Text>

        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Image source={profileImage} style={styles.avatar} />
          <Text style={styles.changePhoto}>Tap to change photo</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={profile.firstName}
            editable={editable}
            onChangeText={(text) => handleChange('firstName', text)}
          />

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profile.fullName}
            editable={editable}
            onChangeText={(text) => handleChange('fullName', text)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            editable={editable}
            onChangeText={(text) => handleChange('email', text)}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={profile.address}
            editable={editable}
            onChangeText={(text) => handleChange('address', text)}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={profile.mobile}
            editable={editable}
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange('mobile', text)}
          />

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditable(!editable)}
          >
            <Text style={styles.editButtonText}>
              {editable ? 'Save Profile' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNavWrapper}>
        <BottomNavBar active="Bag" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
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
