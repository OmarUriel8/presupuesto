import {
  ArrowLeftRight,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Tags,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Resumen de tus finanzas",
  },
  {
    title: "Movimientos",
    href: "/movimientos",
    icon: ArrowLeftRight,
    description: "Ingresos y gastos",
  },
  // {
  //   title: "Presupuestos",
  //   href: "/presupuestos",
  //   icon: PiggyBank,
  //   description: "Límites por categoría",
  // },
  {
    title: "Categorías",
    href: "/categorias",
    icon: Tags,
    description: "Clasifica tus movimientos",
  },
  {
    title: "Formas de pago",
    href: "/formas-pago",
    icon: CreditCard,
    description: "Cuentas y métodos de pago",
  },
  {
    title: "Reportes",
    href: "/reportes",
    icon: Wallet,
    description: "Análisis y tendencias",
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
    description: "Preferencias de la app",
  },
];
