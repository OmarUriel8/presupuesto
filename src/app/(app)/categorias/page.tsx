import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function CategoriasPage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      title="Categorías"
      description="Clasificación de ingresos y gastos (tabla categoria)."
      emptyTitle="Sin categorías todavía"
      emptyDescription="Las categorías existentes en la base de datos se mostrarán aquí."
      actionLabel="Nueva categoría"
    />
  );
}
