"use server";

import { getSession } from "@/lib/auth";
import { getUserById, updateUserProfile, changePassword } from "@/services/auth";

export interface ProfileState {
  message?: string;
  success?: string;
}

export async function updateProfile(data: {
  nombre: string;
  email: string;
}): Promise<ProfileState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  try {
    await updateUserProfile(session.userId, data);
    return { success: "Perfil actualizado correctamente." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar el perfil.";
    return { message };
  }
}

export interface PasswordState {
  message?: string;
  success?: string;
}

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<PasswordState> {
  const session = await getSession();
  if (!session) {
    return { message: "No hay sesión activa." };
  }

  try {
    await changePassword(session.userId, data.currentPassword, data.newPassword);
    return { success: "Contraseña cambiada correctamente." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al cambiar la contraseña.";
    return { message };
  }
}

export async function getProfileData(): Promise<{
  nombre: string;
  email: string;
} | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await getUserById(session.userId);
  if (!user) return null;

  return { nombre: user.nombre, email: user.email };
}
