import { NextRequest, NextResponse } from 'next/server';
import { deleteImage } from '@/lib/cloudinary.service';

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'ID público não especificado' },
        { status: 400 }
      );
    }

    const result = await deleteImage(publicId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar imagem' },
      { status: 500 }
    );
  }
}
