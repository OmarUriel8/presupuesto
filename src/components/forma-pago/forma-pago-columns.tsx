"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { TIPO_OPCIONES } from "@/components/forma-pago/forma-pago-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface FormaPagoRow {
  id_forma_pago: string;
  nombre: string;
  tipo: string;
  activa: boolean;
  fecha_creacion: string;
}

interface FormaPagoColumnsProps {
  onEdit: (formaPago: FormaPagoRow) => void;
  onDelete: (formaPago: FormaPagoRow) => void;
}

export function createFormaPagoColumns({
  onEdit,
  onDelete,
}: FormaPagoColumnsProps): ColumnDef<FormaPagoRow, unknown>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("nombre")}</span>;
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.getValue("tipo") as string;
        return (
          <span className="text-muted-foreground">
            {TIPO_OPCIONES.filter((x) => x.value === tipo)[0]?.label}
          </span>
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
      accessorKey: "fecha_creacion",
      header: "Fecha creación",
      cell: ({ row }) => {
        const fecha = row.getValue("fecha_creacion") as string;
        return (
          <span className="text-muted-foreground text-sm">
            {new Date(fecha).toLocaleDateString("es-ES")}
          </span>
        );
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const formaPago = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(formaPago)}
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(formaPago)}
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
