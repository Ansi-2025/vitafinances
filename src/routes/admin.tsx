import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppShell } from "@/components/app/shell";
import { requireAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
