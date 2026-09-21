"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

interface HeaderProps {
  title?: string;
  user?: {
    nombre: string;
    email: string;
  };
}

export function Header({ title = "Panel", user }: HeaderProps): React.JSX.Element {
  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-16 items-center gap-2 border-b px-4 backdrop-blur sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menú de navegación</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-base font-semibold sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        {user && <UserMenu nombre={user.nombre} email={user.email} />}
      </div>
    </header>
  );
}
