/**
 * Redirección post-login.
 *
 * Cuando un usuario no autenticado visita una ruta protegida, el proxy redirige a
 * /login?from=<ruta>. Guardamos esa ruta en localStorage para devolver al usuario
 * a la página que quería consultar después de iniciar sesión.
 */

export const AUTH_REDIRECT_STORAGE_KEY = "auth_redirect_target";

const AUTH_ROUTES = ["/login", "/registro"];

/**
 * Valida que una ruta de redirección sea interna y segura (evita open redirects).
 * Devuelve la ruta si es válida o null cuando no se debe redirigir.
 */
export function sanitizeRedirectPath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (!path.startsWith("/")) return null; // URLs absolutas
  if (path.startsWith("//")) return null; // protocol-relative
  if (AUTH_ROUTES.some((route) => path === route || path.startsWith(`${route}/`))) {
    return null;
  }
  return path;
}

/** Lee y valida el destino guardado en localStorage. */
export function getStoredRedirectPath(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeRedirectPath(window.localStorage.getItem(AUTH_REDIRECT_STORAGE_KEY));
}

/** Guarda el destino en localStorage solo si es una ruta interna válida. */
export function storeRedirectPath(path: string): void {
  if (typeof window === "undefined") return;
  const safe = sanitizeRedirectPath(path);
  if (safe) {
    window.localStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, safe);
  }
}

/** Elimina el destino guardado (p. ej. al cerrar sesión o tras el login). */
export function clearStoredRedirectPath(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
}
