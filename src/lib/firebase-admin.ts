/**
 * Inicialização do Firebase Admin SDK para Next.js
 * Usado para operações administrativas no servidor
 */

import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

function initializeAdmin() {
  if (adminApp) {
    return adminApp;
  }

  try {
    // Verificar se já existe um app inicializado
    try {
      adminApp = admin.app();
      console.log('Firebase Admin já estava inicializado, reutilizando...');
      return adminApp;
    } catch {
      // App não existe ainda, vamos criar
      console.log('Inicializando Firebase Admin SDK...');
    }

    // Verificar se as credenciais estão disponíveis
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n'
    );

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Credenciais do Firebase Admin não configuradas corretamente'
      );
    }

    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log('Firebase Admin SDK inicializado com sucesso');
    return adminApp;
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin:', error);
    throw error;
  }
}

export const adminAuth = admin.auth(initializeAdmin());
export const adminDb = admin.firestore(initializeAdmin());
