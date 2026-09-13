import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

const faq = [
  { q: "Como funciona o Patrimo?", a: "Você registra receitas, gastos e investimentos e o sistema calcula saldo, percentuais, metas e previsões em tempo real." },
  { q: "Os dados são seguros?", a: "Sim. O projeto usa Supabase com autenticação e policies de acesso por utilizador, garantindo que cada pessoa veja apenas os seus dados." },
  { q: "Posso usar o simulador sem conta?", a: "Sim. O simulador público permite testar cenários sem criar conta, mas para guardar dados você precisará de um utilizador." },
  { q: "Quais planos existem?", a: "Há uma versão gratuita com o essencial e uma versão premium com metas ilimitadas, previsões, investimentos e perfil familiar." },
  { q: "Posso cancelar?", a: "A arquitetura já está preparada para assinatura e gestão do plano, sem exigir pagamentos reais nesta fase do MVP." },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl">Patrimo</Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Perguntas frequentes</h1>
        </div>

        <div className="mt-10 grid gap-5">
          {faq.map(({ q, a }) => (
            <Card key={q}>
              <CardHeader>
                <CardTitle className="text-lg">{q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
