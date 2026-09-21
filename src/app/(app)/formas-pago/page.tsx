"use client";

import { PageHeader } from "@/components/common/page-header";
import { FormasPagoTable } from "@/components/forma-pago/formas-pago-table";

export default function FormasPagoPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Formas de pago"
        description="Gestiona tus métodos de pago como efectivo, tarjetas y transferencias."
      />
      <FormasPagoTable />
    </div>
  );
}
