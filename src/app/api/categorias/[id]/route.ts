import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth";
import {
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
} from "@/services/categoria";
import { categoriaSchema } from "@/schemas/categoria";

function getAuthenticatedUserId(request: NextRequest): string | null {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  const session = verifyToken(token);
  return session?.userId ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: "No autenticado." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const categoria = await getCategoriaById(id, userId);
    if (!categoria) {
      return NextResponse.json(
        { error: "Categoría no encontrada." },
        { status: 404 }
      );
    }
    return NextResponse.json(categoria);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener la categoría." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: "No autenticado." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const existing = await getCategoriaById(id, userId);
    if (!existing) {
      return NextResponse.json(
        { error: "Categoría no encontrada." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = categoriaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { nombre, tipo, color, icono, activa } = parsed.data;

    const updated = await updateCategoria(id, userId, {
      nombre,
      tipo,
      color: color || null,
      icono: icono || null,
      activa,
    });

    return NextResponse.json(updated);
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
      { error: "Error al actualizar la categoría." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: "No autenticado." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const existing = await getCategoriaById(id, userId);
    if (!existing) {
      return NextResponse.json(
        { error: "Categoría no encontrada." },
        { status: 404 }
      );
    }

    await deleteCategoria(id, userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar la categoría." },
      { status: 500 }
    );
  }
}
