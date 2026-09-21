"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import {
  getCategoriasByUsuario,
  createCategoria as createCategoriaService,
  updateCategoria as updateCategoriaService,
  deleteCategoria as deleteCategoriaService,
} from "@/services/categoria";
import { categoriaSchema } from "@/schemas/categoria";
import type { CategoriaInput } from "@/schemas/categoria";

export interface CategoriaState {
  message?: string;
  success?: string;
}

export async function getCategorias(): Promise<
  {
    id_categoria: string;
    nombre: string;
    tipo: string;
    color: string | null;
    icono: string | null;
    activa: boolean;
    fecha_creacion: string;
  }[]
> {
  const session = await getSession();
  if (!session) return [];

  const categorias = await getCategoriasByUsuario(session.userId);
  return categorias.map((c) => ({
    ...c,
    fecha_creacion: c.fecha_creacion.toISOString(),
  }));
}

export async function createCategoria(
  _prev: CategoriaState,
  data: CategoriaInput
): Promise<CategoriaState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  const parsed = categoriaSchema.safeParse(data);
  if (!parsed.success) {
    return { message: "Datos inválidos." };
  }

  try {
    await createCategoriaService({
      id_usuario: session.userId,
      nombre: parsed.data.nombre,
      tipo: parsed.data.tipo,
      color: parsed.data.color || null,
      icono: parsed.data.icono || null,
      activa: parsed.data.activa,
    });

    revalidatePath("/categorias");
    return { success: `Categoría "${parsed.data.nombre}" creada correctamente.` };
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : "Error al crear la categoría.";

    if (message.includes("Unique constraint")) {
      return { message: "Ya existe una categoría con ese nombre." };
    }

    return { message };
  }
}

export async function updateCategoria(
  _prev: CategoriaState,
  { id, ...formData }: { id: string } & CategoriaInput
): Promise<CategoriaState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  const parsed = categoriaSchema.safeParse(formData);
  if (!parsed.success) {
    return { message: "Datos inválidos." };
  }

  try {
    await updateCategoriaService(id, session.userId, {
      nombre: parsed.data.nombre,
      tipo: parsed.data.tipo,
      color: parsed.data.color || null,
      icono: parsed.data.icono || null,
      activa: parsed.data.activa,
    });

    revalidatePath("/categorias");
    return { success: `Categoría "${parsed.data.nombre}" actualizada correctamente.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar la categoría.";

    if (message.includes("Unique constraint")) {
      return { message: "Ya existe una categoría con ese nombre." };
    }

    return { message };
  }
}

export async function deleteCategoriaAction(id: string): Promise<CategoriaState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  try {
    await deleteCategoriaService(id, session.userId);
    revalidatePath("/categorias");
    return { success: "Categoría eliminada correctamente." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al eliminar la categoría.";
    return { message };
  }
}
