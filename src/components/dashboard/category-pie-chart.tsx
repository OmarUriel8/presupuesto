"use client";

import { Cell, Pie, PieChart } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format";
import type { CategoriaGasto } from "@/types";

// Paleta de respaldo cuando la categoría no tiene color o el valor no es un hex válido.
const FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

interface PieEntry {
  // Clave CSS-segura ("cat0", "cat1", ...) porque los nombres de categoría
  // pueden traer espacios o acentos y no sirven como custom property.
  key: string;
  nombre: string;
  monto: number;
  fill: string;
}

interface CategoryPieChartProps {
  /** Gastos del mes agrupados por categoría, del mayor al menor. */
  data: CategoriaGasto[];
  /** Total de gastos del mes: base para los porcentajes. */
  total: number;
  /** Mes representado, ej. "Septiembre 2026". */
  mes: string;
}

/** Pastel de distribución de los gastos del mes por categoría (ancho completo). */
export function CategoryPieChart({
  data,
  total,
  mes,
}: CategoryPieChartProps): React.JSX.Element {
  const sinGastos = data.length === 0 || total <= 0;

  const entries: PieEntry[] = data.map((c, i) => ({
    key: `cat${i}`,
    nombre: c.nombre,
    monto: c.monto,
    fill:
      c.color && HEX_COLOR.test(c.color)
        ? c.color
        : FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));

  const chartConfig: ChartConfig = Object.fromEntries(
    entries.map((e) => [e.key, { label: e.nombre, color: e.fill }])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
        <CardDescription>
          {sinGastos
            ? `Sin gastos registrados en ${mes}.`
            : `Distribución de los gastos de ${mes}. Total ${formatCurrency(total)}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sinGastos ? (
          <EmptyState
            title="Sin datos para la gráfica"
            description="Registra gastos en este mes para ver cómo se distribuyen por categoría."
          />
        ) : (
          <div className="grid items-center gap-6 md:grid-cols-2">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-auto h-[280px] w-full max-w-[320px] sm:h-[320px]"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => {
                        const key = String(name);
                        const entry = entries.find((e) => e.key === key);
                        const porcentaje =
                          total > 0 ? (Number(value) / total) * 100 : 0;
                        return (
                          <div className="flex w-full flex-wrap items-center justify-between gap-2 leading-none">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <span
                                className="size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: entry?.fill }}
                              />
                              {entry?.nombre ?? key}
                            </span>
                            <span className="font-mono font-medium tabular-nums">
                              {formatCurrency(Number(value))}
                              <span className="text-muted-foreground ml-1.5 text-xs">
                                {porcentaje.toFixed(1)}%
                              </span>
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={entries}
                  dataKey="monto"
                  nameKey="key"
                  innerRadius={64}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  {entries.map((entry) => (
                    <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul className="space-y-3">
              {entries.map((entry) => {
                const porcentaje =
                  total > 0 ? (entry.monto / total) * 100 : 0;
                return (
                  <li
                    key={entry.key}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: entry.fill }}
                        aria-hidden="true"
                      />
                      <span className="truncate text-sm">{entry.nombre}</span>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-2">
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {porcentaje.toFixed(1)}%
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {formatCurrency(entry.monto)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
