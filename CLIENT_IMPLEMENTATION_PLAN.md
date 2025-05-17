# FashionTrend: Client-Side **Offline** Functionality Implementation Plan

This document outlines the plan to implement the **fully offline** client-side features for the FashionTrend React Native application, using local device storage (AsyncStorage) and mock data.

## 1. Goal

To transform the existing client-side structure into a fully operational **offline application** where users can authenticate, browse mock products, manage their shopping bag, view profiles and simulated order history, and complete a simulated checkout process, all using data stored locally on the device.

## 2. Crucial Dependency: Local Storage & Mock Data

**This application will operate entirely offline.** Functionality relies on:
*   **AsyncStorage:** For storing user credentials, profile information, shopping bag contents, and simulated order history.
*   **Mock Data:** Predefined data for products (`src/data/products.js`) and potentially for simulated orders.
*   **No Backend API:** No interaction with an online backend is required or planned.

## 3. Prerequisites & Setup

*   **State Management:** React Context API + AsyncStorage are used for:
    *   Authentication status (`loggedInUserEmail`).
    *   Local user credentials and profile data (`user_{email}` key storing name, **hashed password (TODO!)**, address, mobile, profileImageUri).
    *   Shopping Bag contents (`shoppingBag` key).
    *   Simulated Order History (`orders_{email}` key - TBD).
*   **API Service:** The service module (`src/services/api.js`) primarily serves mock data or interacts with AsyncStorage. Online API call functions can be removed or kept as placeholders.
*   **Mock Data Files:** `src/data/products.js` is essential. Mock order data structure needs definition if implementing Phase 5.

## 4. Implementation Phases

### Phase 1: Offline Authentication Flow (✅ Complete - Hashing Skipped)

*   **Goal:** Enable user registration, login, logout using local device storage (AsyncStorage).
*   **Status:** Implemented. Users can register, login, logout offline. Data is stored locally. `RootNavigator` handles auth state.
*   **Note:** Password hashing has been intentionally skipped for this implementation. Storing plain text passwords is a security risk.

### Phase 4: Profile Management (Local Storage) - COMPLETE (Local)

*   **Screen:** `ProfileScreen.js`, `CustomDrawer.js` (for display)
*   **Goal:** Allow users to view and update their profile information (name, email, address, mobile, profile picture).
*   **Steps:**
    *   **[COMPLETED]** Use `AuthContext` to get the logged-in user's email.
    *   **[COMPLETED]** Fetch user details (name, email initially) from AsyncStorage (`user_{email}`).
    *   **[COMPLETED]** Implement UI for displaying profile info.
    *   **[COMPLETED]** Implement image picker (`expo-image-picker`) for profile picture update.
    *   **[COMPLETED]** Save updated profile picture URI, address, and mobile number back to AsyncStorage (`user_{email}`).
    *   **[COMPLETED]** Update `CustomDrawer.js` to display dynamic name/email/picture.
*   **State:** Local component state, `AuthContext`, AsyncStorage.
*   **Dependencies:** `expo-image-picker`, AsyncStorage.

### Phase 2: Product Browsing & Display (✅ Complete - Mock Data)

*   **Goal:** Fetch and display mock product lists and details, allow adding to bag.
*   **Status:** Implemented using mock data. `Home.js` displays products and navigates to `ProductDetailScreen`. `ProductDetailScreen` displays details fetched via mock `fetchProductById` and includes an "Add to Bag" button linked to `BagContext`.
*   **Dependency:** Uses `src/data/products.js`.
*   **How:** Mock data service functions, `Home.js`, `ProductDetailScreen.js`, `BagContext` integration.
*   **Testing:** Verify navigation, display, and "Add to Bag" functionality using mock data.

### Phase 3: Shopping Bag Functionality (✅ Complete - Local Storage)

*   **Goal:** Allow users to add/view/modify items in their bag using local storage.
*   **Status:** Implemented. `BagContext` manages state with `AsyncStorage`. `BagScreen` displays items, total, and allows modification/removal. Items can be added via `ProductDetailScreen`.
*   **How:** `BagContext`, `AsyncStorage` (`shoppingBag` key), `BagScreen.js`.
*   **Dependency:** `ProductDetailScreen` for adding items.
*   **Testing:** Verify full bag lifecycle (add, view, update, remove) using local storage.

### Phase 5: Order History (Local Storage) - COMPLETE (Local)

*   **Screen:** `OrderHistoryScreen.js`
*   **Goal:** Display a list of past orders placed by the user.
*   **Steps:**
    *   **[COMPLETED]** Use `AuthContext` to get the logged-in user's email.
    *   **[COMPLETED]** Fetch order history from AsyncStorage (`orders_{email}`).
    *   **[COMPLETED]** Implement UI to display orders (order ID, date, total, items).
    *   **[COMPLETED]** Handle empty state and loading indicator.
*   **State:** Local component state, `AuthContext`, AsyncStorage.
*   **Dependencies:** AsyncStorage.

### Phase 6: Static Contact Screen - COMPLETE (Static)

*   **Screen:** `Contact.js`
*   **Goal:** Display static contact information (address, phone, email, social media links).
*   **Steps:**
    *   **[COMPLETED]** Remove previous form elements.
    *   **[COMPLETED]** Add static text and icons for address, phone, email.
    *   **[COMPLETED]** Use `Linking` API for tappable phone/email.
    *   **[COMPLETED]** Add links to social media profiles.
*   **State:** None (Static).
*   **Dependencies:** `react-native-vector-icons`, `react-native > Linking`.

### Phase 7: Checkout Simulation (Local Storage) - COMPLETE (Simulated)

*   **Screen:** `BagScreen.js` (Trigger)
*   **Goal:** Simulate the checkout process by saving the current bag as an order.
*   **Steps:**
    *   **[COMPLETED]** Add a "Checkout" / "Place Order" button to `BagScreen.js`.
    *   **[COMPLETED]** On press, construct an order object (unique ID, timestamp, items, total).
    *   **[COMPLETED]** Append the new order to the list stored in AsyncStorage (`orders_{email}`).
    *   **[COMPLETED]** Clear the shopping bag using `BagContext`.
    *   **[COMPLETED]** Navigate to `OrderHistoryScreen` or show a confirmation message.
*   **State:** `BagContext`, AsyncStorage.
*   **Dependencies:** AsyncStorage, `uuid` (or similar for ID generation - *currently using timestamp*).

### Phase 8: Client-Side Product Search (Mock Data) - COMPLETE

*   **Goal:** Allow users to search for products within the mock product list.
*   **Screen:** `components/client/SearchScreen.js`.
*   **Functionality:**
    *   **[COMPLETED]** Added a `TextInput` for the search query.
    *   **[COMPLETED]** Fetches all mock products using `fetchProducts` from `src/services/api.js`.
    *   **[COMPLETED]** Filters the products based on the search term (name/description, case-insensitive).
    *   **[COMPLETED]** Displays the filtered results in a `FlatList` (2 columns).
    *   **[COMPLETED]** Handles the case where no results are found (with icon and message).
    *   **[COMPLETED]** Allows navigation from a search result item to `ProductDetailScreen`.
*   **Navigation:** **[COMPLETED]** Search icon in `navigation/navBar.js` now navigates to `SearchClient` screen. Shopping bag icon also navigates to `BagScreen`.
*   **State:** Local component state for search term and filtered products.
*   **Dependencies:** `src/services/api.js`, `src/data/products.js`, Navigation, `react-native-vector-icons/Ionicons`.

## 5. General Implementation Notes

*   **Password Hashing:** Intentionally skipped for Phase 1.
*   **Error Handling:** Consistent handling for AsyncStorage operations.
*   **Loading States:** Use loading indicators for potentially slow AsyncStorage reads (like initial bag/order load).
*   **Code Structure:** Maintain clean structure.
*   **Data Management:** Carefully manage AsyncStorage keys (e.g., naming conventions like `user_{email}`, `shoppingBag`, `orders_{email}`).

--- 