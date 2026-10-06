"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { VariacionCategoriaGasto } from "@/types";

interface VariacionCategoriaProps {
  data: VariacionCategoriaGasto[];
  mesActual: string;
  mesAnterior: string;
}

/** Frase destacada con la mayor variación, ej. "Gastaste +25% en Restaurantes…". */
function fraseDestacada(data: VariacionCategoriaGasto[]): string | null {
  const conCambio = data.filter((c) => c.diferencia !== 0);
  if (conCambio.length === 0) return null;

  const mayorAumento = [...conCambio].sort((a, b) => b.diferencia - a.diferencia)[0];
  if (mayorAumento.diferencia > 0) {
    if (mayorAumento.porcentaje === null) {
      return `Gastaste ${formatCurrency(mayorAumento.actual)} en ${mayorAumento.nombre}, una categoría sin gasto el mes anterior.`;
    }
    return `Gastaste +${mayorAumento.porcentaje.toFixed(1)}% en ${mayorAumento.nombre} respecto al mes anterior.`;
  }

  const mayorAhorro = [...conCambio].sort((a, b) => a.diferencia - b.diferencia)[0];
  const porcentaje =
    mayorAhorro.porcentaje === null ? "" : ` un ${Math.abs(mayorAhorro.porcentaje).toFixed(1)}%`;
  return `Reduciste tu gasto${porcentaje} en ${mayorAhorro.nombre} respecto al mes anterior.`;
}

function InsigniaTendencia({ item }: { item: VariacionCategoriaGasto }): React.JSX.Element {
  if (item.diferencia > 0) {
    return (
      <Badge variant="destructive">
        <TrendingUp />
        {item.porcentaje === null ? "Nueva" : `+${item.porcentaje.toFixed(1)}%`}
      </Badge>
    );
  }
  if (item.diferencia < 0) {
    return (
      <Badge variant="success">
        <TrendingDown />
        {item.porcentaje === null ? "Menos" : `${item.porcentaje.toFixed(1)}%`}
      </Badge>
    );
  }
  return <Badge variant="secondary">Sin cambios</Badge>;
}

/** Tabla comparativa del gasto por categoría: mes actual vs anterior. */
export function VariacionCategoria({
  data,
  mesActual,
  mesAnterior,
}: VariacionCategoriaProps): React.JSX.Element {
  const destacada = fraseDestacada(data);
  const totalActual = data.reduce((acc, c) => acc + c.actual, 0);
  const totalAnterior = data.reduce((acc, c) => acc + c.anterior, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variación mensual por categoría</CardTitle>
        <CardDescription>
          {data.length === 0
            ? "Sin gastos para comparar."
            : `Lo gastado por categoría en ${mesActual} frente a ${mesAnterior}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <EmptyState
            title="Sin datos para comparar"
            description="Registra gastos en los últimos dos meses para ver la variación por categoría."
          />
        ) : (
          <>
            {destacada ? (
              <p className="bg-muted rounded-lg px-4 py-3 text-sm">{destacada}</p>
            ) : null}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">{mesAnterior}</TableHead>
                  <TableHead className="text-right">{mesActual}</TableHead>
                  <TableHead className="text-right">Diferencia</TableHead>
                  <TableHead className="text-right">Tendencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3 shrink-0 rounded-sm"
                          style={{ backgroundColor: c.color ?? "var(--chart-1)" }}
                          aria-hidden="true"
                        />
                        {c.nombre}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(c.anterior)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(c.actual)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.diferencia > 0 ? "+" : ""}
                      {formatCurrency(c.diferencia)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex w-full justify-end">
                        <InsigniaTendencia item={c} />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(totalAnterior)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(totalActual)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {totalActual - totalAnterior > 0 ? "+" : ""}
                    {formatCurrency(totalActual - totalAnterior)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
