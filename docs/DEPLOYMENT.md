# VectoMatrix: Master Deployment Guide

The VectoMatrix ecosystem utilizes a decoupled, standalone architecture. This means the Web App, Admin App, and Mobile App are completely isolated codebases that communicate through the centralized Supabase backend.

Follow this guide to deploy the entire ecosystem to production.

---

## 1. Database Deployment (Supabase)

Before launching the frontends, the database schema must be initialized.

1. Create a new project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open the `docs/supabase_schema.sql` file provided in this repository.
4. Copy the entire contents of the file and run it in the SQL Editor.
   - *This will instantly create the `agencies`, `packages`, and `leads` tables, configure the Row Level Security (RLS) policies, and create the `package-images` storage bucket.*
5. Go to **Project Settings -> API** and copy your `Project URL` and `anon public` key.

---

## 2. Admin App Deployment (Vercel)

The Vendor SaaS portal must be deployed as an independent project.

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your GitHub repository.
4. **CRITICAL**: In the "Framework Preset" settings, ensure it detects `Next.js`. In the "Root Directory" settings, select the `admin` folder.
5. Add the following Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Your Supabase Anon Key)
6. Click **Deploy**.

---

## 3. Web App Deployment (Vercel)

The Consumer portal is deployed identically to the Admin app, but as a separate instance.

1. In Vercel, click **Add New Project** and select the same GitHub repository.
2. **CRITICAL**: In the "Root Directory" settings, select the `web` folder.
3. Add the same Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

---

## 4. Mobile App Deployment (Expo EAS)

The React Native application requires Expo Application Services (EAS) to compile the native iOS and Android binaries.

1. Install the EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Navigate into the mobile directory:
   ```bash
   cd mobile
   ```
3. Login to your Expo account:
   ```bash
   eas login
   ```
4. Configure the project:
   ```bash
   eas build:configure
   ```
5. Trigger the cloud builds:
   ```bash
   eas build --platform all
   ```
6. Once the build finishes, EAS will provide a direct link to download the `.apk` (Android) and submit the iOS build directly to Apple TestFlight.

---

## 5. Transitioning from Mock to Live Data

The ecosystem defaults to using the `@vectormatrix/mock-engine` local simulation based on your environment variables. To transition from the Mock Engine to your live deployed Supabase and Stripe environments, you no longer need to edit code directly.

Instead, update your environment variables across the Admin, Web, and Mobile apps.

For **Admin & Web Apps** (in `.env` or Vercel dashboard):
```env
NEXT_PUBLIC_USE_MOCK_ENGINE=false
```

For **Mobile App** (in `.env` or EAS dashboard):
```env
EXPO_PUBLIC_USE_MOCK_ENGINE=false
```

Push these configuration changes to your hosting providers (Vercel/EAS) to instantly switch the entire ecosystem from mock offline mode to the live Supabase databases and Stripe payment gateways.

---

## 6. Managing the Mock Architecture

If you prefer to keep the system in Mock Mode for testing, remember that you have access to a dedicated control panel.
Navigate to your deployed Admin portal and append `/mock-admin` to the URL. This hidden dashboard allows you to:
- Inject artificial network latency
- Simulate backend 500 errors
- Perform a factory reset of the mock SQLite/localStorage database
