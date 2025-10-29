/**
 * Inicialização segura do Firebase Admin SDK
 * Usa a conta de serviço para operações administrativas
 */

import * as admin from 'firebase-admin';
import { serviceAccountConfig } from './config';

let adminApp: admin.app.App | null = null;

/**
 * Retorna a instância do Firebase Admin
 */
export function getAdminApp(): admin.app.App {
  if (!adminApp) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(
        serviceAccountConfig as admin.ServiceAccount
      ),
    });
  }
  return adminApp;
}

/**
 * Retorna a instância do Auth
 */
export function getAuth(): admin.auth.Auth {
  return admin.auth(getAdminApp());
}

/**
 * Retorna a instância do Firestore
 */
export function getFirestore(): admin.firestore.Firestore {
  return admin.firestore(getAdminApp());
}
