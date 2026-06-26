-- ── contracts ────────────────────────────────────────────────────────────────
create table if not exists contracts (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  status         text        not null default 'utkast'
                             check (status in ('utkast', 'generert', 'signert')),
  form_data      jsonb       not null default '{}',
  generated_text text        not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table contracts enable row level security;

create policy "contracts: select own" on contracts
  for select using (auth.uid() = user_id);
create policy "contracts: insert own" on contracts
  for insert with check (auth.uid() = user_id);
create policy "contracts: update own" on contracts
  for update using (auth.uid() = user_id);
create policy "contracts: delete own" on contracts
  for delete using (auth.uid() = user_id);

-- ── subscriptions ─────────────────────────────────────────────────────────────
create table if not exists subscriptions (
  user_id                uuid        primary key references auth.users(id) on delete cascade,
  plan                   text        not null default 'gratis'
                                     check (plan in ('gratis', 'basis', 'pro')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  valid_until            timestamptz
);

alter table subscriptions enable row level security;

create policy "subscriptions: select own" on subscriptions
  for select using (auth.uid() = user_id);

-- Auto-provision a gratis subscription when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into subscriptions (user_id, plan)
  values (new.id, 'gratis')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── updated_at trigger ────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger contracts_updated_at
  before update on contracts
  for each row execute function update_updated_at();
