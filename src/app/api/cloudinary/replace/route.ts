import { NextRequest, NextResponse } from 'next/server';
import { replaceImage } from '@/lib/cloudinary.service';

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const publicId = formData.get('publicId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    if (!folder || !publicId) {
      return NextResponse.json(
        { error: 'Pasta ou ID público não especificado' },
        { status: 400 }
      );
    }

    // Converter o arquivo para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Substituir a imagem
    const result = await replaceImage(publicId, buffer, folder);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Erro ao substituir imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao substituir imagem' },
      { status: 500 }
    );
  }
}
