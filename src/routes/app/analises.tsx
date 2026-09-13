import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

import { PageHeader, SectionCard } from "@/components/app/financial-ui";
import { useExpenses, useNamedList } from "@/lib/data";
import { calculateCategoryPercentage, calculateTotalExpenses, formatCurrency, formatPercent } from "@/lib/finance";

export const Route = createFileRoute("/app/analises")({
  component: AnalysisPage,
});

function AnalysisPage() {
  const { data: expenses = [] } = useExpenses();
  const { data: categories = [] } = useNamedList("categorias_despesas");
  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));

  const totals = Array.from(
    expenses.reduce((map, expense) => {
      const key = expense.category_id ?? "sem-categoria";
      const current = map.get(key) ?? 0;
      map.set(key, current + Number(expense.amount ?? 0));
      return map;
    }, new Map<string, number>()),
  )
    .map(([id, total]) => ({ id, name: categoryMap.get(id) ?? "Sem categoria", total }))
    .sort((a, b) => b.total - a.total);

  const totalExpenses = calculateTotalExpenses(expenses);

  return (
    <div className="space-y-6">
      <PageHeader title="Análises" description="Indicadores financeiros e distribuição por categoria." />

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Total gasto" description="Valor total registado">
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalExpenses)}</p>
        </SectionCard>
        <SectionCard title="Média mensal" description="Média por mês">
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(totalExpenses > 0 ? totalExpenses / Math.max(1, expenses.length || 1) : 0)}
          </p>
        </SectionCard>
        <SectionCard title="Maior categoria" description="Maior consumo do período">
          <p className="text-2xl font-semibold text-foreground">
            {totals[0] ? totals[0].name : "Sem dados"}
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Ranking de categorias" description="Distribuição do valor por categoria.">
        <div className="space-y-3">
          {totals.length ? (
            totals.map((category) => (
              <div key={category.id} className="rounded-xl border border-border p-3">
                <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-foreground">{category.name}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(category.total)} · {formatPercent(calculateCategoryPercentage(category.total, totalExpenses))}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, calculateCategoryPercentage(category.total, totalExpenses))}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Ainda não existem dados suficientes para gerar esta análise.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
