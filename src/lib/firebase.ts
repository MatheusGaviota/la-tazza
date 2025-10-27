'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';

/**
 * Configuração do Firebase usando variáveis de ambiente
 * As variáveis NEXT_PUBLIC_* são injetadas em tempo de build
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Valida se todas as variáveis de ambiente do Firebase estão configuradas
 * @throws {Error} Se alguma variável obrigatória estiver faltando
 */
function validateFirebaseConfig(): void {
  const requiredFields: Array<keyof typeof firebaseConfig> = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field]?.trim?.(),
  );

  if (missingFields.length === 0) return;

  const fieldList = missingFields.map((f) => `NEXT_PUBLIC_FIREBASE_${f.toUpperCase()}`).join(', ');
  const error = new Error(
    `Variáveis de ambiente Firebase não configuradas: ${fieldList}. Verifique o arquivo .env`,
  );
  console.error('Firebase Configuration Error:', error.message);
  throw error;
}

function initializeFirebase(): FirebaseApp {
  validateFirebaseConfig();

  const existingApps = getApps();
  if (existingApps.length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

const firebaseApp = initializeFirebase();
export const auth = getAuth(firebaseApp);
export default firebaseApp;
