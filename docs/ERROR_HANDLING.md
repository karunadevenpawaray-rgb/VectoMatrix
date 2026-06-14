# Error Handling Strategies

VectoMatrix implements different error handling strategies depending on the environment context (Mock vs. Live).

## 1. Mock Environment Errors
The `@vectormatrix/mock-engine` supports simulated errors. In the `admin/src/app/mock-admin/page.tsx` hidden dashboard, you can toggle **Simulate 500 Backend Error**. 
When this is active, the `MockApi.ts` throws an intentional `new Error("Simulated 500 Internal Server Error")` on 50% of requests to allow developers to test UI error states (e.g., toast notifications and fallback UI).

## 2. Live Supabase Errors
When interacting with live Supabase endpoints, we use a standard `try/catch` wrapper pattern.
If an error occurs (e.g., RLS violation, missing fields), the service layer returns `{ success: false, error: string }` instead of throwing an unhandled exception. The UI layer interprets this and triggers a non-blocking Toast notification.

## 3. Stripe Checkout Errors
If a user cancels their Stripe checkout session, they are redirected to `/checkout?canceled=true`. The UI detects this query parameter and displays an informational message rather than an error. If the session creation fails on our backend, an HTTP 500 is returned with the error message forwarded to the frontend UI.
