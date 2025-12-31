-- ==========================================
-- O'Flock Supabase Architecture Schema
-- ==========================================

-- 1. Profiles Table
-- Mirrors auth.users for easier joins and public info access if needed.
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Secure the table
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Trigger to create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Missions Table
-- Stores generated business ideas and blueprints.
create table public.missions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null, -- Intentionally NOT cascading delete to preserve history if needed, or use cascade if hard delete desired
  title text not null,
  idea_summary text,
  blueprint jsonb, -- Using JSONB for flexibility with the blueprint structure
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index missions_user_id_idx on public.missions(user_id);

alter table public.missions enable row level security;

create policy "Users can view own missions"
  on public.missions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own missions"
  on public.missions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own missions"
  on public.missions for update
  using ( auth.uid() = user_id );

create policy "Users can delete own missions"
  on public.missions for delete
  using ( auth.uid() = user_id );


-- 3. Usage Limits (Freemium Logic)
-- Tracks how many ideas a user has generated.
create table public.usage_limits (
  user_id uuid references auth.users(id) on delete cascade primary key,
  ideas_generated_count int default 0,
  last_reset_date timestamptz default now()
);

alter table public.usage_limits enable row level security;

-- Everyone can read their own limits to show in UI
create policy "Users can view own limits"
  on public.usage_limits for select
  using ( auth.uid() = user_id );

-- Only system (via functions) should typically update this, but for MVP we might allow RLS update if client-side tracking (not recommended for secure limits).
-- Better approach: Increment via Database Function.

-- Function to safely increment usage with Lazy Monthly Reset
create or replace function increment_usage(row_user_id uuid)
returns void as $$
declare
  current_limit record;
begin
  -- Get current usage record
  select * into current_limit from public.usage_limits where user_id = row_user_id;

  -- If no record exists, create one (first usage)
  if not found then
    insert into public.usage_limits (user_id, ideas_generated_count, last_reset_date)
    values (row_user_id, 1, now());
    return;
  end if;

  -- Check if we need to reset (older than 1 month)
  if current_limit.last_reset_date < (now() - interval '1 month') then
    -- Reset count to 1 (current usage), update reset date
    update public.usage_limits
    set ideas_generated_count = 1,
        last_reset_date = now()
    where user_id = row_user_id;
  else
    -- Just increment
    update public.usage_limits
    set ideas_generated_count = ideas_generated_count + 1
    where user_id = row_user_id;
  end if;
end;
$$ language plpgsql security definer;


-- Function to check if user can generate (Freemium + Subscription check + Lazy Reset Check)
create or replace function can_generate_mission(check_user_id uuid)
returns boolean as $$
declare
  has_active_sub boolean;
  current_limit record;
  limit_per_period int := 5;
begin
  -- 1. Check Subscription
  select exists (
    select 1 from public.subscriptions 
    where user_id = check_user_id 
    and status = 'active'
    and (expires_at is null or expires_at > now()) -- valid lifetime or unexpired sub
  ) into has_active_sub;

  if has_active_sub then
    return true;
  end if;

  -- 2. Check Free Usage
  select * into current_limit from public.usage_limits where user_id = check_user_id;

  -- If no record, they haven't used any (or allow first one)
  if not found then
    return true;
  end if;

  -- Lazy Reset Check (Simulate reset for the check)
  if current_limit.last_reset_date < (now() - interval '1 month') then
    return true; -- It WOULD reset on next increment, so they are free to go
  end if;

  if current_limit.ideas_generated_count < limit_per_period then
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql security definer;
