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
export {
  getFormasPagoByUsuario,
  getFormaPagoById,
  createFormaPago,
  updateFormaPago,
  deleteFormaPago,
} from "./forma_pago";
export type { FormaPago } from "./forma_pago";
export {
  getMovimientosByUsuario,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  getCategoriasActivasByUsuario,
  getFormasPagoActivasByUsuario,
} from "./movimiento";
export type { Movimiento, MovimientoWithRelations } from "./movimiento";
export { getDashboardByMonth } from "./dashboard";
