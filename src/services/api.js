import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockProducts, getMockProductById } from '../data/products'; // Import mock data

// IMPORTANT: Replace with your actual backend API URL
const API_BASE_URL = 'YOUR_ACTUAL_BACKEND_API_URL_HERE';

const ADMIN_PRODUCTS_KEY = 'admin_products'; // Key used by admin panel

const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('userToken');
    } catch (e) {
        console.error("Failed to get auth token from storage", e);
        return null;
    }
};

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = await getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to ${url}`); // Debug log

    try {
        const response = await fetch(url, config);
        const responseData = await response.json();

        console.log(`Response from ${url}:`, response.status, responseData); // Debug log

        if (!response.ok) {
            // Throw an error object that includes the status and message from backend if available
            throw {
                status: response.status,
                message: responseData?.message || 'API request failed',
                errors: responseData?.errors // Include validation errors if backend provides them
            };
        }

        return responseData;
    } catch (error) {
        console.error(`API Error during ${method} request to ${url}:`, error);
        // Re-throw the structured error or a generic one
        throw error.status ? error : { message: 'Network request failed or backend unavailable.' };
    }
};

// Example specific functions (can be expanded)
export const loginUser = (credentials) => apiRequest('/auth/login', 'POST', credentials);
export const registerUser = (userData) => apiRequest('/auth/register', 'POST', userData);

// --- Product API Functions ---
export const fetchProducts = async () => {
    console.log("[Client API] Attempting to fetch products...");
    try {
        const storedProductsString = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
        if (storedProductsString) {
            const storedProducts = JSON.parse(storedProductsString);
            if (storedProducts && storedProducts.length > 0) {
                console.log("[Client API] Loaded products from AsyncStorage (admin_products).");
                return storedProducts;
            }
        }
        console.log("[Client API] No admin_products in AsyncStorage or empty, falling back to mockProducts.");
        // Fallback to mockProducts if nothing in AsyncStorage or if it's empty
        // Optionally, you could also save mockProducts to ADMIN_PRODUCTS_KEY here if it was empty,
        // but admin panel already does this on dashboard load if key is missing.
        return mockProducts;
    } catch (error) {
        console.error("[Client API] Error fetching products from AsyncStorage, falling back to mockProducts:", error);
        return mockProducts; // Fallback in case of any error during AsyncStorage read
    }
};

export const fetchProductById = async (id) => {
    console.log(`[Client API] Attempting to fetch product by id: ${id}`);
    try {
        const allProducts = await fetchProducts(); // This will now prioritize AsyncStorage
        const product = allProducts.find(p => p.id.toString() === id.toString());
        if (product) {
            console.log("[Client API] Found product by ID.");
            return { success: true, data: product };
        } else {
            console.log("[Client API] Product not found by ID after checking potential AsyncStorage source.");
            return { success: false, message: 'Product not found' };
        }
    } catch (error) {
        console.error(`[Client API] Error in fetchProductById for id ${id}:`, error);
        return { success: false, message: 'Failed to fetch product due to an error' };
    }
};
// --- End Product API Functions ---

// --- Bag API Functions (Placeholders for Online Mode) ---

// Fetches the user's bag from the backend
export const fetchBag = async () => {
  console.warn('fetchBag: Online API not implemented. Using local storage via BagContext.');
  // Example online implementation:
  // return apiRequest('/bag', 'GET');
  return Promise.resolve({ success: false, message: 'Online fetchBag not implemented' });
};

// Adds an item to the bag on the backend
export const addItemToBag = async (productId, quantity) => {
  console.warn('addItemToBag: Online API not implemented. Using local storage via BagContext.');
  // Example online implementation:
  // return apiRequest('/bag/items', 'POST', { productId, quantity });
   return Promise.resolve({ success: false, message: 'Online addItemToBag not implemented' });
};

// Removes an item from the bag on the backend
export const removeItemFromBag = async (itemId) => {
  console.warn('removeItemFromBag: Online API not implemented. Using local storage via BagContext.');
  // Example online implementation:
  // return apiRequest(`/bag/items/${itemId}`, 'DELETE');
   return Promise.resolve({ success: false, message: 'Online removeItemFromBag not implemented' });
};

// Updates item quantity in the bag on the backend
export const updateBagItemQuantity = async (itemId, quantity) => {
  console.warn('updateBagItemQuantity: Online API not implemented. Using local storage via BagContext.');
  // Example online implementation:
  // return apiRequest(`/bag/items/${itemId}`, 'PUT', { quantity });
   return Promise.resolve({ success: false, message: 'Online updateBagItemQuantity not implemented' });
};

// --- End Bag API Functions ---

// --- Admin Settings API Functions ---
const ADMIN_LOW_STOCK_THRESHOLD_KEY = 'admin_settings_low_stock_threshold';
const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export const getLowStockThreshold = async () => {
    try {
        const thresholdString = await AsyncStorage.getItem(ADMIN_LOW_STOCK_THRESHOLD_KEY);
        if (thresholdString !== null) {
            const threshold = parseInt(thresholdString, 10);
            if (!isNaN(threshold)) {
                console.log(`[API] Loaded low stock threshold: ${threshold}`);
                return threshold;
            }
            console.warn(`[API] Invalid low stock threshold found in AsyncStorage: ${thresholdString}. Using default.`);
        }
    } catch (error) {
        console.error("[API] Error reading low stock threshold from AsyncStorage:", error);
    }
    console.log(`[API] No low stock threshold set or error reading. Using default: ${DEFAULT_LOW_STOCK_THRESHOLD}`);
    return DEFAULT_LOW_STOCK_THRESHOLD;
};

export const setLowStockThreshold = async (threshold) => {
    try {
        const numericThreshold = parseInt(threshold, 10);
        if (isNaN(numericThreshold) || numericThreshold < 0) {
            console.error('[API] Invalid threshold value. Must be a non-negative number.', threshold);
            return { success: false, message: 'Invalid threshold value. Must be a non-negative number.' };
        }
        await AsyncStorage.setItem(ADMIN_LOW_STOCK_THRESHOLD_KEY, numericThreshold.toString());
        console.log(`[API] Low stock threshold saved: ${numericThreshold}`);
        return { success: true, message: 'Low stock threshold saved successfully.' };
    } catch (error) {
        console.error("[API] Error saving low stock threshold to AsyncStorage:", error);
        return { success: false, message: 'Failed to save low stock threshold.' };
    }
};

// --- End Admin Settings API Functions ---

// Add other specific API call functions here as needed (e.g., fetchProfile, fetchOrders) 