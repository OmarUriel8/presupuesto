"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import {
  getFormasPagoByUsuario,
  createFormaPago as createFormaPagoService,
  updateFormaPago as updateFormaPagoService,
  deleteFormaPago as deleteFormaPagoService,
} from "@/services/forma_pago";
import { forma_pagoSchema } from "@/schemas/forma_pago";
import type { FormaPagoInput } from "@/schemas/forma_pago";

export interface FormaPagoState {
  message?: string;
  success?: string;
}

export async function getFormasPago(): Promise<
  {
    id_forma_pago: string;
    nombre: string;
    tipo: string;
    activa: boolean;
    fecha_creacion: string;
  }[]
> {
  const session = await getSession();
  if (!session) return [];

  const formasPago = await getFormasPagoByUsuario(session.userId);
  return formasPago.map((fp) => ({
    ...fp,
    fecha_creacion: fp.fecha_creacion.toISOString(),
  }));
}

export async function createFormaPago(
  _prev: FormaPagoState,
  data: FormaPagoInput
): Promise<FormaPagoState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  const parsed = forma_pagoSchema.safeParse(data);
  if (!parsed.success) {
    return { message: "Datos inválidos." };
  }

  try {
    await createFormaPagoService({
      id_usuario: session.userId,
      nombre: parsed.data.nombre,
      tipo: parsed.data.tipo,
      activa: parsed.data.activa,
    });

    revalidatePath("/formas-pago");
    return { success: `Forma de pago "${parsed.data.nombre}" creada correctamente.` };
  } catch (error) {
    console.log(error);
    const message =
      error instanceof Error ? error.message : "Error al crear la forma de pago.";

    if (message.includes("Unique constraint")) {
      return { message: "Ya existe una forma de pago con ese nombre." };
    }

    return { message };
  }
}

export async function updateFormaPago(
  _prev: FormaPagoState,
  { id, ...formData }: { id: string } & FormaPagoInput
): Promise<FormaPagoState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  const parsed = forma_pagoSchema.safeParse(formData);
  if (!parsed.success) {
    return { message: "Datos inválidos." };
  }

  try {
    await updateFormaPagoService(id, session.userId, {
      nombre: parsed.data.nombre,
      tipo: parsed.data.tipo,
      activa: parsed.data.activa,
    });

    revalidatePath("/formas-pago");
    return { success: `Forma de pago "${parsed.data.nombre}" actualizada correctamente.` };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar la forma de pago.";

    if (message.includes("Unique constraint")) {
      return { message: "Ya existe una forma de pago con ese nombre." };
    }

    return { message };
  }
}

export async function deleteFormaPagoAction(id: string): Promise<FormaPagoState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  try {
    await deleteFormaPagoService(id, session.userId);
    revalidatePath("/formas-pago");
    return { success: "Forma de pago eliminada correctamente." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al eliminar la forma de pago.";
    return { message };
  }
}
