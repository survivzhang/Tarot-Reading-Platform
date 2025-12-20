/**
 * Simple session management for email-based auth
 * For a production app, consider using NextAuth.js or similar
 */

import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'tarot_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface Session {
  userId: string;
  email: string;
}

/**
 * Creates a session for a user
 */
export async function createSession(userId: string, email: string): Promise<void> {
  const sessionData: Session = { userId, email };
  const sessionString = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  (await cookies()).set(SESSION_COOKIE_NAME, sessionString, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Gets the current session
 */
export async function getSession(): Promise<Session | null> {
  try {
    const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const sessionString = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(sessionString) as Session;

    return session;
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

/**
 * Destroys the current session
 */
export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

/**
 * Checks if user is authenticated and returns user ID
 */
export async function requireAuth(): Promise<string> {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized - Please sign in');
  }

  return session.userId;
}
