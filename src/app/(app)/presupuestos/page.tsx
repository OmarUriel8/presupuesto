import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function PresupuestosPage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      title="Presupuestos"
      description="Límites de gasto por periodo y categoría."
      emptyTitle="Sin presupuestos todavía"
      emptyDescription="Podrás crear presupuestos mensuales y asignar montos por categoría."
      actionLabel="Nuevo presupuesto"
    />
  );
}
