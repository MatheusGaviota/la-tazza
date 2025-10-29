import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import sendVerificationEmail from '@/lib/emails/verifyEmail';
import crypto from 'crypto';

const COLLECTION = 'emailVerifications';
const DEFAULT_EXP_MIN = 60;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    // Verifica idToken do Firebase para obter uid e email
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email;

    if (!email) {
      return NextResponse.json(
        { error: 'Email do usuário não disponível' },
        { status: 400 }
      );
    }

    // Gerar token seguro
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresInMinutes = DEFAULT_EXP_MIN;
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;

    // Salvar token no Firestore
    await adminDb.collection(COLLECTION).doc(verificationToken).set({
      uid,
      email,
      token: verificationToken,
      createdAt: Date.now(),
      expiresAt,
    });

    // Envia e-mail via Resend
    await sendVerificationEmail({
      to: email,
      token: verificationToken,
      name: decoded.name || null,
      expiresInMinutes,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro em /api/auth/send-verification:', error);
    const message = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
