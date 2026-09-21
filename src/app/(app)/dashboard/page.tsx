import { PiggyBank, Scale, TrendingDown, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { ChartPlaceholder } from "@/components/dashboard/chart-placeholder";
import { RecentMovements } from "@/components/dashboard/recent-movements";
import { StatCard } from "@/components/dashboard/stat-card";
import type { DashboardSummary, MovimientoMock } from "@/types";

// Solo datos mock para demostrar el diseño. No se leen ni escriben en la BD.
const summaryMock: DashboardSummary = {
  ingresosMes: 45280,
  gastosMes: 28740.5,
  balance: 16539.5,
  presupuestoDisponible: 9260,
  mes: "Septiembre 2026",
};

const movimientosMock: MovimientoMock[] = [
  {
    id: "1",
    descripcion: "Nómina quincenal",
    categoria: "Salario",
    fecha: "15 sep 2026",
    monto: 22000,
    tipo: "ingreso",
  },
  {
    id: "2",
    descripcion: "Supermercado",
    categoria: "Alimentación",
    fecha: "14 sep 2026",
    monto: 2340.5,
    tipo: "gasto",
  },
  {
    id: "3",
    descripcion: "Renta mensual",
    categoria: "Vivienda",
    fecha: "10 sep 2026",
    monto: 12000,
    tipo: "gasto",
  },
  {
    id: "4",
    descripcion: "Freelance diseño",
    categoria: "Extra",
    fecha: "08 sep 2026",
    monto: 5280,
    tipo: "ingreso",
  },
  {
    id: "5",
    descripcion: "Transporte",
    categoria: "Movilidad",
    fecha: "05 sep 2026",
    monto: 840,
    tipo: "gasto",
  },
];

export default function DashboardPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Dashboard · ${summaryMock.mes}`}
        description="Resumen mensual con datos de ejemplo. La conexión a Prisma ya está lista para el siguiente módulo."
      />

      <section aria-label="Resumen del mes" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos del mes"
          value={summaryMock.ingresosMes}
          description="Total de ingresos registrados"
          icon={TrendingUp}
          tone="income"
        />
        <StatCard
          title="Gastos del mes"
          value={summaryMock.gastosMes}
          description="Total de gastos registrados"
          icon={TrendingDown}
          tone="expense"
        />
        <StatCard
          title="Balance"
          value={summaryMock.balance}
          description="Ingresos menos gastos"
          icon={Scale}
          tone="neutral"
        />
        <StatCard
          title="Presupuesto disponible"
          value={summaryMock.presupuestoDisponible}
          description="Por ejecutar en el mes"
          icon={PiggyBank}
          tone="budget"
        />
      </section>

      <section aria-label="Detalle" className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentMovements movements={movimientosMock} />
        </div>
        <div className="grid gap-4 xl:col-span-2">
          <ChartPlaceholder
            title="Ingresos vs gastos"
            description="Estructura lista para agregar gráficas."
          />
          <ChartPlaceholder
            title="Presupuesto por categoría"
            description="Espacio reservado para el siguiente módulo."
          />
        </div>
      </section>
    </div>
  );
}
