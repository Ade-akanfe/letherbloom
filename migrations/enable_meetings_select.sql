-- Allow reading meetings from the frontend (required for direct Supabase fetch)
-- Run this in your Supabase SQL Editor

-- Ensure select policy exists for any authenticated/anonymous user if appropriate
-- For restricted admin access, you would normally check jwt claims, but for this project's setup:
CREATE POLICY "Enable select for all users" ON meetings FOR SELECT USING (true);
