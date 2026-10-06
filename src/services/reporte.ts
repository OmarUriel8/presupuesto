import "server-only";

import { prisma } from "@/lib/prisma";
import { formatMonthYear } from "@/lib/format";
import type {
  EvolucionMes,
  PromedioDiarioGasto,
  ReporteFinanciero,
  VariacionCategoriaGasto,
} from "@/types";

/** Rangos permitidos para la evolución del balance (en meses). */
export type RangoMesesReporte = 3 | 6 | 12;

function normalizarRango(meses: number): RangoMesesReporte {
  if (meses === 3 || meses === 12) return meses;
  return 6;
}

/** Evita errores de punto flotante en los totales (Decimal(14,2)). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

interface MovimientoClasificado {
  anio: number;
  mes: number;
  monto: number;
  tipo: string;
  id_categoria: string;
  nombre: string;
  color: string | null;
}

/**
 * Reporte financiero del usuario en una sola consulta: evolución mensual de
 * ingresos vs gastos del rango, promedio diario de gasto (mes actual vs meses
 * previos) y variación por categoría (mes actual vs anterior).
 * Todos los importes se devuelven como number (redondeados a 2 decimales).
 */
export async function getReporteFinanciero(
  id_usuario: string,
  meses = 6
): Promise<ReporteFinanciero> {
  const rango = normalizarRango(meses);
  const ahora = new Date();
  const anioHoy = ahora.getUTCFullYear();
  const mesHoy = ahora.getUTCMonth() + 1;
  const diaHoy = ahora.getUTCDate();

  // Meses del rango, del más antiguo al actual.
  const indiceActual = anioHoy * 12 + (mesHoy - 1);
  const claves = Array.from({ length: rango }, (_, i) => {
    const indice = indiceActual - (rango - 1) + i;
    return { anio: Math.floor(indice / 12), mes: (indice % 12) + 1 };
  });

  // Las fechas se almacenan como DATE: límites del rango en UTC,
  // igual que en el servicio del dashboard.
  const primera = claves[0];
  const desde = new Date(Date.UTC(primera.anio, primera.mes - 1, 1));
  const hasta = new Date(Date.UTC(anioHoy, mesHoy, 1)); // exclusivo

  const movimientos = await prisma.movimiento.findMany({
    where: { id_usuario, fecha: { gte: desde, lt: hasta } },
    select: {
      fecha: true,
      monto: true,
      tipo: true,
      id_categoria: true,
      categoria: { select: { nombre: true, color: true } },
    },
  });

  const clasificados: MovimientoClasificado[] = movimientos.map((m) => ({
    anio: m.fecha.getUTCFullYear(),
    mes: m.fecha.getUTCMonth() + 1,
    monto: Number(m.monto),
    tipo: m.tipo,
    id_categoria: m.id_categoria,
    nombre: m.categoria.nombre,
    color: m.categoria.color,
  }));

  const ingresosPorMes = new Map<string, number>();
  const gastosPorMes = new Map<string, number>();
  for (const m of clasificados) {
    const clave = `${m.anio}-${String(m.mes).padStart(2, "0")}`;
    const destino = m.tipo === "INGRESO" ? ingresosPorMes : gastosPorMes;
    destino.set(clave, round2((destino.get(clave) ?? 0) + m.monto));
  }

  const evolucion: EvolucionMes[] = claves.map(({ anio, mes }) => {
    const clave = `${anio}-${String(mes).padStart(2, "0")}`;
    const ingresos = ingresosPorMes.get(clave) ?? 0;
    const gastos = gastosPorMes.get(clave) ?? 0;
    return {
      anio,
      mes,
      etiqueta: formatMonthYear(anio, mes),
      ingresos,
      gastos,
      balance: round2(ingresos - gastos),
    };
  });

  return {
    rango,
    evolucion,
    promedioDiario: calcularPromedioDiario(evolucion, claves, diaHoy),
    variacionCategorias: calcularVariacionCategorias(
      clasificados,
      claves[rango - 1],
      claves[rango - 2]
    ),
  };
}

/**
 * Ritmo de gasto diario: lo gastado en el mes actual entre los días
 * transcurridos, frente al gasto diario medio de los meses previos
 * completos (total de gastos previos entre total de días de esos meses).
 */
function calcularPromedioDiario(
  evolucion: EvolucionMes[],
  claves: { anio: number; mes: number }[],
  diaHoy: number
): PromedioDiarioGasto {
  const actual = evolucion[evolucion.length - 1];
  const diasTranscurridos = Math.max(diaHoy, 1);
  const promedioActual = round2(actual.gastos / diasTranscurridos);

  let gastosPrevios = 0;
  let diasPrevios = 0;
  for (let i = 0; i < evolucion.length - 1; i++) {
    const { anio, mes } = claves[i];
    gastosPrevios += evolucion[i].gastos;
    diasPrevios += new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  }
  const promedioPrevio = diasPrevios > 0 ? round2(gastosPrevios / diasPrevios) : 0;
  const diferencia = round2(promedioActual - promedioPrevio);

  return {
    etiquetaMesActual: actual.etiqueta,
    diasTranscurridos,
    promedioActual,
    promedioPrevio,
    diferencia,
    diferenciaPorcentaje: promedioPrevio > 0 ? round2((diferencia / promedioPrevio) * 100) : null,
  };
}

/** Compara el gasto por categoría entre el mes actual y el anterior. */
function calcularVariacionCategorias(
  movimientos: MovimientoClasificado[],
  mesActual: { anio: number; mes: number },
  mesAnterior: { anio: number; mes: number }
): VariacionCategoriaGasto[] {
  const porCategoria = new Map<
    string,
    { nombre: string; color: string | null; actual: number; anterior: number }
  >();

  for (const m of movimientos) {
    if (m.tipo !== "GASTO") continue;
    const esActual = m.anio === mesActual.anio && m.mes === mesActual.mes;
    const esAnterior = m.anio === mesAnterior.anio && m.mes === mesAnterior.mes;
    if (!esActual && !esAnterior) continue;

    const acumulado = porCategoria.get(m.id_categoria) ?? {
      nombre: m.nombre,
      color: m.color,
      actual: 0,
      anterior: 0,
    };
    if (esActual) {
      acumulado.actual = round2(acumulado.actual + m.monto);
    } else {
      acumulado.anterior = round2(acumulado.anterior + m.monto);
    }
    porCategoria.set(m.id_categoria, acumulado);
  }

  return [...porCategoria.entries()]
    .map(([id, v]) => {
      const diferencia = round2(v.actual - v.anterior);
      return {
        id,
        nombre: v.nombre,
        color: v.color,
        actual: v.actual,
        anterior: v.anterior,
        diferencia,
        porcentaje: v.anterior > 0 ? round2((diferencia / v.anterior) * 100) : null,
      };
    })
    .sort((a, b) => b.actual - a.actual);
}
