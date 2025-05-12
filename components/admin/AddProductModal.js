// components/admin/AddProductModal.js
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';
const AddProductModal = ({ visible, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSize, setSelectedSize] = useState([]);
    const [gender, setGender] = useState('');
    const [category, setCategory] = useState('');

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const genders = ['Male', 'Female', 'Unisex'];

    const toggleSize = (size) => {
        setSelectedSize((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageUpload = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
          if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
            setSelectedImage(response.assets[0].uri);
          }
        });
      };

    return (
        <Modal visible={visible} animationType="slide">
            <ScrollView style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                    <Ionicons name="arrow-back" size={24} color="#1f3e32" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>General Information</Text>

                    <Text style={styles.label}>Name of Product</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholder="Product name"
                    />

                    <Text style={styles.label}>Description Product</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        style={styles.textArea}
                        placeholder="Product description"
                    />

                    <Text style={styles.label}>Size</Text>
                    <Text style={styles.subLabel}>Pick available size</Text>
                    <View style={styles.optionsRow}>
                        {sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[
                                    styles.optionBox,
                                    selectedSize.includes(size) && styles.selectedBox,
                                ]}
                                onPress={() => toggleSize(size)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedSize.includes(size) && styles.selectedText,
                                    ]}
                                >
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Gender</Text>
                    <Text style={styles.subLabel}>Pick available gender</Text>
                    <View style={styles.optionsRow}>
                        {genders.map((g) => (
                            <TouchableOpacity
                                key={g}
                                style={[
                                    styles.optionBox,
                                    gender === g && styles.selectedBox,
                                ]}
                                onPress={() => setGender(g)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        gender === g && styles.selectedText,
                                    ]}
                                >
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.sectionTitle}>Category</Text>
                        <Text style={styles.label}>Product category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Jacket"
                            value={category}
                            onChangeText={setCategory}
                        />
                        <TouchableOpacity style={styles.addCategoryButton}>
                            <Text style={styles.addCategoryText}>Add Category</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.uploadContainer}>
                        <Text style={styles.sectionTitle}>Upload image</Text>
                        <TouchableOpacity onPress={handleImageUpload}>
                            <Image
                                source={
                                    selectedImage
                                        ? { uri: selectedImage }
                                        : require('../../assets/products/productupload.png') // Fallback placeholder image
                                }
                                style={styles.uploadedImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
};

export default AddProductModal;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backText: {
        fontSize: 16,
        marginLeft: 6,
        color: '#1f3e32',
    },
    card: {
        margin: 15,
        padding: 15,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f3e32',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        color: '#1f3e32',
        fontWeight: '600',
    },
    subLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        fontSize: 14,
        color: '#333',
    },
    textArea: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        fontSize: 14,
        height: 100,
        textAlignVertical: 'top',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    optionBox: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedBox: {
        backgroundColor: '#00c800',
        borderColor: '#00c800',
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    selectedText: {
        color: '#fff',
        fontWeight: '600',
    },
    categoryContainer: {
        backgroundColor: '#ddd',
        borderRadius: 20,
        padding: 15,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    label: {
        fontSize: 14,
        color: '#1f3e32',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 10,
    },
    addCategoryButton: {
        backgroundColor: '#00B020',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    addCategoryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    uploadContainer: {
        backgroundColor: '#ddd',
        borderRadius: 20,
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
      },
      uploadedImage: {
        width: 300,
        height: 350,
        borderRadius: 15,
        marginTop: 10,
      },
      
});
