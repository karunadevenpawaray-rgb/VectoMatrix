# VectoMatrix Ecosystem: Testing Architecture

This document defines the testing strategy for the VectoMatrix standalone architecture. As a multi-platform system involving highly sensitive B2B data and financial transactions, robust testing is required before disabling the Mock Data toggle in production.

## 1. End-to-End (E2E) Browser Testing
**Framework**: [Playwright](https://playwright.dev/)
**Target**: The `/web` and `/admin` Next.js applications.

### Configuration Strategy
Playwright should be configured to run dual-browser tests testing the core User Journeys:
1. **The Consumer Journey**: A script that navigates to `/web`, uses the Advanced Search sidebar to filter by "Dubai", selects a package, and submits the Lead Generation form.
2. **The Vendor Journey**: A script that logs into `/admin` (bypassing mock mode), creates a new Package via the Rich Text Editor, and verifies the package appears in the active inventory.

### Running E2E locally
```bash
npm init playwright@latest
npx playwright test
```

## 2. Unit & Component Testing
**Framework**: [Jest](https://jestjs.io/) + React Testing Library
**Target**: Matrix algorithms and Shared UI components.

### Core Algorithms to Unit Test
- **Pricing Matrix**: Ensure the `calculated_total_mur` in the Lead Generation form correctly calculates passengers, insurance multipliers, and add-on fixed costs.
- **Search Engine**: Ensure the `web/src/app/page.tsx` filtering logic properly applies keyword fuzzing and price threshold logic to the dataset.

## 3. Mobile Device Testing
**Framework**: [Detox](https://wix.github.io/Detox/) or Expo EAS test builds.
**Target**: The `/mobile` React Native application.

Testing mobile locally requires running the iOS Simulator and Android Emulator simultaneously:
```bash
cd mobile
npm run ios
npm run android
```

### Validating the Offline Sync Queue
The mobile app leverages the `@vectormatrix/mock-engine` via `AsyncStorage` to enable true offline functionality.
1. Start the mobile app.
2. Navigate to the Admin Portal's `/mock-admin` dashboard and enable **Offline Mode**.
3. Attempt to complete a booking in the mobile app.
4. Verify the user is shown the "Offline Mode Active" banner and the lead is safely pushed to the local `vmx_offline_queue`.
5. Navigate back to the Customer Dashboard and verify the "Pending Sync" banner appears.
6. Disable **Offline Mode** in the mock admin, and tap "Sync Now" to verify batch uploading.

## 4. Mock Engine Validation
Since the architecture heavily relies on the shared NPM workspace `packages/mock-engine`, it's critical to validate its constraints:
- Open the `/mock-admin` dashboard.
- Increase artificial latency to `2000ms` and verify that all apps display loading spinners (`<ActivityIndicator />` in React Native, generic skeleton loaders in Next.js).
- Set the Error Rate to `100%` and verify all apps fail gracefully without hard-crashing.
