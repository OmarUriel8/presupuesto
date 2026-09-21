"use client";

import * as React from "react";

import { DataTable } from "@/components/ui/data-table";
import {
  createFormaPagoColumns,
  type FormaPagoRow,
} from "@/components/forma-pago/forma-pago-columns";
import { FormaPagoDialog } from "@/components/forma-pago/forma-pago-dialog";
import { DeleteConfirmDialog } from "@/components/forma-pago/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import type { FormaPagoInput } from "@/schemas/forma_pago";
import {
  getFormasPago,
  createFormaPago,
  updateFormaPago,
  deleteFormaPagoAction,
} from "@/app/(app)/formas-pago/actions";

export function FormasPagoTable(): React.JSX.Element {
  const [data, setData] = React.useState<FormaPagoRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingFormaPago, setEditingFormaPago] =
    React.useState<FormaPagoRow | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingFormaPago, setDeletingFormaPago] =
    React.useState<FormaPagoRow | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const fetchFormasPago = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFormasPago();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las formas de pago."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFormasPago();
  }, [fetchFormasPago]);

  function handleCreate(data: FormaPagoInput): void {
    startTransition(async () => {
      const result = await createFormaPago({ message: "", success: "" }, data);
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDialogOpen(false);
        await fetchFormasPago();
      }
    });
  }

  function handleUpdate(data: FormaPagoInput): void {
    if (!editingFormaPago) return;

    startTransition(async () => {
      const result = await updateFormaPago(
        { message: "", success: "" },
        { id: editingFormaPago.id_forma_pago, ...data }
      );
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDialogOpen(false);
        setEditingFormaPago(null);
        await fetchFormasPago();
      }
    });
  }

  function handleDelete(): void {
    if (!deletingFormaPago) return;

    startTransition(async () => {
      const result = await deleteFormaPagoAction(deletingFormaPago.id_forma_pago);
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDeleteDialogOpen(false);
        setDeletingFormaPago(null);
        await fetchFormasPago();
      }
    });
  }

  function handleEdit(formaPago: FormaPagoRow): void {
    setEditingFormaPago(formaPago);
    setDialogOpen(true);
  }

  function handleDeleteClick(formaPago: FormaPagoRow): void {
    setDeletingFormaPago(formaPago);
    setDeleteDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean): void {
    setDialogOpen(open);
    if (!open) {
      setEditingFormaPago(null);
    }
  }

  const columns = React.useMemo(
    () =>
      createFormaPagoColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-40 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center text-red-700">
        <p>{error}</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={fetchFormasPago}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={() => setDialogOpen(true)} disabled={isPending}>
          <PlusIcon className="h-4 w-4" />
          Nueva forma de pago
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar forma de pago..."
        searchColumn="nombre"
      />

      <FormaPagoDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        initialData={editingFormaPago}
        onSubmit={editingFormaPago ? handleUpdate : handleCreate}
        isSubmitting={isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        nombre={deletingFormaPago?.nombre ?? ""}
        onConfirm={handleDelete}
        isSubmitting={isPending}
      />
    </div>
  );
}
