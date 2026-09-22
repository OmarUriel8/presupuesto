"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { EmptyState } from "@/components/common/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import type { MovimientoDia } from "@/types";

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    theme: { light: "var(--success)", dark: "var(--success)" },
  },
  gastos: {
    label: "Gastos",
    theme: { light: "var(--destructive)", dark: "var(--destructive)" },
  },
} satisfies ChartConfig;

interface MonthChartProps {
  /** Totales por día del mes (solo días con movimientos). */
  data: MovimientoDia[];
  /** Mes representado, ej. "Septiembre 2026". */
  mes: string;
}

/** Gráfica de barras de ingresos vs gastos por día del mes seleccionado. */
export function MonthChart({ data, mes }: MonthChartProps): React.JSX.Element {
  const sinMovimientos = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs gastos</CardTitle>
        <CardDescription>
          {sinMovimientos
            ? `Sin movimientos registrados en ${mes}.`
            : `Totales por día de ${mes}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sinMovimientos ? (
          <EmptyState
            title="Sin datos para la gráfica"
            description="Registra ingresos o gastos en este mes para ver la comparativa."
          />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="dia"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={58}
                tickFormatter={(value: number) => formatCurrencyCompact(value)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Día ${label}`}
                    formatter={(value, name) => {
                      const key = String(name);
                      const label =
                        key in chartConfig
                          ? chartConfig[key as keyof typeof chartConfig].label
                          : key;
                      return (
                        <div className="flex w-full flex-wrap items-center justify-between gap-2 leading-none">
                          <span className="text-muted-foreground">{label ?? key}</span>
                          <span className="font-mono font-medium tabular-nums">
                            {formatCurrency(Number(value))}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="gastos" fill="var(--color-gastos)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
