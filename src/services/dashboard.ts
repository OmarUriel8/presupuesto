import "server-only";

import { prisma } from "@/lib/prisma";
import { formatMonthYear } from "@/lib/format";
import type {
  CategoriaGasto,
  DashboardMonthData,
  MovimientoDia,
  MovimientoResumen,
  TipoMovimiento,
} from "@/types";

/**
 * Resumen del dashboard para un mes calendario (1-12) del año indicado.
 * Consulta los movimientos del usuario en el rango [mes, mes+1) y calcula
 * ingresos, gastos, balance, los registros del mes y los totales por día
 * (estos últimos alimentan la gráfica de ingresos vs gastos).
 */
export async function getDashboardByMonth(
  id_usuario: string,
  anio: number,
  mes: number
): Promise<DashboardMonthData> {
  // Las fechas se almacenan como DATE y se serializan con toISOString(),
  // por lo que los límites del rango también se construyen en UTC.
  const desde = new Date(Date.UTC(anio, mes - 1, 1));
  const hasta = new Date(Date.UTC(anio, mes, 1)); // exclusivo

  const movimientos = await prisma.movimiento.findMany({
    where: { id_usuario, fecha: { gte: desde, lt: hasta } },
    include: { categoria: true },
    orderBy: [{ fecha: "desc" }, { fecha_creacion: "desc" }],
  });

  let ingresosMes = 0;
  let gastosMes = 0;
  const porDia = new Map<string, MovimientoDia>();
  const gastosPorCategoria = new Map<string, CategoriaGasto>();

  const filas: MovimientoResumen[] = movimientos.map((m) => {
    const monto = Number(m.monto);
    const esIngreso = m.tipo === "INGRESO";

    if (esIngreso) {
      ingresosMes += monto;
    } else {
      gastosMes += monto;

      const acumulado =
        gastosPorCategoria.get(m.id_categoria) ??
        {
          id: m.id_categoria,
          nombre: m.categoria.nombre,
          color: m.categoria.color,
          monto: 0,
        };
      acumulado.monto += monto;
      gastosPorCategoria.set(m.id_categoria, acumulado);
    }

    const fecha = m.fecha.toISOString().split("T")[0];
    const dia = fecha.slice(8, 10);

    const acumulado = porDia.get(dia) ?? { dia, ingresos: 0, gastos: 0 };
    if (esIngreso) {
      acumulado.ingresos += monto;
    } else {
      acumulado.gastos += monto;
    }
    porDia.set(dia, acumulado);

    return {
      id: m.id_movimiento,
      descripcion: m.descripcion,
      categoria: m.categoria.nombre,
      fecha,
      monto,
      tipo: m.tipo as TipoMovimiento,
    };
  });

  return {
    resumen: {
      ingresosMes: round2(ingresosMes),
      gastosMes: round2(gastosMes),
      balance: round2(ingresosMes - gastosMes),
      registros: filas.length,
      mes: formatMonthYear(anio, mes),
    },
    movimientos: filas,
    chartData: [...porDia.values()].sort((a, b) => a.dia.localeCompare(b.dia)),
    // Para la gráfica de pastel: gastos por categoría, del mayor al menor.
    categorias: [...gastosPorCategoria.values()]
      .map((c) => ({ ...c, monto: round2(c.monto) }))
      .sort((a, b) => b.monto - a.monto),
  };
}

/** Evita errores de punto flotante en los totales (Decimal(14,2)). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
