import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader, SectionCard, EmptyState } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIncomes, useNamedList, useSaveRow } from "@/lib/data";
import { calculateTotalIncome, formatCurrency, formatDate } from "@/lib/finance";

export const Route = createFileRoute("/app/receitas")({
  validateSearch: (search: Record<string, unknown>) => ({
    openAdd: search.openAdd === true || search.openAdd === "true",
  }),
  component: IncomePage,
});

function IncomePage() {
  const search = Route.useSearch();
  const [isFormOpen, setIsFormOpen] = useState(Boolean(search.openAdd));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const saveIncome = useSaveRow("receitas", ["receitas"], "Receita adicionada.");
  const { data: incomes = [] } = useIncomes();
  const { data: categories = [] } = useNamedList("categorias_rendas");
  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));

  useEffect(() => {
    setIsFormOpen(Boolean(search.openAdd));
  }, [search.openAdd]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!description.trim() || Number(amount) <= 0) {
      return;
    }

    saveIncome.mutate({
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: Number(amount),
      date,
      recurring: false,
      recurrence_type: null,
      account: null,
      notes: null,
      category_id: null,
    });

    setDescription("");
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
    setIsFormOpen(false);
  }

  if (!incomes.length && !isFormOpen) {
    return (
      <div className="space-y-6">
        <PageHeader title="Receitas" description="Registe as suas entradas e acompanhe o que entra no mês." />
        <EmptyState
          title="Você ainda não cadastrou nenhuma receita."
          description="Comece por adicionar a sua primeira entrada mensal e mantenha o resumo financeiro atualizado."
          actionLabel="Adicionar receita"
          onAction={() => setIsFormOpen(true)}
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
          <Button type="button" onClick={() => setIsFormOpen((value) => !value)}>
            <Plus className="size-4" aria-hidden />
            {isFormOpen ? "Fechar" : "Adicionar receita"}
          </Button>
        }
      />

      {isFormOpen ? (
        <SectionCard title="Nova receita" description="Registe uma entrada e mantenha o resumo atualizado.">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="income-description">Descrição</Label>
                <Input
                  id="income-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Salário, freelance, rendimento extra..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income-amount">Valor</Label>
                <Input
                  id="income-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value || 0))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income-date">Data</Label>
                <Input id="income-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                <X className="size-4" aria-hidden />
                Cancelar
              </Button>
              <Button type="submit" disabled={saveIncome.isPending}>
                <Plus className="size-4" aria-hidden />
                {saveIncome.isPending ? "A guardar..." : "Guardar receita"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

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
