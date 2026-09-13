-- Migração de correção para o banco Supabase já existente.
-- Use este script no SQL editor do Supabase quando a base foi criada com os nomes em inglês.
-- Ele é idempotente: pode ser executado novamente sem quebrar o banco.

-- 1) Renomear as tabelas existentes para o padrão em português.
ALTER TABLE IF EXISTS public.audit_logs RENAME TO logs_auditoria;
ALTER TABLE IF EXISTS public.expense_categories RENAME TO categorias_despesas;
ALTER TABLE IF EXISTS public.expense_subcategories RENAME TO subcategorias_despesas;
ALTER TABLE IF EXISTS public.expenses RENAME TO despesas;
ALTER TABLE IF EXISTS public.goals RENAME TO metas;
ALTER TABLE IF EXISTS public.household_members RENAME TO membros_domicilios;
ALTER TABLE IF EXISTS public.households RENAME TO domicilios;
ALTER TABLE IF EXISTS public.income_categories RENAME TO categorias_rendas;
ALTER TABLE IF EXISTS public.incomes RENAME TO receitas;
ALTER TABLE IF EXISTS public.investment_transactions RENAME TO transacoes_investimentos;
ALTER TABLE IF EXISTS public.investment_types RENAME TO tipos_investimentos;
ALTER TABLE IF EXISTS public.investments RENAME TO investimentos;
ALTER TABLE IF EXISTS public.notifications RENAME TO notificacoes;
ALTER TABLE IF EXISTS public.payment_methods RENAME TO metodos_pagamento;
ALTER TABLE IF EXISTS public.profiles RENAME TO perfis;
ALTER TABLE IF EXISTS public.subscriptions RENAME TO assinaturas;
ALTER TABLE IF EXISTS public.user_roles RENAME TO papeis_usuarios;
ALTER TABLE IF EXISTS public.user_settings RENAME TO configuracoes_usuario;

-- 2) Atualizar funções que ainda apontam para nomes antigos.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.papeis_usuarios
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_household_member(_household_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.membros_domicilios
    WHERE household_id = _household_id
      AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE c text;
BEGIN
  INSERT INTO public.perfis (user_id, name, email)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.papeis_usuarios (user_id, role)
  VALUES (new.id, 'user')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.configuracoes_usuario (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.assinaturas (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  FOREACH c IN ARRAY ARRAY[
    'Salário', 'Renda extra', 'Freelance', 'Rendimentos', 'Outros'
  ] LOOP
    INSERT INTO public.categorias_rendas (user_id, name)
    VALUES (new.id, c);
  END LOOP;

  FOREACH c IN ARRAY ARRAY[
    'Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação',
    'Lazer', 'Compras', 'Assinaturas', 'Contas', 'Impostos', 'Outros'
  ] LOOP
    INSERT INTO public.categorias_despesas (user_id, name)
    VALUES (new.id, c);
  END LOOP;

  FOREACH c IN ARRAY ARRAY[
    'Pix', 'Dinheiro', 'Débito', 'Crédito', 'Boleto', 'Transferência', 'Outros'
  ] LOOP
    INSERT INTO public.metodos_pagamento (user_id, name)
    VALUES (new.id, c);
  END LOOP;

  FOREACH c IN ARRAY ARRAY[
    'Renda fixa', 'Ações', 'FIIs', 'ETFs', 'Fundos', 'Criptomoedas', 'Previdência', 'Outros'
  ] LOOP
    INSERT INTO public.tipos_investimentos (user_id, name)
    VALUES (new.id, c);
  END LOOP;

  RETURN NEW;
END;
$$;

-- 3) Atualizar trigger de criação do usuário, se houver uma função já registrada.
-- O trigger em si continua ligado a auth.users e chama a função pelo nome.
-- Se necessário, ele permanece válido após a redefinição da função acima.

-- 4) Observação final:
-- As policies e os triggers ficam vinculados à tabela renomeada automaticamente pelo Postgres,
-- então normalmente não é necessário recriar esses objetos manualmente.
