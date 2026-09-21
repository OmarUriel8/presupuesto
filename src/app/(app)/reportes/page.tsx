import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function ReportesPage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      title="Reportes"
      description="Análisis, tendencias y comparativas mensuales."
      emptyTitle="Sin reportes todavía"
      emptyDescription="Las gráficas y reportes se habilitarán después del CRUD base."
      actionLabel="Generar reporte"
    />
  );
}
