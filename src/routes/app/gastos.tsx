import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader, SectionCard, EmptyState } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { useExpenses, useNamedList } from "@/lib/data";
import { calculateTotalExpenses, formatCurrency, formatDate } from "@/lib/finance";

export const Route = createFileRoute("/app/gastos")({
  component: ExpensePage,
});

function ExpensePage() {
  const { data: expenses = [] } = useExpenses();
  const { data: categories = [] } = useNamedList("categorias_despesas");
  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));

  if (!expenses.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Gastos" description="Registe despesas fixes, variáveis e pendentes." />
        <EmptyState
          title="Você ainda não cadastrou nenhum gasto."
          description="Adicione os primeiros gastos para perceber onde o dinheiro está a ir e começar a otimizar o saldo."
          actionLabel="Adicionar gasto"
          actionHref="/app/gastos"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gastos"
        description="Acompanhe quanto gasta, por categoria e por tipo de despesa."
        actions={
          <Button>
            <Plus className="size-4" aria-hidden />
            Adicionar gasto
          </Button>
        }
      />

      <SectionCard title="Resumo" description="Total de gastos registados.">
        <div className="text-3xl font-semibold tracking-tight text-foreground">
          {formatCurrency(calculateTotalExpenses(expenses))}
        </div>
      </SectionCard>

      <SectionCard title="Histórico" description="Últimas despesas registadas.">
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">{expense.description}</p>
                <p className="text-sm text-muted-foreground">
                  {categoryMap.get(expense.category_id ?? "") ?? "Sem categoria"} · {formatDate(expense.date)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
                <p className="text-xs text-muted-foreground">{expense.payment_status}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
