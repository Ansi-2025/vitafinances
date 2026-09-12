-- ROLES
create type public.app_role as enum ('admin','user');
create type public.member_role as enum ('owner','admin','member','viewer');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  name text,
  email text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = user_id);
create policy "own roles select" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

-- HOUSEHOLDS
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.households to authenticated;
grant all on public.households to service_role;
alter table public.households enable row level security;

create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null,
  role public.member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (household_id, user_id)
);
grant select, insert, update, delete on public.household_members to authenticated;
grant all on public.household_members to service_role;
alter table public.household_members enable row level security;

create or replace function public.is_household_member(_household_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.household_members where household_id = _household_id and user_id = _user_id)
$$;

create policy "household read" on public.households for select to authenticated using (owner_id = auth.uid() or public.is_household_member(id, auth.uid()));
create policy "household insert" on public.households for insert to authenticated with check (owner_id = auth.uid());
create policy "household update" on public.households for update to authenticated using (owner_id = auth.uid());
create policy "household delete" on public.households for delete to authenticated using (owner_id = auth.uid());
create policy "members read" on public.household_members for select to authenticated using (user_id = auth.uid() or public.is_household_member(household_id, auth.uid()));
create policy "members insert" on public.household_members for insert to authenticated with check (exists (select 1 from public.households h where h.id = household_id and h.owner_id = auth.uid()));
create policy "members delete" on public.household_members for delete to authenticated using (exists (select 1 from public.households h where h.id = household_id and h.owner_id = auth.uid()));

-- CATEGORIES
create table public.income_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);
create table public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  color text,
  created_at timestamptz not null default now()
);
create table public.expense_subcategories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid not null references public.expense_categories(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);
create table public.investment_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- MOVEMENTS
create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.households(id) on delete set null,
  category_id uuid references public.income_categories(id) on delete set null,
  description text not null,
  amount numeric(14,2) not null check (amount >= 0),
  date date not null default current_date,
  recurring boolean not null default false,
  recurrence_type text,
  account text,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.households(id) on delete set null,
  category_id uuid references public.expense_categories(id) on delete set null,
  subcategory_id uuid references public.expense_subcategories(id) on delete set null,
  description text not null,
  amount numeric(14,2) not null check (amount >= 0),
  date date not null default current_date,
  payment_method text,
  expense_type text not null default 'variavel',
  payment_status text not null default 'pago',
  essential boolean not null default true,
  recurring boolean not null default false,
  recurrence_type text,
  account text,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.households(id) on delete set null,
  investment_type_id uuid references public.investment_types(id) on delete set null,
  name text not null,
  institution text,
  invested_amount numeric(14,2) not null default 0,
  current_value numeric(14,2) not null default 0,
  investment_date date not null default current_date,
  monthly_contribution numeric(14,2) not null default 0,
  objective text,
  deadline date,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.investment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  investment_id uuid not null references public.investments(id) on delete cascade,
  type text not null,
  amount numeric(14,2) not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.households(id) on delete set null,
  name text not null,
  description text,
  target_amount numeric(14,2) not null check (target_amount > 0),
  current_amount numeric(14,2) not null default 0,
  monthly_contribution numeric(14,2) not null default 0,
  target_date date,
  category text,
  priority text not null default 'media',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  currency text not null default 'BRL',
  theme text not null default 'light',
  conservative_rate numeric(6,2) not null default 6,
  moderate_rate numeric(6,2) not null default 10,
  optimistic_rate numeric(6,2) not null default 13,
  monthly_income_estimate numeric(14,2),
  monthly_expense_estimate numeric(14,2),
  monthly_investment_target numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  plan text not null default 'free',
  status text not null default 'active',
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- GRANTS + RLS for user-owned tables
do $$
declare t text;
begin
  foreach t in array array['income_categories','expense_categories','expense_subcategories','payment_methods','investment_types','incomes','expenses','investments','investment_transactions','goals','user_settings','subscriptions','notifications','audit_logs']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own select" on public.%I for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),''admin''))', t);
    execute format('create policy "own insert" on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('create policy "own update" on public.%I for update to authenticated using (auth.uid() = user_id)', t);
    execute format('create policy "own delete" on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
  end loop;
end $$;

create index on public.incomes (user_id, date);
create index on public.expenses (user_id, date);
create index on public.investments (user_id);
create index on public.goals (user_id);

-- SIGNUP BOOTSTRAP
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare c text;
begin
  insert into public.profiles (user_id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.email)
  on conflict (user_id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  insert into public.user_settings (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.subscriptions (user_id) values (new.id) on conflict (user_id) do nothing;

  foreach c in array array['Salário','Renda extra','Freelance','Rendimentos','Outros'] loop
    insert into public.income_categories (user_id, name) values (new.id, c);
  end loop;
  foreach c in array array['Moradia','Alimentação','Transporte','Saúde','Educação','Lazer','Compras','Assinaturas','Contas','Impostos','Outros'] loop
    insert into public.expense_categories (user_id, name) values (new.id, c);
  end loop;
  foreach c in array array['Pix','Dinheiro','Débito','Crédito','Boleto','Transferência','Outros'] loop
    insert into public.payment_methods (user_id, name) values (new.id, c);
  end loop;
  foreach c in array array['Renda fixa','Ações','FIIs','ETFs','Fundos','Criptomoedas','Previdência','Outros'] loop
    insert into public.investment_types (user_id, name) values (new.id, c);
  end loop;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();