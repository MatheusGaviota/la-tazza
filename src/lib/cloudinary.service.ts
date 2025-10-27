import { v2 as cloudinary } from 'cloudinary';

// Configuração do Cloudinary
const cloudinaryUrl = process.env.NEXT_PRIVATE_CLOUDINARY_URL;

if (!cloudinaryUrl) {
  throw new Error('NEXT_PRIVATE_CLOUDINARY_URL não está definida');
}

// Parse da URL do Cloudinary: cloudinary://api_key:api_secret@cloud_name
const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);

if (!urlMatch) {
  throw new Error('Formato inválido de NEXT_PRIVATE_CLOUDINARY_URL');
}

const [, apiKey, apiSecret, cloudName] = urlMatch;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export interface UploadImageOptions {
  folder: string;
  publicId?: string;
  overwrite?: boolean;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  };
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resourceType: string;
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
}

/**
 * Upload de imagem para o Cloudinary
 * @param file - Buffer, string (base64 ou URL) ou caminho local da imagem
 * @param options - Opções de upload incluindo pasta de destino
 * @returns Informações da imagem enviada
 */
export const uploadImage = async (
  file: Buffer | string,
  options: UploadImageOptions
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadOptions: Record<string, unknown> = {
      folder: options.folder,
      resource_type: 'image',
      overwrite: options.overwrite ?? false,
    };

    if (options.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    if (options.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    let fileToUpload: string;
    
    if (file instanceof Buffer) {
      fileToUpload = `data:image/png;base64,${file.toString('base64')}`;
    } else {
      fileToUpload = file as string;
    }

    const result = await cloudinary.uploader.upload(
      fileToUpload,
      uploadOptions
    );

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw new Error('Falha ao enviar imagem para o Cloudinary');
  }
};

/**
 * Substituir uma imagem existente
 * @param publicId - ID público da imagem existente (sem a pasta)
 * @param file - Nova imagem (Buffer ou string)
 * @param folder - Pasta onde a imagem está localizada
 * @returns Informações da imagem atualizada
 */
export const replaceImage = async (
  publicId: string,
  file: Buffer | string,
  folder: string
): Promise<CloudinaryUploadResult> => {
  try {
    return await uploadImage(file, {
      folder,
      publicId,
      overwrite: true,
    });
  } catch (error) {
    console.error('Erro ao substituir imagem:', error);
    throw new Error('Falha ao substituir imagem no Cloudinary');
  }
};

/**
 * Deletar uma imagem do Cloudinary
 * @param publicId - ID público completo da imagem (incluindo pasta, ex: "produtos/cafe-especial")
 * @returns Resultado da operação
 */
export const deleteImage = async (
  publicId: string
): Promise<{ result: string }> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Falha ao deletar imagem: ${result.result}`);
    }

    return { result: result.result };
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error('Falha ao deletar imagem do Cloudinary');
  }
};

/**
 * Deletar múltiplas imagens de uma vez
 * @param publicIds - Array de IDs públicos das imagens
 * @returns Resultados das operações
 */
export const deleteMultipleImages = async (
  publicIds: string[]
): Promise<{ deleted: Record<string, string> }> => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: 'image',
    });

    return { deleted: result.deleted };
  } catch (error) {
    console.error('Erro ao deletar múltiplas imagens:', error);
    throw new Error('Falha ao deletar imagens do Cloudinary');
  }
};

/**
 * Deletar todas as imagens de uma pasta específica
 * @param folder - Nome da pasta
 * @returns Resultado da operação
 */
export const deleteFolder = async (
  folder: string
): Promise<{ result: string }> => {
  try {
    // Primeiro, deletar todos os recursos da pasta
    await cloudinary.api.delete_resources_by_prefix(folder, {
      resource_type: 'image',
    });

    // Depois, deletar a pasta vazia
    await cloudinary.api.delete_folder(folder);

    return { result: 'ok' };
  } catch (error) {
    console.error('Erro ao deletar pasta:', error);
    throw new Error('Falha ao deletar pasta do Cloudinary');
  }
};

/**
 * Listar imagens de uma pasta específica
 * @param folder - Nome da pasta
 * @param maxResults - Número máximo de resultados (padrão: 100)
 * @returns Lista de imagens
 */
export const listImagesInFolder = async (
  folder: string,
  maxResults: number = 100
): Promise<CloudinaryUploadResult[]> => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
      resource_type: 'image',
    });

    return result.resources.map((resource: CloudinaryResource) => ({
      publicId: resource.public_id,
      secureUrl: resource.secure_url,
      url: resource.url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      resourceType: resource.resource_type,
    }));
  } catch (error) {
    console.error('Erro ao listar imagens da pasta:', error);
    throw new Error('Falha ao listar imagens do Cloudinary');
  }
};

/**
 * Obter URL otimizada de uma imagem
 * @param publicId - ID público da imagem
 * @param options - Opções de transformação
 * @returns URL da imagem otimizada
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }
): string => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: options,
  });
};

export default cloudinary;
