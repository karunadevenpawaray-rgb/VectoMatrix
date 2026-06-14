# Custom SMTP & Email Templates Configuration Guide

VectoMatrix allows B2B travel agency vendors to configure their custom SMTP servers and templates so all receipt and voucher notifications are sent from their official business domain.

---

## 1. Entering SMTP Connection Settings

To set up your agency's custom SMTP configuration:

1. Sign in to the **VectoMatrix B2B Vendor Portal** (`/admin`).
2. Go to **Settings** -> **Communications & Notifications**.
3. Fill in the **SMTP Settings** form fields:
   - **SMTP Host**: The address of your outbound email server (e.g., `smtp.gmail.com` or `smtp.sendgrid.net`).
   - **SMTP Port**: The port your server uses. Generally `587` (TLS) or `465` (SSL).
   - **Username**: The email or account login name for your SMTP host.
   - **Password**: The password or API application key.
   - **Sender Email Address**: The address that recipients see (e.g., `bookings@youragency.mu`).
   - **Sender Name**: The user-friendly name displayed in mail clients (e.g., `True Memories Support`).
4. Click **Save Settings** to encrypt and save your connection settings to your agency profile.

---

## 2. Personalizing Email Templates

You can customize the automated templates using standard HTML and CSS:

### Available Templates
1. **Lead Inquiry Received**: Sent when a traveler submits an inquiry form.
2. **Lead Converted / Confirmed**: Sent when booking and transaction payment are approved.

### Dynamic Placeholders
To inject booking variables on the fly, place double curly brackets around the key names inside your HTML:
- `{{client_name}}`: Replaced with the customer's full name.
- `{{package_title}}`: Replaced with the title of the travel package purchased.
- `{{total_amount}}`: Replaced with the total price in MUR.

### Example Template Structure
```html
<div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc;">
  <h2 style="color: #ea580c;">Booking Confirmed! 🎉</h2>
  <p>Dear <strong>{{client_name}}</strong>,</p>
  <p>Your payment for <strong>{{package_title}}</strong> has been processed successfully.</p>
  <p>Total Paid: <strong>Rs {{total_amount}}</strong></p>
  <p>Thank you for choosing us for your journeys.</p>
</div>
```
