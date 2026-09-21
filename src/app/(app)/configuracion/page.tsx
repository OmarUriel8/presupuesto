import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function ConfiguracionPage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      title="Configuración"
      description="Preferencias de la aplicación y del perfil."
      emptyTitle="Configuración pendiente"
      emptyDescription="El selector de tema (claro / oscuro / sistema) ya está disponible en el header."
      actionLabel="Guardar cambios"
    />
  );
}
