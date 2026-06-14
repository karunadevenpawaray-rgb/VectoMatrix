-- VectoMatrix Database Seed Script

-- 1. SEED SAAS TENANTS
INSERT INTO public.tenants (id, name, subdomain, primary_color, logo_text) VALUES
('00000000-0000-0000-0000-000000000001', 'TRUEMEMORIES Travel & Tours', 'truememories', '#ea580c', 'TRUEMEMORIES'),
('00000000-0000-0000-0000-000000000002', 'VectoMatrix Basic Tours', 'basic', '#3b82f6', 'VECTOMATRIX')
ON CONFLICT (subdomain) DO NOTHING;

-- 2. SEED TENANT PLUGINS
INSERT INTO public.tenant_plugins (tenant_id, plugin_name, is_enabled) VALUES
('00000000-0000-0000-0000-000000000001', 'stripeCheckout', true),
('00000000-0000-0000-0000-000000000001', 'promotionalBillboards', true),
('00000000-0000-0000-0000-000000000001', 'packageComparison', true),
('00000000-0000-0000-0000-000000000001', 'imageGalleryUpload', true),
('00000000-0000-0000-0000-000000000002', 'stripeCheckout', false),
('00000000-0000-0000-0000-000000000002', 'promotionalBillboards', false),
('00000000-0000-0000-0000-000000000002', 'packageComparison', false),
('00000000-0000-0000-0000-000000000002', 'imageGalleryUpload', false)
ON CONFLICT (tenant_id, plugin_name) DO NOTHING;

-- 3. SEED AGENCIES (B2B Vendors)
INSERT INTO public.agencies (id, name, email, phone, logo_url, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Alpha Travels', 'agency-alpha@example.com', '+230 5555 0001', 'https://images.unsplash.com/photo-1596422846543-75c6ff416766', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'Beta Tours', 'agency-beta@example.com', '+230 5555 0002', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 4. SEED AGENCY SETTINGS (Custom SMTP)
INSERT INTO public.agency_settings (agency_id, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from_email, smtp_from_name) VALUES
('11111111-1111-1111-1111-111111111111', 'smtp.mailtrap.io', 2525, 'mock-user', 'mock-pass', 'alpha@example.com', 'Alpha Travels Support'),
('22222222-2222-2222-2222-222222222222', 'smtp.mailtrap.io', 2525, 'mock-user', 'mock-pass', 'beta@example.com', 'Beta Tours Info')
ON CONFLICT (agency_id) DO NOTHING;

-- 5. SEED BILLBOARDS (Rotating hero sliders)
INSERT INTO public.billboards (id, title, subtitle, image_url, cta_text, cta_link, is_active) VALUES
('33333333-3333-3333-3333-333333333331', 'YOUR GATEWAY TO BEAUTIFUL JOURNEYS', 'True Memories Travel & Tours acts as a bridge between traveler and tours and holidays. Explore quiet beachside strolls, guided walks, and simple packages.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', 'Discover Packages', '#packages', true),
('33333333-3333-3333-3333-333333333332', '5 Days Dubai Premium Desert Safari', 'Wander through desert dunes, ride camels, and enjoy a warm BBQ dinner under the stars at Atlantis The Palm.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200', 'Book Dubai Now', '/package/pkg-1', true)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED PACKAGES
INSERT INTO public.packages (id, agency_id, title, destination, base_price_mur, travel_month, hotel_name, hotel_stars, description, image_url, is_active, is_archived) VALUES
('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', '5 Days Dubai Premium Desert Safari', 'DUBAI', 45000.00, '2026-08', 'Atlantis The Palm', 5, 'Wander through desert dunes, ride camels, and enjoy a warm BBQ dinner under the stars.', 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800', true, false),
('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', 'Kuala Lumpur Shopping Fiesta', 'MALAYSIA', 5000.00, '2026-09', 'Luxury Inn', 4, 'Shop till you drop in the heart of Kuala Lumpur. Guided shopping tour.', 'https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=800', true, false)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED LEADS / BOOKINGS
INSERT INTO public.leads (id, package_id, assigned_agency_id, client_name, client_email, client_phone, passenger_count, selected_insurance, include_esim, upgrade_private_car, calculated_total_mur, status, payment_status) VALUES
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Jean Dupont', 'jean@example.com', '+230 5555 1234', 2, 'Premium SWAN Cover', true, false, 45000.00, 'PENDING', 'UNPAID'),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', 'Sarah Lee', 'sarah@example.com', '+230 5555 9876', 1, 'Standard Cover', false, true, 32000.00, 'CONVERTED', 'PAID')
ON CONFLICT (id) DO NOTHING;
