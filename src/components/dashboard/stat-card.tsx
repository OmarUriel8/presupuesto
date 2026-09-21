import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  tone?: "income" | "expense" | "neutral" | "budget";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  income: "bg-success/15 text-success",
  expense: "bg-destructive/10 text-destructive",
  neutral: "bg-primary/10 text-primary",
  budget: "bg-chart-2/15 text-chart-2",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "neutral",
}: StatCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span
          className={cn("flex size-8 items-center justify-center rounded-lg", toneStyles[tone])}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{formatCurrency(value)}</p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
