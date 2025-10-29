import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const COLLECTION = 'emailVerifications';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || null;

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      );
    }

    const doc = await adminDb.collection(COLLECTION).doc(token).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    const data = doc.data() as
      | { uid: string; email: string; expiresAt: number }
      | undefined;
    if (!data) {
      await doc.ref.delete().catch(() => null);
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    if (Date.now() > (data.expiresAt || 0)) {
      await doc.ref.delete().catch(() => null);
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 });
    }

    // Atualiza usuário no Firebase (marca emailVerified = true)
    await adminAuth.updateUser(data.uid, { emailVerified: true });

    // Remove o token
    await doc.ref.delete().catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro em /api/auth/verify:', error);
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
