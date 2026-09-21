import "server-only";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { Categoria } from "./categoria";
import type { FormaPago } from "./forma_pago";

export interface Movimiento {
  id_movimiento: string;
  id_usuario: string;
  id_categoria: string;
  id_forma_pago: string | null;
  fecha: Date;
  descripcion: string;
  /** Decimal de Prisma (Decimal(14,2)). Convertir con Number(m.monto) al serializar. */
  monto: Prisma.Decimal;
  tipo: string;
  notas: string | null;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  categoria?: Categoria;
  forma_pago?: FormaPago | null;
}

export interface MovimientoWithRelations extends Movimiento {
  categoria: Categoria;
  forma_pago: FormaPago | null;
}

export async function getMovimientosByUsuario(
  id_usuario: string
): Promise<MovimientoWithRelations[]> {
  return prisma.movimiento.findMany({
    where: { id_usuario },
    include: {
      categoria: true,
      forma_pago: true,
    },
    orderBy: [{ fecha: "desc" }, { fecha_creacion: "desc" }],
  });
}

export async function getMovimientoById(
  id_movimiento: string,
  id_usuario: string
): Promise<MovimientoWithRelations | null> {
  return prisma.movimiento.findFirst({
    where: { id_movimiento, id_usuario },
    include: {
      categoria: true,
      forma_pago: true,
    },
  });
}

export async function createMovimiento(data: {
  id_usuario: string;
  id_categoria: string;
  id_forma_pago: string | null;
  fecha: Date;
  descripcion: string;
  monto: number | Prisma.Decimal;
  tipo: string;
  notas: string | null;
}): Promise<MovimientoWithRelations> {
  return prisma.movimiento.create({
    data: {
      id_usuario: data.id_usuario,
      id_categoria: data.id_categoria,
      id_forma_pago: data.id_forma_pago,
      fecha: data.fecha,
      descripcion: data.descripcion,
      monto: data.monto,
      tipo: data.tipo,
      notas: data.notas,
    },
    include: {
      categoria: true,
      forma_pago: true,
    },
  });
}

export async function updateMovimiento(
  id_movimiento: string,
  id_usuario: string,
  data: Partial<{
    id_categoria: string;
    id_forma_pago: string | null;
    fecha: Date;
    descripcion: string;
    monto: number | Prisma.Decimal;
    tipo: string;
    notas: string | null;
  }>
): Promise<MovimientoWithRelations> {
  return prisma.movimiento.update({
    where: {
      id_movimiento,
      id_usuario,
    },
    data: {
      ...data,
      fecha_actualizacion: new Date(),
    },
    include: {
      categoria: true,
      forma_pago: true,
    },
  });
}

export async function deleteMovimiento(
  id_movimiento: string,
  id_usuario: string
): Promise<void> {
  await prisma.movimiento.delete({
    where: {
      id_movimiento,
      id_usuario,
    },
  });
}

// Helper functions to get active categorias and formas de pago for selects
export async function getCategoriasActivasByUsuario(id_usuario: string) {
  return prisma.categoria.findMany({
    where: { id_usuario, activa: true },
    select: {
      id_categoria: true,
      nombre: true,
      tipo: true,
      color: true,
    },
    orderBy: [{ tipo: "asc" }, { nombre: "asc" }],
  });
}

export async function getFormasPagoActivasByUsuario(id_usuario: string) {
  return prisma.forma_pago.findMany({
    where: { id_usuario, activa: true },
    select: {
      id_forma_pago: true,
      nombre: true,
      tipo: true,
    },
    orderBy: [{ nombre: "asc" }],
  });
}