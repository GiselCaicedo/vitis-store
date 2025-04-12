import { jwtVerify, JWTPayload } from 'jose';

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const secretKey = new TextEncoder().encode('VT#s7!pK9@zQ4*xL2$rE8&mD5^bN3%wG6+tY');
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    console.error('Error al verificar token:', err);
    throw err;
  }
}