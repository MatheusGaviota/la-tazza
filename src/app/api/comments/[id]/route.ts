import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    // Buscar o comentário usando Admin SDK
    const commentRef = adminDb.collection('comments').doc(id);
    const commentSnap = await commentRef.get();

    if (!commentSnap.exists) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    const commentData = commentSnap.data();
    if (!commentData) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    const isCommentAuthor = commentData.userId === decodedToken.uid;

    // Verificar se o usuário é admin
    const isAdmin =
      decodedToken.customClaims && decodedToken.customClaims.admin === true;

    // Buscar o post para verificar se o usuário é o autor do post
    const postRef = adminDb.collection('blog-posts').doc(commentData.postId);
    const postSnap = await postRef.get();
    const isPostAuthor =
      postSnap.exists && postSnap.data()?.authorUid === decodedToken.uid;

    // Autorização: pode deletar se for autor do comentário, autor do post ou admin
    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar este comentário' },
        { status: 403 }
      );
    }

    // Deletar o comentário
    await commentRef.delete();

    return NextResponse.json(
      { message: 'Comentário deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    return NextResponse.json(
      {
        error: 'Erro ao deletar comentário',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
