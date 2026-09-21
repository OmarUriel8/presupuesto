"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { movimientoSchema, type MovimientoInput } from "@/schemas/movimiento";
import type { CategoriaOption, FormaPagoOption } from "@/app/(app)/movimientos/actions";
import type { MovimientoRow } from "@/components/movimientos/movimiento-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";

/**
 * Radix Select no admite valores vacíos, así que "sin forma de pago" se
 * representa con este valor en la UI y se guarda en el formulario como `null`.
 */
const SELECT_SIN_FORMA_PAGO = "none";

const TIPO_OPCIONES = [
  { value: "GASTO", label: "Gasto" },
  { value: "INGRESO", label: "Ingreso" },
];

function hoyISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function emptyValues(): MovimientoInput {
  return {
    fecha: hoyISO(),
    descripcion: "",
    monto: 0,
    tipo: "GASTO",
    id_categoria: "",
    id_forma_pago: null,
    notas: "",
  };
}

interface MovimientoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MovimientoRow | null;
  categorias: CategoriaOption[];
  formasPago: FormaPagoOption[];
  onSubmit: (data: MovimientoInput) => void;
  isSubmitting?: boolean;
}

export function MovimientoDialog({
  open,
  onOpenChange,
  initialData,
  categorias,
  formasPago,
  onSubmit,
  isSubmitting = false,
}: MovimientoDialogProps): React.JSX.Element {
  const isEditing = !!initialData;

  const form = useForm<MovimientoInput>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: emptyValues(),
  });

  // Reset form when dialog opens or initialData changes
  React.useEffect(() => {
    if (!open) return;

    if (initialData) {
      form.reset({
        fecha: initialData.fecha,
        descripcion: initialData.descripcion,
        monto: initialData.monto,
        tipo: initialData.tipo === "INGRESO" ? "INGRESO" : "GASTO",
        id_categoria: initialData.categoria.id_categoria,
        id_forma_pago: initialData.forma_pago?.id_forma_pago ?? null,
        notas: initialData.notas ?? "",
      });
    } else {
      form.reset(emptyValues());
    }
  }, [open, initialData, form]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  // Watch the tipo field to filter categorias
  const selectedTipo = watch("tipo");

  function handleFormSubmit(data: MovimientoInput): void {
    onSubmit(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar movimiento" : "Nuevo movimiento"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del movimiento."
              : "Completa los campos para registrar un ingreso o gasto."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input id="fecha" type="date" {...register("fecha")} />
              {errors.fecha ? (
                <p className="text-destructive text-sm">{errors.fecha.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Controller
                control={control}
                name="tipo"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Al cambiar el tipo, la categoría seleccionada puede no coincidir:
                      // se limpia para forzar una nueva selección válida.
                      form.setValue("id_categoria", "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPO_OPCIONES.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo ? (
                <p className="text-destructive text-sm">{errors.tipo.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Input
              id="descripcion"
              placeholder="Ej: Compra de supermercado"
              {...register("descripcion")}
            />
            {errors.descripcion ? (
              <p className="text-destructive text-sm">{errors.descripcion.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monto">Monto *</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("monto", { valueAsNumber: true })}
              />
              {errors.monto ? (
                <p className="text-destructive text-sm">{errors.monto.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="forma_pago">Forma de pago</Label>
              <Controller
                control={control}
                name="id_forma_pago"
                render={({ field }) => (
                  <Select
                    value={field.value ?? SELECT_SIN_FORMA_PAGO}
                    onValueChange={(value) =>
                      field.onChange(value === SELECT_SIN_FORMA_PAGO ? null : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una forma de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SELECT_SIN_FORMA_PAGO}>Sin forma de pago</SelectItem>
                      {formasPago.map((fp) => (
                        <SelectItem key={fp.id_forma_pago} value={fp.id_forma_pago}>
                          {fp.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.id_forma_pago ? (
                <p className="text-destructive text-sm">{errors.id_forma_pago.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_categoria">Categoría *</Label>
            <Controller
              control={control}
              name="id_categoria"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.filter((c) => c.tipo === selectedTipo).length > 0 ? (
                      categorias
                        .filter((c) => c.tipo === selectedTipo)
                        .map((categoria) => (
                          <SelectItem key={categoria.id_categoria} value={categoria.id_categoria}>
                            <div className="flex items-center gap-2">
                              {categoria.color ? (
                                <span
                                  className="inline-block h-3 w-3 shrink-0 rounded-full"
                                  style={{ backgroundColor: categoria.color }}
                                />
                              ) : null}
                              {categoria.nombre}
                            </div>
                          </SelectItem>
                        ))
                    ) : (
                      <div className="text-muted-foreground px-2 py-3 text-center text-sm">
                        No hay categorías de tipo {selectedTipo === "INGRESO" ? "ingreso" : "gasto"}{" "}
                        activas. Cree una en Categorías.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.id_categoria ? (
              <p className="text-destructive text-sm">{errors.id_categoria.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Input
              id="notas"
              placeholder="Información adicional (opcional)"
              {...register("notas")}
            />
            {errors.notas ? (
              <p className="text-destructive text-sm">{errors.notas.message}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
              {isEditing ? "Guardar cambios" : "Crear movimiento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
