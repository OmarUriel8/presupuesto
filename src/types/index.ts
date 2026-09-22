export type TipoMovimiento = "INGRESO" | "GASTO";

export interface DashboardSummary {
  ingresosMes: number;
  gastosMes: number;
  balance: number;
  /** Total de movimientos del mes. */
  registros: number;
  /** Nombre legible del mes, ej. "Septiembre 2026". */
  mes: string;
}

/** Movimiento serializado para mostrar en el dashboard. */
export interface MovimientoResumen {
  id: string;
  descripcion: string;
  categoria: string;
  /** Fecha en formato AAAA-MM-DD. */
  fecha: string;
  monto: number;
  tipo: TipoMovimiento;
}

/** Totales de ingresos/gastos de un día del mes (datos de la gráfica). */
export interface MovimientoDia {
  /** Día del mes con dos dígitos, ej. "05". */
  dia: string;
  ingresos: number;
  gastos: number;
}

/** Total de gastos de una categoría en el mes (alimenta la gráfica de pastel). */
export interface CategoriaGasto {
  id: string;
  nombre: string;
  /** Color hex elegido en la categoría, o null si no tiene. */
  color: string | null;
  monto: number;
}

/** Resultado de la consulta del dashboard para un mes dado. */
export interface DashboardMonthData {
  resumen: DashboardSummary;
  movimientos: MovimientoResumen[];
  chartData: MovimientoDia[];
  categorias: CategoriaGasto[];
}
