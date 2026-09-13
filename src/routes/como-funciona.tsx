import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, CalendarRange, PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/como-funciona")({
  component: HowItWorksPage,
});

const blocks = [
  { title: "Dashboard", description: "Mostra receitas, gastos, investimentos e saldo disponível em indicadores claros.", icon: BarChart3 },
  { title: "Receitas e gastos", description: "Cada movimento entra no mesmo sistema e ajuda a entender o que sobra no mês.", icon: CalendarRange },
  { title: "Metas", description: "Veja o progresso, o restante e o que precisa aportar para chegar ao objetivo.", icon: PiggyBank },
  { title: "Previsões", description: "Entenda cenários do mês e dos próximos anos sem prometer rentabilidade garantida.", icon: TrendingUp },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl">VITA FINANCES</Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Começar</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        <section className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Como funciona</p>
          <h1 className="text-4xl font-semibold tracking-tight">Seu dinheiro mais claro, em um único lugar.</h1>
          <p className="max-w-2xl text-muted-foreground">
            O sistema conecta receitas, gastos, investimentos, metas e projeções para mostrar a realidade e o futuro financeiro com menos ruído.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {blocks.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="h-full">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="rounded-3xl border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold">Entenda seus números</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Saldo disponível</p>
              <p className="mt-2 font-semibold">Receitas - Gastos - Investimentos</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Taxa de investimento</p>
              <p className="mt-2 font-semibold">Investimentos / Receitas × 100</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Percentual da categoria</p>
              <p className="mt-2 font-semibold">Gasto da categoria / Total de gastos × 100</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Progresso da meta</p>
              <p className="mt-2 font-semibold">Valor atual / Valor objetivo × 100</p>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Button asChild>
            <Link to="/cadastro">
              Criar conta grátis
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
