import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { PageHeader, SectionCard, EmptyState } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useExpenses, useNamedList, useSaveRow } from "@/lib/data";
import { calculateTotalExpenses, formatCurrency, formatDate } from "@/lib/finance";

export const Route = createFileRoute("/app/gastos")({
  component: ExpensePage,
});

function ExpensePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const { data: expenses = [] } = useExpenses();
  const { data: categories = [] } = useNamedList("categorias_despesas");
  const { data: paymentMethods = [] } = useNamedList("metodos_pagamento");
  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));
  const paymentMethodMap = new Map(paymentMethods.map((item) => [item.id, item.name]));
  const saveExpense = useSaveRow("despesas", ["despesas"], "Despesa adicionada.");

  function resetForm() {
    setDescription("");
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
    setNotes("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!description.trim() || Number(amount) <= 0) {
      return;
    }

    saveExpense.mutate({
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: Number(amount),
      date,
      category_id: null,
      subcategory_id: null,
      payment_method: paymentMethods[0]?.id ?? null,
      expense_type: "variavel",
      payment_status: "pago",
      essential: false,
      recurring: false,
      recurrence_type: null,
      account: null,
      notes: notes.trim() || null,
    });

    resetForm();
    setIsFormOpen(false);
  }

  if (!expenses.length && !isFormOpen) {
    return (
      <div className="space-y-6">
        <PageHeader title="Gastos" description="Registe despesas fixes, variáveis e pendentes." />
        <EmptyState
          title="Você ainda não cadastrou nenhum gasto."
          description="Adicione os primeiros gastos para perceber onde o dinheiro está a ir e começar a otimizar o saldo."
          actionLabel="Adicionar gasto"
          onAction={() => setIsFormOpen(true)}
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
          <Button type="button" onClick={() => setIsFormOpen((value) => !value)}>
            <Plus className="size-4" aria-hidden />
            {isFormOpen ? "Fechar" : "Adicionar gasto"}
          </Button>
        }
      />

      {isFormOpen ? (
        <SectionCard title="Novo gasto" description="Registe uma despesa e acompanhe o impacto no saldo.">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="expense-description">Descrição</Label>
                <Input
                  id="expense-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Alimentação, casa, transporte..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-amount">Valor</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value || 0))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-date">Data</Label>
                <Input id="expense-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-payment-method">Método de pagamento</Label>
                <Input
                  id="expense-payment-method"
                  value={paymentMethods[0]?.name ?? "Pix"}
                  readOnly
                  className="bg-muted/40"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="expense-notes">Observações</Label>
                <Textarea
                  id="expense-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Detalhes adicionais, ou deixa em branco."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                <X className="size-4" aria-hidden />
                Cancelar
              </Button>
              <Button type="submit" disabled={saveExpense.isPending}>
                <Plus className="size-4" aria-hidden />
                {saveExpense.isPending ? "A guardar..." : "Guardar gasto"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

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
                <p className="text-xs text-muted-foreground">
                  {paymentMethodMap.get(expense.payment_method ?? "") ?? expense.payment_status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
