import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { deleteImage } from '@/lib/cloudinary.service';

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
  { params }: { params: Promise<{ uid: string }> }
) {
  let uid = '';
  try {
    console.log('Iniciando exclusão de usuário...');

    const adminUid = await verifyAdminToken(request);
    if (!adminUid) {
      console.log('Token de admin inválido');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    ({ uid } = await params);
    console.log(`Tentando deletar usuário: ${uid}`);

    // Impedir que o admin delete a si mesmo
    if (uid === adminUid) {
      console.log('Tentativa de auto-exclusão bloqueada');
      return NextResponse.json(
        { error: 'Você não pode deletar sua própria conta' },
        { status: 400 }
      );
    }

    // Obter dados do usuário antes de deletar para acessar a photoURL
    let userPhotoURL: string | null = null;
    try {
      console.log('Obtendo dados do usuário...');
      const userRecord = await adminAuth.getUser(uid);
      userPhotoURL = userRecord.photoURL || null;
      console.log(`PhotoURL do usuário: ${userPhotoURL}`);
    } catch (getUserError) {
      console.warn(
        'Não foi possível obter dados do usuário antes da exclusão:',
        getUserError
      );
      // Continua mesmo se não conseguir obter os dados
    }

    // Se o usuário tem uma foto do Cloudinary, deletar ela primeiro
    if (userPhotoURL && userPhotoURL.includes('cloudinary.com')) {
      try {
        console.log('Tentando deletar imagem do Cloudinary...');
        const publicId = extractPublicIdFromCloudinaryUrl(userPhotoURL);
        console.log(`PublicId extraído: ${publicId}`);

        if (publicId) {
          try {
            await deleteImage(publicId);
            console.log(
              `Imagem do usuário ${uid} deletada do Cloudinary: ${publicId}`
            );
          } catch (deleteImageError) {
            console.error(
              'Erro específico ao deletar imagem do Cloudinary:',
              deleteImageError
            );
            // Não falha a operação se não conseguir deletar a imagem
          }
        } else {
          console.log('Não foi possível extrair publicId da URL');
        }
      } catch (urlError) {
        console.error('Erro ao processar URL do Cloudinary:', urlError);
        // Não falha a operação se não conseguir processar a URL
      }
    } else {
      console.log('Usuário não tem foto do Cloudinary ou photoURL é null');
    }

    // Deletar o usuário do Firebase Auth
    try {
      console.log('Deletando usuário do Firebase Auth...');
      await adminAuth.deleteUser(uid);
      console.log('Usuário deletado com sucesso');
    } catch (deleteUserError) {
      console.error('Erro ao deletar usuário do Firebase:', deleteUserError);
      const errorMessage =
        deleteUserError instanceof Error
          ? deleteUserError.message
          : 'Erro desconhecido ao deletar usuário';
      return NextResponse.json(
        { error: `Erro ao deletar usuário: ${errorMessage}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Usuário deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro geral ao deletar usuário:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao deletar usuário';
    return NextResponse.json(
      { error: `Erro ao deletar usuário: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const adminUid = await verifyAdminToken(request);
    if (!adminUid) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { uid } = await params;
    const body = await request.json();

    // Operações permitidas
    if (body.action === 'toggle-admin') {
      // Impedir que o admin remova seus próprios privilégios
      if (uid === adminUid && body.isAdmin === false) {
        return NextResponse.json(
          { error: 'Você não pode remover seus próprios privilégios de admin' },
          { status: 400 }
        );
      }

      await adminAuth.setCustomUserClaims(uid, {
        admin: body.isAdmin,
      });

      return NextResponse.json(
        { message: 'Privilégios de admin atualizados' },
        { status: 200 }
      );
    }

    if (body.action === 'toggle-status') {
      // Impedir que o admin desative sua própria conta
      if (uid === adminUid && body.disabled === true) {
        return NextResponse.json(
          { error: 'Você não pode desativar sua própria conta' },
          { status: 400 }
        );
      }

      await adminAuth.updateUser(uid, {
        disabled: body.disabled,
      });

      return NextResponse.json(
        { message: 'Status do usuário atualizado' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}
