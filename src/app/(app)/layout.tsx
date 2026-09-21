import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { getUserById } from "@/services/auth";
import { Header } from "@/components/layout/header";
import { SidebarContent } from "@/components/layout/sidebar";
import { Separator } from "@/components/ui/separator";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps): Promise<React.JSX.Element> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await getUserById(session.userId);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-muted/40 min-h-screen">
      <aside
        aria-label="Barra lateral"
        className="bg-background fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block"
      >
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header
          title="Gestión de presupuestos"
          user={{ nombre: user.nombre, email: user.email }}
        />
        <Separator className="sr-only" />
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="text-muted-foreground px-4 py-4 text-center text-xs sm:px-6">
          Presupuesto · v0.1.0
        </footer>
      </div>
    </div>
  );
}
