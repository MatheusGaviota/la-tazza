import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { deleteImage } from '@/lib/cloudinary.service';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost } from '@/types/admin.types';

async function verifyAdminToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.admin !== true) {
      return null;
    }

    return decodedToken.uid;
  } catch {
    return null;
  }
}

/**
 * Extrai o publicId de uma URL do Cloudinary
 * @param cloudinaryUrl - URL completa do Cloudinary
 * @returns publicId da imagem ou null se não for uma URL válida
 */
function extractPublicIdFromCloudinaryUrl(
  cloudinaryUrl: string
): string | null {
  try {
    // Remover querystring/hash (ex: ?t=123) e obter apenas o path para casamento.
    let path = cloudinaryUrl;
    try {
      // Se for uma URL válida, extrai o pathname
      const u = new URL(cloudinaryUrl);
      path = u.pathname;
    } catch {
      // Fallback: remove query/hash manualmente
      path = cloudinaryUrl.split('?')[0].split('#')[0];
      // Se veio algo como https://..., extraia pathname-like portion
      const idx = path.indexOf('/image/upload/');
      if (idx >= 0) path = path.substring(idx);
    }

    // Normalizar: garantir que começamos após /upload/
    const uploadIndex = path.indexOf('/upload/');
    if (uploadIndex < 0) return null;

    let afterUpload = path.substring(uploadIndex + '/upload/'.length);

    // Decodificar componentes (caso contenham %20 ou similares)
    afterUpload = decodeURIComponent(afterUpload);

    // Quebrar em segmentos para identificar transformações e versão
    const segments = afterUpload.split('/').filter(Boolean);

    // Se encontrarmos um segmento que seja exatamente 'v<digits>', saltamos ele
    let i = 0;
    // Pular segmentos de transformação iniciais (ex: c_fill,w_400 ou g_face)
    while (i < segments.length) {
      const s = segments[i];
      // versão: v12345
      if (/^v\d+$/.test(s)) {
        i++;
        break;
      }
      // transformação provável contém vírgula ou padrão chave_valor curto (c_, w_, h_)
      if (s.includes(',') || /^[a-z]{1,3}_[a-z0-9_=-]+$/i.test(s)) {
        i++;
        continue;
      }
      // Se não parece transformação nem versão, parar — resto é publicId
      break;
    }

    const publicIdWithExt = segments.slice(i).join('/');
    if (!publicIdWithExt) return null;

    // Remover extensão se presente
    const dotIndex = publicIdWithExt.lastIndexOf('.');
    const publicId =
      dotIndex !== -1
        ? publicIdWithExt.substring(0, dotIndex)
        : publicIdWithExt;

    return publicId;
  } catch {
    return null;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUid = await verifyAdminToken(request);
    if (!adminUid) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Primeiro, buscar o post para obter a URL da imagem
    const docRef = doc(db, 'blog-posts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    const post = { id: docSnap.id, ...docSnap.data() } as BlogPost;

    // Se o post tem uma imagem do Cloudinary, deletar ela primeiro
    if (post.imageUrl && post.imageUrl.includes('cloudinary.com')) {
      try {
        const publicId = extractPublicIdFromCloudinaryUrl(post.imageUrl);
        if (publicId) {
          await deleteImage(publicId);
          console.log(`Imagem do post "${post.title}" deletada do Cloudinary: ${publicId}`);
        } else {
          console.warn('Não foi possível extrair publicId da URL da imagem do post');
        }
      } catch (imageError) {
        console.error('Erro ao deletar imagem do Cloudinary:', imageError);
        // Não interromper a exclusão do post se falhar ao deletar a imagem
      }
    }

    // Agora deletar o documento do Firestore
    await deleteDoc(docRef);
    console.log(`Post "${post.title}" deletado com sucesso`);

    return NextResponse.json(
      { message: 'Post deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao deletar post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}