-- Supabase Live Database Schema for VectoMatrix Ecosystem

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- SUPER ADMINS
CREATE TABLE public.super_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- AGENCIES (B2B Vendors)
CREATE TABLE public.agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase Auth
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  logo_url TEXT,
  status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION', -- ACTIVE, SUSPENDED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- PACKAGES (Inventory)
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  base_price_mur DECIMAL(10,2) NOT NULL,
  travel_month VARCHAR(7), -- e.g. "2026-08"
  hotel_name VARCHAR(255),
  hotel_stars INT DEFAULT 4,
  description TEXT,
  image_url TEXT,
  service_type VARCHAR(50) DEFAULT 'package',
  flight_included BOOLEAN DEFAULT true,
  meal_plan VARCHAR(100) DEFAULT 'Breakfast Included',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- LEADS / BOOKINGS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  assigned_agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  passenger_count INT DEFAULT 1,
  selected_insurance VARCHAR(100) DEFAULT 'Standard Cover',
  include_esim BOOLEAN DEFAULT false,
  upgrade_private_car BOOLEAN DEFAULT false,
  calculated_total_mur DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CLAIMED, CONVERTED, LOST
  payment_status VARCHAR(50) DEFAULT 'UNPAID', -- UNPAID, PAID (for Stripe integration)
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- AGENCY SETTINGS (Custom SMTP & Email Templates)
CREATE TABLE public.agency_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Custom SMTP configuration
  smtp_host VARCHAR(255),
  smtp_port INT,
  smtp_user VARCHAR(255),
  smtp_pass TEXT, -- Should ideally be encrypted at application level before inserting
  smtp_from_email VARCHAR(255),
  smtp_from_name VARCHAR(255),
  
  -- Email Templates
  template_lead_received TEXT DEFAULT '<h1>New Lead Received</h1><p>You have received a new inquiry from {{client_name}}.</p>',
  template_lead_converted TEXT DEFAULT '<h1>Booking Confirmed</h1><p>Dear {{client_name}}, your booking for {{package_title}} is confirmed.</p>',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- BILLBOARDS (Hero slider)
CREATE TABLE public.billboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  link_url TEXT,
  cta_text VARCHAR(100) DEFAULT 'Book Now',
  cta_link VARCHAR(255) DEFAULT '/',
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- TENANT CONFIG (SaaS Configuration)
CREATE TABLE public.tenant_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_name VARCHAR(255) NOT NULL DEFAULT 'VectoMatrix Travel & Tours',
  primary_color VARCHAR(50) DEFAULT '#ea580c',
  logo_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_config ENABLE ROW LEVEL SECURITY;

-- SUPER ADMINS: Only super admins can see the super admin table
CREATE POLICY "Super admins view super admins" ON public.super_admins FOR SELECT USING (auth.uid() = auth_id);

-- AGENCIES: Can read all, but only update their own profile (Super Admin can do all)
CREATE POLICY "Agencies can view all profiles" ON public.agencies FOR SELECT USING (true);
CREATE POLICY "Agencies can update own profile" ON public.agencies FOR UPDATE USING (auth.uid() = auth_id OR auth.uid() IN (SELECT auth_id FROM public.super_admins));
CREATE POLICY "Agencies can insert own profile" ON public.agencies FOR INSERT WITH CHECK (auth.uid() = auth_id);
CREATE POLICY "Super admin can manage agencies" ON public.agencies FOR ALL USING (auth.uid() IN (SELECT auth_id FROM public.super_admins));

-- AGENCY SETTINGS: Agencies read/update their own settings
CREATE POLICY "Agencies read own settings" ON public.agency_settings FOR SELECT USING (auth.uid() = agency_id);
CREATE POLICY "Agencies update own settings" ON public.agency_settings FOR UPDATE USING (auth.uid() = agency_id);
CREATE POLICY "Agencies insert own settings" ON public.agency_settings FOR INSERT WITH CHECK (auth.uid() = agency_id);

-- BILLBOARDS: Public read, Super Admin all
CREATE POLICY "Public read active billboards" ON public.billboards FOR SELECT USING (is_active = true);

-- TENANT CONFIG: Public read, Super Admin all
CREATE POLICY "Public read active tenant config" ON public.tenant_config FOR SELECT USING (is_active = true);
-- PACKAGES: Anyone can read active packages. Agencies can fully manage their own packages. (Super Admin can do all)
CREATE POLICY "Anyone can view active packages" ON public.packages FOR SELECT USING (is_active = true AND is_archived = false);
CREATE POLICY "Agencies can manage own packages" ON public.packages FOR ALL USING (
  agency_id IN (SELECT id FROM public.agencies WHERE auth_id = auth.uid()) 
  OR auth.uid() IN (SELECT auth_id FROM public.super_admins)
);

-- LEADS: Agencies can only see and update leads assigned to them. (Super Admin can do all)
CREATE POLICY "Agencies can manage own leads" ON public.leads FOR ALL USING (
  assigned_agency_id IN (SELECT id FROM public.agencies WHERE auth_id = auth.uid())
  OR auth.uid() IN (SELECT auth_id FROM public.super_admins)
);
-- Consumers can insert leads anonymously
CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);

-- AGENCY SETTINGS: Agencies can fully manage their own settings. (Super Admin can do all)
CREATE POLICY "Agencies can manage own settings" ON public.agency_settings FOR ALL USING (
  agency_id IN (SELECT id FROM public.agencies WHERE auth_id = auth.uid())
  OR auth.uid() IN (SELECT auth_id FROM public.super_admins)
);

-- 4. RPC FUNCTIONS (For Analytics)

-- Get Metrics for a Specific Agency
CREATE OR REPLACE FUNCTION get_agency_metrics(p_agency_id UUID)
RETURNS JSON AS $$
DECLARE
  v_total_leads INT;
  v_converted_leads INT;
  v_revenue DECIMAL(10,2);
  v_active_packages INT;
BEGIN
  SELECT count(*) INTO v_total_leads FROM public.leads WHERE assigned_agency_id = p_agency_id;
  SELECT count(*) INTO v_converted_leads FROM public.leads WHERE assigned_agency_id = p_agency_id AND status = 'CONVERTED';
  SELECT coalesce(sum(calculated_total_mur), 0) INTO v_revenue FROM public.leads WHERE assigned_agency_id = p_agency_id AND status = 'CONVERTED';
  SELECT count(*) INTO v_active_packages FROM public.packages WHERE agency_id = p_agency_id AND is_active = true;

  RETURN json_build_object(
    'totalLeads', v_total_leads,
    'conversionRate', CASE WHEN v_total_leads > 0 THEN round((v_converted_leads::numeric / v_total_leads::numeric) * 100, 1) ELSE 0 END,
    'revenueGenerated', v_revenue,
    'activePackages', v_active_packages,
    'recentActivity', (
      SELECT json_agg(json_build_object(
        'id', id,
        'action', status,
        'detail', client_name || ' - Rs ' || calculated_total_mur,
        'time', created_at
      ))
      FROM (
        SELECT id, status, client_name, calculated_total_mur, created_at 
        FROM public.leads 
        WHERE assigned_agency_id = p_agency_id 
        ORDER BY created_at DESC LIMIT 5
      ) sub
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Global Metrics for Super Admin
CREATE OR REPLACE FUNCTION get_superadmin_metrics()
RETURNS JSON AS $$
DECLARE
  v_total_agencies INT;
  v_total_packages INT;
  v_system_gmv DECIMAL(10,2);
BEGIN
  SELECT count(*) INTO v_total_agencies FROM public.agencies;
  SELECT count(*) INTO v_total_packages FROM public.packages WHERE is_active = true;
  SELECT coalesce(sum(calculated_total_mur), 0) INTO v_system_gmv FROM public.leads WHERE status = 'CONVERTED';

  RETURN json_build_object(
    'totalAgencies', v_total_agencies,
    'totalActivePackages', v_total_packages,
    'systemGMV', v_system_gmv,
    'recentAgencies', (
      SELECT json_agg(json_build_object(
        'id', id,
        'name', name,
        'status', status,
        'joined', created_at
      ))
      FROM (
        SELECT id, name, status, created_at 
        FROM public.agencies 
        ORDER BY created_at DESC LIMIT 5
      ) sub
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* Redundant declaration commented out for safety:
-- BILLBOARDS (Promotional Slider)
CREATE TABLE public.billboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url TEXT NOT NULL,
  cta_text VARCHAR(100) DEFAULT 'Book Now',
  cta_link VARCHAR(255) DEFAULT '/',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
*/

ALTER TABLE public.billboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active billboards" ON public.billboards 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Super admin can manage billboards" ON public.billboards 
  FOR ALL USING (auth.uid() IN (SELECT auth_id FROM public.super_admins));

-- SAAS MULTI-TENANT CONFIGURATION TABLES
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  primary_color VARCHAR(50) DEFAULT '#ea580c',
  logo_text VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.tenant_plugins (
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  plugin_name VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (tenant_id, plugin_name)
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_plugins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tenants" ON public.tenants FOR SELECT USING (true);
CREATE POLICY "Super admin can manage tenants" ON public.tenants FOR ALL USING (auth.uid() IN (SELECT auth_id FROM public.super_admins));

CREATE POLICY "Anyone can view tenant plugins" ON public.tenant_plugins FOR SELECT USING (true);
CREATE POLICY "Super admin can manage tenant plugins" ON public.tenant_plugins FOR ALL USING (auth.uid() IN (SELECT auth_id FROM public.super_admins));


