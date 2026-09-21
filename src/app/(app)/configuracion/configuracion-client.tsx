"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Shield } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  updateProfile,
  changePasswordAction,
  getProfileData,
} from "@/app/(app)/configuracion/actions";
import {
  updateProfileSchema,
  type UpdateProfileInput,
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/schemas/auth";

interface UserData {
  nombre: string;
  email: string;
}

function ProfileForm({ user }: { user: UserData }): React.JSX.Element {
  const [serverResult, setServerResult] = useState<{
    message?: string;
    success?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nombre: user.nombre,
      email: user.email,
    },
  });

  async function onSubmit(data: UpdateProfileInput) {
    setServerResult({});
    const result = await updateProfile(data);
    setServerResult(result);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi perfil</CardTitle>
        <CardDescription>Actualiza tu nombre y correo electrónico.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverResult.success && (
            <div className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
              {serverResult.success}
            </div>
          )}
          {serverResult.message && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverResult.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              autoComplete="name"
              {...register("nombre")}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "profile-nombre-error" : undefined}
            />
            {errors.nombre && (
              <p id="profile-nombre-error" className="text-sm text-destructive">
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
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "profile-email-error" : undefined}
            />
            {errors.email && (
              <p id="profile-email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </CardContent>

        <div className="px-6 pb-6 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PasswordForm(): React.JSX.Element {
  const [serverResult, setServerResult] = useState<{
    message?: string;
    success?: string;
  }>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordInput) {
    setServerResult({});
    const result = await changePasswordAction({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    setServerResult(result);
    if (result.success) {
      reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
        <CardDescription>
          Asegúrate de usar una contraseña fuerte y única.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverResult.success && (
            <div className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
              {serverResult.success}
            </div>
          )}
          {serverResult.message && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverResult.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("currentPassword")}
              aria-invalid={!!errors.currentPassword}
              aria-describedby={
                errors.currentPassword ? "current-password-error" : undefined
              }
            />
            {errors.currentPassword && (
              <p id="current-password-error" className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("newPassword")}
              aria-invalid={!!errors.newPassword}
              aria-describedby={
                errors.newPassword ? "new-password-error" : undefined
              }
            />
            {errors.newPassword && (
              <p id="new-password-error" className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirmar nueva contraseña</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("confirmNewPassword")}
              aria-invalid={!!errors.confirmNewPassword}
              aria-describedby={
                errors.confirmNewPassword ? "confirm-new-password-error" : undefined
              }
            />
            {errors.confirmNewPassword && (
              <p id="confirm-new-password-error" className="text-sm text-destructive">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <div className="px-6 pb-6 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Cambiando...
              </>
            ) : (
              <>
                <Shield className="size-4" aria-hidden="true" />
                Cambiar contraseña
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function ConfiguracionClient(): React.JSX.Element {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    getProfileData().then(setUser);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        description="Gestiona tu perfil y preferencias de seguridad."
      />

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList>
          <TabsTrigger value="perfil">Mi perfil</TabsTrigger>
          <TabsTrigger value="seguridad">
            <Shield className="size-4" aria-hidden="true" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-6">
          {user && <ProfileForm user={user} />}
        </TabsContent>

        <TabsContent value="seguridad" className="mt-6">
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
