import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const publicId = formData.get('publicId') as string | null;

    // Validações
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    if (!folder) {
      return NextResponse.json(
        { error: 'Pasta não especificada' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WEBP' },
        { status: 400 }
      );
    }

    // Validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      );
    }

    // Converter o arquivo para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configurar transformações baseadas na pasta
    const transformation =
      folder === 'la-tazza/profile-photos'
        ? {
            width: 400,
            height: 400,
            crop: 'fill' as const,
            quality: 'auto' as const,
          }
        : {
            quality: 'auto' as const,
          };

    // Upload da imagem com overwrite se publicId for fornecido
    const result = await uploadImage(buffer, {
      folder,
      publicId: publicId || undefined,
      overwrite: !!publicId, // Força overwrite quando há publicId
      transformation,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao fazer upload da imagem',
      },
      { status: 500 }
    );
  }
}
