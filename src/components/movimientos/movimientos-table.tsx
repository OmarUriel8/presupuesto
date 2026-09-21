"use client";

import * as React from "react";
import Link from "next/link";

import { DataTable } from "@/components/ui/data-table";
import {
  createMovimientoColumns,
  type MovimientoRow,
} from "@/components/movimientos/movimiento-columns";
import { MovimientoDialog } from "@/components/movimientos/movimiento-dialog";
import { DeleteConfirmDialog } from "@/components/movimientos/delete-confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import type { MovimientoInput } from "@/schemas/movimiento";
import {
  getMovimientosData,
  createMovimiento,
  updateMovimiento,
  deleteMovimientoAction,
  type MovimientosData,
} from "@/app/(app)/movimientos/actions";

interface MovimientosTableProps {
  initialData: MovimientosData;
}

export function MovimientosTable({ initialData }: MovimientosTableProps): React.JSX.Element {
  // Los datos iniciales los resuelve el server component; aquí solo se refrescan
  // desde manejadores de eventos (nada de fetching en effects).
  const [data, setData] = React.useState<MovimientosData>(initialData);

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingMovimiento, setEditingMovimiento] = React.useState<MovimientoRow | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingMovimiento, setDeletingMovimiento] = React.useState<MovimientoRow | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const refetch = React.useCallback(async (): Promise<void> => {
    try {
      const result = await getMovimientosData();
      setData(result);
    } catch (err) {
      toast.error("Error", {
        description: err instanceof Error ? err.message : "Error al cargar los movimientos.",
      });
    }
  }, []);

  function handleCreate(input: MovimientoInput): void {
    startTransition(async () => {
      const result = await createMovimiento({ message: "", success: "" }, input);
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDialogOpen(false);
        await refetch();
      }
    });
  }

  function handleUpdate(input: MovimientoInput): void {
    if (!editingMovimiento) return;

    startTransition(async () => {
      const result = await updateMovimiento(
        { message: "", success: "" },
        { id: editingMovimiento.id_movimiento, ...input }
      );
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDialogOpen(false);
        setEditingMovimiento(null);
        await refetch();
      }
    });
  }

  function handleDelete(): void {
    if (!deletingMovimiento) return;

    startTransition(async () => {
      const result = await deleteMovimientoAction(deletingMovimiento.id_movimiento);
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDeleteDialogOpen(false);
        setDeletingMovimiento(null);
        await refetch();
      }
    });
  }

  function handleEdit(movimiento: MovimientoRow): void {
    setEditingMovimiento(movimiento);
    setDialogOpen(true);
  }

  function handleDeleteClick(movimiento: MovimientoRow): void {
    setDeletingMovimiento(movimiento);
    setDeleteDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean): void {
    setDialogOpen(open);
    if (!open) {
      setEditingMovimiento(null);
    }
  }

  const columns = React.useMemo(
    () =>
      createMovimientoColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
      }),
    []
  );

  const faltanCategorias = data.categorias.length === 0;
  const faltanFormasPago = data.formasPago.length === 0;
  const faltanRegistros = faltanCategorias || faltanFormasPago;

  // Sin categorías y/o formas de pago no se puede registrar ningún movimiento:
  // se indica al usuario a qué módulos debe ir.
  if (faltanRegistros) {
    const modulos: string[] = [];
    if (faltanCategorias) modulos.push("categorías");
    if (faltanFormasPago) modulos.push("formas de pago");

    return (
      <EmptyState
        title="Faltan registros para poder crear movimientos"
        description={`Antes de registrar un movimiento necesitas tener al menos un registro en: ${modulos.join(
          " y "
        )}. Crea esos registros en su módulo y vuelve a esta página.`}
        action={
          <div className="flex flex-wrap items-center justify-center gap-2">
            {faltanCategorias ? (
              <Button asChild>
                <Link href="/categorias">Ir a categorías</Link>
              </Button>
            ) : null}
            {faltanFormasPago ? (
              <Button asChild variant="outline">
                <Link href="/formas-pago">Ir a formas de pago</Link>
              </Button>
            ) : null}
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setDialogOpen(true)} disabled={isPending}>
          <PlusIcon className="h-4 w-4" />
          Nuevo movimiento
        </Button>
      </div>

      {data.movimientos.length === 0 ? (
        <EmptyState
          title="Sin movimientos todavía"
          description="Registra tu primer ingreso o gasto para empezar a controlar tus finanzas."
          action={
            <Button onClick={() => setDialogOpen(true)} variant="outline">
              <PlusIcon className="h-4 w-4" />
              Nuevo movimiento
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={data.movimientos}
          searchPlaceholder="Buscar movimiento..."
          searchColumn="descripcion"
        />
      )}

      <MovimientoDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        initialData={editingMovimiento}
        categorias={data.categorias}
        formasPago={data.formasPago}
        onSubmit={editingMovimiento ? handleUpdate : handleCreate}
        isSubmitting={isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        nombre={deletingMovimiento?.descripcion ?? ""}
        onConfirm={handleDelete}
        isSubmitting={isPending}
      />
    </div>
  );
}
