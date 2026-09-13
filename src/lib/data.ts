import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Range = { start: string; end: string };

const unwrap = <T,>(result: { data: T | null; error: { message: string } | null }): T => {
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as T;
};

export type Income = {
  id: string;
  description: string;
  amount: number;
  date: string;
  recurring: boolean;
  recurrence_type: string | null;
  account: string | null;
  notes: string | null;
  category_id: string | null;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string | null;
  subcategory_id: string | null;
  payment_method: string | null;
  expense_type: string;
  payment_status: string;
  essential: boolean;
  recurring: boolean;
  recurrence_type: string | null;
  account: string | null;
  notes: string | null;
};

export type Investment = {
  id: string;
  name: string;
  institution: string | null;
  invested_amount: number;
  current_value: number;
  investment_date: string;
  monthly_contribution: number;
  objective: string | null;
  deadline: string | null;
  notes: string | null;
  investment_type_id: string | null;
};

export type Goal = {
  id: string;
  name: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  target_date: string | null;
  category: string | null;
  priority: string;
};

export type NamedRow = { id: string; name: string };

export const useIncomes = (range?: Range) =>
  useQuery({
    queryKey: ["receitas", range?.start ?? "all", range?.end ?? "all"],
    queryFn: async () => {
      let query = supabase.from("receitas").select("*").order("date", { ascending: false });
      if (range) query = query.gte("date", range.start).lte("date", range.end);
      return unwrap(await query) as unknown as Income[];
    },
  });

export const useExpenses = (range?: Range) =>
  useQuery({
    queryKey: ["despesas", range?.start ?? "all", range?.end ?? "all"],
    queryFn: async () => {
      let query = supabase.from("despesas").select("*").order("date", { ascending: false });
      if (range) query = query.gte("date", range.start).lte("date", range.end);
      return unwrap(await query) as unknown as Expense[];
    },
  });

export const useInvestments = () =>
  useQuery({
    queryKey: ["investimentos"],
    queryFn: async () =>
      unwrap(
        await supabase.from("investimentos").select("*").order("investment_date", { ascending: false }),
      ) as unknown as Investment[],
  });

export const useGoals = () =>
  useQuery({
    queryKey: ["metas"],
    queryFn: async () =>
      unwrap(await supabase.from("metas").select("*").order("created_at", { ascending: false })) as unknown as Goal[],
  });

type ListTable =
  | "categorias_rendas"
  | "categorias_despesas"
  | "subcategorias_despesas"
  | "metodos_pagamento"
  | "tipos_investimentos";

export const useNamedList = (table: ListTable) =>
  useQuery({
    queryKey: [table],
    queryFn: async () =>
      unwrap(await supabase.from(table).select("id, name").order("name")) as unknown as NamedRow[],
  });

export const useProfile = () =>
  useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const { data, error } = await supabase.from("perfis").select("*").maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

export const useSettings = () =>
  useQuery({
    queryKey: ["configuracoes_usuario"],
    queryFn: async () => {
      const { data, error } = await supabase.from("configuracoes_usuario").select("*").maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

export const useSubscription = () =>
  useQuery({
    queryKey: ["assinaturas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("assinaturas").select("*").maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

export const useIsAdmin = () =>
  useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("papeis_usuarios").select("role").eq("role", "admin");
      if (error) throw new Error(error.message);
      return (data ?? []).length > 0;
    },
  });

/** Mutação genérica de escrita numa tabela do utilizador. */
export function useSaveRow<T extends Record<string, unknown>>(
  table: string,
  invalidate: string[],
  successMessage = "Guardado com sucesso.",
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: T & { id?: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Sessão expirada. Entre novamente.");
      const { id, ...values } = payload;
      const client = supabase.from(table as never);
      const result = id
        ? await client.update(values as never).eq("id", id)
        : await client.insert({ ...values, user_id: userId } as never);
      if (result.error) throw new Error(result.error.message);
      return true;
    },
    onSuccess: () => {
      invalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success(successMessage);
    },
    onError: (error: Error) => toast.error(friendlyError(error.message)),
  });
}

export function useDeleteRow(table: string, invalidate: string[]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => {
      invalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success("Registo removido.");
    },
    onError: (error: Error) => toast.error(friendlyError(error.message)),
  });
}

export const friendlyError = (message: string) => {
  if (/duplicate key/i.test(message)) return "Este registo já existe.";
  if (/permission|policy|row-level/i.test(message)) return "Não tem permissão para esta ação.";
  if (/Invalid login credentials/i.test(message)) return "E-mail ou palavra-passe incorretos.";
  if (/User already registered/i.test(message)) return "Já existe uma conta com este e-mail.";
  if (/network|fetch/i.test(message)) return "Falha de ligação. Tente novamente.";
  return message || "Algo correu mal. Tente novamente.";
};
