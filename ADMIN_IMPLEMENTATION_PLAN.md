# Admin Panel Implementation Plan (Offline First)

This document outlines the plan to implement the Admin functionality for the FashionTrend application, focusing on offline data storage using AsyncStorage initially.

**Assumptions:**

*   Admin authentication is separate from client authentication.
*   Data (orders, products, users) will be managed locally using AsyncStorage or mock data files (`src/data/products.js`).
*   No backend API integration is required at this stage.

---

**Phase 1: Admin Authentication Setup (Revised) - COMPLETE**

*   **Goal:** Allow a designated admin user to log in using a dedicated modal and access the existing admin screens (`Dashboard`, etc.) via the existing Admin Drawer.
*   **Status:** COMPLETE
*   **Steps:** Implemented `AdminSignInModal.js`, updated `AuthContext` with `isAdminLoggedIn` state and `adminLogin`/`adminLogout` functions using hardcoded credentials and AsyncStorage, updated `App.js` routing.

---

**Phase 2: Admin Dashboard Screen - COMPLETE**

*   **Goal:** Create the main landing screen for logged-in admins, showing key information.
*   **Status:** COMPLETE
*   **Steps:** Created `Dashboard.js`, implemented `loadDashboardData` to scan AsyncStorage for `user_*` and `orders_*` keys, calculate totals, prepare chart data, and display using `react-native-chart-kit`. Fixed initial loading issues.

---

**Phase 3: Order Management - COMPLETE**

*   **Goal:** Allow admins to view all client orders, see details, and update their status using local storage. Status updates also reflect on the client's order history.
*   **Status:** COMPLETE
*   **Steps:**
    1.  **[COMPLETE]** **Create Order List Component:** `src/components/admin/OrdersScreen.js` created.
    2.  **[COMPLETE]** **Fetch All Orders:** Implemented logic to scan AsyncStorage for `orders_*` keys, combine orders, and add customer email/uniqueId.
    3.  **[COMPLETE]** **Display Order List:** Used `FlatList` to display orders with key details and image. Fixed data loading/rendering bugs.
    4.  **[COMPLETE]** **Create Order Detail Component:** `src/components/admin/OrderDetailScreen.js` created.
    5.  **[COMPLETE]** **Navigation:** Implemented stack navigation from `OrdersScreen` to `OrderDetailScreen`, passing order data. Updated `AdminDrawer.js`.
    6.  **[COMPLETE]** **Display Order Details:** `OrderDetailScreen.js` shows full order details (summary, items, status).
    7.  **[COMPLETE]** **Update Status:** Implemented UI and logic in `OrderDetailScreen` to update order status in AsyncStorage. Status updates reflect in client's `OrderHistoryScreen.js` due to shared data and `useFocusEffect`.
    8.  **[COMPLETE]** **Refinement:** Client-side `OrderHistoryScreen.js` updated to display order status.

---

**Phase 4: Product Management (CRUD) - COMPLETE**

*   **Goal:** Allow admins to add, view, edit, and delete products using local storage.
*   **Status:** COMPLETE
*   **Steps:**
    1.  **[COMPLETE]** **Product State Management:** Ensured `admin_products` is initialized in AsyncStorage from `src/data/products.js` if it doesn't exist (via `Dashboard.js`).
    2.  **[COMPLETE]** **Create Product List Component:** `src/components/admin/ProductsScreen.js` created.
    3.  **[COMPLETE]** **Fetch & Display Products:** `ProductsScreen.js` loads products from AsyncStorage and displays them in a `FlatList` with edit/delete options.
    4.  **[COMPLETE]** **Create Product Form Component:** `src/components/admin/ProductEditScreen.js` created with form fields for product details and logic for add/edit modes.
    5.  **[COMPLETE]** **Navigation:** `ProductStackNavigator` created in `navigation/AdminDrawer.js`. `ProductsScreen.js` updated to navigate to `ProductEditScreen` (passing data for edits). "Manage Products" added to admin drawer.
    6.  **[COMPLETE]** **Implement CRUD Logic:**
        *   **Create:** `ProductEditScreen.js` saves new products to AsyncStorage.
        *   **Read:** `ProductsScreen.js` reads products from AsyncStorage.
        *   **Update:** `ProductEditScreen.js` updates existing products in AsyncStorage.
        *   **Delete:** `ProductsScreen.js` deletes products from AsyncStorage with confirmation.
    7.  **[COMPLETE]** **Navigation (Drawer & Stack):** Product management section added to the `AdminDrawer` using a dedicated `StackNavigator` for `ProductsScreen` and `ProductEditScreen`.

---

**Phase 5: User/Customer Management (CRUD) - COMPLETE**

*   **Goal:** Allow admins to Create, Read, Update, and Delete client user/customer accounts using local storage.
*   **Status:** COMPLETE
*   **Steps:**
    1.  **Read Users/Customers (View Only) - COMPLETE**
        *   `src/components/admin/UsersScreen.js` (labeled "Customers") created.
        *   Fetches user data (name, email) from AsyncStorage (keys matching `user_*`).
        *   Displays users in a `FlatList`.
        *   Navigation added to `AdminDrawer`.
    2.  **Update User/Customer Details - COMPLETE**
        *   **UI:** "Edit" button/icon added for each user in `UsersScreen.js`.
        *   **Navigation:** Navigates from `UsersScreen.js` to `UserEditScreen.js`, passing selected user's data.
        *   **Component:** `UserEditScreen.js` created with a form to modify user details (name implemented).
        *   **Logic:** `UserEditScreen.js` saves updated user information to AsyncStorage.
    3.  **Delete User/Customer Account - COMPLETE**
        *   **UI:** "Delete" button/icon added for each user in `UsersScreen.js`.
        *   **Logic:**
            *   Confirmation dialog implemented.
            *   Upon confirmation, `user_{email}` key removed from AsyncStorage.
    4.  **Create User/Customer Account (Admin-side) - COMPLETE**
        *   **UI:** "Add New User/Customer" button added on `UsersScreen.js` header.
        *   **Navigation:** Navigates to `UserCreateScreen.js`.
        *   **Component:** `UserCreateScreen.js` created with fields for new user details (name, email, password). Password stored as `passwordHash`.
        *   **Logic:** Saves new user to a new `user_{email.toLowerCase()}` key in AsyncStorage. Client login (`SignInModal.js`) updated to use lowercase email and expect `passwordHash`.

---

**Phase 6: Admin Search Functionality - COMPLETE**

*   **Goal:** Implement search functionality within the admin panel.
*   **Status:** COMPLETE
*   **Details:** Implemented a global search accessible from the Dashboard header. Search covers Products (name, category, description, tags), Orders (ID, customer email, status), and Customers/Users (name, email). Results are displayed on a dedicated screen, grouped by type, with navigation to detail/edit views.
*   **Steps:**
    1.  **[COMPLETE] Define scope and UI for admin search:** Decided on global search from Dashboard header, toggling a TextInput, navigating to a results screen. Search covers Products, Orders, Users by relevant fields.
    2.  **[COMPLETE] Implement search input in Dashboard:** Modified `Dashboard.js` header to include a togglable search input field and navigation to results screen.
    3.  **[COMPLETE] Create Search Results Screen:** Created `AdminSearchResultsScreen.js` to fetch data, filter by query, display grouped results using `SectionList`, and handle navigation to item details.
    4.  **[COMPLETE] Implement search logic:** Logic implemented in `AdminSearchResultsScreen.js` to search products (name, category, description, tags), orders (ID, customerEmail, status), and users (name, email) from AsyncStorage, case-insensitively.
    5.  **[COMPLETE] Integrate search UI into relevant admin screen(s):** Integrated into `Dashboard.js` header. Added `AdminSearchResultsScreen` to `AdminDrawer.js` for navigation.
    6.  **[COMPLETE] Debugging & Refinement:** Addressed navigation issues from search results to nested screens and fixed image URI errors for products in search results.

---

**Phase 7: Admin Notification System - PENDING**

*   **Goal:** Implement a notification system for the admin panel.
*   **Details:** (To be defined - e.g., What events trigger notifications? How are they displayed? Are they persistent?)
*   **Steps:**
    1.  Define notification events and display mechanisms.
    2.  Implement logic to trigger/store notifications (potentially in AsyncStorage for an offline app).
    3.  Create UI for displaying notifications.

---

**Future Considerations:**

*   **Backend Integration:** Replace all local/AsyncStorage data operations with API calls once a backend is available.
*   **Admin Roles/Permissions:** Implement more granular controls if needed.
*   **Error Handling & Validation:** Add robust error handling and input validation throughout the admin panel.
*   **UI/UX:** Refine the admin interface for better usability. 
*   **Admin Profile Management**: (As seen in the user-provided image, this was listed under Admin features implicitly - should be considered if not covered by auth.) 