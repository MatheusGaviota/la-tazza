/**
 * Cliente para upload de imagens via API routes
 * Usado em componentes client-side para fazer upload seguro
 */

interface UploadResponse {
  success: boolean;
  data?: {
    publicId: string;
    secureUrl: string;
    url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    resourceType: string;
  };
  error?: string;
}

/**
 * Faz upload de arquivo para Cloudinary via API route
 * @param file - Arquivo a ser enviado
 * @param folder - Pasta de destino no Cloudinary
 * @returns URL da imagem ou lança erro
 */
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `la-tazza/${folder}`);

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
    });

    const result: UploadResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Erro ao fazer upload da imagem');
    }

    return result.data!.secureUrl;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error instanceof Error
      ? error
      : new Error('Erro ao fazer upload da imagem');
  }
}

/**
 * Substitui uma imagem existente no Cloudinary
 * @param file - Nova imagem
 * @param publicId - ID público da imagem existente
 * @param folder - Pasta no Cloudinary
 * @returns URL da nova imagem
 */
export async function replaceCloudinaryImage(
  file: File,
  publicId: string,
  folder: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `la-tazza/${folder}`);
    formData.append('publicId', publicId);

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
    });

    const result: UploadResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Erro ao substituir imagem');
    }

    return result.data!.secureUrl;
  } catch (error) {
    console.error('Erro ao substituir imagem:', error);
    throw error instanceof Error
      ? error
      : new Error('Erro ao substituir imagem');
  }
}

/**
 * Deleta uma imagem do Cloudinary
 * @param publicId - ID público da imagem
 */
export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Erro ao deletar imagem');
    }
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error instanceof Error ? error : new Error('Erro ao deletar imagem');
  }
}
