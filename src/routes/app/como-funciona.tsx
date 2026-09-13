import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Calculator, PiggyBank, TrendingUp, Wallet } from "lucide-react";

import { PageHeader, SectionCard } from "@/components/app/financial-ui";

export const Route = createFileRoute("/app/como-funciona")({
  component: AppHowItWorksPage,
});

const areas = [
  { title: "Dashboard", text: "Mostra receitas, gastos, investimentos e saldo real em tempo útil.", icon: BarChart3 },
  { title: "Receitas", text: "Regista tudo o que entra para manter a movimentação visível e organizada.", icon: Wallet },
  { title: "Gastos", text: "Agrupa por categoria, subcategoria, essencialidade e status de pagamento.", icon: TrendingUp },
  { title: "Metas", text: "Calcula progresso, faltante e o valor necessário para atingir o objetivo.", icon: PiggyBank },
  { title: "Simulador", text: "Você pode testar juros compostos e comparar diferentes cenários de investimento.", icon: Calculator },
];

function AppHowItWorksPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Como funciona" description="Uma visão simples de como o sistema interpreta os seus números." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map(({ title, text, icon: Icon }) => (
          <SectionCard key={title} title={title} description={text}>
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
