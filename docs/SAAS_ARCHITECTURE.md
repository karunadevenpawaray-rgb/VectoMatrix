# VectoMatrix SaaS Multi-Tenant & Plugin Architecture

This document describes the architectural patterns of VectoMatrix Travel & Tours as a multi-tenant SaaS (Software as a Service) platform.

## 1. Multi-Tenancy Design
VectoMatrix runs as a single-instance, multi-tenant application where:
- Each agency or brand acts as a **Tenant**.
- Tenants are identified dynamically via their request hostname or a fallback sub-path configuration.
- Database entries (e.g., packages, leads, agency associations) are scoped using a `tenant_id` or `agency_id`.

### TRUEMEMORIES Travel & Tours
**TRUEMEMORIES Travel & Tours** is the primary tenant (`tenant-truememories`).
- **Domain**: `localhost` / `truememories.vectomatrix.com`
- **Branding Color**: Premium brand orange (`#ea580c`)
- **Active Addons**: Promotional Billboards, Package Comparison, Image Gallery, Stripe Checkout.

---

## 2. Modular Plugin & Addon System
Features are decoupled from the core framework and loaded conditionally based on the tenant's subscription status or configuration.

### Registry of Plugins
1. **`addon-stripe-checkout`**
   - Enables direct online checkout.
   - Core API fallback: Standard lead generation inquiry forms.

2. **`addon-promotional-billboards`**
   - Renders a rotating hero billboard banner section.
   - Core API fallback: Standard search form.

3. **`addon-package-comparison`**
   - Adds the comparison panel and package matching metrics.
   - Core API fallback: Hidden.

4. **`addon-image-gallery-upload`**
   - Enables multi-image upload fields in the B2B packages inventory form.
   - Core API fallback: Single image URL input.

---

## 3. Dynamic Registry Resolution
The React/Next.js frontend resolves configuration using the `saasService` client:
- Fetches tenant-specific branding tokens (theme color, font, logo).
- Checks whether a plugin key is active before rendering corresponding features.
