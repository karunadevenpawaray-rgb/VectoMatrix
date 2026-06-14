# Deployment Guide

This document outlines the process for deploying the VectoMatrix Travel & Tours Ltd ecosystem to production.

## Architecture Overview

The ecosystem consists of three main applications:

1. **Web Consumer Portal** (`/web`) - Next.js application for customers
2. **Admin B2B Portal** (`/admin`) - Next.js application for agencies 
3. **Mobile Application** (`/mobile`) - React Native app with Expo

All applications connect to a central Supabase PostgreSQL database with RLS (Row Level Security) for data isolation.

## Deployment Prerequisites

Before deploying, ensure you have:

- Supabase project with database configured
- Stripe account for payment processing
- Resend account for email delivery (web app)
- Vercel account for web deployments
- Expo account for mobile deployment

## Environment Variables

Each application requires specific environment variables:

### Web App (`/web`)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_APP_URL=your_deployed_url
RESEND_API_KEY=your_resend_api_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### Admin App (`/admin`)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=your_admin_app_url
SMTP_HOST=smtp.yourhost.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Mobile App (`/mobile`)

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Steps

### 1. Deploy to Vercel (Web & Admin Apps)

Both web applications can be deployed independently to Vercel:

1. Connect your GitHub repository to Vercel
2. Create separate projects for web and admin apps
3. Set the root directory to `/web` or `/admin` respectively
4. Add environment variables in Vercel dashboard
5. Deploy

### 2. Deploy Mobile App to Expo

1. Ensure you have Expo CLI installed:
```bash
npm install -g @expo/cli
```

2. Log in to Expo:
```bash
npx expo login
```

3. Publish over-the-air updates:
```bash
cd mobile
npx expo publish
```

### 3. Configure Supabase

After deployment, configure your Supabase project:

1. Set up authentication providers (if needed)
2. Configure storage buckets with appropriate policies
3. Set up database functions and RLS policies
4. Configure email templates for automated notifications

## Database Schema

The database schema is managed through Supabase migrations. Ensure all tables and RLS policies are properly configured before deploying the applications.

## Post-Deployment Checklist

- [ ] Verify all environment variables are correctly set
- [ ] Test user registration and authentication
- [ ] Verify database connections and RLS policies
- [ ] Test payment processing (Stripe integration)
- [ ] Confirm email delivery (Resend integration)
- [ ] Validate mobile app connectivity
- [ ] Test cross-application data consistency

## Troubleshooting

Common deployment issues:

1. **Environment variables not loaded**: Double-check variable names and scopes in deployment platform
2. **Database connection failures**: Verify Supabase URL and service role key
3. **Authentication issues**: Ensure RLS policies allow appropriate access
4. **Payment processing errors**: Verify Stripe keys and webhook configuration
5. **Email delivery failures**: Check SMTP settings and Resend configuration