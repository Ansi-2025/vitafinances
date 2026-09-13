import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { EmptyState, PageHeader, SectionCard } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { useGoals } from "@/lib/data";
import { calculateGoalProgress, calculateRequiredMonthlyContribution, formatCurrency } from "@/lib/finance";

export const Route = createFileRoute("/app/metas")({
  component: GoalsPage,
});

function GoalsPage() {
  const { data: goals = [] } = useGoals();

  if (!goals.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Metas" description="Defina objetivos, acompanhe o progresso e o próximo passo para alcançá-los." />
        <EmptyState
          title="Ainda não existe nenhuma meta."
          description="Crie a sua primeira meta para ver o progresso e o valor que ainda falta para chegar ao objetivo."
          actionLabel="Criar meta"
          actionHref="/app/metas"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metas"
        description="Monitore quanto falta para atingir cada objetivo e quanto precisa aportar mensalmente."
        actions={
          <Button>
            <Plus className="size-4" aria-hidden />
            Nova meta
          </Button>
        }
      />

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal.current_amount, goal.target_amount);
          const remaining = Math.max(goal.target_amount - goal.current_amount, 0);
          const requiredMonthly = calculateRequiredMonthlyContribution(goal.target_amount, goal.current_amount, 12, 6);

          return (
            <SectionCard key={goal.id} title={goal.name} description={goal.description ?? "Meta em desenvolvimento."}>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Progresso</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Atual</p>
                    <p className="mt-1 font-semibold text-foreground">{formatCurrency(goal.current_amount)}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Restante</p>
                    <p className="mt-1 font-semibold text-foreground">{formatCurrency(remaining)}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Aporte mensal</p>
                    <p className="mt-1 font-semibold text-foreground">{formatCurrency(requiredMonthly)}</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
