"use client";

import * as React from "react";
import { toast } from "sonner";

import { getReportesData, type RangoReporte } from "@/app/(app)/reportes/actions";
import { PageHeader } from "@/components/common/page-header";
import { BalanceChart } from "@/components/reportes/balance-chart";
import { PromedioDiario } from "@/components/reportes/promedio-diario";
import { VariacionCategoria } from "@/components/reportes/variacion-categoria";
import { Button } from "@/components/ui/button";
import type { ReporteFinanciero } from "@/types";

const RANGOS: RangoReporte[] = [3, 6, 12];

interface ReportesViewProps {
  initialData: ReporteFinanciero;
}

export function ReportesView({ initialData }: ReportesViewProps): React.JSX.Element {
  // Los datos iniciales los resuelve el server component; aquí solo se
  // refrescan al cambiar el rango (nada de fetching en effects).
  const [data, setData] = React.useState<ReporteFinanciero>(initialData);
  const [isPending, startTransition] = React.useTransition();

  function handleRangoChange(rango: RangoReporte): void {
    if (rango === data.rango || isPending) return;

    startTransition(async () => {
      try {
        setData(await getReportesData(rango));
      } catch (err) {
        toast.error("Error", {
          description: err instanceof Error ? err.message : "No se pudo cargar el reporte.",
        });
      }
    });
  }

  const mesActual = data.evolucion.at(-1)?.etiqueta ?? "Mes actual";
  const mesAnterior = data.evolucion.at(-2)?.etiqueta ?? "Mes anterior";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        description="Tendencias de tu balance y comparativas mensuales por categoría."
        action={
          <div className="flex items-center gap-1" role="group" aria-label="Rango del reporte">
            {RANGOS.map((rango) => (
              <Button
                key={rango}
                type="button"
                size="sm"
                variant={rango === data.rango ? "default" : "outline"}
                disabled={isPending}
                onClick={() => handleRangoChange(rango)}
              >
                {rango} meses
              </Button>
            ))}
          </div>
        }
      />

      <section aria-label="Promedio diario de gasto">
        <PromedioDiario data={data.promedioDiario} />
      </section>

      <section aria-label="Evolución del balance">
        <BalanceChart data={data.evolucion} rango={data.rango} />
      </section>

      <section aria-label="Variación mensual por categoría">
        <VariacionCategoria
          data={data.variacionCategorias}
          mesActual={mesActual}
          mesAnterior={mesAnterior}
        />
      </section>
    </div>
  );
}
