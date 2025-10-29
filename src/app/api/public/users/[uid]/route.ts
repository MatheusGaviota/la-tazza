import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;

    // Obter dados públicos do usuário via Admin SDK
    const userRecord = await adminAuth.getUser(uid);

    const publicData = {
      uid: userRecord.uid,
      displayName: userRecord.displayName || null,
      email: userRecord.email || null,
      photoURL: userRecord.photoURL || null,
    };

    return NextResponse.json({ user: publicData }, { status: 200 });
  } catch (error) {
    console.error('Erro ao obter usuário público:', error);
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 }
    );
  }
}
