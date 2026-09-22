"use client";

import * as React from "react";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import {
  getDashboardData,
  type DashboardData,
} from "@/app/(app)/dashboard/actions";
import { PageHeader } from "@/components/common/page-header";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { DateFilter } from "@/components/dashboard/date-filter";
import { MonthChart } from "@/components/dashboard/month-chart";
import { RecentMovements } from "@/components/dashboard/recent-movements";
import { StatCard } from "@/components/dashboard/stat-card";

interface DashboardViewProps {
  initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps): React.JSX.Element {
  // Los datos iniciales los resuelve el server component; aquí solo se
  // refrescan desde el cambio del filtro (nada de fetching en effects).
  const [data, setData] = React.useState<DashboardData>(initialData);
  const [isPending, startTransition] = React.useTransition();

  function handleFechaChange(fecha: string): void {
    // El input date vacío (borrado) no dispara una consulta.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return;

    startTransition(async () => {
      try {
        setData(await getDashboardData(fecha));
      } catch (err) {
        toast.error("Error", {
          description:
            err instanceof Error ? err.message : "No se pudo cargar el resumen del mes.",
        });
      }
    });
  }

  const { resumen } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Dashboard · ${resumen.mes}`}
        description={`${resumen.registros} movimiento${
          resumen.registros === 1 ? "" : "s"
        } registrado${resumen.registros === 1 ? "" : "s"} en el mes.`}
        action={
          <DateFilter
            value={data.fecha}
            mes={resumen.mes}
            disabled={isPending}
            onChange={handleFechaChange}
          />
        }
      />

      <section
        aria-label="Resumen del mes"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <StatCard
          title="Ingresos del mes"
          value={resumen.ingresosMes}
          description="Total de ingresos registrados"
          icon={TrendingUp}
          tone="income"
        />
        <StatCard
          title="Gastos del mes"
          value={resumen.gastosMes}
          description="Total de gastos registrados"
          icon={TrendingDown}
          tone="expense"
        />
        <StatCard
          title="Balance"
          value={resumen.balance}
          description="Ingresos menos gastos"
          icon={Scale}
          tone={resumen.balance < 0 ? "expense" : "neutral"}
        />
      </section>

      <section aria-label="Detalle" className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentMovements movements={data.movimientos} />
        </div>
        <div className="xl:col-span-2">
          <MonthChart data={data.chartData} mes={resumen.mes} />
        </div>
      </section>

      <section aria-label="Gastos por categoría">
        <CategoryPieChart
          data={data.categorias}
          total={resumen.gastosMes}
          mes={resumen.mes}
        />
      </section>
    </div>
  );
}
