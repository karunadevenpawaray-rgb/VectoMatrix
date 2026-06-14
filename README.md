# VectoMatrix Travel & Tours Ltd - Ecosystem Monorepo

Welcome to the VectoMatrix Travel & Tours Ltd ecosystem repository. This project is a comprehensive multi-platform travel booking and management system, designed with a robust standalone architecture and a sophisticated offline-capable Mock Engine.

## Project Structure

This repository is structured as an npm workspace monorepo:

- **`packages/mock-engine/`**: A shared library providing a centralized Mock API, storage adapters (supporting both browser `localStorage` and React Native `AsyncStorage`), and simulated network latency/error states.
- **`web/`**: The Next.js Consumer Portal. Here, travelers can discover packages and book them via Stripe (or the mock engine).
- **`admin/`**: The Next.js B2B SaaS Portal. Travel agencies manage their inventory and leads here. Includes a hidden `/mock-admin` dashboard for global mock configurations.
- **`mobile/`**: The React Native Expo Application for travelers, featuring true offline booking capabilities and a local sync queue.
- **`supabase/`**: Contains the SQL schema, Row Level Security (RLS) policies, and definitions for database tables like `agencies`, `packages`, `leads`, and `super_admins`.
- **`docs/`**: Comprehensive project documentation.

## Documentation

Please refer to the following documents in the `/docs` folder for detailed information:

1. [Features & User Types](docs/FEATURES.md): Detailed breakdown of the system's capabilities and the different roles (Super Admin, Travel Agency, Consumer, Mobile User).
2. [Deployment Guide](docs/DEPLOYMENT.md): Instructions on how to deploy the database, web app, admin app, and mobile app to production, and how to transition from Mock to Live data.
3. [Testing Strategy](docs/TESTING.md): Guidelines for End-to-End, Unit, and Mobile testing, including offline state validation.

## Getting Started Locally

1. **Install Dependencies**: 
   Run `npm install` at the root directory to bootstrap the workspaces.
2. **Run the Admin Portal**:
   Navigate to `admin/` and run `npm run dev`.
3. **Run the Web Portal**:
   Navigate to `web/` and run `npm run dev`.
4. **Run the Mobile App**:
   Navigate to `mobile/` and run `npm run ios` or `npm run android` (requires Expo CLI).

*Note: By default, the system runs in Mock Mode via the shared `@vectormatrix/mock-engine`. To connect to a live Supabase instance, change `USE_MOCK_DATA = false` in the respective service files and provide your Supabase environment variables.*
