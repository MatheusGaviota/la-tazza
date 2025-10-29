import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da avaliação não fornecido' },
        { status: 400 }
      );
    }

    const reviewRef = adminDb.collection('product-reviews').doc(id);
    const reviewSnap = await reviewRef.get();

    if (!reviewSnap.exists) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      );
    }

    const reviewData = reviewSnap.data();
    if (!reviewData) {
      return NextResponse.json(
        { error: 'Dados da avaliação não encontrados' },
        { status: 404 }
      );
    }

    // Verifica se o usuário é o autor da avaliação ou admin
    const isReviewAuthor = reviewData.userId === decodedToken.uid;
    const userDoc = await adminDb
      .collection('users')
      .doc(decodedToken.uid)
      .get();
    const isAdmin = userDoc.exists && userDoc.data()?.isAdmin === true;

    if (!isReviewAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar esta avaliação' },
        { status: 403 }
      );
    }

    await reviewRef.delete();

    return NextResponse.json(
      { message: 'Avaliação deletada com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
