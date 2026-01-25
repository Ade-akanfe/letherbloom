-- Migration: Add max_seats column to organizations table
-- Run this in Supabase SQL Editor

-- Add max_seats column to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS max_seats integer NOT NULL DEFAULT 0;

-- Update existing organizations to set max_seats based on current member count
UPDATE organizations o
SET max_seats = (
  SELECT COUNT(*)
  FROM organization_members om
  WHERE om.organization_id = o.id
)
WHERE max_seats = 0;

-- Add comment to document the column
COMMENT ON COLUMN organizations.max_seats IS 'Maximum number of seats/members allowed (paid for)';
