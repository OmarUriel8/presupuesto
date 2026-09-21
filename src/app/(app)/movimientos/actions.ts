"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import {
  getMovimientosByUsuario,
  createMovimiento as createMovimientoService,
  updateMovimiento as updateMovimientoService,
  deleteMovimiento as deleteMovimientoService,
  getCategoriasActivasByUsuario,
  getFormasPagoActivasByUsuario,
} from "@/services/movimiento";
import { getCategoriaById } from "@/services/categoria";
import { getFormaPagoById } from "@/services/forma_pago";
import { movimientoSchema, type MovimientoInput } from "@/schemas/movimiento";

/**
 * Valida que la categoría y la forma de pago existan y pertenezcan al usuario.
 * Evita guardar movimientos ligados a registros de otra cuenta (solo hay FK, no hay check de propiedad).
 */
async function resolveRelaciones(
  id_usuario: string,
  data: MovimientoInput
): Promise<{ id_categoria: string; id_forma_pago: string | null } | { message: string }> {
  const categoria = await getCategoriaById(data.id_categoria, id_usuario);
  if (!categoria) {
    return {
      message:
        "La categoría seleccionada no existe o no te pertenece. Crea una categoría válida en el módulo Categorías.",
    };
  }

  if (data.id_forma_pago) {
    const formaPago = await getFormaPagoById(data.id_forma_pago, id_usuario);
    if (!formaPago) {
      return {
        message:
          "La forma de pago seleccionada no existe o no te pertenece. Crea una forma de pago válida en el módulo Formas de pago.",
      };
    }
    return { id_categoria: categoria.id_categoria, id_forma_pago: formaPago.id_forma_pago };
  }

  return { id_categoria: categoria.id_categoria, id_forma_pago: null };
}

export interface MovimientoState {
  message?: string;
  success?: string;
}

export interface MovimientoRow {
  id_movimiento: string;
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: string;
  notas: string | null;
  categoria: {
    id_categoria: string;
    nombre: string;
    tipo: string;
    color: string | null;
  };
  forma_pago: {
    id_forma_pago: string;
    nombre: string;
    tipo: string;
  } | null;
}

export interface CategoriaOption {
  id_categoria: string;
  nombre: string;
  tipo: string;
  color: string | null;
}

export interface FormaPagoOption {
  id_forma_pago: string;
  nombre: string;
  tipo: string;
}

export interface MovimientosData {
  movimientos: MovimientoRow[];
  categorias: CategoriaOption[];
  formasPago: FormaPagoOption[];
}

/**
 * Carga todo lo que necesita la página de movimientos en una sola llamada.
 * Se usa desde el server component (datos iniciales) y como refetch en el cliente.
 */
export async function getMovimientosData(): Promise<MovimientosData> {
  const session = await getSession();
  if (!session) {
    return { movimientos: [], categorias: [], formasPago: [] };
  }

  const [movimientos, categorias, formasPago] = await Promise.all([
    getMovimientos(),
    getCategoriasOptions(),
    getFormasPagoOptions(),
  ]);

  return { movimientos, categorias, formasPago };
}

export async function getMovimientos(): Promise<MovimientoRow[]> {
  const session = await getSession();
  if (!session) return [];

  const movimientos = await getMovimientosByUsuario(session.userId);
  return movimientos.map((m) => ({
    ...m,
    fecha: m.fecha.toISOString().split("T")[0],
    monto: Number(m.monto),
  }));
}

export async function getCategoriasOptions(): Promise<CategoriaOption[]> {
  const session = await getSession();
  if (!session) return [];

  return getCategoriasActivasByUsuario(session.userId);
}

export async function getFormasPagoOptions(): Promise<FormaPagoOption[]> {
  const session = await getSession();
  if (!session) return [];

  return getFormasPagoActivasByUsuario(session.userId);
}

export async function createMovimiento(
  _prev: MovimientoState,
  data: MovimientoInput
): Promise<MovimientoState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  // Verify user has at least one active categoria
  const categorias = await getCategoriasActivasByUsuario(session.userId);
  if (categorias.length === 0) {
    return {
      message:
        "Debe tener al menos una categoría activa para crear un movimiento. Vaya a Categorías y cree una.",
    };
  }

  const parsed = movimientoSchema.safeParse(data);
  if (!parsed.success) {
    return { message: "Datos inválidos." };
  }

  const relaciones = await resolveRelaciones(session.userId, parsed.data);
  if ("message" in relaciones) {
    return { message: relaciones.message };
  }

  try {
    await createMovimientoService({
      id_usuario: session.userId,
      id_categoria: relaciones.id_categoria,
      id_forma_pago: relaciones.id_forma_pago,
      fecha: new Date(parsed.data.fecha),
      descripcion: parsed.data.descripcion,
      monto: parsed.data.monto,
      tipo: parsed.data.tipo,
      notas: parsed.data.notas || null,
    });

    revalidatePath("/movimientos");
    return { success: `Movimiento "${parsed.data.descripcion}" creado correctamente.` };
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : "Error al crear el movimiento.";
    return { message };
  }
}

export async function updateMovimiento(
  _prev: MovimientoState,
  { id, ...formData }: { id: string } & MovimientoInput
): Promise<MovimientoState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  const parsed = movimientoSchema.safeParse(formData);
  if (!parsed.success) {
    return { message: "Datos inválidos." };
  }

  const relaciones = await resolveRelaciones(session.userId, parsed.data);
  if ("message" in relaciones) {
    return { message: relaciones.message };
  }

  try {
    await updateMovimientoService(id, session.userId, {
      id_categoria: relaciones.id_categoria,
      id_forma_pago: relaciones.id_forma_pago,
      fecha: new Date(parsed.data.fecha),
      descripcion: parsed.data.descripcion,
      monto: parsed.data.monto,
      tipo: parsed.data.tipo,
      notas: parsed.data.notas || null,
    });

    revalidatePath("/movimientos");
    return { success: `Movimiento "${parsed.data.descripcion}" actualizado correctamente.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar el movimiento.";
    return { message };
  }
}

export async function deleteMovimientoAction(id: string): Promise<MovimientoState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  try {
    await deleteMovimientoService(id, session.userId);
    revalidatePath("/movimientos");
    return { success: "Movimiento eliminado correctamente." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al eliminar el movimiento.";
    return { message };
  }
}