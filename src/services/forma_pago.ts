import "server-only";

import { prisma } from "@/lib/prisma";

export interface FormaPago {
  id_forma_pago: string;
  id_usuario: string;
  nombre: string;
  tipo: string;
  activa: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export async function getFormasPagoByUsuario(
  id_usuario: string
): Promise<FormaPago[]> {
  return prisma.forma_pago.findMany({
    where: { id_usuario },
    orderBy: [{ nombre: "asc" }],
  });
}

export async function getFormaPagoById(
  id_forma_pago: string,
  id_usuario: string
): Promise<FormaPago | null> {
  return prisma.forma_pago.findFirst({
    where: { id_forma_pago, id_usuario },
  });
}

export async function createFormaPago(
  data: Omit<FormaPago, "id_forma_pago" | "fecha_creacion" | "fecha_actualizacion">
): Promise<FormaPago> {
  return prisma.forma_pago.create({
    data: {
      id_usuario: data.id_usuario,
      nombre: data.nombre,
      tipo: data.tipo,
      activa: data.activa,
    },
  });
}

export async function updateFormaPago(
  id_forma_pago: string,
  id_usuario: string,
  data: Partial<Pick<FormaPago, "nombre" | "tipo" | "activa">>
): Promise<FormaPago> {
  return prisma.forma_pago.update({
    where: {
      id_forma_pago,
      id_usuario,
    },
    data: {
      ...data,
      fecha_actualizacion: new Date(),
    },
  });
}

export async function deleteFormaPago(
  id_forma_pago: string,
  id_usuario: string
): Promise<void> {
  await prisma.forma_pago.delete({
    where: {
      id_forma_pago,
      id_usuario,
    },
  });
}
