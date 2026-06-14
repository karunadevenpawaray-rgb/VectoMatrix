# VectoMatrix Production Deployment Guide

This document provides a step-by-step walkthrough to deploy the VectoMatrix Travel & Tours multi-tenant SaaS application to production.

---

## 1. Database Setup (Supabase)

To initialize your production database on Supabase:

1. **Sign In / Create Project**: Go to [Supabase](https://supabase.com) and click **New Project**.
2. **Apply Database Schema**:
   - Navigate to the **SQL Editor** in the left sidebar.
   - Click **New Query**.
   - Copy the schema definitions from [supabase/schema.sql](file:///c:/Users/deven/Desktop/VectoMatrix%20Travel%20&%20Tours%20Ltd/supabase/schema.sql) and paste them into the SQL editor.
   - Click **Run** to execute the query. This creates all tables, enabling Row Level Security (RLS) policies, storage configurations, and database RPC triggers.
3. **Populate Initial Seed Data** (Optional):
   - To seed initial records, paste the contents of [supabase/seed.sql](file:///c:/Users/deven/Desktop/VectoMatrix%20Travel%20&%20Tours%20Ltd/supabase/seed.sql) and execute them.
4. **Acquire API Keys**:
   - Go to **Project Settings -> API**.
   - Copy the **Project URL** (referenced as `SUPABASE_URL`) and **API Key / `anon` public** (referenced as `SUPABASE_ANON_KEY`).

---

## 2. B2C Web Portal Deployment (Vercel)

The B2C traveler-facing customer portal (`/web`) should be deployed as a Next.js project on Vercel.

1. **Import Repository**:
   - In the Vercel Dashboard, select **Add New -> Project**.
   - Connect your GitHub repository.
   - Under **Root Directory**, specify `web`.
2. **Framework Configuration**:
   - Vercel automatically detects the **Next.js** framework.
3. **Environment Variables**:
   Add the following production environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous key.
   - `NEXT_PUBLIC_USE_MOCK_ENGINE`: Set explicitly to `false`.
   - `STRIPE_SECRET_KEY`: Your live production Stripe Secret API Key (starts with `sk_live_`).
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your live production Stripe Publishable API Key (starts with `pk_live_`).
   - `STRIPE_WEBHOOK_SECRET`: Secure webhook signing secret generated in your Stripe Dashboard.
   - `NEXT_PUBLIC_APP_URL`: The production domain URL (e.g., `https://vectomatrix.com`).
4. **Deploy**:
   - Click **Deploy**. Vercel will build and host the application at the assigned domain.

---

## 3. B2B Vendor Admin Portal Deployment (Vercel)

The B2B vendor and agency management dashboard (`/admin`) is deployed similarly.

1. **Import Repository**:
   - Select **Add New -> Project** in Vercel.
   - Select the same GitHub repository.
   - Under **Root Directory**, specify `admin`.
2. **Environment Variables**:
   Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous key.
   - `NEXT_PUBLIC_USE_MOCK_ENGINE`: Set explicitly to `false`.
3. **Deploy**:
   - Click **Deploy** to compile and host the administrator console.

---

## 4. Mobile App Compiles (Expo EAS Build)

The mobile codebase (`/mobile`) uses Expo. To package native `.ipa` (iOS) and `.apk`/`.aab` (Android) binaries:

1. **Install EAS CLI**:
   Ensure Expo Application Services CLI is installed globally:
   ```bash
   npm install -g eas-cli
   ```
2. **Log In to Expo**:
   ```bash
   eas login
   ```
3. **Configure the Project**:
   Initialize credentials and EAS configuration profiles:
   ```bash
   eas build:configure
   ```
4. **Configure Production Variables**:
   Ensure your `.env` (or project environment variables in the Expo Dashboard) are populated:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   EXPO_PUBLIC_USE_MOCK_ENGINE=false
   ```
5. **Trigger Compiles**:
   - For Android (AAB bundle):
     ```bash
     eas build --platform android
     ```
   - For iOS (IPA bundle):
     ```bash
     eas build --platform ios
     ```
   - For both platforms:
     ```bash
     eas build --platform all
     ```
