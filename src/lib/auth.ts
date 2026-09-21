import "server-only";

import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no está definida. Revisa tu archivo .env.");
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export interface SessionPayload {
  userId: string;
  expiresAt: number;
}

export async function createSession(userId: string): Promise<void> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${userId}|${expiresAt}`;
  const signature = sign(payload);
  const token = `${payload}|${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const parts = token.split("|");
  if (parts.length !== 3) return null;

  const [userId, expiresAtStr, signature] = parts;
  const payload = `${userId}|${expiresAtStr}`;
  const expectedSignature = sign(payload);

  if (signature !== expectedSignature) return null;

  const expiresAt = parseInt(expiresAtStr, 10);
  if (Number.isNaN(expiresAt) || Math.floor(Date.now() / 1000) > expiresAt) {
    return null;
  }

  return { userId, expiresAt };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Verify a session token without reading from cookies.
 * Used in proxy.ts where we read cookies from the request.
 */
export function verifyToken(token: string): SessionPayload | null {
  const parts = token.split("|");
  if (parts.length !== 3) return null;

  const [userId, expiresAtStr, signature] = parts;
  const payload = `${userId}|${expiresAtStr}`;
  const expectedSignature = sign(payload);

  if (signature !== expectedSignature) return null;

  const expiresAt = parseInt(expiresAtStr, 10);
  if (Number.isNaN(expiresAt) || Math.floor(Date.now() / 1000) > expiresAt) {
    return null;
  }

  return { userId, expiresAt };
}
