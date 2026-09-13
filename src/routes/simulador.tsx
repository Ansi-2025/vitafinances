import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-[1fr,1.2fr]">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="initial-value">Valor inicial</Label>
              <Input id="initial-value" type="number" value={initialValue} onChange={(event) => setInitialValue(Number(event.target.value || 0))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contribution">Aporte mensal</Label>
              <Input id="contribution" type="number" value={monthlyContribution} onChange={(event) => setMonthlyContribution(Number(event.target.value || 0))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Rentabilidade anual (%)</Label>
              <Input id="rate" type="number" value={annualRate} onChange={(event) => setAnnualRate(Number(event.target.value || 0))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Prazo em anos</Label>
              <Input id="years" type="number" value={years} onChange={(event) => setYears(Number(event.target.value || 0))} />
            </div>
          </CardContent>
        </Card>

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
              <p className="text-sm text-muted-foreground">Valor final</p>
              <p className="mt-3 text-2xl font-semibold">{formatCurrency(result.final)}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
