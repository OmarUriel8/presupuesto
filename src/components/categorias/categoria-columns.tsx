"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CategoriaRow {
  id_categoria: string;
  nombre: string;
  tipo: string;
  color: string | null;
  icono: string | null;
  activa: boolean;
  fecha_creacion: string;
}

interface CategoriaColumnsProps {
  onEdit: (categoria: CategoriaRow) => void;
  onDelete: (categoria: CategoriaRow) => void;
}

export function createCategoriaColumns({
  onEdit,
  onDelete,
}: CategoriaColumnsProps): ColumnDef<CategoriaRow, unknown>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        const color = row.original.color;
        return (
          <div className="flex items-center gap-2">
            {color ? (
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
            ) : null}
            <span className="font-medium">{row.getValue("nombre")}</span>
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
      accessorKey: "icono",
      header: "Ícono",
      cell: ({ row }) => {
        const icono = row.getValue("icono") as string | null;
        return icono ? (
          <span className="text-muted-foreground text-sm">{icono}</span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },
    {
      accessorKey: "activa",
      header: "Estado",
      cell: ({ row }) => {
        const activa = row.getValue("activa") as boolean;
        return (
          <Badge variant={activa ? "success" : "secondary"}>{activa ? "Activa" : "Inactiva"}</Badge>
        );
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const categoria = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(categoria)}
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            {/* <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={() => onDelete(categoria)}
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button> */}
          </div>
        );
      },
    },
  ];
}
