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

/** Ingresos vs gastos de un mes dentro del rango de un reporte. */
export interface EvolucionMes {
  anio: number;
  /** Mes en rango 1-12. */
  mes: number;
  /** Etiqueta legible, ej. "Septiembre 2026". */
  etiqueta: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

/** Comparativa del ritmo de gasto diario del mes actual vs meses previos. */
export interface PromedioDiarioGasto {
  etiquetaMesActual: string;
  /** Días transcurridos del mes actual (base del promedio). */
  diasTranscurridos: number;
  /** Gasto diario del mes actual. */
  promedioActual: number;
  /** Gasto diario medio de los meses previos completos. */
  promedioPrevio: number;
  /** promedioActual menos promedioPrevio (positivo = gastas más por día). */
  diferencia: number;
  /** Variación porcentual vs meses previos; null sin base de comparación. */
  diferenciaPorcentaje: number | null;
}

/** Gasto de una categoría este mes frente al mes anterior. */
export interface VariacionCategoriaGasto {
  id: string;
  nombre: string;
  color: string | null;
  /** Gasto del mes actual. */
  actual: number;
  /** Gasto del mes anterior. */
  anterior: number;
  /** actual menos anterior. */
  diferencia: number;
  /** Variación porcentual; null si la categoría no tenía gasto previo. */
  porcentaje: number | null;
}

/** Resultado del reporte financiero para un rango de meses. */
export interface ReporteFinanciero {
  /** Rango solicitado (3, 6 o 12). */
  rango: number;
  /** Ingresos vs gastos mes a mes, del más antiguo al actual. */
  evolucion: EvolucionMes[];
  promedioDiario: PromedioDiarioGasto;
  /** Variación por categoría (mes actual vs anterior), de mayor a menor gasto actual. */
  variacionCategorias: VariacionCategoriaGasto[];
}
