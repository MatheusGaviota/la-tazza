import { useId } from 'react';

/**
 * Hook que retorna um ID estável que não causa hydration mismatch
 * Usa o hook nativo useId do React 18+ que é SSR-safe
 * 
 * @param prefix - Prefixo opcional para o ID
 * @returns ID estável único
 */
export function useStableId(prefix?: string): string {
  const id = useId();
  return prefix ? `${prefix}-${id}` : id;
}
