import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, CreditCard, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { PageHeader, SectionCard } from "@/components/app/financial-ui";
import { Button } from "@/components/ui/button";
import { useSaveRow, useSubscription } from "@/lib/data";

export const Route = createFileRoute("/app/assinatura")({
  component: SubscriptionPage,
});

const plans = [
  {
    key: "free",
    name: "Gratuito",
    price: "€0",
    description: "Para começar a organizar a sua carteira com os básicos.",
    features: ["Receitas e gastos", "Dashboard inicial", "Metas básicas"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "€19",
    description: "Para quem quer mais controlo e previsões financeiras.",
    features: ["Tudo do gratuito", "Previsões", "Análises avançadas"],
  },
  {
    key: "premium",
    name: "Premium",
    price: "€39",
    description: "Para gestão familiar, objetivos e visão de longo prazo.",
    features: ["Tudo do Pro", "Perfil familiar", "Suporte prioritário"],
  },
] as const;

function SubscriptionPage() {
  const { data: subscription } = useSubscription();
  const saveSubscription = useSaveRow("assinaturas", ["assinaturas"], "Plano atualizado.");

  const currentPlan = subscription?.plan ?? "free";

  const activePlan = useMemo(
    () => plans.find((plan) => plan.key === currentPlan) ?? plans[0],
    [currentPlan],
  );

  const handleSelectPlan = (planKey: (typeof plans)[number]["key"]) => {
    saveSubscription.mutate({
      id: subscription?.id,
      plan: planKey,
      status: subscription?.status ?? "active",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Assinatura" description="Gerir o teu plano e as funcionalidades disponíveis no Patrimo." />

      <SectionCard title="Plano atual" description="Estado da sua conta e benefícios ativos.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Plano ativo</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{activePlan.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{activePlan.description}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-300">
            <BadgeCheck className="size-4" aria-hidden />
            {subscription?.status ?? "active"}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.key === currentPlan;

          return (
            <SectionCard
              key={plan.key}
              title={plan.name}
              description={plan.description}
              className={isCurrent ? "border-primary/50 ring-1 ring-primary/30" : ""}
            >
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/ mês</span>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  variant={isCurrent ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.key)}
                  disabled={saveSubscription.isPending}
                >
                  <CreditCard className="size-4" aria-hidden />
                  {isCurrent ? "Plano atual" : "Selecionar plano"}
                </Button>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
