import { NextRequest, NextResponse } from 'next/server';
import { listImagesInFolder } from '@/lib/cloudinary.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const maxResults = parseInt(searchParams.get('maxResults') || '100');

    if (!folder) {
      return NextResponse.json(
        { error: 'Pasta não especificada' },
        { status: 400 }
      );
    }

    const images = await listImagesInFolder(folder, maxResults);

    return NextResponse.json({
      success: true,
      data: images,
      count: images.length,
    });
  } catch (error) {
    console.error('Erro ao listar imagens:', error);
    return NextResponse.json(
      { error: 'Erro ao listar imagens' },
      { status: 500 }
    );
  }
}
