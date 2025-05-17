import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Context
export const AuthContext = createContext();

// Storage Keys
const LOGGED_IN_USER_KEY = 'loggedInUserEmail';
const ADMIN_LOGGED_IN_KEY = 'isAdminLoggedInStatus'; // New key for admin status

// Provider Component - Modified for Offline Auth
export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loggedInUserEmail, setLoggedInUserEmail] = useState(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // New admin state
    const [error, setError] = useState(null);

    // Function to update client login state and storage
    const setLoginState = async (email) => {
        try {
            if (email) {
                await AsyncStorage.setItem(LOGGED_IN_USER_KEY, email);
                setLoggedInUserEmail(email);
                console.log("[AuthContext] Client login state set for:", email);
            } else {
                await AsyncStorage.removeItem(LOGGED_IN_USER_KEY);
                setLoggedInUserEmail(null);
                console.log("[AuthContext] Client login state cleared.");
            }
            // setError(null); // Clear errors on successful state change - moved to individual functions
        } catch (e) {
            console.error("[AuthContext] Failed to set client login state in storage", e);
            setError("Failed to update client session state.");
        }
    };

    // Function to update admin login state and storage
    const setAdminLoginState = async (isAdmin) => {
        try {
            if (isAdmin) {
                await AsyncStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
                setIsAdminLoggedIn(true);
                console.log("[AuthContext] Admin login state SET.");
            } else {
                await AsyncStorage.removeItem(ADMIN_LOGGED_IN_KEY);
                setIsAdminLoggedIn(false);
                console.log("[AuthContext] Admin login state CLEARED.");
            }
        } catch (e) {
            console.error("[AuthContext] Failed to set admin login state in storage", e);
            setError("Failed to update admin session state.");
        }
    };

    // Client Login function
    const login = async (email) => {
        setIsLoading(true);
        setError(null);
        await setLoginState(email); // Update state/storage
        setIsLoading(false);
    };

    // Admin Login function
    const adminLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        // Hardcoded admin credentials
        if (email.toLowerCase() === 'admin@fashion.com' && password === 'admin123') {
            await setAdminLoginState(true); // Set admin as logged in
            await setLoginState(null);      // Ensure client is logged out
            setIsLoading(false);
            console.log("[AuthContext] Admin login successful for:", email);
            return true;
        } else {
            setError("Invalid admin credentials.");
            setIsLoading(false);
            console.log("[AuthContext] Admin login failed for:", email);
            return false;
        }
    };

    // Register function (context doesn't need to do much, logic in modal)
    const register = async (userData) => {
        console.log("[AuthContext] Registration attempted (handled in modal):", userData);
    };

    // Client Logout function
    const logout = async () => {
        setIsLoading(true);
        setError(null);
        await setLoginState(null); // Clear email and remove from storage
        setIsLoading(false);
        console.log("[AuthContext] Client logout executed.");
    };

    // Admin Logout function
    const adminLogout = async () => {
        setIsLoading(true);
        setError(null);
        await setAdminLoginState(false);
        setIsLoading(false);
        console.log("[AuthContext] Admin logout executed.");
    };

    // Check login status on initial mount
    const checkLoginStatus = async () => {
        setIsLoading(true);
        try {
            const clientEmail = await AsyncStorage.getItem(LOGGED_IN_USER_KEY);
            const adminStatus = await AsyncStorage.getItem(ADMIN_LOGGED_IN_KEY);

            if (adminStatus === 'true') {
                setIsAdminLoggedIn(true);
                setLoggedInUserEmail(null); // Ensure client not logged in if admin is
                console.log("[AuthContext] Initial check: Admin is logged in.");
            } else {
                setIsAdminLoggedIn(false);
                // Only set client email if admin is not logged in
                setLoggedInUserEmail(clientEmail);
                console.log("[AuthContext] Initial check: Admin NOT logged in. Client email:", clientEmail ? clientEmail : 'none');
            }
        } catch (e) {
            console.error("[AuthContext] Failed to check login status:", e);
            setError('Failed to load session');
            setLoggedInUserEmail(null);
            setIsAdminLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            isLoading, 
            loggedInUserEmail,
            isAdminLoggedIn, // Added admin state
            error, 
            login,
            logout, 
            register,
            adminLogin,    // Added admin login function
            adminLogout,   // Added admin logout function
            setError,
            clearError: () => setError(null)
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
}; 