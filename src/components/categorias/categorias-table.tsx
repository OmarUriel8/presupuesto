"use client";

import * as React from "react";

import { DataTable } from "@/components/ui/data-table";
import {
  createCategoriaColumns,
  type CategoriaRow,
} from "@/components/categorias/categoria-columns";
import { CategoriaDialog } from "@/components/categorias/categoria-dialog";
import { DeleteConfirmDialog } from "@/components/categorias/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import type { CategoriaInput } from "@/schemas/categoria";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoriaAction,
  type CategoriaState,
} from "@/app/(app)/categorias/actions";

export function CategoriasTable(): React.JSX.Element {
  const [data, setData] = React.useState<CategoriaRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategoria, setEditingCategoria] =
    React.useState<CategoriaRow | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingCategoria, setDeletingCategoria] =
    React.useState<CategoriaRow | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const fetchCategorias = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCategorias();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las categorías."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  function handleCreate(data: CategoriaInput): void {
    startTransition(async () => {
      const result = await createCategoria({ message: "", success: "" }, data);
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDialogOpen(false);
        await fetchCategorias();
      }
    });
  }

  function handleUpdate(data: CategoriaInput): void {
    if (!editingCategoria) return;

    startTransition(async () => {
      const result = await updateCategoria(
        { message: "", success: "" },
        { id: editingCategoria.id_categoria, ...data }
      );
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDialogOpen(false);
        setEditingCategoria(null);
        await fetchCategorias();
      }
    });
  }

  function handleDelete(): void {
    if (!deletingCategoria) return;

    startTransition(async () => {
      const result = await deleteCategoriaAction(
        deletingCategoria.id_categoria
      );
      if (result.message) {
        toast.error("Error", { description: result.message });
      }
      if (result.success) {
        toast.success(result.success);
        setDeleteDialogOpen(false);
        setDeletingCategoria(null);
        await fetchCategorias();
      }
    });
  }

  function handleEdit(categoria: CategoriaRow): void {
    setEditingCategoria(categoria);
    setDialogOpen(true);
  }

  function handleDeleteClick(categoria: CategoriaRow): void {
    setDeletingCategoria(categoria);
    setDeleteDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean): void {
    setDialogOpen(open);
    if (!open) {
      setEditingCategoria(null);
    }
  }

  const columns = React.useMemo(
    () =>
      createCategoriaColumns({
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
        <Button variant="outline" size="sm" className="mt-2" onClick={fetchCategorias}>
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
          Nueva categoría
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar categoría..."
        searchColumn="nombre"
      />

      <CategoriaDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        initialData={editingCategoria}
        onSubmit={editingCategoria ? handleUpdate : handleCreate}
        isSubmitting={isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        nombre={deletingCategoria?.nombre ?? ""}
        onConfirm={handleDelete}
        isSubmitting={isPending}
      />
    </div>
  );
}
