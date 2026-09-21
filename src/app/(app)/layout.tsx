import { Header } from "@/components/layout/header";
import { SidebarContent } from "@/components/layout/sidebar";
import { Separator } from "@/components/ui/separator";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps): React.JSX.Element {
  return (
    <div className="bg-muted/40 min-h-screen">
      <aside
        aria-label="Barra lateral"
        className="bg-background fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block"
      >
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header title="Gestión de presupuestos" />
        <Separator className="sr-only" />
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="text-muted-foreground px-4 py-4 text-center text-xs sm:px-6">
          Presupuesto · Datos de ejemplo en el dashboard. La base de datos no se modifica.
        </footer>
      </div>
    </div>
  );
}
