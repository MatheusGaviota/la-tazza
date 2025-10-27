// Firebase initialization wrapper using environment variables
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';

/**
 * Valida se todas as variáveis de ambiente do Firebase estão configuradas
 */
function validateFirebaseConfig(): void {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]?.trim()
  );

  if (missingVars.length > 0) {
    const errorMessage = `Variáveis de ambiente Firebase não configuradas: ${missingVars.join(', ')}. Verifique o arquivo .env.local`;
    console.error('❌', errorMessage);
    throw new Error(errorMessage);
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

function createFirebaseApp(): FirebaseApp {
  try {
    validateFirebaseConfig();

    if (!getApps().length) {
      return initializeApp(firebaseConfig);
    }
    return getApp();
  } catch (error) {
    console.error(
      '❌ Falha ao inicializar Firebase:',
      error instanceof Error ? error.message : 'Erro desconhecido'
    );
    throw error;
  }
}

const firebaseApp = createFirebaseApp();
export const auth = getAuth(firebaseApp);

export default firebaseApp;
