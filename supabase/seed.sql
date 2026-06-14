-- VectoMatrix Database Seed Script (Enriched Edition)

-- 1. SEED SAAS TENANTS
INSERT INTO public.tenants (id, name, subdomain, primary_color, logo_text) VALUES
('00000000-0000-0000-0000-000000000001', 'TRUEMEMORIES Travel & Tours', 'truememories', '#ea580c', 'TRUEMEMORIES'),
('00000000-0000-0000-0000-000000000002', 'VectoMatrix Basic Tours', 'basic', '#3b82f6', 'VECTOMATRIX'),
('00000000-0000-0000-0000-000000000003', 'Apex Luxury Voyages', 'apex', '#1e1b4b', 'APEX VOYAGES'),
('00000000-0000-0000-0000-000000000004', 'EcoAdventure Trails', 'ecoadventure', '#064e3b', 'ECOADVENTURE')
ON CONFLICT (subdomain) DO NOTHING;

-- 2. SEED TENANT PLUGINS
INSERT INTO public.tenant_plugins (tenant_id, plugin_name, is_enabled) VALUES
-- TRUEMEMORIES
('00000000-0000-0000-0000-000000000001', 'stripeCheckout', true),
('00000000-0000-0000-0000-000000000001', 'promotionalBillboards', true),
('00000000-0000-0000-0000-000000000001', 'packageComparison', true),
('00000000-0000-0000-0000-000000000001', 'imageGalleryUpload', true),
-- Basic
('00000000-0000-0000-0000-000000000002', 'stripeCheckout', false),
('00000000-0000-0000-0000-000000000002', 'promotionalBillboards', false),
('00000000-0000-0000-0000-000000000002', 'packageComparison', false),
('00000000-0000-0000-0000-000000000002', 'imageGalleryUpload', false),
-- Apex
('00000000-0000-0000-0000-000000000003', 'stripeCheckout', true),
('00000000-0000-0000-0000-000000000003', 'promotionalBillboards', true),
('00000000-0000-0000-0000-000000000003', 'packageComparison', true),
('00000000-0000-0000-0000-000000000003', 'imageGalleryUpload', true),
-- EcoAdventure
('00000000-0000-0000-0000-000000000004', 'stripeCheckout', false),
('00000000-0000-0000-0000-000000000004', 'promotionalBillboards', true),
('00000000-0000-0000-0000-000000000004', 'packageComparison', true),
('00000000-0000-0000-0000-000000000004', 'imageGalleryUpload', false)
ON CONFLICT (tenant_id, plugin_name) DO NOTHING;

-- 3. SEED AGENCIES (B2B Vendors)
INSERT INTO public.agencies (id, name, email, phone, logo_url, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Alpha Travels', 'agency-alpha@example.com', '+230 5555 0001', 'https://images.unsplash.com/photo-1596422846543-75c6ff416766', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'Beta Tours', 'agency-beta@example.com', '+230 5555 0002', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'Gamma Getaways', 'agency-gamma@example.com', '+230 5555 0003', 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96', 'ACTIVE'),
('44444444-4444-4444-4444-444444444444', 'Delta Destinations', 'agency-delta@example.com', '+230 5555 0004', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', 'PENDING_VERIFICATION'),
('55555555-5555-5555-5555-555555555555', 'Epsilon Escapes', 'agency-epsilon@example.com', '+230 5555 0005', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 4. SEED AGENCY SETTINGS (Custom SMTP)
INSERT INTO public.agency_settings (agency_id, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from_email, smtp_from_name) VALUES
('11111111-1111-1111-1111-111111111111', 'smtp.mailtrap.io', 2525, 'mock-user', 'mock-pass', 'alpha@example.com', 'Alpha Travels Support'),
('22222222-2222-2222-2222-222222222222', 'smtp.mailtrap.io', 2525, 'mock-user', 'mock-pass', 'beta@example.com', 'Beta Tours Info'),
('33333333-3333-3333-3333-333333333333', 'smtp.mailtrap.io', 2525, 'mock-user', 'mock-pass', 'gamma@example.com', 'Gamma Getaways Info'),
('55555555-5555-5555-5555-555555555555', 'smtp.mailtrap.io', 2525, 'mock-user', 'mock-pass', 'epsilon@example.com', 'Epsilon Escapes Desk')
ON CONFLICT (agency_id) DO NOTHING;

-- 5. SEED BILLBOARDS (Rotating hero sliders)
INSERT INTO public.billboards (id, title, subtitle, image_url, cta_text, cta_link, is_active, display_order) VALUES
('33333333-3333-3333-3333-333333333331', 'YOUR GATEWAY TO BEAUTIFUL JOURNEYS', 'True Memories Travel & Tours acts as a bridge between traveler and tours and holidays. Explore quiet beachside strolls, guided walks, and simple packages.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', 'Discover Packages', '#packages', true, 0),
('33333333-3333-3333-3333-333333333332', '5 Days Dubai Premium Desert Safari', 'Wander through desert dunes, ride camels, and enjoy a warm BBQ dinner under the stars at Atlantis The Palm.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200', 'Book Dubai Now', '/package/pkg-1', true, 1),
('33333333-3333-3333-3333-333333333333', 'EXPLORE THE MAJESTY OF SWITZERLAND', 'Breathtaking alpine chalets, snowy peaks, and scenic train rides through Interlaken and Zermatt.', 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=1200', 'Explore Swiss Escape', '#packages', true, 2)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED PACKAGES
-- Changed image for Kuala Lumpur Shopping Fiesta (44444444-4444-4444-4444-444444444442) to local public image assets folder location: /images/kuala_lumpur_shopping_fiesta.png
INSERT INTO public.packages (id, agency_id, title, destination, base_price_mur, travel_month, hotel_name, hotel_stars, description, image_url, is_active, is_archived) VALUES
('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', '5 Days Dubai Premium Desert Safari', 'DUBAI', 45000.00, '2026-08', 'Atlantis The Palm', 5, 'Wander through desert dunes, ride camels, and enjoy a warm BBQ dinner under the stars.', 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&q=80&w=800', true, false),
('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', 'Kuala Lumpur Shopping Fiesta', 'MALAYSIA', 32000.00, '2026-09', 'Luxury Inn', 4, 'Shop till you drop in the heart of Kuala Lumpur. Guided shopping tour.', '/images/kuala_lumpur_shopping_fiesta.png', true, false),
('44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', '7 Days Enchanting Paris Romantic Escape', 'PARIS', 89000.00, '2026-10', 'Hotel Plaza Athenee', 5, 'Indulge in romantic strolls, visit the Eiffel Tower at night, and savor authentic French cuisine.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800', true, false),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Tokyo & Kyoto Cultural Explorer', 'JAPAN', 115000.00, '2026-11', 'Kyoto Grand Royal', 4, 'Experience the balance between hyper-modern Tokyo and the ancient temple gardens of Kyoto during autumn leaf season.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800', true, false),
('44444444-4444-4444-4444-444444444445', '33333333-3333-3333-3333-333333333333', 'Cape Town & Garden Route Adventure', 'SOUTH AFRICA', 56000.00, '2026-08', 'Table Mountain Lodge', 4, 'Ride cableways, explore penguin colonies, and drive the gorgeous scenic ocean highway route.', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800', true, false),
('44444444-4444-4444-4444-444444444446', '55555555-5555-5555-5555-555555555555', 'Swiss Alps Winter Ski Chalet', 'SWITZERLAND', 135000.00, '2026-12', 'Zermatt Ski Lodge', 5, 'World-class skiing at the Matterhorn, luxury alpine wellness, and hot cheese fondue dinners.', 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=800', true, false),
('44444444-4444-4444-4444-444444444447', '33333333-3333-3333-3333-333333333333', 'Bangkok Temple & Street Food Tour', 'THAILAND', 28000.00, '2026-09', 'The Riverfront Bangkok', 3, 'Marvel at the Grand Palace, ride tuk-tuks, and explore Michelin-guide street food stalls.', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=800', true, false),
('44444444-4444-4444-4444-444444444448', '55555555-5555-5555-5555-555555555555', 'Bali Tropical Haven Getaway', 'INDONESIA', 41000.00, '2026-09', 'Ubud Sanctuary Spa', 4, 'Relax in private villa pools, visit sacred monkey forests, and practice oceanfront yoga.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800', true, false)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED LEADS / BOOKINGS
INSERT INTO public.leads (id, package_id, assigned_agency_id, client_name, client_email, client_phone, passenger_count, selected_insurance, include_esim, upgrade_private_car, calculated_total_mur, status, payment_status) VALUES
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Jean Dupont', 'jean@example.com', '+230 5555 1234', 2, 'Premium SWAN Cover', true, false, 45000.00, 'PENDING', 'UNPAID'),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', 'Sarah Lee', 'sarah@example.com', '+230 5555 9876', 1, 'Standard Cover', false, true, 32000.00, 'CONVERTED', 'PAID'),
('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', 'Alice Johnson', 'alice@example.com', '+230 5555 4567', 2, 'Premium SWAN Cover', true, true, 178000.00, 'CONVERTED', 'PAID'),
('55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'David Miller', 'david@example.com', '+230 5555 7890', 3, 'Standard Cover', true, false, 345000.00, 'PENDING', 'UNPAID'),
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444445', '33333333-3333-3333-3333-333333333333', 'Robert Smith', 'robert@example.com', '+230 5555 3456', 2, 'No Insurance', false, false, 112000.00, 'CONVERTED', 'PAID'),
('55555555-5555-5555-5555-555555555556', '44444444-4444-4444-4444-444444444446', '55555555-5555-5555-5555-555555555555', 'Emma Watson', 'emma@example.com', '+230 5555 2345', 1, 'Premium SWAN Cover', true, true, 135000.00, 'LOST', 'UNPAID'),
('55555555-5555-5555-5555-555555555557', '44444444-4444-4444-4444-444444444447', '33333333-3333-3333-3333-333333333333', 'Michael Brown', 'michael@example.com', '+230 5555 8765', 4, 'Standard Cover', false, true, 112000.00, 'CLAIMED', 'UNPAID'),
('55555555-5555-5555-5555-555555555558', '44444444-4444-4444-4444-444444444448', '55555555-5555-5555-5555-555555555555', 'Sophia Davis', 'sophia@example.com', '+230 5555 6543', 2, 'Premium SWAN Cover', true, false, 82000.00, 'PENDING', 'UNPAID')
ON CONFLICT (id) DO NOTHING;

-- 8. SEED DEMO SUPER ADMIN (SQL linking template)
-- When a user registers their auth user, executing:
--   INSERT INTO public.super_admins (auth_id, email) VALUES ('<USER_AUTH_ID>', 'admin@vectomatrix.com');
-- will link them as Super Admin.
INSERT INTO public.super_admins (id, auth_id, email) VALUES
('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', 'admin@vectomatrix.com')
ON CONFLICT (id) DO NOTHING;
