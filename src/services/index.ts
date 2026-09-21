// Capa de acceso a datos (solo Server Components / Server Actions / Route Handlers).
// No importar Prisma directamente en componentes visuales: usar estos servicios.
export {
  registerUser,
  authenticateUser,
  getUserById,
  updateUserProfile,
  changePassword,
} from "./auth";
export type { AuthUser } from "./auth";
export {
  getCategoriasByUsuario,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "./categoria";
export type { Categoria } from "./categoria";
