import * as z from "zod";

export const forma_pagoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre no puede exceder 100 caracteres.")
    .trim(),
  tipo: z
    .string()
    .min(1, "El tipo de forma de pago es obligatorio.")
    .max(30, "El tipo no puede exceder 30 caracteres.")
    .trim(),
  activa: z.boolean(),
});

export type FormaPagoInput = z.infer<typeof forma_pagoSchema>;
