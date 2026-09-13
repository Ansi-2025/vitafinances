import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { redirect } from "@tanstack/react-router";

import { hasSupabaseConfig, supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export type { User };

/** Caminho relativo seguro para redirecionar após autenticação. */
export const safeRedirect = (value: string | undefined | null, fallback = "/app/dashboard") =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;

export const requireSession = async () => {
  if (!hasSupabaseConfig()) return;

  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw redirect({ to: "/login" });
  }
};

export const requireAdmin = async () => {
  if (!hasSupabaseConfig()) return;

  await requireSession();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw redirect({ to: "/login" });

  const { data, error } = await supabase
    .from("papeis_usuarios")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !data) {
    throw redirect({ to: "/login" });
  }
};
