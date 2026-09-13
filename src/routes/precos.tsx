import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/precos")({
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl">Patrimo</Link>
        <Button variant="ghost" asChild>
          <Link to="/login">Entrar</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Preços</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Escolha o plano que faz sentido para a sua vida.</h1>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <p className="text-3xl font-semibold">€0</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Dashboard</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Receitas e gastos</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Análise básica</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> 1 meta</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Simulador</li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/cadastro">Começar grátis</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <p className="text-3xl font-semibold">R$ 29<span className="text-base text-muted-foreground">/mês</span></p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Tudo do Free</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Metas ilimitadas</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Investimentos</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Previsões e projeções</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 text-emerald-600" aria-hidden /> Perfil familiar</li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/cadastro">
                  Falar com o plano
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
