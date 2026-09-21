"use server";

import { redirect } from "next/navigation";
import { authenticateUser } from "@/services/auth";
import { createSession } from "@/lib/auth";

export interface LoginState {
  message?: string;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<LoginState> {
  try {
    const user = await authenticateUser(data.email, data.password);
    await createSession(user.id_usuario);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al iniciar sesión.";
    return { message };
  }

  redirect("/dashboard");
}
