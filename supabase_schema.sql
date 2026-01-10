-- Create a table for access codes
create table access_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  is_active boolean default true,
  plan text,
  expires_at timestamp with time zone,
  assigned_to text, -- Optional: could be user email or name
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table access_codes enable row level security;

-- Create a policy that allows read access to everyone (or restrict as needed)
-- For this simple use case, we might want to allow checking if a code exists/is valid via the API (using service role) 
-- so strictly speaking public read access might not be needed if we only access via server-side API.
-- However, if we want to query from client:
create policy "Enable read access for all users" on access_codes for select using (true);

-- Table for scheduled meetings tied to access codes
create table meetings (
  id uuid default gen_random_uuid() primary key,
  title text,
  meeting_number text not null,
  meeting_password text,
  start_time timestamp with time zone,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table meetings enable row level security;

create policy "Enable insert for service role only" on meetings for insert using (true);
