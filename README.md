# VectoMatrix Travel & Tours Ltd

The complete monorepo for the next-generation travel booking ecosystem, featuring a consumer web portal, B2B vendor portal, and native mobile app - all powered by a unified data layer.

## 🏗️ Architecture Overview

```
vector-matrix-ecosystem/
├── web/              # Consumer Web Portal (Next.js)
├── admin/            # B2B Admin Portal (Next.js)
├── mobile/           # Native Mobile App (Expo/React Native)
└── packages/         # Shared libraries and utilities
```

## 🌐 Live Applications

- **Consumer Web Portal** (`/web`): Direct-to-consumer booking platform with package discovery, comparison, and checkout flows
- **B2B Admin Portal** (`/admin`): Agency management platform for inventory, leads, and analytics
- **Mobile App** (`/mobile`): Native experience with offline booking capabilities

## 🛠 Tech Stack

- **Frontend Frameworks**: Next.js 16, React Native (Expo)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Payment Processing**: Stripe
- **Styling**: Tailwind CSS, React Native StyleSheet
- **Deployment**: Vercel (web/admin), Expo OTA (mobile)

## 📊 Data Layer

Centralized PostgreSQL database via Supabase with:
- Row Level Security (RLS) policies for multi-tenancy
- Real-time subscriptions
- Server-side analytics via PostgreSQL functions

## 🔐 Authentication & Permissions

- Multi-tenant architecture with agency-level data isolation
- Role-based access controls via Supabase RLS
- JWT-based sessions

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- npm or yarn
- Supabase account

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables for Supabase and Stripe

3. Run individual apps:
```bash
# Consumer Web Portal
cd web && npm run dev

# B2B Admin Portal  
cd admin && npm run dev

# Mobile App
cd mobile && npx expo start
```

## 📱 Mobile Offline-First Architecture

The mobile app features true offline capabilities:
- Local data persistence using Async Storage
- Queue-based sync mechanism
- Network-aware operations

## 🔄 Deployment

All applications are designed for cloud deployment:
- Web/Admin: Deploy to Vercel with automatic environment propagation
- Mobile: Publish to Expo OTA for instant over-the-air updates

## 🏢 B2B Multi-Tenant SaaS

The admin portal supports multiple travel agencies:
- Isolated inventory and lead management
- White-label customization options
- Agency-specific branding and SMTP settings

## 💳 Payment & Conversion

Integrated payment flows:
- Stripe checkout for direct bookings
- Lead generation for high-touch sales
- Automated email notifications

## 📈 Analytics & Insights

Built-in analytics dashboard:
- Revenue tracking
- Conversion metrics
- Package performance
- Agency-specific reporting
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

1. [Architecture & Features](docs/ARCHITECTURE_AND_FEATURES.md): Detailed breakdown of the multi-tenant SaaS architecture, B2B/B2C features, mobile navigation structure, and core business/pricing logic.
2. [Operations & Testing Guide](docs/OPERATIONS_AND_TESTING.md): Instructions on how to deploy the database, web app, admin app, and mobile app to production, transition from Mock to Live data, setup Stripe/Storage, manage error handling, and run test suites.

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
