import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageHeader, SectionCard, StatCard } from "@/components/app/financial-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateCompoundInterest, formatCurrency } from "@/lib/finance";

export const Route = createFileRoute("/app/simulador")({
  component: AppSimulatorPage,
});

function AppSimulatorPage() {
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

    return { final, totalContributed, interest, months };
  }, [annualRate, initialValue, monthlyContribution, years]);

  return (
    <div className="space-y-6">
      <PageHeader title="Simulador" description="Teste cenários de investimento com juros compostos." />

      <div className="grid gap-6 xl:grid-cols-[1fr,1.2fr]">
        <SectionCard title="Parâmetros" description="Ajuste o cenário para perceber o impacto no futuro.">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial-value">Valor inicial</Label>
              <Input id="initial-value" type="number" value={initialValue} onChange={(event) => setInitialValue(Number(event.target.value || 0))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-contribution">Aporte mensal</Label>
              <Input id="monthly-contribution" type="number" value={monthlyContribution} onChange={(event) => setMonthlyContribution(Number(event.target.value || 0))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annual-rate">Rentabilidade anual (%)</Label>
              <Input id="annual-rate" type="number" value={annualRate} onChange={(event) => setAnnualRate(Number(event.target.value || 0))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Prazo (anos)</Label>
              <Input id="years" type="number" value={years} onChange={(event) => setYears(Number(event.target.value || 0))} />
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total aportado" value={formatCurrency(result.totalContributed)} caption="Valor investido ao longo do tempo" />
          <StatCard title="Juros ganhos" value={formatCurrency(result.interest)} caption="Rendimento do cenário" />
          <StatCard title="Valor final" value={formatCurrency(result.final)} caption="Montante esperado" />
        </div>
      </div>
    </div>
  );
}
