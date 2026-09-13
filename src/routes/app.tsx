import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppShell } from "@/components/app/shell";
import { requireSession } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    await requireSession();
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
