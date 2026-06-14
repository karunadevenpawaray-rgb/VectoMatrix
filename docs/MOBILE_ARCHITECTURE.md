# Mobile Architecture & Navigation

The VectoMatrix mobile app is built using React Native and Expo. It uses `@react-navigation/native` for its routing.

## Navigation Stack
The primary navigation is a Stack Navigator containing the following screens:

1. **Home (`HomeScreen`)**: Displays the main feed of packages, search, and filters.
2. **PackageDetail (`PackageDetailScreen`)**: Shows details for a specific package (itinerary, rooms, pickup locations).
3. **BookingFlow (`BookingFlowScreen`)**: The checkout page where users enter passenger details and confirm payment.
4. **Lead (`LeadScreen`)**: The inquiry page where users send a message to the agency without booking.
5. **CustomerDashboard (`CustomerDashboardScreen`)**: Shows the user's past bookings, active inquiries, and offline sync queue.
6. **Compare (`CompareScreen`)**: Allows side-by-side comparison of multiple packages.
7. **Notifications (`NotificationsScreen`)**: Displays local or push notifications.

## Offline Capabilities
The mobile app heavily leverages the `MockEngine` wrapped around `AsyncStorage`.
When offline, all actions (creating leads, bookings, favorites) are intercepted by the `MockEngine` and saved locally with an `_isPendingSync = true` flag.

The `useOfflineSync` hook runs periodically (or upon reconnect) in the `CustomerDashboard` to flush these pending items to the live Supabase database once connectivity is restored.
