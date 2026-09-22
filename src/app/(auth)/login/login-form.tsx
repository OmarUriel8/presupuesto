"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { login } from "@/app/(auth)/login/actions";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { clearStoredRedirectPath, getStoredRedirectPath, storeRedirectPath } from "@/lib/redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm(): React.JSX.Element {
  const [serverError, setServerError] = useState<string | undefined>();

  // Guarda en localStorage la página que el usuario quería consultar
  // (p. ej. /movimientos) para volver a ella tras iniciar sesión.
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (from) {
      storeRedirectPath(from);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(undefined);
    const from = getStoredRedirectPath() ?? undefined;
    const result = await login({ ...data, from });
    if (result?.message) {
      setServerError(result.message);
    } else {
      // Login exitoso: el servidor redirige a `from` y ya no hace falta el destino.
      clearStoredRedirectPath();
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-destructive text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
