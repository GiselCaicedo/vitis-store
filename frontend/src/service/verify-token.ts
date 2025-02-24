import { jwtVerify, JWTPayload } from 'jose';

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode('secret'));
    return payload;
  } catch (err) {
    throw err;
  }
}