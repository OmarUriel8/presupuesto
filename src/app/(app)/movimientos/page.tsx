import { PageHeader } from "@/components/common/page-header";
import { MovimientosTable } from "@/components/movimientos/movimientos-table";
import { getMovimientosData } from "@/app/(app)/movimientos/actions";

export default async function MovimientosPage(): Promise<React.JSX.Element> {
  const data = await getMovimientosData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Movimientos"
        description="Registra y controla tus ingresos y gastos."
      />
      <MovimientosTable initialData={data} />
    </div>
  );
}
