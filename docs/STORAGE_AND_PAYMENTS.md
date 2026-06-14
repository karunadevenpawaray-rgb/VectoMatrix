# VectoMatrix Storage & Payment Setup

To fully utilize the Live Mode of the VectoMatrix ecosystem, you must configure Supabase Storage for file uploads and Stripe for payment processing.

## 1. Setting up Supabase Storage (File Uploads)

Currently, image uploads (for agency logos, package images, etc.) are mocked. To enable live uploads:

1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Select your VectoMatrix project.
3. On the left sidebar, click on **Storage**.
4. Click **New Bucket**.
5. Name the bucket exactly: `vmx-assets`
6. **IMPORTANT**: Make sure to check the box that says **Public bucket**. (This allows the images to be readable by the frontend apps).
7. Click **Save**.

Your `storageService.ts` is already configured to upload to the `vmx-assets` bucket when the environment is not in mock mode.

## 2. Setting up Stripe (Payment Processing)

Currently, the checkout flow simulates a successful payment. To enable live payments:

1. Log in to your [Stripe Dashboard](https://stripe.com).
2. Ensure you are in **Test Mode** (toggle in the top right corner) while testing.
3. Go to the **Developers** section -> **API keys**.
4. You need two keys:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)
5. Open the `.env` (or `.env.local`) file in your `web` app directory.
6. Add the secret key:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```
7. When moving to real production, swap out the test keys for the live keys (`pk_live_...` and `sk_live_...`).

The `api/checkout/route.ts` API will automatically use the Stripe SDK to generate checkout sessions when `NEXT_PUBLIC_USE_MOCK_ENGINE=false`.
