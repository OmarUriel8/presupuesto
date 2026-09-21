import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function MovimientosPage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      title="Movimientos"
      description="Ingresos y gastos. El CRUD se implementará en el siguiente módulo."
      emptyTitle="Sin movimientos todavía"
      emptyDescription="Aquí aparecerán tus ingresos y gastos cuando conectemos la base de datos."
      actionLabel="Nuevo movimiento"
    />
  );
}
