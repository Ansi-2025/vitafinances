import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader, SectionCard, EmptyState } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { useIncomes, useNamedList } from "@/lib/data";
import { calculateTotalIncome, formatCurrency, formatDate } from "@/lib/finance";

export const Route = createFileRoute("/app/receitas")({
  component: IncomePage,
});

function IncomePage() {
  const { data: incomes = [] } = useIncomes();
  const { data: categories = [] } = useNamedList("categorias_rendas");
  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));

  if (!incomes.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Receitas" description="Registe as suas entradas e acompanhe o que entra no mês." />
        <EmptyState
          title="Você ainda não cadastrou nenhuma receita."
          description="Comece por adicionar a sua primeira entrada mensal e mantenha o resumo financeiro atualizado."
          actionLabel="Adicionar receita"
          actionHref="/app/receitas"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Receitas"
        description="Acompanhe as entradas do mês, filtre por categoria e mantenha o histórico atual." 
        actions={
          <Button>
            <Plus className="size-4" aria-hidden />
            Adicionar receita
          </Button>
        }
      />

      <SectionCard title="Resumo" description="Total registado no período atual.">
        <div className="text-3xl font-semibold tracking-tight text-foreground">
          {formatCurrency(calculateTotalIncome(incomes))}
        </div>
      </SectionCard>

      <SectionCard title="Histórico" description="Últimas entradas registadas.">
        <div className="space-y-3">
          {incomes.map((income) => (
            <div key={income.id} className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">{income.description}</p>
                <p className="text-sm text-muted-foreground">
                  {categoryMap.get(income.category_id ?? "") ?? "Sem categoria"} · {formatDate(income.date)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{formatCurrency(income.amount)}</p>
                <p className="text-xs text-muted-foreground">{income.recurring ? "Recorrente" : "Pontual"}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
