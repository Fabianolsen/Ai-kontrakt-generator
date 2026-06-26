-- Kontrakter table
create table if not exists kontrakter (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  data jsonb not null,
  innhold text not null default '',
  status text not null default 'utkast' check (status in ('utkast', 'generert', 'signert')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Row Level Security
alter table kontrakter enable row level security;

create policy "Users can only see their own contracts"
  on kontrakter for select
  using (auth.uid() = user_id);

create policy "Users can insert their own contracts"
  on kontrakter for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contracts"
  on kontrakter for update
  using (auth.uid() = user_id);

create policy "Users can delete their own contracts"
  on kontrakter for delete
  using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger kontrakter_updated_at
  before update on kontrakter
  for each row execute function update_updated_at();
