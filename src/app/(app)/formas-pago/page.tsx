import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function FormasPagoPage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      title="Formas de pago"
      description="Cuentas y métodos de pago (tablas cuenta y forma_pago)."
      emptyTitle="Sin formas de pago todavía"
      emptyDescription="Aquí gestionarás efectivo, tarjetas y cuentas bancarias."
      actionLabel="Nueva forma de pago"
    />
  );
}
