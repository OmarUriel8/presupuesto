"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categoriaSchema, type CategoriaInput } from "@/schemas/categoria";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2Icon } from "lucide-react";

interface CategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id_categoria: string;
    nombre: string;
    tipo: string;
    color: string | null;
    icono: string | null;
    activa: boolean;
  } | null;
  onSubmit: (data: CategoriaInput) => void;
  isSubmitting?: boolean;
}

export function CategoriaDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: CategoriaDialogProps): React.JSX.Element {
  const isEditing = !!initialData;

  const form = useForm<CategoriaInput>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
      tipo: "GASTO",
      color: "",
      icono: "",
      activa: true,
    },
  });

  // Reset form when dialog opens or initialData changes
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          nombre: initialData.nombre,
          tipo: initialData.tipo as "INGRESO" | "GASTO",
          color: initialData.color ?? "",
          icono: initialData.icono ?? "",
          activa: initialData.activa,
        });
      } else {
        form.reset({
          nombre: "",
          tipo: "GASTO",
          color: "",
          icono: "",
          activa: true,
        });
      }
    }
  }, [open, initialData, form]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  const colorValue = watch("color");

  function handleFormSubmit(data: CategoriaInput): void {
    onSubmit(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la categoría."
              : "Completa los campos para crear una nueva categoría."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input id="nombre" placeholder="Ej: Alimentación" {...register("nombre")} />
            {errors.nombre ? (
              <p className="text-destructive text-sm">{errors.nombre.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GASTO">Gasto</SelectItem>
                    <SelectItem value="INGRESO">Ingreso</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo ? <p className="text-destructive text-sm">{errors.tipo.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="color-picker"
                  type="color"
                  value={colorValue || "#000000"}
                  onChange={(e) => setValue("color", e.target.value)}
                  className="border-input h-9 w-12 cursor-pointer rounded p-0.5"
                />
                <Input id="color" placeholder="#ff5733" {...register("color")} className="flex-1" />
              </div>
              {errors.color ? (
                <p className="text-destructive text-sm">{errors.color.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icono">Ícono</Label>
              <Input id="icono" placeholder="Ej: ShoppingCart" {...register("icono")} />
              {errors.icono ? (
                <p className="text-destructive text-sm">{errors.icono.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="activa"
              render={({ field }) => (
                <Checkbox
                  id="activa"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="activa" className="cursor-pointer">
              Categoría activa
            </Label>
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
              {isEditing ? "Guardar cambios" : "Crear categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
