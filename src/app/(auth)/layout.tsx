import { Wallet } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): React.JSX.Element {
  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <Wallet className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Presupuesto</h1>
            <p className="text-muted-foreground text-xs">Finanzas personales</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
