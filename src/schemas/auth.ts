import * as z from "zod";

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es obligatorio.")
      .max(150, "El nombre no puede exceder 150 caracteres.")
      .trim(),
    email: z
      .string()
      .min(1, "El email es obligatorio.")
      .email("Ingresa un email válido.")
      .max(255, "El email no puede exceder 255 caracteres.")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .max(100, "La contraseña no puede exceder 100 caracteres."),
    confirmPassword: z
      .string()
      .min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio.")
    .email("Ingresa un email válido.")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .max(150, "El nombre no puede exceder 150 caracteres.")
    .trim(),
  email: z
    .string()
    .min(1, "El email es obligatorio.")
    .email("Ingresa un email válido.")
    .max(255, "El email no puede exceder 255 caracteres.")
    .trim()
    .toLowerCase(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "La contraseña actual es obligatoria."),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres.")
      .max(100, "La contraseña no puede exceder 100 caracteres."),
    confirmNewPassword: z
      .string()
      .min(1, "Confirma la nueva contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
