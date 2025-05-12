import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LogoutModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Are you sure you want{'\n'}to Logout?</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={onConfirm}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    width: '75%',
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff7a00',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 12,
    width: '100%',
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
  },
  cancelText: {
    textAlign: 'center',
    color: '#ff4d4d',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
