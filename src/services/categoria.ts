import "server-only";

import { prisma } from "@/lib/prisma";

export interface Categoria {
  id_categoria: string;
  id_usuario: string;
  nombre: string;
  tipo: string;
  color: string | null;
  icono: string | null;
  activa: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export async function getCategoriasByUsuario(
  id_usuario: string
): Promise<Categoria[]> {
  return prisma.categoria.findMany({
    where: { id_usuario },
    orderBy: [{ tipo: "asc" }, { nombre: "asc" }],
  });
}

export async function getCategoriaById(
  id_categoria: string,
  id_usuario: string
): Promise<Categoria | null> {
  return prisma.categoria.findFirst({
    where: { id_categoria, id_usuario },
  });
}

export async function createCategoria(
  data: Omit<Categoria, "id_categoria" | "fecha_creacion" | "fecha_actualizacion">
): Promise<Categoria> {
  return prisma.categoria.create({
    data: {
      id_usuario: data.id_usuario,
      nombre: data.nombre,
      tipo: data.tipo,
      color: data.color || null,
      icono: data.icono || null,
      activa: data.activa,
    },
  });
}

export async function updateCategoria(
  id_categoria: string,
  id_usuario: string,
  data: Partial<
    Pick<Categoria, "nombre" | "tipo" | "color" | "icono" | "activa">
  >
): Promise<Categoria> {
  return prisma.categoria.update({
    where: {
      id_categoria,
      id_usuario,
    },
    data: {
      ...data,
      fecha_actualizacion: new Date(),
    },
  });
}

export async function deleteCategoria(
  id_categoria: string,
  id_usuario: string
): Promise<void> {
  await prisma.categoria.delete({
    where: {
      id_categoria,
      id_usuario,
    },
  });
}
