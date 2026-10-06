import { CalendarDays, History, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PromedioDiarioGasto } from "@/types";

interface PromedioDiarioProps {
  data: PromedioDiarioGasto;
}

interface Tarjeta {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: LucideIcon;
  tono: "income" | "expense" | "neutral";
}

const tonos: Record<Tarjeta["tono"], string> = {
  income: "bg-success/15 text-success",
  expense: "bg-destructive/10 text-destructive",
  neutral: "bg-primary/10 text-primary",
};

/** Tarjetas del ritmo de gasto diario: mes actual vs meses previos. */
export function PromedioDiario({ data }: PromedioDiarioProps): React.JSX.Element {
  const aumenta = data.diferencia > 0;
  const disminuye = data.diferencia < 0;
  const descripcionDiferencia =
    data.diferenciaPorcentaje === null
      ? "Sin gasto previo para comparar."
      : `${aumenta ? "+" : "-"}${Math.abs(data.diferenciaPorcentaje).toFixed(1)}% frente a meses anteriores.`;

  const tarjetas: Tarjeta[] = [
    {
      titulo: "Promedio diario · mes actual",
      valor: data.promedioActual,
      descripcion: `${data.diasTranscurridos} ${data.diasTranscurridos === 1 ? "día transcurrido" : "días transcurridos"} de ${data.etiquetaMesActual}.`,
      icono: CalendarDays,
      tono: "neutral",
    },
    {
      titulo: "Promedio diario · meses previos",
      valor: data.promedioPrevio,
      descripcion: "Ritmo medio de los meses previos completos.",
      icono: History,
      tono: "neutral",
    },
    {
      titulo: "Diferencia diaria",
      valor: Math.abs(data.diferencia),
      descripcion: descripcionDiferencia,
      icono: aumenta ? TrendingUp : TrendingDown,
      tono: aumenta ? "expense" : disminuye ? "income" : "neutral",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tarjetas.map((t) => {
        const Icon = t.icono;
        return (
          <Card key={t.titulo}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.titulo}</CardTitle>
              <span
                className={cn("flex size-8 items-center justify-center rounded-lg", tonos[t.tono])}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight tabular-nums">
                {formatCurrency(t.valor)}
                <span className="text-muted-foreground text-sm font-normal">/día</span>
              </p>
              <p className="text-muted-foreground mt-1 text-xs">{t.descripcion}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
