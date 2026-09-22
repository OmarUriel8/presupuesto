import { PageHeader } from "@/components/common/page-header";
import { Loader2 } from "lucide-react";

export default function Loading(): React.JSX.Element {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando contenido">
      <PageHeader title="Movimientos" description="Registra y controla tus ingresos y gastos." />
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" aria-hidden="true" />
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
}
