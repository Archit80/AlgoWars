import { createClient } from '@supabase/supabase-js';
import { createRemoteJWKSet, jwtVerify, decodeProtectedHeader, errors as joseErrors } from 'jose';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const issuer = `${process.env.SUPABASE_URL}/auth/v1`;
// Asymmetric signing keys (cached and refreshed by jose)
const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
// Legacy HS256 projects: set SUPABASE_JWT_SECRET to verify locally
const hsSecret = process.env.SUPABASE_JWT_SECRET
  ? new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET)
  : null;

// Failures that mean "can't check this locally" rather than "this token is bad"
const UNVERIFIABLE_LOCALLY = [
  joseErrors.JWKSNoMatchingKey,
  joseErrors.JWKSTimeout,
  joseErrors.JWKSInvalid,
  joseErrors.JWKSMultipleMatchingKeys,
];

// Verifies a Supabase access token without a network round trip per request.
// Returns { id, email } or null. Note: a signed-out session's token stays valid until it expires.
export async function verifyAccessToken(token) {
  let alg;
  try {
    alg = decodeProtectedHeader(token).alg;
  } catch {
    return null; // not a JWT at all
  }

  try {
    const key = hsSecret && alg === 'HS256' ? hsSecret : jwks;
    const { payload } = await jwtVerify(token, key, { issuer, audience: 'authenticated' });
    return payload.sub ? { id: payload.sub, email: payload.email } : null;
  } catch (err) {
    const isJoseError = err instanceof joseErrors.JOSEError;
    if (isJoseError && !UNVERIFIABLE_LOCALLY.some((E) => err instanceof E)) return null;

    // No usable local key (or JWKS unreachable): ask Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error || !user ? null : { id: user.id, email: user.email };
  }
}

export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const user = await verifyAccessToken(authHeader.split(' ')[1]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// Use after authenticateUser on routes scoped to a user via a URL param.
export function requireSelf(paramName) {
  return (req, res, next) => {
    if (req.params[paramName] !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

export async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const user = await verifyAccessToken(token);
    if (!user) {
      return next(new Error('Invalid token'));
    }

    socket.userId = user.id;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
}
