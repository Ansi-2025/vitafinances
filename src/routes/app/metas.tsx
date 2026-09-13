import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader, SectionCard } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGoals, useSaveRow } from "@/lib/data";
import { calculateGoalProgress, calculateRequiredMonthlyContribution, formatCurrency } from "@/lib/finance";

export const Route = createFileRoute("/app/metas")({
  component: GoalsPage,
});

function GoalsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("media");

  const { data: goals = [] } = useGoals();
  const saveGoal = useSaveRow("metas", ["metas"], "Meta adicionada.");

  function resetForm() {
    setName("");
    setDescription("");
    setTargetAmount(0);
    setCurrentAmount(0);
    setMonthlyContribution(0);
    setTargetDate("");
    setCategory("");
    setPriority("media");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || Number(targetAmount) <= 0) {
      return;
    }

    saveGoal.mutate({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || null,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount),
      monthly_contribution: Number(monthlyContribution),
      target_date: targetDate || null,
      category: category.trim() || null,
      priority,
    });

    resetForm();
    setIsFormOpen(false);
  }

  if (!goals.length && !isFormOpen) {
    return (
      <div className="space-y-6">
        <PageHeader title="Metas" description="Defina objetivos, acompanhe o progresso e o próximo passo para alcançá-los." />
        <EmptyState
          title="Ainda não existe nenhuma meta."
          description="Crie a sua primeira meta para ver o progresso e o valor que ainda falta para chegar ao objetivo."
          actionLabel="Criar meta"
          onAction={() => setIsFormOpen(true)}
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
          <Button type="button" onClick={() => setIsFormOpen((value) => !value)}>
            <Plus className="size-4" aria-hidden />
            {isFormOpen ? "Fechar" : "Nova meta"}
          </Button>
        }
      />

      {isFormOpen ? (
        <SectionCard title="Nova meta" description="Defina um objetivo e acompanhe o progresso ao longo do tempo.">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="goal-name">Nome da meta</Label>
                <Input id="goal-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Viagem, casa, férias..." required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="goal-description">Descrição</Label>
                <Textarea
                  id="goal-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Detalhes da meta ou objetivo financeiro."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-target">Valor final</Label>
                <Input
                  id="goal-target"
                  type="number"
                  min="0"
                  step="0.01"
                  value={targetAmount}
                  onChange={(event) => setTargetAmount(Number(event.target.value || 0))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-current">Valor atual</Label>
                <Input
                  id="goal-current"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentAmount}
                  onChange={(event) => setCurrentAmount(Number(event.target.value || 0))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-monthly">Aporte mensal</Label>
                <Input
                  id="goal-monthly"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyContribution}
                  onChange={(event) => setMonthlyContribution(Number(event.target.value || 0))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-date">Data alvo</Label>
                <Input id="goal-date" type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-category">Categoria</Label>
                <Input id="goal-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Casa, viagem, educação..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-priority">Prioridade</Label>
                <select
                  id="goal-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                <X className="size-4" aria-hidden />
                Cancelar
              </Button>
              <Button type="submit" disabled={saveGoal.isPending}>
                <Plus className="size-4" aria-hidden />
                {saveGoal.isPending ? "A guardar..." : "Guardar meta"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

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
