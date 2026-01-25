-- =====================================================
-- ORGANIZATION SUBSCRIPTION SYSTEM SCHEMA
-- =====================================================
-- This schema adds support for organization-based subscriptions
-- with email whitelisting and admin management.

-- =====================================================
-- 1. ORGANIZATIONS TABLE
-- =====================================================
-- Stores organization subscription details
create table organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique not null, -- Unique organization access code
  admin_email text not null, -- Primary admin email
  price_per_seat numeric default 10.00,
  max_seats integer not null, -- Maximum number of seats/members allowed (paid for)
  subscription_duration_months integer not null,
  subscription_start timestamp with time zone not null,
  subscription_end timestamp with time zone not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table organizations enable row level security;

-- Policy: Allow service role full access
create policy "Enable all access for service role" on organizations for all using (true);

-- =====================================================
-- 2. ORGANIZATION MEMBERS TABLE
-- =====================================================
-- Stores whitelisted member emails for each organization
create table organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  added_by text, -- Email of admin who added this member
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure each email is unique per organization
  unique(organization_id, email)
);

-- Enable RLS
alter table organization_members enable row level security;

-- Policy: Allow service role full access
create policy "Enable all access for service role" on organization_members for all using (true);

-- Index for faster email lookups
create index idx_org_members_org_email on organization_members(organization_id, email);

-- =====================================================
-- 3. ORGANIZATION ADMINS TABLE
-- =====================================================
-- Stores admin users who can manage the organization
create table organization_admins (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  password_hash text not null, -- Hashed password for admin login
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure each email is unique per organization
  unique(organization_id, email)
);

-- Enable RLS
alter table organization_admins enable row level security;

-- Policy: Allow service role full access
create policy "Enable all access for service role" on organization_admins for all using (true);

-- Index for faster admin lookups
create index idx_org_admins_email on organization_admins(email);

-- =====================================================
-- 4. UPDATE ACCESS_CODES TABLE
-- =====================================================
-- Add columns to support organization codes
-- Note: Run this AFTER creating the organizations table

-- Add is_organization flag
alter table access_codes add column if not exists is_organization boolean default false;

-- Add organization_id reference
alter table access_codes add column if not exists organization_id uuid references organizations(id) on delete cascade;

-- Add checkout_session_id if not exists (for individual subscriptions)
alter table access_codes add column if not exists checkout_session_id text;

-- Index for faster organization code lookups
create index if not exists idx_access_codes_org on access_codes(organization_id) where is_organization = true;

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at on organizations
create trigger update_organizations_updated_at
  before update on organizations
  for each row
  execute function update_updated_at_column();

-- =====================================================
-- 6. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================
-- Uncomment to insert test data

-- INSERT INTO organizations (name, code, admin_email, subscription_duration_months, subscription_start, subscription_end)
-- VALUES (
--   'Test Company Inc',
--   'ORG-TEST-001',
--   'admin@testcompany.com',
--   12,
--   timezone('utc'::text, now()),
--   timezone('utc'::text, now()) + interval '12 months'
-- );

-- INSERT INTO organization_members (organization_id, email, added_by)
-- SELECT id, 'member1@testcompany.com', 'admin@testcompany.com'
-- FROM organizations WHERE code = 'ORG-TEST-001';

-- INSERT INTO organization_members (organization_id, email, added_by)
-- SELECT id, 'member2@testcompany.com', 'admin@testcompany.com'
-- FROM organizations WHERE code = 'ORG-TEST-001';
