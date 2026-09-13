import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SectionCard } from "@/components/app/financial-ui";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Visão geral" description="Painel administrativo do produto." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SectionCard title="Utilizadores" description="Total registados">
          <p className="text-2xl font-semibold text-foreground">1.248</p>
        </SectionCard>
        <SectionCard title="Ativos" description="Utilizadores ativos">
          <p className="text-2xl font-semibold text-foreground">736</p>
        </SectionCard>
        <SectionCard title="Assinaturas" description="Ativas no momento">
          <p className="text-2xl font-semibold text-foreground">198</p>
        </SectionCard>
        <SectionCard title="Receita estimada" description="Mês em curso">
          <p className="text-2xl font-semibold text-foreground">R$ 12.400</p>
        </SectionCard>
      </div>
    </div>
  );
}
