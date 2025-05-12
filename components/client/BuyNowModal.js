import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default function BuyNowModal({ visible, onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    // Handle add to cart logic
    console.log('Product added:', { ...product, quantity, note });
    onClose(); // close modal after action
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
        <Image source={product.image} style={styles.image} resizeMode="cover" />

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>Php {product.price.toLocaleString()}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Order</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity onPress={decreaseQty}><Text style={styles.qtyBtn}>-</Text></TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQty}><Text style={styles.qtyBtn}>+</Text></TouchableOpacity>
            </View>
          </View>

          <TextInput
            value={note}
            onChangeText={setNote}
            style={styles.noteInput}
            placeholder="Note"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.addToCart} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to cart - Php {(product.price * quantity).toLocaleString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 20,
    marginTop: 10,
    color: '#222',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 18,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyBtn: {
    fontSize: 24,
    paddingHorizontal: 12,
    color: '#000',
  },
  qtyText: {
    fontSize: 18,
  },
  noteInput: {
    width: '100%',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 15,
  },
  addToCart: {
    backgroundColor: '#ff2d2d',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeText: {
    marginTop: 10,
    color: '#555',
    textDecorationLine: 'underline',
  },
});
