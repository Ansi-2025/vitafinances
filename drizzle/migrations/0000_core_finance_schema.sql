-- PAPÉIS E PERFIS DO SISTEMA
create type public.app_role as enum ('admin','user');
create type public.member_role as enum ('owner','admin','member','viewer');

create table public.perfis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  name text,
  email text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.perfis to authenticated;
grant all on public.perfis to service_role;
alter table public.perfis enable row level security;

create table public.papeis_usuarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.papeis_usuarios to authenticated;
grant all on public.papeis_usuarios to service_role;
alter table public.papeis_usuarios enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.papeis_usuarios where user_id = _user_id and role = _role)
$$;

create policy "own profile select" on public.perfis for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.perfis for insert to authenticated with check (auth.uid() = user_id);
create policy "own profile update" on public.perfis for update to authenticated using (auth.uid() = user_id);
create policy "own roles select" on public.papeis_usuarios for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

-- CASA / FAMÍLIA
create table public.domicilios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.domicilios to authenticated;
grant all on public.domicilios to service_role;
alter table public.domicilios enable row level security;

create table public.membros_domicilios (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.domicilios(id) on delete cascade,
  user_id uuid not null,
  role public.member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (household_id, user_id)
);
grant select, insert, update, delete on public.membros_domicilios to authenticated;
grant all on public.membros_domicilios to service_role;
alter table public.membros_domicilios enable row level security;

create or replace function public.is_household_member(_household_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.membros_domicilios where household_id = _household_id and user_id = _user_id)
$$;

create policy "household read" on public.domicilios for select to authenticated using (owner_id = auth.uid() or public.is_household_member(id, auth.uid()));
create policy "household insert" on public.domicilios for insert to authenticated with check (owner_id = auth.uid());
create policy "household update" on public.domicilios for update to authenticated using (owner_id = auth.uid());
create policy "household delete" on public.domicilios for delete to authenticated using (owner_id = auth.uid());
create policy "members read" on public.membros_domicilios for select to authenticated using (user_id = auth.uid() or public.is_household_member(household_id, auth.uid()));
create policy "members insert" on public.membros_domicilios for insert to authenticated with check (exists (select 1 from public.domicilios h where h.id = household_id and h.owner_id = auth.uid()));
create policy "members delete" on public.membros_domicilios for delete to authenticated using (exists (select 1 from public.domicilios h where h.id = household_id and h.owner_id = auth.uid()));

-- CATEGORIAS
create table public.categorias_rendas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);
create table public.categorias_despesas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  color text,
  created_at timestamptz not null default now()
);
create table public.subcategorias_despesas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid not null references public.categorias_despesas(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create table public.metodos_pagamento (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);
create table public.tipos_investimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- MOVIMENTOS FINANCEIROS
create table public.receitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.domicilios(id) on delete set null,
  category_id uuid references public.categorias_rendas(id) on delete set null,
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
create table public.despesas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.domicilios(id) on delete set null,
  category_id uuid references public.categorias_despesas(id) on delete set null,
  subcategory_id uuid references public.subcategorias_despesas(id) on delete set null,
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
create table public.investimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.domicilios(id) on delete set null,
  investment_type_id uuid references public.tipos_investimentos(id) on delete set null,
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
create table public.transacoes_investimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  investment_id uuid not null references public.investimentos(id) on delete cascade,
  type text not null,
  amount numeric(14,2) not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);
create table public.metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid references public.domicilios(id) on delete set null,
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
create table public.configuracoes_usuario (
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
create table public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  plan text not null default 'free',
  status text not null default 'active',
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.logs_auditoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- PERMISSÕES E RLS PARA TABELAS DO USUÁRIO
do $$
declare t text;
begin
  foreach t in array array['categorias_rendas','categorias_despesas','subcategorias_despesas','metodos_pagamento','tipos_investimentos','receitas','despesas','investimentos','transacoes_investimentos','metas','configuracoes_usuario','assinaturas','notificacoes','logs_auditoria']
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

create index on public.receitas (user_id, date);
create index on public.despesas (user_id, date);
create index on public.investimentos (user_id);
create index on public.metas (user_id);

-- BOOTSTRAP NO CADASTRO
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare c text;
begin
  insert into public.perfis (user_id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.email)
  on conflict (user_id) do nothing;

  insert into public.papeis_usuarios (user_id, role) values (new.id, 'user') on conflict do nothing;
  insert into public.configuracoes_usuario (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.assinaturas (user_id) values (new.id) on conflict (user_id) do nothing;

  foreach c in array array['Salário','Renda extra','Freelance','Rendimentos','Outros'] loop
    insert into public.categorias_rendas (user_id, name) values (new.id, c);
  end loop;
  foreach c in array array['Moradia','Alimentação','Transporte','Saúde','Educação','Lazer','Compras','Assinaturas','Contas','Impostos','Outros'] loop
    insert into public.categorias_despesas (user_id, name) values (new.id, c);
  end loop;
  foreach c in array array['Pix','Dinheiro','Débito','Crédito','Boleto','Transferência','Outros'] loop
    insert into public.metodos_pagamento (user_id, name) values (new.id, c);
  end loop;
  foreach c in array array['Renda fixa','Ações','FIIs','ETFs','Fundos','Criptomoedas','Previdência','Outros'] loop
    insert into public.tipos_investimentos (user_id, name) values (new.id, c);
  end loop;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();