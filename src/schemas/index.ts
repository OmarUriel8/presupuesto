// Validaciones con Zod. Los esquemas por módulo se agregarán
// cuando se implemente cada CRUD (movimientos, presupuestos, etc.).
export { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "./auth";
export type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from "./auth";
export { categoriaSchema } from "./categoria";
export type { CategoriaInput } from "./categoria";
