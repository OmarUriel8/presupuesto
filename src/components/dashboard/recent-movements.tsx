import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency, formatDate, formatToLocalDate } from "@/lib/format";
import type { MovimientoResumen } from "@/types";
import { cn } from "@/lib/utils";

interface RecentMovementsProps {
  movements: MovimientoResumen[];
}

export function RecentMovements({ movements }: RecentMovementsProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos recientes</CardTitle>
        <CardDescription>Registros del mes seleccionado, más recientes primero.</CardDescription>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <EmptyState
            title="Sin movimientos"
            description="Todavía no hay movimientos registrados en este mes."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m) => {
                const isIncome = m.tipo === "INGRESO";
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium">
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full",
                            isIncome
                              ? "bg-success/15 text-success"
                              : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="size-4" aria-hidden="true" />
                          ) : (
                            <ArrowDownRight className="size-4" aria-hidden="true" />
                          )}
                        </span>
                        {m.descripcion}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary">{m.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {formatDate(formatToLocalDate(m.fecha))}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        isIncome ? "text-success" : "text-destructive"
                      )}
                    >
                      {isIncome ? "+" : "−"}
                      {formatCurrency(m.monto)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
