"use server";

import { getSession } from "@/lib/auth";
import { formatMonthYear } from "@/lib/format";
import { getDashboardByMonth } from "@/services/dashboard";
import type { DashboardMonthData } from "@/types";

export interface DashboardData extends DashboardMonthData {
  /** Día elegido en el filtro (AAAA-MM-DD) del que se derivaron año y mes. */
  fecha: string;
  anio: number;
  /** Mes derivado de la fecha elegido, en rango 1-12. */
  mes: number;
}

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function fechaHoy(): string {
  const hoy = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${hoy.getFullYear()}-${pad(hoy.getMonth() + 1)}-${pad(hoy.getDate())}`;
}

function esFechaValida(valor: string): boolean {
  if (!FECHA_REGEX.test(valor)) return false;
  const [anio, mes, dia] = valor.split("-").map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

/**
 * Carga el resumen del dashboard para el mes del día indicado.
 * Recibe un día (AAAA-MM-DD) porque el filtro elige un día y de ahí se
 * derivan el año y el mes a consultar. Si la fecha no es válida usa hoy.
 * Se usa desde el server component (datos iniciales) y como refetch en el cliente.
 */
export async function getDashboardData(fecha?: string): Promise<DashboardData> {
  const valor = fecha && esFechaValida(fecha) ? fecha : fechaHoy();
  const anio = Number(valor.slice(0, 4));
  const mes = Number(valor.slice(5, 7));

  const session = await getSession();
  if (!session) {
    return {
      fecha: valor,
      anio,
      mes,
      resumen: {
        ingresosMes: 0,
        gastosMes: 0,
        balance: 0,
        registros: 0,
        mes: formatMonthYear(anio, mes),
      },
      movimientos: [],
      chartData: [],
      categorias: [],
    };
  }

  const data = await getDashboardByMonth(session.userId, anio, mes);
  return { fecha: valor, anio, mes, ...data };
}
