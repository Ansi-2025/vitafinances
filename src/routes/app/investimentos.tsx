import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { EmptyState, PageHeader, SectionCard } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { useInvestments, useNamedList } from "@/lib/data";
import { formatCurrency } from "@/lib/finance";

export const Route = createFileRoute("/app/investimentos")({
  component: InvestmentsPage,
});

function InvestmentsPage() {
  const { data: investments = [] } = useInvestments();
  const { data: types = [] } = useNamedList("tipos_investimentos");
  const typeMap = new Map(types.map((item) => [item.id, item.name]));

  if (!investments.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Investimentos" description="Acompanhe o seu património e os seus ativos." />
        <EmptyState
          title="Ainda não há investimentos registados."
          description="Adicione o primeiro ativo para acompanhar património, rentabilidade e evolução da carteira."
          actionLabel="Adicionar investimento"
          actionHref="/app/investimentos"
        />
      </div>
    );
  }

  const totalInvested = investments.reduce((sum, item) => sum + Number(item.invested_amount ?? 0), 0);
  const totalCurrent = investments.reduce((sum, item) => sum + Number(item.current_value ?? 0), 0);
  const totalProfit = totalCurrent - totalInvested;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investimentos"
        description="Veja o valor investido, o património atual e o desempenho da carteira."
        actions={
          <Button>
            <Plus className="size-4" aria-hidden />
            Novo investimento
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Património investido" description="Valor total aplicado">
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalInvested)}</p>
        </SectionCard>
        <SectionCard title="Valor atual" description="Património atualizado">
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalCurrent)}</p>
        </SectionCard>
        <SectionCard title="Lucro / prejuízo" description="Diferença entre valor atual e aplicado">
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalProfit)}</p>
        </SectionCard>
      </div>

      <SectionCard title="Ativos" description="Lista dos investimentos registados.">
        <div className="space-y-3">
          {investments.map((investment) => {
            const profit = Number(investment.current_value ?? 0) - Number(investment.invested_amount ?? 0);
            return (
              <div key={investment.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <p className="font-medium text-foreground">{investment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {typeMap.get(investment.investment_type_id ?? "") ?? "Sem tipo"} · {investment.institution ?? "Instituição não definida"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatCurrency(investment.current_value ?? 0)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(profit)} de ganho</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
