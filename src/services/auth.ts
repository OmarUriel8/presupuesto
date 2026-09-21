import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

const SALT_LENGTH = 32;
const HASH_LENGTH = 64;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto.scryptSync(password, salt, HASH_LENGTH);
  return `${salt}:${hash.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) return false;
  const hash = crypto.scryptSync(password, salt, HASH_LENGTH);
  return hash.toString("hex") === hashHex;
}

export interface AuthUser {
  id_usuario: string;
  nombre: string;
  email: string;
}

export async function registerUser(data: {
  nombre: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const existing = await prisma.usuario.findUnique({
    where: { email: data.email },
    select: { id_usuario: true },
  });

  if (existing) {
    throw new Error("Ya existe una cuenta con este email.");
  }

  const passwordHash = hashPassword(data.password);

  const user = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password_hash: passwordHash,
    },
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  });

  return user;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const user = await prisma.usuario.findUnique({
    where: { email },
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
      password_hash: true,
      activo: true,
    },
  });

  if (!user) {
    throw new Error("Credenciales incorrectas.");
  }

  if (!user.activo) {
    throw new Error("La cuenta está desactivada.");
  }

  const isValid = verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new Error("Credenciales incorrectas.");
  }

  return {
    id_usuario: user.id_usuario,
    nombre: user.nombre,
    email: user.email,
  };
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  const user = await prisma.usuario.findUnique({
    where: { id_usuario: userId },
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  });

  return user;
}

export async function updateUserProfile(
  userId: string,
  data: { nombre: string; email: string }
): Promise<AuthUser> {
  // Check if email is taken by another user
  const existing = await prisma.usuario.findFirst({
    where: {
      email: data.email,
      id_usuario: { not: userId },
    },
    select: { id_usuario: true },
  });

  if (existing) {
    throw new Error("Ya existe otra cuenta con este email.");
  }

  const user = await prisma.usuario.update({
    where: { id_usuario: userId },
    data: {
      nombre: data.nombre,
      email: data.email,
    },
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  });

  return user;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.usuario.findUnique({
    where: { id_usuario: userId },
    select: {
      password_hash: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const isValid = verifyPassword(currentPassword, user.password_hash);
  if (!isValid) {
    throw new Error("La contraseña actual es incorrecta.");
  }

  const newHash = hashPassword(newPassword);

  await prisma.usuario.update({
    where: { id_usuario: userId },
    data: {
      password_hash: newHash,
    },
  });
}
