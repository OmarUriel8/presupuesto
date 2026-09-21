"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { formatToLocalDate } from "@/lib/format";

export interface MovimientoRow {
  id_movimiento: string;
  fecha: string; // AAAA-MM-DD
  descripcion: string;
  monto: number;
  tipo: string;
  notas: string | null;
  categoria: {
    id_categoria: string;
    nombre: string;
    tipo: string;
    color: string | null;
  };
  forma_pago: {
    id_forma_pago: string;
    nombre: string;
    tipo: string;
  } | null;
}

interface MovimientoColumnsProps {
  onEdit: (movimiento: MovimientoRow) => void;
  onDelete: (movimiento: MovimientoRow) => void;
}

export function createMovimientoColumns({
  onEdit,
  onDelete,
}: MovimientoColumnsProps): ColumnDef<MovimientoRow, unknown>[] {
  return [
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-sm">
          {formatDate(formatToLocalDate(row.getValue("fecha") as string))}
        </span>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => {
        const { descripcion, notas } = row.original;
        return (
          <div className="space-y-0.5">
            <span className="font-medium">{descripcion}</span>
            {notas ? (
              <p className="text-muted-foreground max-w-[240px] truncate text-xs">{notas}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "categoria",
      header: "Categoría",
      cell: ({ row }) => {
        const { nombre, color } = row.original.categoria;
        return (
          <div className="flex items-center gap-2">
            {color ? (
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
            ) : null}
            <span>{nombre}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipo") as string;
        return (
          <Badge variant={tipo === "INGRESO" ? "success" : "destructive"}>
            {tipo === "INGRESO" ? "Ingreso" : "Gasto"}
          </Badge>
        );
      },
    },
    {
      id: "forma_pago",
      header: "Forma de pago",
      cell: ({ row }) => {
        const formaPago = row.original.forma_pago;
        return formaPago ? (
          <span>{formaPago.nombre}</span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }) => {
        const monto = row.getValue("monto") as number;
        const esIngreso = row.original.tipo === "INGRESO";
        return (
          <span
            className={`block text-right font-medium tabular-nums ${
              esIngreso ? "text-success" : "text-destructive"
            }`}
          >
            {esIngreso ? "+" : "−"}
            {formatCurrency(monto)}
          </span>
        );
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const movimiento = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(movimiento)}
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={() => onDelete(movimiento)}
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        );
      },
    },
  ];
}
