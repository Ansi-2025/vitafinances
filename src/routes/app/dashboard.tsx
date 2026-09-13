import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Wallet } from "lucide-react";

import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/app/financial-ui";
import { useExpenses, useGoals, useIncomes, useInvestments } from "@/lib/data";
import { calculateInvestmentRate, calculateTotalExpenses, calculateTotalIncome, formatCurrency, sumAmounts } from "@/lib/finance";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { data: incomes = [] } = useIncomes();
  const { data: expenses = [] } = useExpenses();
  const { data: investments = [] } = useInvestments();
  const { data: goals = [] } = useGoals();

  const totalIncome = calculateTotalIncome(incomes);
  const totalExpenses = calculateTotalExpenses(expenses);
  const totalInvestments = sumAmounts(
    investments.map((item) => ({ amount: item.current_value ?? item.invested_amount ?? 0 })),
  );
  const availableBalance = totalIncome - totalExpenses - totalInvestments;
  const investmentRate = calculateInvestmentRate(totalInvestments, totalIncome);

  if (!incomes.length && !expenses.length && !investments.length && !goals.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Comece a organizar a sua vida financeira."
        />
        <EmptyState
          title="Comece organizando sua vida financeira."
          description="Cadastre a sua primeira receita, registe um gasto e defina a sua primeira meta."
          actionLabel="Adicionar receita"
          onAction={() => navigate({ to: "/app/receitas", search: { openAdd: true } })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumo do seu comportamento financeiro e o que está a sobrar para o futuro."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Receita" value={formatCurrency(totalIncome)} caption="Valor total registado" icon={ArrowUpCircle} accent="emerald" />
        <StatCard title="Gastos" value={formatCurrency(totalExpenses)} caption="Total dos gastos" icon={ArrowDownCircle} accent="amber" />
        <StatCard title="Investimentos" value={formatCurrency(totalInvestments)} caption="Património atual" icon={PiggyBank} accent="sky" />
        <StatCard title="Saldo disponível" value={formatCurrency(availableBalance)} caption="Receitas - gastos - investimentos" icon={Wallet} accent="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <SectionCard title="Insights" description="Análises baseadas apenas nos dados reais do seu utilizador.">
          <div className="space-y-3">
            <p className="rounded-xl bg-muted p-3 text-sm text-foreground">
              {totalExpenses > 0
                ? `Os seus gastos totais representam ${formatCurrency(totalExpenses)} neste período.`
                : "Ainda não temos dados suficientes para gerar esta análise."}
            </p>
            <p className="rounded-xl bg-muted p-3 text-sm text-foreground">
              {totalIncome > 0
                ? `A taxa de investimento é de ${investmentRate.toFixed(2)}% da sua receita.`
                : "Ainda não temos dados suficientes para gerar esta análise."}
            </p>
            <p className="rounded-xl bg-muted p-3 text-sm text-foreground">
              {goals.length > 0
                ? `Tem ${goals.length} meta(s) em curso. Acompanhe o progresso na área de metas.`
                : "Registe a sua primeira meta para começar a acompanhar o progresso."}
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Resumo" description="O que está a acontecer agora.">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm text-muted-foreground">Taxa de investimento</span>
              <strong className="text-base">{investmentRate.toFixed(2)}%</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm text-muted-foreground">Património atual</span>
              <strong className="text-base">{formatCurrency(totalInvestments)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm text-muted-foreground">Metas ativas</span>
              <strong className="text-base">{goals.length}</strong>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
