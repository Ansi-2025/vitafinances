import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader, SectionCard } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInvestments, useNamedList, useSaveRow } from "@/lib/data";
import { formatCurrency } from "@/lib/finance";

export const Route = createFileRoute("/app/investimentos")({
  component: InvestmentsPage,
});

function InvestmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [investedAmount, setInvestedAmount] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [investmentDate, setInvestmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [objective, setObjective] = useState("");
  const [notes, setNotes] = useState("");

  const { data: investments = [] } = useInvestments();
  const { data: types = [] } = useNamedList("tipos_investimentos");
  const typeMap = new Map(types.map((item) => [item.id, item.name]));
  const saveInvestment = useSaveRow("investimentos", ["investimentos"], "Investimento adicionado.");

  function resetForm() {
    setName("");
    setInstitution("");
    setInvestedAmount(0);
    setCurrentValue(0);
    setInvestmentDate(new Date().toISOString().slice(0, 10));
    setMonthlyContribution(0);
    setObjective("");
    setNotes("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || Number(investedAmount) < 0 || Number(currentValue) < 0) {
      return;
    }

    saveInvestment.mutate({
      id: crypto.randomUUID(),
      name: name.trim(),
      institution: institution.trim() || null,
      invested_amount: Number(investedAmount),
      current_value: Number(currentValue),
      investment_date: investmentDate,
      monthly_contribution: Number(monthlyContribution),
      objective: objective.trim() || null,
      deadline: null,
      notes: notes.trim() || null,
      investment_type_id: types[0]?.id ?? null,
    });

    resetForm();
    setIsFormOpen(false);
  }

  if (!investments.length && !isFormOpen) {
    return (
      <div className="space-y-6">
        <PageHeader title="Investimentos" description="Acompanhe o seu património e os seus ativos." />
        <EmptyState
          title="Ainda não há investimentos registados."
          description="Adicione o primeiro ativo para acompanhar património, rentabilidade e evolução da carteira."
          actionLabel="Adicionar investimento"
          onAction={() => setIsFormOpen(true)}
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
          <Button type="button" onClick={() => setIsFormOpen((value) => !value)}>
            <Plus className="size-4" aria-hidden />
            {isFormOpen ? "Fechar" : "Novo investimento"}
          </Button>
        }
      />

      {isFormOpen ? (
        <SectionCard title="Novo investimento" description="Registe um ativo para acompanhar a carteira.">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="investment-name">Nome do investimento</Label>
                <Input id="investment-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="ETF, fundo, ação..." required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-institution">Instituição</Label>
                <Input
                  id="investment-institution"
                  value={institution}
                  onChange={(event) => setInstitution(event.target.value)}
                  placeholder="Banco, corretora..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-invested">Valor aplicado</Label>
                <Input
                  id="investment-invested"
                  type="number"
                  min="0"
                  step="0.01"
                  value={investedAmount}
                  onChange={(event) => setInvestedAmount(Number(event.target.value || 0))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-current">Valor atual</Label>
                <Input
                  id="investment-current"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentValue}
                  onChange={(event) => setCurrentValue(Number(event.target.value || 0))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-date">Data do investimento</Label>
                <Input id="investment-date" type="date" value={investmentDate} onChange={(event) => setInvestmentDate(event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-monthly">Aporte mensal</Label>
                <Input
                  id="investment-monthly"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyContribution}
                  onChange={(event) => setMonthlyContribution(Number(event.target.value || 0))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="investment-objective">Objetivo</Label>
                <Input
                  id="investment-objective"
                  value={objective}
                  onChange={(event) => setObjective(event.target.value)}
                  placeholder="Objetivo financeiro ou comentário do investimento."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="investment-notes">Notas</Label>
                <Textarea
                  id="investment-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Informações adicionais, riscos ou comentários."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                <X className="size-4" aria-hidden />
                Cancelar
              </Button>
              <Button type="submit" disabled={saveInvestment.isPending}>
                <Plus className="size-4" aria-hidden />
                {saveInvestment.isPending ? "A guardar..." : "Guardar investimento"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

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
