import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Palette, Save, WalletCards } from "lucide-react";

import { PageHeader, SectionCard } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveRow, useSettings } from "@/lib/data";

export const Route = createFileRoute("/app/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settings } = useSettings();
  const saveSettings = useSaveRow("configuracoes_usuario", ["configuracoes_usuario"], "Configurações guardadas.");

  const [currency, setCurrency] = useState("BRL");
  const [theme, setTheme] = useState("dark");
  const [conservativeRate, setConservativeRate] = useState("6");
  const [moderateRate, setModerateRate] = useState("10");
  const [optimisticRate, setOptimisticRate] = useState("13");
  const [monthlyIncome, setMonthlyIncome] = useState("0");
  const [monthlyExpense, setMonthlyExpense] = useState("0");
  const [monthlyInvestmentTarget, setMonthlyInvestmentTarget] = useState("0");

  useEffect(() => {
    if (!settings) return;
    setCurrency(settings.currency ?? "BRL");
    setTheme(settings.theme ?? "dark");
    setConservativeRate(String(settings.conservative_rate ?? 6));
    setModerateRate(String(settings.moderate_rate ?? 10));
    setOptimisticRate(String(settings.optimistic_rate ?? 13));
    setMonthlyIncome(String(settings.monthly_income_estimate ?? 0));
    setMonthlyExpense(String(settings.monthly_expense_estimate ?? 0));
    setMonthlyInvestmentTarget(String(settings.monthly_investment_target ?? 0));
  }, [settings]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveSettings.mutate({
      id: settings?.id,
      currency,
      theme,
      conservative_rate: Number(conservativeRate || 0),
      moderate_rate: Number(moderateRate || 0),
      optimistic_rate: Number(optimisticRate || 0),
      monthly_income_estimate: Number(monthlyIncome || 0),
      monthly_expense_estimate: Number(monthlyExpense || 0),
      monthly_investment_target: Number(monthlyInvestmentTarget || 0),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Ajuste as preferências do seu perfil financeiro e da experiência no app." />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <SectionCard title="Perfil financeiro" description="Defina a moeda e as estimativas do seu cenário." icon={undefined}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <select
                id="currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="BRL">Real (BRL)</option>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <select
                id="theme"
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Renda mensal estimada</Label>
              <Input id="monthlyIncome" type="number" min="0" step="0.01" value={monthlyIncome} onChange={(event) => setMonthlyIncome(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyExpense">Gasto mensal estimado</Label>
              <Input id="monthlyExpense" type="number" min="0" step="0.01" value={monthlyExpense} onChange={(event) => setMonthlyExpense(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyInvestmentTarget">Aporte mensal alvo</Label>
              <Input id="monthlyInvestmentTarget" type="number" min="0" step="0.01" value={monthlyInvestmentTarget} onChange={(event) => setMonthlyInvestmentTarget(event.target.value)} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Taxas de cenário" description="Use esses valores para simulações de projeção e metas." icon={undefined}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="conservativeRate">Taxa conservadora (%)</Label>
              <Input id="conservativeRate" type="number" min="0" step="0.01" value={conservativeRate} onChange={(event) => setConservativeRate(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moderateRate">Taxa moderada (%)</Label>
              <Input id="moderateRate" type="number" min="0" step="0.01" value={moderateRate} onChange={(event) => setModerateRate(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optimisticRate">Taxa otimista (%)</Label>
              <Input id="optimisticRate" type="number" min="0" step="0.01" value={optimisticRate} onChange={(event) => setOptimisticRate(event.target.value)} />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <Button type="submit" disabled={saveSettings.isPending}>
            <Save className="size-4" aria-hidden />
            {saveSettings.isPending ? "A guardar..." : "Guardar configurações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
