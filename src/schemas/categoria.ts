import * as z from "zod";

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre no puede exceder 100 caracteres.")
    .trim(),
  tipo: z.enum(["INGRESO", "GASTO"], {
    message: "El tipo debe ser 'ingreso' o 'gasto'.",
  }),
  color: z.string().max(20, "El color no puede exceder 20 caracteres.").trim().optional(),
  icono: z.string().max(50, "El ícono no puede exceder 50 caracteres.").trim().optional(),
  activa: z.boolean(),
});

export type CategoriaInput = z.infer<typeof categoriaSchema>;
