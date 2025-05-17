import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BAG_STORAGE_KEY = 'shoppingBag';

// Create Context
const BagContext = createContext();

// Create Provider Component
export const BagProvider = ({ children }) => {
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bag from storage on initial mount
  useEffect(() => {
    const loadBag = async () => {
      setLoading(true);
      try {
        const storedBag = await AsyncStorage.getItem(BAG_STORAGE_KEY);
        if (storedBag) {
          setBagItems(JSON.parse(storedBag));
        } else {
          setBagItems([]); // Initialize empty if nothing stored
        }
      } catch (error) {
        console.error('Failed to load bag from storage:', error);
        setBagItems([]); // Default to empty on error
      } finally {
        setLoading(false);
      }
    };

    loadBag();
  }, []);

  // Persist bag to storage whenever it changes
  useEffect(() => {
    const saveBag = async () => {
      // Don't save during initial load
      if (!loading) {
        try {
          await AsyncStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
        } catch (error) {
          console.error('Failed to save bag to storage:', error);
        }
      }
    };

    saveBag();
  }, [bagItems, loading]);

  // Add item to bag (or increase quantity if exists)
  const addItem = (product, quantity = 1) => {
    setBagItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        // Increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }];
      }
    });
     console.log("Item added to bag:", product.name, "Qty:", quantity);
  };

  // Remove item from bag
  const removeItem = (productId) => {
    setBagItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.id !== productId);
        console.log("Item removed from bag, ID:", productId);
        return updatedItems;
    });
  };

  // Update quantity of an item
  const updateItemQuantity = (productId, newQuantity) => {
    setBagItems(prevItems => {
      if (newQuantity <= 0) {
        // If quantity drops to 0 or less, remove the item
        return prevItems.filter(item => item.id !== productId);
      } else {
        // Otherwise, update the quantity
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }
    });
    console.log("Item quantity updated, ID:", productId, "New Qty:", newQuantity);
  };

  // Clear the entire bag
  const clearBag = () => {
    setBagItems([]);
    console.log("Bag cleared.");
    // AsyncStorage will be updated by the useEffect hook
  };

  // Calculate total price
  const totalPrice = bagItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Value provided by the context
  const value = {
    bagItems,
    loading,
    addItem,
    removeItem,
    updateItemQuantity,
    clearBag,
    totalPrice,
    itemCount: bagItems.reduce((count, item) => count + item.quantity, 0), // Total number of items
  };

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
};

// Custom hook to use the BagContext
export const useBag = () => {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
}; 