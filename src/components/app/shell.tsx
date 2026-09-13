import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsAdmin, useProfile } from "@/lib/data";
import {
  BarChart3,
  Calculator,
  Coins,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Settings,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const mainNav: NavItem[] = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/receitas", label: "Receitas", icon: TrendingUp },
  { to: "/app/gastos", label: "Gastos", icon: TrendingDown },
  { to: "/app/analises", label: "Análises", icon: BarChart3 },
  { to: "/app/investimentos", label: "Investimentos", icon: Coins },
  { to: "/app/simulador", label: "Simulador", icon: Calculator },
  { to: "/app/metas", label: "Metas", icon: Target },
  { to: "/app/previsoes", label: "Previsões", icon: LineChart },
];

const supportNav: NavItem[] = [
  { to: "/app/como-funciona", label: "Como funciona", icon: HelpCircle },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings },
  { to: "/app/assinatura", label: "Assinatura", icon: CreditCard },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: isAdmin } = useIsAdmin();

  const render = (items: NavItem[]) =>
    items.map(({ to, label, icon: Icon }) => (
      <Link
        key={to}
        to={to}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          pathname === to
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        {label}
      </Link>
    ));

  return (
    <nav className="flex flex-col gap-6" aria-label="Navegação principal">
      <div className="space-y-1">
        <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Principal
        </p>
        {render(mainNav)}
      </div>
      <div className="space-y-1">
        <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Suporte
        </p>
        {render(supportNav)}
        {isAdmin ? (
          <Link
            to="/admin"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <Shield className="size-4" aria-hidden />
            Administração
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  async function signOut() {
    toast.info("A sair da sua conta...");
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to="/app/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Coins className="size-4" aria-hidden />
          </span>
          <span className="font-display text-lg">VITA FINANCES</span>
        </Link>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="mt-4 border-t border-sidebar-border pt-4">
          <p className="truncate px-3 text-sm font-medium">{profile?.name ?? "A minha conta"}</p>
          <p className="truncate px-3 text-xs text-muted-foreground">{profile?.email ?? ""}</p>
          <Button variant="ghost" className="mt-2 w-full justify-start gap-3" onClick={signOut}>
            <LogOut className="size-4" aria-hidden />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto bg-sidebar p-4">
              <SheetTitle className="mb-6 font-display text-lg">VITA FINANCES</SheetTitle>
              <NavLinks onNavigate={() => setOpen(false)} />
              <Button variant="ghost" className="mt-6 w-full justify-start gap-3" onClick={signOut}>
                <LogOut className="size-4" aria-hidden />
                Sair
              </Button>
            </SheetContent>
          </Sheet>
          <span className="font-display text-base">VITA FINANCES</span>
          <span className="size-9" />
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
