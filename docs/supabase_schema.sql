-- ========================================================
-- VECTOMATRIX: MASTER SUPABASE SQL BLUEPRINT
-- Description: Execute this file in your Supabase SQL Editor
-- when you are ready to migrate from Mock Data to Live.
-- ========================================================

-- 1. Custom Types / Enums
CREATE TYPE lead_status AS ENUM ('PENDING', 'CLAIMED', 'CONVERTED', 'LOST');
CREATE TYPE destination_enum AS ENUM ('DUBAI', 'MALAYSIA', 'SOUTH_AFRICA', 'RODRIGUES', 'REUNION');

-- 2. Agencies Table (Vendor Profiles)
CREATE TABLE public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Bound to Supabase Auth
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL CHECK (phone ~ '^\+[1-9]\d{1,14}$'), -- E.164 standard Validation
    brn_number TEXT UNIQUE, -- Business Registration Number
    bio TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Feature Toggles (Settings Page Configuration)
    setting_accept_payments BOOLEAN DEFAULT false,
    setting_enable_sms BOOLEAN DEFAULT false
);

-- 3. Packages Table (Inventory)
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    destination destination_enum NOT NULL,
    base_price_mur INTEGER NOT NULL CHECK (base_price_mur > 0),
    travel_month TEXT NOT NULL,
    hotel_name TEXT,
    hotel_stars INTEGER CHECK (hotel_stars BETWEEN 1 AND 5),
    hotel_location TEXT,
    baggage_allowance TEXT,
    transfer_type TEXT,
    image_url TEXT, -- Link to Supabase Storage Bucket
    is_active BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Leads Table (CRM Pipeline)
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    assigned_agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL CHECK (client_phone ~ '^\+[1-9]\d{1,14}$'),
    passenger_count INTEGER NOT NULL DEFAULT 1 CHECK (passenger_count > 0),
    selected_insurance TEXT DEFAULT 'Standard',
    include_esim BOOLEAN DEFAULT false,
    upgrade_private_car BOOLEAN DEFAULT false,
    calculated_total_mur INTEGER NOT NULL,
    status lead_status DEFAULT 'PENDING',
    payment_status TEXT DEFAULT 'UNPAID', -- Used if setting_accept_payments is TRUE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- STORAGE BUCKETS
-- ========================================================
-- Create public bucket for package images
INSERT INTO storage.buckets (id, name, public) VALUES ('package_images', 'package_images', true);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 1. Public can view active, non-archived packages
CREATE POLICY "Public can view active packages" 
ON public.packages FOR SELECT 
USING (is_active = true AND is_archived = false);

-- 2. Anyone can submit a lead (Consumers)
CREATE POLICY "Anyone can insert a lead" 
ON public.leads FOR INSERT 
WITH CHECK (true);

-- 3. Agencies can only view/update their own packages
CREATE POLICY "Agencies can manage their packages" 
ON public.packages FOR ALL 
USING (agency_id IN (SELECT id FROM public.agencies WHERE auth_id = auth.uid()));

-- 4. Agencies can only view/update leads assigned to them
CREATE POLICY "Agencies can manage their assigned leads" 
ON public.leads FOR ALL 
USING (assigned_agency_id IN (SELECT id FROM public.agencies WHERE auth_id = auth.uid()));

-- 5. Agencies can manage their own profile and settings
CREATE POLICY "Agencies can manage their profile" 
ON public.agencies FOR ALL 
USING (auth_id = auth.uid());

-- Storage Bucket Policies
CREATE POLICY "Public Image Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'package_images');

CREATE POLICY "Agencies can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'package_images' 
  AND auth.role() = 'authenticated'
);
