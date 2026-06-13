-- NyayaSetu Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- Last updated: NyayaSetu v2

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- USERS (auto-populated by auth trigger)
-- =====================
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  city text,
  avatar_url text,
  preferred_language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, phone, city)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'city'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================
-- LAWYERS (verified data pending — structure ready)
-- =====================
create table if not exists public.lawyers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  specialization text not null,
  city text not null,
  state text,
  experience integer not null default 0,
  rating numeric(3,2),
  phone text,
  email text,
  address text,
  languages text[] default '{}',
  bio text,
  bar_council_id text,
  is_verified boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =====================
-- CASE LIBRARY (educational landmark cases)
-- =====================
create table if not exists public.case_library (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null,
  court text not null,
  year integer not null,
  citation text unique,
  summary text not null,
  issue text not null,
  resolution text not null,
  takeaway text not null,
  tags text[] default '{}',
  is_published boolean default true,
  created_at timestamptz default now()
);

-- =====================
-- CHAT HISTORY
-- =====================
create table if not exists public.chat_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  session_id uuid not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists chat_history_user_session_idx
  on public.chat_history (user_id, session_id, created_at);

-- =====================
-- CALLBACK REQUESTS
-- =====================
create table if not exists public.callback_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete set null,
  name text not null,
  phone text not null,
  issue_type text,
  description text,
  status text default 'pending' check (status in ('pending', 'contacted', 'resolved', 'cancelled')),
  created_at timestamptz default now()
);

-- =====================
-- HELPLINES (reference table)
-- =====================
create table if not exists public.helplines (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  number text not null,
  description text,
  category text not null,
  available text,
  is_urgent boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =====================
-- CONTACT MESSAGES
-- =====================
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  category text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =====================
-- SAVED ITEMS
-- =====================
create table if not exists public.saved_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  item_type text not null check (item_type in ('case', 'lawyer', 'article')),
  item_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, item_type, item_id)
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- users: own row only
alter table public.users enable row level security;
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- chat_history: own only
alter table public.chat_history enable row level security;
drop policy if exists "chat_select_own" on public.chat_history;
drop policy if exists "chat_insert_own" on public.chat_history;
create policy "chat_select_own" on public.chat_history for select using (auth.uid() = user_id);
create policy "chat_insert_own" on public.chat_history for insert with check (auth.uid() = user_id);

-- saved_items: own only
alter table public.saved_items enable row level security;
drop policy if exists "saved_own" on public.saved_items;
create policy "saved_own" on public.saved_items for all using (auth.uid() = user_id);

-- lawyers: public read
alter table public.lawyers enable row level security;
drop policy if exists "lawyers_public_read" on public.lawyers;
create policy "lawyers_public_read" on public.lawyers for select using (is_active = true);

-- case_library: public read
alter table public.case_library enable row level security;
drop policy if exists "cases_public_read" on public.case_library;
create policy "cases_public_read" on public.case_library for select using (is_published = true);

-- helplines: public read
alter table public.helplines enable row level security;
drop policy if exists "helplines_public_read" on public.helplines;
create policy "helplines_public_read" on public.helplines for select using (is_active = true);

-- contact_messages: anyone can insert, only service role reads
alter table public.contact_messages enable row level security;
drop policy if exists "contact_insert" on public.contact_messages;
create policy "contact_insert" on public.contact_messages for insert with check (true);

-- callback_requests: anyone can insert
alter table public.callback_requests enable row level security;
drop policy if exists "callback_insert" on public.callback_requests;
create policy "callback_insert" on public.callback_requests for insert with check (true);
