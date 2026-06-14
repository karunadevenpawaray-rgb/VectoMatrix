# VectoMatrix Custom API Documentation

This document describes the custom server-side API routes implemented in the VectoMatrix Next.js apps.

---

## 1. `/api/checkout` (B2C Web App)
Initiates a secure online payment transaction using the Stripe Checkout system.

* **Endpoint**: `/api/checkout`
* **Method**: `POST`
* **Content-Type**: `application/json`

### Request Payload Schema
```json
{
  "packageId": "UUID",
  "agencyId": "UUID",
  "clientName": "string",
  "clientEmail": "string",
  "clientPhone": "string",
  "totalAmount": number
}
```

### Process Flow
1. Generates a new pending lead in the `leads` table with `status = 'PENDING'` and `payment_status = 'UNPAID'`.
2. Fetches matching inventory package details to construct the itemized billing details.
3. Constructs a Stripe Checkout Session, appending the new `lead_id` within Stripe's metadata.
4. Updates the created lead record with the generated Stripe Session ID (`stripe_session_id`).
5. Returns the redirect URL pointing to Stripe's payment gateway.

### Success Response (`200 OK`)
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_live_..."
}
```

---

## 2. `/api/leads` (B2C Web App)
Creates a non-paid reservation inquiry (Lead generation form) for consumer packages.

* **Endpoint**: `/api/leads`
* **Method**: `POST`
* **Content-Type**: `application/json`

### Request Payload Schema
```json
{
  "packageId": "UUID",
  "assignedAgencyId": "UUID",
  "clientName": "string",
  "clientEmail": "string",
  "clientPhone": "string",
  "passengerCount": number,
  "selectedInsurance": "string",
  "includeEsim": boolean,
  "upgradePrivateCar": boolean,
  "calculatedTotalMur": number,
  "honeypotField": "string",
  "turnstileToken": "string"
}
```

### Security Validations
1. **Honeypot Validation**: Rejects requests where the invisible `honeypotField` is populated, identifying bots.
2. **Turnstile Captcha Verification**: Verifies the Cloudflare Turnstile token on Cloudflare's servers.

### Success Response (`200 OK`)
```json
{
  "success": true,
  "leadId": "UUID"
}
```

---

## 3. `/api/email` (B2B Admin App)
Dispatches system transaction notification emails using the B2B vendor's custom SMTP configuration.

* **Endpoint**: `/api/email`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Headers**:
  - `Authorization: Bearer <supabase_jwt_token>` (Required)

### Security Checks
1. **JWT Verification**: Verifies that the caller's JWT is valid via `supabase.auth.getUser()`.
2. **Permission Check**: Verifies that the authenticated user belongs to the requested `agencyId`.
3. **Rate Limiting**: Limits requests per agency to 5 dispatches per minute in memory.

### Request Payload Schema
```json
{
  "agencyId": "UUID",
  "type": "LEAD_RECEIVED" | "LEAD_CONVERTED",
  "toEmail": "string",
  "variables": {
    "client_name": "string",
    "package_title": "string",
    "total_amount": number
  }
}
```

### Template Compilation
Compiles configured template HTML string by replacing occurrences of `{{variable_name}}` dynamically before dispatching via Nodemailer.

### Success Response (`200 OK`)
```json
{
  "success": true,
  "messageId": "string"
}
```
