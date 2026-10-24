import type { CookieOptions } from 'express';

export const REFRESH_COOKIE = 'refresh_token';
export const cookieOpts: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/auth',
  maxAge: 7 * 24 * 3600 * 1000,
};
