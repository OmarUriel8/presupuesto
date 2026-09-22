"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { register } from "@/app/(auth)/registro/actions";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterForm(): React.JSX.Element {
  const [serverError, setServerError] = useState<string | undefined>();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setServerError(undefined);
    const result = await register(data);
    if (result?.message) {
      setServerError(result.message);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Regístrate para empezar a administrar tus finanzas.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              autoComplete="name"
              {...registerField("nombre")}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "nombre-error" : undefined}
            />
            {errors.nombre && (
              <p id="nombre-error" className="text-destructive text-sm">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              {...registerField("email")}
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
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...registerField("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              {...registerField("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
