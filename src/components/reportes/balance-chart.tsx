"use client";

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import type { EvolucionMes } from "@/types";

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    theme: { light: "var(--success)", dark: "var(--success)" },
  },
  gastos: {
    label: "Gastos",
    theme: { light: "var(--destructive)", dark: "var(--destructive)" },
  },
  balance: {
    label: "Balance",
    theme: { light: "var(--chart-2)", dark: "var(--chart-2)" },
  },
} satisfies ChartConfig;

const mesCortoFormatter = new Intl.DateTimeFormat("es-MX", {
  month: "short",
  timeZone: "UTC",
});

/** Etiqueta corta para el eje X, ej. "sep 26". */
function etiquetaCorta(anio: number, mes: number): string {
  const nombre = mesCortoFormatter.format(new Date(Date.UTC(anio, mes - 1, 1)));
  return `${nombre.replace(".", "")} ${String(anio).slice(2)}`;
}

interface BalanceChartProps {
  /** Evolución mensual del más antiguo al actual. */
  data: EvolucionMes[];
  /** Rango en meses (3, 6 o 12). */
  rango: number;
}

/** Barras de ingresos vs gastos por mes con línea de balance. */
export function BalanceChart({ data, rango }: BalanceChartProps): React.JSX.Element {
  const datos = data.map((d) => ({ ...d, mesCorto: etiquetaCorta(d.anio, d.mes) }));
  const etiquetas = new Map(datos.map((d) => [d.mesCorto, d.etiqueta]));
  const sinMovimientos = datos.every((d) => d.ingresos === 0 && d.gastos === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución del balance</CardTitle>
        <CardDescription>
          {datos.length === 0 || sinMovimientos
            ? "Sin movimientos en el periodo seleccionado."
            : `Ingresos vs gastos de los últimos ${rango} meses.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {datos.length === 0 || sinMovimientos ? (
          <EmptyState
            title="Sin datos para la gráfica"
            description="Registra movimientos para ver la evolución de tu balance mes a mes."
          />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
            <ComposedChart data={datos} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="mesCorto" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={58}
                tickFormatter={(value: number) => formatCurrencyCompact(value)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => etiquetas.get(String(label)) ?? String(label)}
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
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
