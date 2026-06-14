# VectoMatrix: Operations, Deployments, and Testing Guide

This document outlines the deployment instructions, the transition process from mock to live databases, payment integration flows, testing strategies, error handling guidelines, security hardening procedures, and scalability configurations for the VectoMatrix ecosystem.

---

## 1. Deployment Runbook

The VectoMatrix ecosystem utilizes isolated, standalone codebases that communicate through a centralized Supabase backend and Stripe API.

### 1. Database Initialization (Supabase)
Before launching any frontends, configure the database:
1. Create a new project in your [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste the contents of [supabase/schema.sql](file:///c:/Users/deven/Desktop/VectoMatrix%20Travel%20&%20Tours%20Ltd/supabase/schema.sql) and [supabase/seed.sql](file:///c:/Users/deven/Desktop/VectoMatrix%20Travel%20&%20Tours%20Ltd/supabase/seed.sql).
4. Run the queries to initialize tables (`agencies`, `packages`, `leads`, `super_admins`), RLS policies, buckets, and RPC functions.
5. In **Project Settings -> API**, retrieve the `Project URL` and `anon public` key.

### 2. Frontend Deployment (Vercel)
Deploy the B2C Web app and B2B Admin portal as separate Vercel instances:
1. Connect your Github repository to your Vercel Account.
2. **Admin SaaS Portal**:
   - Set the root directory to `admin`.
   - Set framework preset to `Next.js`.
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_USE_MOCK_ENGINE=false` (to enable live database calls in production).
3. **B2C Customer Portal**:
   - Set the root directory to `web`.
   - Set framework preset to `Next.js`.
   - Add same variables as above, plus:
     - `STRIPE_SECRET_KEY` = (Your live or test Stripe Secret Key)
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = (Your live or test Stripe Publishable Key)
     - `STRIPE_WEBHOOK_SECRET` = (Stripe signing secret for live webhooks)

### 3. Mobile App Compiles (Expo EAS)
Compile native binaries for iOS and Android:
1. Run `npm install -g eas-cli` inside the mobile root directory.
2. Initialize project credentials: `eas build:configure`.
3. Configure `.env` with `EXPO_PUBLIC_USE_MOCK_ENGINE=false`, `EXPO_PUBLIC_SUPABASE_URL`, and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Trigger build process: `eas build --platform all`.

---

## 2. Transition Process: Mock-to-Live

VectoMatrix uses the `@vectormatrix/mock-engine` package to allow local offline-first development. Transitioning the system to production live data requires setting appropriate environment flags.

### 1. Auto-Resolution Mechanism
The codebase automatically toggles database queries off the mock engine and onto live Supabase APIs by analyzing environment hostnames:
- If hostname is not `localhost` or `127.0.0.1`, `USE_MOCK_DATA` resolves to `false`.
- If environment variable `NEXT_PUBLIC_USE_MOCK_ENGINE` (or `EXPO_PUBLIC_USE_MOCK_ENGINE`) is explicitly set to `false`, mock services bypass entirely.

### 2. Step-by-Step Transition Checklist:
1. **Database Schema Sync**: Verify schema migrations and seed scripts are active on the live Supabase instance.
2. **Environment Variables Config**: Set `NEXT_PUBLIC_USE_MOCK_ENGINE=false` in target Vercel / EAS dashboards.
3. **Storage Bucket Activation**: Create a public bucket in Supabase named exactly `package_images` to map package inventory uploads.
4. **Stripe Key Mapping**: Replace the mock indicator string `'sk_test_mock'` with authentic Stripe test keys or live keys.
5. **Testing Verification**: Perform smoke tests on `/web` and `/admin` to verify that data reads/writes target the Supabase endpoints.

---

## 3. Stripe Payment Flow & Webhook Fulfillment

Online transaction processing relies on Stripe Checkout. The system automatically switches to mock billing if Stripe keys are missing or invalid, avoiding runtime exceptions.

### Live Payment Processing Diagram
```
[Traveler UI] -- 1. Click Checkout --> [Checkout API Route]
                                                |
[Stripe Portal] <-- 3. Redirect Client -- 2. Create Stripe Session
      |                                    (Embed Package/Lead ID)
4. Traveler Pays
      |
[Stripe Webhook] -- 5. Broadcasts checkout.session.completed --> [Webhook Endpoint]
                                                                        |
[Supabase DB] <-- 7. Mark status = 'PAID' <-- 6. Verify Webhook Signature
```

### 1. Session Initialization
When the checkout route is loaded, `api/checkout/route.ts` runs. If `STRIPE_SECRET_KEY` is present and valid, it initializes a Stripe session. It stores the passenger information, package selection, and temporary lead details inside the session metadata.

### 2. Webhook Handler
Stripe fires a `checkout.session.completed` event to our Next.js API webhook path. The webhook parser:
- Decrypts the request payload.
- Validates the signature using `STRIPE_WEBHOOK_SECRET` to prevent spoofing.
- Extracts the unique `lead_id` from metadata.
- Updates the database row in the `public.leads` table to set `payment_status = 'PAID'` and `status = 'CLAIMED'`.
- Invokes the email engine to dispatch the travel vouchers.

---

## 4. Error Handling Framework

VectoMatrix utilizes a multi-tiered safety model to capture and process errors across mock and live environments without crash loops.

```
       [Client UI Render]
               │
     (React Error Boundary)  <-- Catches React component render crashes
               │
    (Service Layer Try/Catch) <-- Resolves errors to { success: false, error }
               │
  ┌────────────┴────────────┐
  ▼                         ▼
[Mock Mode]            [Live Mode]
- Injects 500 error    - Catches RLS violations
  via Admin Panel.     - Captures HTTP failures
                       - Displays custom Toast prompts
```

### 1. Service Layer Wrappers
API requests do not throw unhandled exceptions. Service layers wrap interactions in clean `try/catch` handlers. They resolve all outcomes to a uniform object structure:
```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```
If Supabase returns a network or database error (such as an RLS violation), the UI intercepts the `error` string and displays a non-blocking toast warning.

### 2. Frontend React Boundaries
- **Next.js Error Boundaries**: Pages wrap heavy dashboard blocks in React Error Boundaries (`error.tsx` files). If a component crashes, the application displays a localized fallback UI (e.g., "Failed to load dashboard widgets") without disrupting global navigation.
- **Form Validations**: Checkout forms and package creation templates use React Hook Form paired with Zod schemas. Clients get immediate visual feedback for validation failures before server requests fire.

### 3. Stripe Checkout Cancellations
If a transaction fails or a user manually aborts Stripe billing, Stripe redirects back to `/checkout?canceled=true`. The web routing captures this URL query, halts lead confirmation, and displays a localized warning explaining the payment was canceled.

---

## 5. Security Hardening Guidelines

To protect agency databases and customer transaction history in production:

1. **Row-Level Security (RLS)**: Enforce strict RLS. Ensure that guests can only execute `SELECT` on the public `packages` catalog. Ensure that agencies can only query or update rows matching their own authentication tokens (`auth.uid()`).
2. **Stripe Signature Checks**: The webhook endpoint must verify signatures before updating lead states:
   ```typescript
   const event = stripe.webhooks.constructEvent(payload, headerSignature, webhookSecret);
   ```
3. **CORS Headers**: Set rigid CORS configurations on Vercel deployment dashboards. Lock public API routes so they only accept payloads originating from authorized domain subfolders.
4. **Environment Security**: Never save private credentials (like `STRIPE_SECRET_KEY`, SMTP passwords, or `SUPABASE_SERVICE_ROLE_KEY`) in client bundles. Only prefix variables with `NEXT_PUBLIC_` or `EXPO_PUBLIC_` if they are intended for public client exposure.
5. **Rate Limiting**: Apply rate-limiting filters (using Upstash Redis or Vercel Edge Middleware) to sensitive routes like contact forms, checkout sessions, and dashboard search queries.

---

## 6. Performance Scaling & Optimization

As agency tenants and package counts grow, apply the following performance benchmarks:

* **Caching Strategies**: Use Next.js Incremental Static Regeneration (ISR) with a revalidation time of 300 seconds on catalog detail pages. This ensures fast loads for travelers while updating package details in the background.
* **Database Indexing**: Add composite indices to columns involved in filters and relationships:
  ```sql
  CREATE INDEX idx_packages_agency_active ON public.packages (agency_id, is_active, is_archived);
  CREATE INDEX idx_leads_assigned_agency ON public.leads (assigned_agency_id, status);
  ```
* **Supabase Connection Pooling**: Toggle serverless database client calls to use Supabase Connection Pooling (Supavisor) on port `5432` instead of direct database connections, preventing connection exhaustion.
* **Image Delivery Optimizations**: Leverage Next.js `<Image />` component with custom loaders. This compresses and formats vendor-uploaded assets into modern `.webp` representations on the fly.
* **State Memoization**: Wrap heavy pricing matrices, invoice calculators, and inventory tables in `useMemo` and `useCallback` to prevent UI lag during client inputs.

---

## 7. Testing Architecture

Verify system functionality using playbooks across the stack:

### 1. End-to-End Browser Tests (Playwright)
Verify core traveler and vendor workflows:
- Run `npx playwright test` to run dual-browser tests.
- **Traveler Simulation**: Navigates to B2C homepage, filters package lists, selects package, and triggers Stripe checkout or lead generation.
- **Vendor Simulation**: Navigates to B2B dashboard, authenticates, opens package form, saves package, and validates addition.

### 2. Unit and Component Tests (Jest)
Validate calculations:
- Run unit tests to verify pricing formulas against custom occupancy rates, insurance tiers, and markups.
- Validate Search filters to make sure they display correct outcomes for date searches.

### 3. Mobile Device Suite (Detox & NetInfo)
- Run `npm run ios` and `npm run android` in the `/mobile` directory to run native emulator tests.
- Toggle **Offline Mode** in the hidden `/mock-admin` control panel to verify that the SQLite/AsyncStorage buffer queue holds booking records correctly.
- Restore the connection, press "Sync Now" in the user wallet, and verify data transfers to Supabase.
