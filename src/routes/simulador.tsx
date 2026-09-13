import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Info, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateCompoundInterest, formatCurrency } from "@/lib/finance";

export const Route = createFileRoute("/simulador")({
  component: PublicSimulatorPage,
});

function PublicSimulatorPage() {
  const [initialValue, setInitialValue] = useState(15000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(8);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = (annualRate / 100) / 12;
    const final = calculateCompoundInterest(initialValue, monthlyContribution, monthlyRate, months);
    const totalContributed = initialValue + monthlyContribution * months;
    const interest = final - totalContributed;
    return { final, totalContributed, interest };
  }, [annualRate, initialValue, monthlyContribution, years]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl">VITA FINANCES</Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-12">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Simulador</p>
          <h1 className="text-4xl font-semibold tracking-tight">Descubra quanto o seu dinheiro pode crescer.</h1>
          <p className="max-w-3xl text-muted-foreground">
            Ajuste os valores abaixo para ver rapidamente o impacto do tempo, do aporte mensal e da rentabilidade.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <Label htmlFor="initial-value">Valor inicial</Label>
                <Input
                  id="initial-value"
                  type="number"
                  value={initialValue}
                  onChange={(event) => setInitialValue(Number(event.target.value || 0))}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">Digite o valor que você já tem guardado ou investido.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contribution">Aporte mensal</Label>
                <Input
                  id="contribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(event) => setMonthlyContribution(Number(event.target.value || 0))}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">Quanto você consegue investir todos os meses.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Rentabilidade anual (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={annualRate}
                  onChange={(event) => setAnnualRate(Number(event.target.value || 0))}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">Use uma estimativa realista: conservador, moderado ou otimista.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Prazo em anos</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(event) => setYears(Number(event.target.value || 0))}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">Quanto tempo você pretende manter esse investimento.</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Info className="size-4" aria-hidden />
                  Como usar
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>1. Comece pelo valor que já tem investido.</li>
                  <li>2. Ajuste o aporte mensal para o que consegue guardar.</li>
                  <li>3. Teste diferentes taxas de retorno para comparar cenários.</li>
                  <li>4. Aumente o prazo para ver o efeito dos juros compostos.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Calculator className="size-4" aria-hidden />
                  Como os cálculos funcionam
                </div>
                <p className="text-sm text-muted-foreground">
                  O valor final considera o efeito dos juros compostos sobre o valor inicial e os aportes mensais.
                </p>
                <div className="rounded-xl bg-muted/50 p-3 text-sm leading-6 text-foreground">
                  FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Total aportado = valor inicial + aporte mensal × meses</li>
                  <li>• Juros ganhos = valor final - total aportado</li>
                  <li>• Se a taxa for 0, o cálculo fica linear e simples.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total aportado</p>
              <p className="mt-3 text-2xl font-semibold">{formatCurrency(result.totalContributed)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Juros ganhos</p>
              <p className="mt-3 text-2xl font-semibold">{formatCurrency(result.interest)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Valor final</p>
                <TrendingUp className="size-4 text-emerald-600" aria-hidden />
              </div>
              <p className="mt-3 text-2xl font-semibold">{formatCurrency(result.final)}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
