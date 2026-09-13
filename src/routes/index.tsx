import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CircleDollarSign,
  Landmark,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const featureCards = [
  { title: "Dashboard", description: "Receitas, gastos, investimentos e saldo em um único lugar.", icon: BarChart3 },
  { title: "Metas", description: "Acompanhe o progresso e o valor que ainda falta para chegar lá.", icon: PiggyBank },
  { title: "Simulador", description: "Teste cenários com juros compostos e veja o impacto do tempo.", icon: Calculator },
  { title: "Previsões", description: "Entenda o que o mês e os próximos anos podem reservar.", icon: TrendingUp },
];

const faq = [
  { q: "Como funciona?", a: "Você registra receitas, gastos e investimentos e o sistema calcula o saldo, percentuais e metas em tempo real." },
  { q: "É seguro?", a: "Os dados ficam protegidos no Supabase com autenticação e políticas de acesso por utilizador." },
  { q: "Posso testar antes de criar conta?", a: "Sim. O simulador público permite explorar cenários sem precisar de sessão." },
  { q: "Preciso pagar para começar?", a: "O plano gratuito já permite começar com o essencial. O premium abre visão avançada e família." },
];

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/app/dashboard" });
  },
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-4" aria-hidden />
          </div>
          <div>
            <p className="font-display text-xl">Patrimo</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/como-funciona">Como funciona</Link>
          <Link to="/precos">Preços</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/simulador">Simulador</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Começar grátis</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Gestão financeira pessoal e familiar
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Organize seu dinheiro. Planeje seu futuro.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Tenha receitas, gastos, investimentos, metas e projeções financeiras em um único lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/cadastro">
                  Começar grátis
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/simulador">Testar simulador</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">+4.000</p>
                <span>utilizadores</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">R$ 2.1M</p>
                <span>trackados</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-primary/5">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Receita</p>
                    <p className="mt-3 text-2xl font-semibold">R$ 5.000,00</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600">
                      <TrendingUp className="size-4" aria-hidden />
                      +3,2% no mês
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Gastos</p>
                    <p className="mt-3 text-2xl font-semibold">R$ 2.800,00</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                      <CircleDollarSign className="size-4" aria-hidden />
                      Moradia 53,6%
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-sky-50 md:col-span-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Saldo disponível</p>
                        <p className="mt-3 text-2xl font-semibold">R$ 1.400,00</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        <ShieldCheck className="size-3.5" aria-hidden />
                        16% investido
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="h-full">
                <CardHeader className="pb-3">
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
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Problema</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Você sabe quanto ganha. Mas sabe quanto realmente sobra?</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <li>• Dinheiro desaparece durante o mês sem um controle claro.</li>
                <li>• Gastos se misturam com metas e investimentos.</li>
                <li>• Há dificuldade em perceber o impacto real de cada decisão.</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Solução</p>
              <div className="mt-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Receitas</span>
                  <ArrowRight className="size-4" aria-hidden />
                  <span>Gastos</span>
                  <ArrowRight className="size-4" aria-hidden />
                  <span>Saldo</span>
                  <ArrowRight className="size-4" aria-hidden />
                  <span>Investimentos</span>
                  <ArrowRight className="size-4" aria-hidden />
                  <span>Metas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              { title: "Dashboard", icon: BarChart3, description: "Indicadores principais com visão geral real do mês." },
              { title: "Controle de gastos", icon: CircleDollarSign, description: "Categorias, subcategorias e formas de pagamento em um só lugar." },
              { title: "Análise financeira", icon: Landmark, description: "Percentuais, rankings e comparação com o período anterior." },
              { title: "Investimentos", icon: TrendingUp, description: "Patrimônio, rentabilidade e carteira em evolução." },
              { title: "Simulador", icon: Calculator, description: "Explore cenários com juros compostos e diferentes aportes." },
              { title: "Metas", icon: PiggyBank, description: "Aporte necessário, progresso e previsões de conclusão." },
            ].map(({ title, description, icon: Icon }) => (
              <Card key={title} className="h-full">
                <CardContent className="p-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-3xl border border-border bg-card p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Simulador público</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Veja como o tempo pode mudar o resultado.</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/simulador">Explorar cenário</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/cadastro">Crie sua conta grátis</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {faq.map(({ q, a }) => (
              <Card key={q} className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
