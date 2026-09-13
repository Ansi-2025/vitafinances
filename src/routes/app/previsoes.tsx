import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SectionCard, StatCard } from "@/components/app/financial-ui";
import { useExpenses, useGoals, useIncomes, useInvestments } from "@/lib/data";
import { calculateTotalExpenses, calculateTotalIncome, formatCurrency, sumAmounts } from "@/lib/finance";

export const Route = createFileRoute("/app/previsoes")({
  component: ForecastsPage,
});

function ForecastsPage() {
  const { data: incomes = [] } = useIncomes();
  const { data: expenses = [] } = useExpenses();
  const { data: investments = [] } = useInvestments();
  const { data: goals = [] } = useGoals();

  const projectedMonthlyBalance = calculateTotalIncome(incomes) - calculateTotalExpenses(expenses) - sumAmounts(
    investments.map((item) => ({ amount: item.monthly_contribution ?? 0 })),
  );

  const nextYearGoal = sumAmounts(goals.map((goal) => ({ amount: goal.monthly_contribution ?? 0 })));

  return (
    <div className="space-y-6">
      <PageHeader title="Previsões" description="Estimativas baseadas nos dados reais para ajudar a planear o próximo período." />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Saldo previsto" value={formatCurrency(projectedMonthlyBalance)} caption="Projeção do próximo mês" />
        <StatCard title="Gastos previstos" value={formatCurrency(calculateTotalExpenses(expenses))} caption="Baseado no histórico registado" />
        <StatCard title="Investimentos previstos" value={formatCurrency(nextYearGoal)} caption="Aportes mensais em curso" />
      </div>

      <SectionCard title="Projeção patrimonial" description="Estimativa de evolução do património nas próximas janelas de tempo.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[1, 5, 10, 20].map((years) => (
            <div key={years} className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">{years} ano{years > 1 ? 's' : ''}</p>
              <p className="mt-3 text-xl font-semibold text-foreground">{formatCurrency(projectedMonthlyBalance * years * 12)}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
