-- Add is_ended column to meetings table to allow manual completion control
-- Run this in your Supabase SQL Editor

ALTER TABLE meetings ADD COLUMN IF NOT EXISTS is_ended BOOLEAN DEFAULT false;

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(is_ended);
