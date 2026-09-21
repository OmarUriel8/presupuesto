import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth";
import {
  getCategoriasByUsuario,
  createCategoria,
} from "@/services/categoria";
import { categoriaSchema } from "@/schemas/categoria";

function getAuthenticatedUserId(request: NextRequest): string | null {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  const session = verifyToken(token);
  return session?.userId ?? null;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: "No autenticado." },
      { status: 401 }
    );
  }

  try {
    const categorias = await getCategoriasByUsuario(userId);
    return NextResponse.json(categorias);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las categorías." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: "No autenticado." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = categoriaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { nombre, tipo, color, icono, activa } = parsed.data;

    const categoria = await createCategoria({
      id_usuario: userId,
      nombre,
      tipo,
      color: color || null,
      icono: icono || null,
      activa,
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Ya existe una categoría con ese nombre." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear la categoría." },
      { status: 500 }
    );
  }
}
