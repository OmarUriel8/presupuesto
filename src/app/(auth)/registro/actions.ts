"use server";

import { redirect } from "next/navigation";
import { registerUser } from "@/services/auth";
import { createSession } from "@/lib/auth";

export interface RegisterState {
  message?: string;
}

export async function register(data: {
  nombre: string;
  email: string;
  password: string;
}): Promise<RegisterState> {
  try {
    const user = await registerUser(data);
    await createSession(user.id_usuario);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear la cuenta.";
    return { message };
  }

  redirect("/dashboard");
}
