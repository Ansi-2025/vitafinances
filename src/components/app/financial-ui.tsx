import type { ReactNode } from "react";
import { ArrowRight, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">VITA FINANCES</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  title,
  value,
  caption,
  icon: Icon = Wallet,
  accent = "emerald",
}: {
  title: string;
  value: string;
  caption: string;
  icon?: LucideIcon;
  accent?: "emerald" | "amber" | "sky" | "violet" | "rose";
}) {
  const accentClass = {
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  }[accent];

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          </div>
          <div className={cn("flex size-11 items-center justify-center rounded-xl", accentClass)}>
            <Icon className="size-5" aria-hidden />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-52 flex-col items-center justify-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Wallet className="size-5" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        {actionLabel && (actionHref || onAction) ? (
          actionHref ? (
            <Button asChild className="mt-5">
              <a href={actionHref}>
                {actionLabel}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
          ) : (
            <Button className="mt-5" type="button" onClick={onAction}>
              {actionLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
