import * as z from "zod";

export const movimientoSchema = z.object({
  id_categoria: z.string().uuid("Debe seleccionar una categoría válida."),
  id_forma_pago: z.string().uuid("Debe seleccionar una forma de pago válida.").nullable().optional(),
  fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha es obligatoria y debe ser válida.",
  }),
  descripcion: z
    .string()
    .min(1, "La descripción es obligatoria.")
    .max(255, "La descripción no puede exceder 255 caracteres.")
    .trim(),
  // z.number() (no coerce) para que el input y output coincidan con react-hook-form.
  // El input usa valueAsNumber: true.
  monto: z
    .number({ message: "El monto es obligatorio." })
    .positive("El monto debe ser mayor a 0."),
  tipo: z.enum(["INGRESO", "GASTO"], {
    message: "El tipo debe ser 'ingreso' o 'gasto'.",
  }),
  notas: z
    .string()
    .max(500, "Las notas no pueden exceder 500 caracteres.")
    .trim()
    .optional()
    .nullable(),
});

export type MovimientoInput = z.infer<typeof movimientoSchema>;