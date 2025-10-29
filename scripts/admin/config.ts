/**
 * Carrega as credenciais do Firebase Admin a partir de variáveis de ambiente
 *
 * Variáveis necessárias em .env.local:
 * - FIREBASE_ADMIN_PROJECT_ID
 * - FIREBASE_ADMIN_PRIVATE_KEY_ID
 * - FIREBASE_ADMIN_PRIVATE_KEY
 * - FIREBASE_ADMIN_CLIENT_EMAIL
 * - FIREBASE_ADMIN_CLIENT_ID
 * - FIREBASE_ADMIN_CLIENT_X509_CERT_URL
 */

import 'dotenv/config';

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${key} não encontrada. Verifique seu arquivo .env.local`
    );
  }
  return value;
}

export const serviceAccountConfig = {
  type: 'service_account',
  project_id: getEnv('FIREBASE_ADMIN_PROJECT_ID'),
  private_key_id: getEnv('FIREBASE_ADMIN_PRIVATE_KEY_ID'),
  private_key: getEnv('FIREBASE_ADMIN_PRIVATE_KEY').replace(/\\n/g, '\n'),
  client_email: getEnv('FIREBASE_ADMIN_CLIENT_EMAIL'),
  client_id: getEnv('FIREBASE_ADMIN_CLIENT_ID'),
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: getEnv('FIREBASE_ADMIN_CLIENT_X509_CERT_URL'),
  universe_domain: 'googleapis.com',
};
