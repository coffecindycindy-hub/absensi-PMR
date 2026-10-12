import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'pmr_session';
const SESSION_SECRET = process.env.AUTH_SECRET || 'pmr-attendance-super-secret-key-12345';

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'MEMBER';
  memberId?: string; // If role is MEMBER
  expiresAt: string;
}

// Simple base64url helpers
function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

// Helper to sign a token using HMAC-SHA256
function signToken(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');
}

export async function encryptSession(payload: Omit<SessionPayload, 'expiresAt'>): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  const sessionPayload: SessionPayload = { ...payload, expiresAt };
  const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = base64urlEncode(JSON.stringify(sessionPayload));
  const signature = signToken(`${header}.${data}`, SESSION_SECRET);
  return `${header}.${data}.${signature}`;
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, data, signature] = parts;
    const expectedSignature = signToken(`${header}.${data}`, SESSION_SECRET);

    if (signature !== expectedSignature) {
      console.warn('Session token signature verification failed');
      return null;
    }

    const payload: SessionPayload = JSON.parse(base64urlDecode(data));
    
    // Check expiration
    if (new Date(payload.expiresAt) < new Date()) {
      console.warn('Session token has expired');
      return null;
    }

    return payload;
  } catch (e) {
    console.error('Failed to decrypt session', e);
    return null;
  }
}

export async function createSession(payload: Omit<SessionPayload, 'expiresAt'>) {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true, // Required for sameSite: 'none' and standard iframe environments
    sameSite: 'none', // Allow cookie within the AI Studio iframe preview
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decryptSession(token);
}
