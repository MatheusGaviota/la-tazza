import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { postId, content, userName, userPhoto } = body;

    // Validação
    if (!postId || !content || !userName) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comentário muito curto (mínimo 3 caracteres)' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comentário muito longo (máximo 1000 caracteres)' },
        { status: 400 }
      );
    }

    // Adicionar comentário ao Firestore usando Admin SDK
    const commentsRef = adminDb.collection('comments');
    const commentDoc = await commentsRef.add({
      postId,
      userId: decodedToken.uid,
      userName,
      userPhoto: userPhoto || null,
      content: content.trim(),
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        id: commentDoc.id,
        message: 'Comentário adicionado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return NextResponse.json(
      {
        error: 'Erro ao adicionar comentário',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
