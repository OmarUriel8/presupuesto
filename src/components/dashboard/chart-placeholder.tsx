import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartPlaceholderProps {
  title: string;
  description: string;
}

export function ChartPlaceholder({ title, description }: ChartPlaceholderProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
          <span className="bg-background flex size-10 items-center justify-center rounded-full border">
            <BarChart3 className="text-muted-foreground size-5" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium">Gráfica pendiente</p>
          <p className="text-muted-foreground max-w-xs text-xs">
            Aquí se mostrará la visualización cuando se conecten los datos reales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
