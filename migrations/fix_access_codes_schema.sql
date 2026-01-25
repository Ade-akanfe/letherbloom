-- Fix for access_codes table missing columns for individual subscriptions
-- Run this in Supabase SQL Editor if you are experiencing issues with code generation

-- Add checkout_session_id if not exists (Vital for individual subscriptions)
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS checkout_session_id text;

-- Add is_organization flag if not exists
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS is_organization boolean DEFAULT false;

-- Add organization_id reference if not exists
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_access_codes_session ON access_codes(checkout_session_id);
