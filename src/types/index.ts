export type TipoMovimiento = "ingreso" | "gasto";

export interface DashboardSummary {
  ingresosMes: number;
  gastosMes: number;
  balance: number;
  presupuestoDisponible: number;
  mes: string;
}

export interface MovimientoMock {
  id: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  monto: number;
  tipo: TipoMovimiento;
}
