# VectoMatrix Mock-to-Live Migration Path

This guide describes how to transition the VectoMatrix ecosystem from the offline-first Mock Engine to the production live database powered by Supabase.

---

## 1. Core Mechanics
VectoMatrix uses a dual-engine architecture. It defaults to mock data during local development and dynamically shifts to live APIs under the following conditions:
- **Environment Flag**: `NEXT_PUBLIC_USE_MOCK_ENGINE` (Web/Admin) or `EXPO_PUBLIC_USE_MOCK_ENGINE` (Mobile) is set to `false`.
- **Production Hostname Detection**: If the application runs on a production server (not `localhost` or `127.0.0.1`), mock mode is automatically disabled.

---

## 2. Migration Checklist

### Step 1: Database Setup
1. Deploy the SQL schema found in [supabase/schema.sql](file:///c:/Users/deven/Desktop/VectoMatrix%20Travel%20&%20Tours%20Ltd/supabase/schema.sql) to your production Supabase SQL Editor.
2. Verify all RLS (Row Level Security) policies are properly compiled and active.
3. Configure target buckets (such as `package_images`) in Supabase Storage with public access.

### Step 2: Update Configuration Files
Ensure you have updated your local `.env` and production hosting settings (Vercel, Netlify, Expo EAS):

#### Web & Admin (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-live-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-live-anon-public-key
NEXT_PUBLIC_USE_MOCK_ENGINE=false
```

#### Mobile App (`.env`):
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-live-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-live-anon-public-key
EXPO_PUBLIC_USE_MOCK_ENGINE=false
```

---

## 3. Data Synchronization & Import Strategy

If you wish to import packages or leads collected during mock mode:

1. **Format Export**: Retrieve mock data records from the mock engine definitions in [MockData.ts](file:///c:/Users/deven/Desktop/VectoMatrix%20Travel%20&%20Tours%20Ltd/packages/mock-engine/src/MockData.ts).
2. **Transform Data**: Ensure all JSON properties align with DB schema column names (e.g. converting `basePrice` to `base_price_mur`).
3. **Execute SQL Insert**: Use the Supabase SQL editor or run bulk insert queries using the Supabase client library to load existing items.

---

## 4. Verification

After turning off mock mode:
- **Network Inspections**: Check the browser DevTools **Network** tab. Ensure calls direct to `https://*.supabase.co` instead of local mock endpoints.
- **Log Inspections**: Ensure no mock console notices appear during application startup.
