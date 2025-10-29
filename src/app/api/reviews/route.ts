import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);

    const body = await request.json();
    const { productId, userId, userName, userPhoto, rating, content } = body;

    if (!productId || !userId || !userName || !content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Avaliação deve estar entre 1 e 5 estrelas' },
        { status: 400 }
      );
    }

    if (content.trim().length < 3 || content.length > 1000) {
      return NextResponse.json(
        { error: 'Avaliação deve ter entre 3 e 1000 caracteres' },
        { status: 400 }
      );
    }

    // Verifica se o usuário está autenticado e é o dono do comentário
    if (userId !== decodedToken.uid) {
      return NextResponse.json(
        { error: 'Você só pode criar avaliações para si mesmo' },
        { status: 403 }
      );
    }

    // Verifica se o usuário já fez uma avaliação para este produto
    const existingReviews = await adminDb
      .collection('product-reviews')
      .where('productId', '==', productId)
      .where('userId', '==', userId)
      .get();

    if (!existingReviews.empty) {
      return NextResponse.json(
        { error: 'Você já avaliou este produto' },
        { status: 400 }
      );
    }

    const reviewsRef = adminDb.collection('product-reviews');
    const reviewDoc = await reviewsRef.add({
      productId,
      userId,
      userName,
      userPhoto: userPhoto || null,
      rating,
      content: content.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Avaliação criada com sucesso',
        id: reviewDoc.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
