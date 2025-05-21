import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Este hook simplemente re-exporta el contexto, pero podríamos añadir funcionalidad adicional si es necesario
export const useAuth = () => {
  return useAuthContext();
};