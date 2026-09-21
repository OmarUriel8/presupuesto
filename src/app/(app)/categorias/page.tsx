import { PageHeader } from "@/components/common/page-header";
import { CategoriasTable } from "@/components/categorias/categorias-table";

export default function CategoriasPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        description="Clasifica tus ingresos y gastos por categoría."
      />
      <CategoriasTable />
    </div>
  );
}
