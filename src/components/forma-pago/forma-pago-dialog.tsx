"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forma_pagoSchema, type FormaPagoInput } from "@/schemas/forma_pago";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { FormaPagoRow } from "./forma-pago-columns";

interface FormaPagoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: FormaPagoRow | null;
  onSubmit: (data: FormaPagoInput) => void;
  isSubmitting?: boolean;
}

export const TIPO_OPCIONES = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TARJETA_CREDITO", label: "Tarjeta de Crédito" },
  { value: "TARJETA_DEBITO", label: "Tarjeta de Débito" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "OTRA", label: "Otro" },
];

export function FormaPagoDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: FormaPagoDialogProps): React.JSX.Element {
  const isEditing = !!initialData;

  const form = useForm<FormaPagoInput>({
    resolver: zodResolver(forma_pagoSchema),
    defaultValues: {
      nombre: "",
      tipo: "",
      activa: true,
    },
  });

  // Reset form when dialog opens or initialData changes
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          nombre: initialData.nombre,
          tipo: initialData.tipo,
          activa: initialData.activa,
        });
      } else {
        form.reset({
          nombre: "",
          tipo: "",
          activa: true,
        });
      }
    }
  }, [open, initialData, form]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  function handleFormSubmit(data: FormaPagoInput): void {
    onSubmit(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar forma de pago" : "Nueva forma de pago"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza los datos de la forma de pago."
              : "Completa los campos para crear una nueva forma de pago."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input id="nombre" placeholder="Ej: Efectivo" {...register("nombre")} />
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
                    {TIPO_OPCIONES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo ? <p className="text-destructive text-sm">{errors.tipo.message}</p> : null}
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="activa"
              render={({ field }) => (
                <Checkbox id="activa" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="activa" className="cursor-pointer">
              Forma de pago activa
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
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isEditing ? "Guardar cambios" : "Crear forma de pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
